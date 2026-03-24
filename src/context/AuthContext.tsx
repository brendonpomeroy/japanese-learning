/**
 * AuthContext — authentication, cloud pull, and conflict resolution.
 *
 * Wraps the app and provides:
 *  - Supabase auth session state
 *  - Magic-link sign-in / sign-out
 *  - Initial cloud pull + conflict detection on sign-in
 *  - `isResolvingCloudSync` flag that blocks write-through syncing
 *    until the initial pull / conflict flow completes
 */

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import { getDeviceId } from '../lib/device';
import {
  type CloudBackedValue,
  type SyncedKey,
  SYNCED_KEYS,
  readSyncMeta,
  deepEqualPayload,
  wrapCloudValue,
} from '../lib/cloudData';
import {
  pullAllKeys,
  pushAllKeys,
  upsertKey,
  restoreCloudLocally,
} from '../hooks/useCloudPull';

// ---------------------------------------------------------------------------
// Default state helpers (mirrors the app's default states for "empty" checks)
// ---------------------------------------------------------------------------

function isProgressDefault(val: unknown): boolean {
  if (!val || typeof val !== 'object') return true;
  const p = val as Record<string, unknown>;
  const emptyObj = (v: unknown) =>
    typeof v === 'object' && v !== null && Object.keys(v).length === 0;
  const emptyArr = (v: unknown) => Array.isArray(v) && v.length === 0;
  return (
    emptyObj(p.characterMastery) &&
    emptyArr(p.exerciseHistory) &&
    emptyObj(p.emojiMastery) &&
    emptyArr(p.emojiExerciseHistory) &&
    emptyObj(p.vocabularyMastery) &&
    emptyArr(p.vocabularyExerciseHistory) &&
    emptyObj(p.vocabularySuccessRates) &&
    emptyObj(p.timeSpent) &&
    emptyObj(p.successRates) &&
    emptyObj(p.emojiSuccessRates) &&
    (p.streak === 0 || p.streak === undefined) &&
    (!p.lastPracticeDate || p.lastPracticeDate === '')
  );
}

function isSettingsDefault(val: unknown): boolean {
  if (!val || typeof val !== 'object') return true;
  const s = val as Record<string, unknown>;
  return (
    s.audioEnabled === true &&
    s.darkMode === false &&
    s.fontSize === 'medium' &&
    (s.theme === 'default' || s.theme === undefined)
  );
}

function isVocabDefault(val: unknown): boolean {
  if (!val || typeof val !== 'object') return true;
  const v = val as Record<string, unknown>;
  return (
    typeof v.wordProgress === 'object' &&
    v.wordProgress !== null &&
    Object.keys(v.wordProgress as object).length === 0
  );
}

function isGrammarDefault(val: unknown): boolean {
  if (!val || typeof val !== 'object') return true;
  const g = val as Record<string, unknown>;
  return (
    typeof g.progress === 'object' &&
    g.progress !== null &&
    Object.keys(g.progress as object).length === 0
  );
}

const defaultCheckers: Record<SyncedKey, (v: unknown) => boolean> = {
  'japanese-learning-progress': isProgressDefault,
  'japanese-learning-settings': isSettingsDefault,
  vocab_progress_v2: isVocabDefault,
  grammar_progress_v1: isGrammarDefault,
};

function isLocalEmpty(): boolean {
  return SYNCED_KEYS.every(key => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return true;
      return defaultCheckers[key](JSON.parse(raw));
    } catch {
      return true;
    }
  });
}

// ---------------------------------------------------------------------------
// Conflict types
// ---------------------------------------------------------------------------

export type ConflictDirection = 'cloud' | 'local' | 'equal' | 'conflict';

export interface PerKeyComparison {
  key: SyncedKey;
  direction: ConflictDirection;
  localMeta: { clientUpdatedAt: string } | null;
  cloudMeta: { clientUpdatedAt: string } | null;
}

