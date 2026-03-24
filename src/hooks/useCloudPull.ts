/**
 * Cloud pull / push helpers.
 *
 * Works with all 4 synced keys in one place, keeping Supabase specifics
 * out of React components and context providers.
 */

import { supabase } from '../lib/supabase';
import { getDeviceId } from '../lib/device';
import {
  type CloudBackedValue,
  type SyncedKey,
  SYNCED_KEYS,
  wrapCloudValue,
  readSyncMeta,
  writeSyncMeta,
} from '../lib/cloudData';

// ---------------------------------------------------------------------------
// Pull all cloud rows for the authenticated user
// ---------------------------------------------------------------------------

export async function pullAllKeys(
  userId: string
): Promise<Record<string, CloudBackedValue>> {
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('user_data')
    .select('key, data')
    .eq('user_id', userId);

  if (error) {
    console.error('Cloud pull failed:', error.message);
    return {};
  }

  const result: Record<string, CloudBackedValue> = {};
  for (const row of data ?? []) {
    result[row.key as string] = row.data as CloudBackedValue;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Push (upsert) a single key
// ---------------------------------------------------------------------------

export async function upsertKey(
  userId: string,
  key: SyncedKey,
  wrapped: CloudBackedValue
): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase.from('user_data').upsert(
    {
      user_id: userId,
      key,
      data: wrapped,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,key' }
  );

  if (error) {
    console.error(`Cloud upsert failed for ${key}:`, error.message);
  }
}

// ---------------------------------------------------------------------------
// Push all local data to cloud
// ---------------------------------------------------------------------------

export async function pushAllKeys(userId: string): Promise<void> {
  if (!supabase) return;

  const deviceId = getDeviceId();

  for (const key of SYNCED_KEYS) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const payload = JSON.parse(raw);
      const meta = readSyncMeta(key) ?? {
        clientUpdatedAt: new Date().toISOString(),
        deviceId,
      };
      const wrapped = wrapCloudValue(payload, meta);
      await upsertKey(userId, key, wrapped);
    } catch (e) {
      console.error(`Failed to push ${key}:`, e);
    }
  }
}

// ---------------------------------------------------------------------------
// Restore cloud data into localStorage + update sync meta
// ---------------------------------------------------------------------------

export function restoreCloudLocally(
  cloudData: Record<string, CloudBackedValue>
): void {
  for (const key of SYNCED_KEYS) {
    const cloudValue = cloudData[key];
    if (!cloudValue) continue;

    try {
      localStorage.setItem(key, JSON.stringify(cloudValue.payload));
      writeSyncMeta(key, {
        clientUpdatedAt: cloudValue.clientUpdatedAt,
        deviceId: cloudValue.deviceId,
      });
    } catch (e) {
      console.error(`Failed to restore ${key} locally:`, e);
    }
  }
}
