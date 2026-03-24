/**
 * Cloud data wrapping / unwrapping utilities.
 *
 * These helpers keep Supabase-specific metadata out of React components
 * and context reducers. The app's internal state shapes are never changed —
 * wrapping only happens at the sync boundary.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CloudBackedValue<T = unknown> = {
  schemaVersion: number;
  deviceId: string;
  clientUpdatedAt: string;
  payload: T;
};

export type LocalSyncMeta = {
  clientUpdatedAt: string;
  deviceId: string;
};

// The four synced localStorage keys
export const SYNCED_KEYS = [
  'japanese-learning-progress',
  'japanese-learning-settings',
  'vocab_progress_v2',
  'grammar_progress_v1',
] as const;

export type SyncedKey = (typeof SYNCED_KEYS)[number];

export function metaKey(key: SyncedKey): string {
  return `${key}_meta`;
}

// ---------------------------------------------------------------------------
// Wrap / Unwrap
// ---------------------------------------------------------------------------

export function wrapCloudValue<T>(
  payload: T,
  meta: LocalSyncMeta,
): CloudBackedValue<T> {
  return {
    schemaVersion: 1,
    deviceId: meta.deviceId,
    clientUpdatedAt: meta.clientUpdatedAt,
    payload,
  };
}

export function isCloudBackedValue(value: unknown): value is CloudBackedValue {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.schemaVersion === 'number' &&
    typeof v.deviceId === 'string' &&
    typeof v.clientUpdatedAt === 'string' &&
    'payload' in v
  );
}

export function getClientUpdatedAt(
  value: unknown,
): string | null {
  if (isCloudBackedValue(value)) return value.clientUpdatedAt;
  return null;
}

export function getPayload<T = unknown>(
  value: unknown,
): T | null {
  if (isCloudBackedValue(value)) return value.payload as T;
  return null;
}

// ---------------------------------------------------------------------------
// Metadata persistence
// ---------------------------------------------------------------------------

export function readSyncMeta(key: SyncedKey): LocalSyncMeta | null {
  try {
    const raw = localStorage.getItem(metaKey(key));
    if (!raw) return null;
    return JSON.parse(raw) as LocalSyncMeta;
  } catch {
    return null;
  }
}

export function writeSyncMeta(key: SyncedKey, meta: LocalSyncMeta): void {
  try {
    localStorage.setItem(metaKey(key), JSON.stringify(meta));
  } catch (e) {
    console.error(`Error writing sync meta for ${key}:`, e);
  }
}

// ---------------------------------------------------------------------------
// Comparison helpers
// ---------------------------------------------------------------------------

/** Shallow JSON equality check (sufficient for whole-key comparison). */
export function deepEqualPayload(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