export interface CloudConflictState {
  comparisons: PerKeyComparison[];
}

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthEnabled: boolean;
  isAuthenticating: boolean;
  isResolvingCloudSync: boolean;
  isSyncReady: boolean;
  pendingConflict: CloudConflictState | null;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resolveConflictUseCloud: () => Promise<void>;
  resolveConflictKeepLocal: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isResolvingCloudSync, setIsResolvingCloudSync] = useState(false);
  const [pendingConflict, setPendingConflict] =
    useState<CloudConflictState | null>(null);

  // Track whether we've already run the initial sync for this session
  const hasSyncedRef = useRef(false);

  // Derived — sync is ready when auth is done AND no pending conflict
  const isSyncReady =
    isSupabaseEnabled && !!user && !isResolvingCloudSync && !pendingConflict;

  // ------------------------------------------------------------------
  // Conflict comparison logic
  // ------------------------------------------------------------------

  const compareKeys = useCallback(
    (cloudData: Record<string, CloudBackedValue>): PerKeyComparison[] => {
      return SYNCED_KEYS.map(key => {
        const cloud = cloudData[key] ?? null;
        const localMeta = readSyncMeta(key);

        let localPayload: unknown = null;
        try {
          const raw = localStorage.getItem(key);
          if (raw) localPayload = JSON.parse(raw);
        } catch {
          /* empty */
        }

        const hasLocal =
          localPayload !== null && !defaultCheckers[key](localPayload);
        const hasCloud = cloud !== null;

        if (!hasLocal && !hasCloud) {
          return {
            key,
            direction: 'equal' as const,
            localMeta,
            cloudMeta: null,
          };
        }
        if (hasLocal && !hasCloud) {
          return {
            key,
            direction: 'local' as const,
            localMeta,
            cloudMeta: null,
          };
        }
        if (!hasLocal && hasCloud) {
          return {
            key,
            direction: 'cloud' as const,
            localMeta: null,
            cloudMeta: { clientUpdatedAt: cloud!.clientUpdatedAt },
          };
        }

        // Both exist — compare payloads
        if (deepEqualPayload(localPayload, cloud!.payload)) {
          return {
            key,
            direction: 'equal' as const,
            localMeta,
            cloudMeta: { clientUpdatedAt: cloud!.clientUpdatedAt },
          };
        }

        // Payloads differ — compare timestamps
        const localTs = localMeta?.clientUpdatedAt ?? '';
        const cloudTs = cloud!.clientUpdatedAt ?? '';

        if (localTs && cloudTs) {
          if (localTs > cloudTs) {
            return {
              key,
              direction: 'local' as const,
              localMeta,
              cloudMeta: { clientUpdatedAt: cloudTs },
            };
          }
          if (cloudTs > localTs) {
            return {
              key,
              direction: 'cloud' as const,
              localMeta,
              cloudMeta: { clientUpdatedAt: cloudTs },
            };
          }
        }

        // Same timestamp, different payload — true conflict
        return {
          key,
          direction: 'conflict' as const,
          localMeta,
          cloudMeta: cloud ? { clientUpdatedAt: cloud.clientUpdatedAt } : null,
        };
      });
    },
    []
  );

  // ------------------------------------------------------------------
  // Initial sync after sign-in
  // ------------------------------------------------------------------

  const runInitialSync = useCallback(
    async (userId: string) => {
      if (hasSyncedRef.current) return;
      hasSyncedRef.current = true;
      setIsResolvingCloudSync(true);

      try {
        const cloudData = await pullAllKeys(userId);
        const hasCloudData = Object.keys(cloudData).length > 0;

        // Case 1: no cloud data — push local
        if (!hasCloudData) {
          await pushAllKeys(userId);
          setIsResolvingCloudSync(false);
          return;
        }

        // Case 2: cloud exists, local is empty — restore silently
        if (isLocalEmpty()) {
          restoreCloudLocally(cloudData);
          // Trigger page reload so contexts re-hydrate from updated localStorage
          window.location.reload();
          return;
        }

        // Case 3: both exist — compare per key
        const comparisons = compareKeys(cloudData);
        const differing = comparisons.filter(c => c.direction !== 'equal');

        if (differing.length === 0) {
          // Everything equal — nothing to do
          setIsResolvingCloudSync(false);
          return;
        }

        // Check if all diffs point the same direction
        const directions = new Set(differing.map(c => c.direction));

        if (directions.size === 1) {
          const dir = differing[0].direction;

          if (dir === 'local') {
            // All newer locally — push
            await pushAllKeys(userId);
            setIsResolvingCloudSync(false);
            return;
          }

          if (dir === 'cloud') {
            // All newer in cloud — restore
            restoreCloudLocally(cloudData);
            window.location.reload();
            return;
          }
        }

        // Mixed / ambiguous — show conflict modal
        setPendingConflict({ comparisons });
        // Keep isResolvingCloudSync true until user decides
      } catch (e) {
        console.error('Initial cloud sync failed:', e);
        setIsResolvingCloudSync(false);
      }
    },
    [compareKeys]
  );

  // ------------------------------------------------------------------
  // Conflict resolution actions
  // ------------------------------------------------------------------

  const resolveConflictUseCloud = useCallback(async () => {
    if (!user) return;
    try {
      const cloudData = await pullAllKeys(user.id);
      restoreCloudLocally(cloudData);
      setPendingConflict(null);
      // Reload so contexts hydrate from the now-updated localStorage
      window.location.reload();
    } catch (e) {
      console.error('Resolve (use cloud) failed:', e);
      setPendingConflict(null);
      setIsResolvingCloudSync(false);
    }
  }, [user]);

  const resolveConflictKeepLocal = useCallback(async () => {
    if (!user) return;
    try {
      const deviceId = getDeviceId();

      for (const key of SYNCED_KEYS) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const payload = JSON.parse(raw);
        const meta = readSyncMeta(key) ?? {
          clientUpdatedAt: new Date().toISOString(),
          deviceId,
        };
        const wrapped = wrapCloudValue(payload, meta);
        await upsertKey(user.id, key, wrapped);
      }

      setPendingConflict(null);
      setIsResolvingCloudSync(false);
    } catch (e) {
      console.error('Resolve (keep local) failed:', e);
      setPendingConflict(null);
      setIsResolvingCloudSync(false);
    }
  }, [user]);

  // ------------------------------------------------------------------
  // Auth state listener
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        runInitialSync(s.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        runInitialSync(s.user.id);
      } else {
        // Signed out — reset sync state
        hasSyncedRef.current = false;
        setIsResolvingCloudSync(false);
        setPendingConflict(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [runInitialSync]);

  // ------------------------------------------------------------------
  // Sign in / out
  // ------------------------------------------------------------------

  const signInWithMagicLink = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      if (!supabase) return { error: 'Cloud sync is not configured' };
      setIsAuthenticating(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) return { error: error.message };
        return { error: null };
      } finally {
        setIsAuthenticating(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    hasSyncedRef.current = false;
    await supabase.auth.signOut();
    // localStorage is kept as-is per spec
  }, []);

  // ------------------------------------------------------------------
  // Context value
  // ------------------------------------------------------------------

  const value: AuthContextValue = {
    user,
    session,
    isAuthEnabled: isSupabaseEnabled,
    isAuthenticating,
    isResolvingCloudSync,
    isSyncReady,
    pendingConflict,
    signInWithMagicLink,
    signOut,
    resolveConflictUseCloud,
    resolveConflictKeepLocal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
