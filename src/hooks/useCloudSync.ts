/**
 * useCloudSync — debounced write-through sync for a single localStorage key.
 *
 * Wraps the payload with cloud metadata and upserts to Supabase.
 * Does nothing when Supabase is disabled, unauthenticated, or during
 * hydration / conflict resolution.
 */

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getDeviceId } from '../lib/device';
import { type SyncedKey, readSyncMeta, wrapCloudValue } from '../lib/cloudData';
import { useAuth } from './useAuth';

const DEBOUNCE_MS = 300;

export function useCloudSync<T>({
  storageKey,
  payload,
  isHydrated,
  isEnabled,
}: {
  storageKey: SyncedKey;
  payload: T;
  isHydrated: boolean;
  isEnabled: boolean;
}): void {
  const { user } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPayloadRef = useRef(payload);
  latestPayloadRef.current = payload;

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    doSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isEnabled, isHydrated]);

  // Actual sync implementation
  function doSync() {
    if (!supabase || !user || !isEnabled || !isHydrated) return;
    if (!navigator.onLine) return;

    const deviceId = getDeviceId();
    const meta = readSyncMeta(storageKey) ?? {
      clientUpdatedAt: new Date().toISOString(),
      deviceId,
    };
    const wrapped = wrapCloudValue(latestPayloadRef.current, meta);

    // Fire and forget — errors logged silently
    supabase
      .from('user_data')
      .upsert(
        {
          user_id: user.id,
          key: storageKey,
          data: wrapped,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,key' }
      )
      .then(({ error }) => {
        if (error) {
          console.error(`Cloud sync failed for ${storageKey}:`, error.message);
        }
      });
  }

  // Debounced sync on payload change
  useEffect(() => {
    if (!supabase || !user || !isEnabled || !isHydrated) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      doSync();
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, user, isEnabled, isHydrated, storageKey]);

  // Flush on visibility change and online events
  useEffect(() => {
    if (!supabase || !user || !isEnabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flush();
      }
    };

    const handleOnline = () => {
      // Reconnected — sync immediately
      flush();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    window.addEventListener('pagehide', flush);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('pagehide', flush);
    };
  }, [flush, user, isEnabled]);
}
