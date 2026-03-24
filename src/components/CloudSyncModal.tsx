/**
 * CloudSyncModal — shown when local and cloud data have an ambiguous conflict.
 *
 * Presents two choices:
 *  - Use Cloud Data (restores cloud → local)
 *  - Keep Local Data (pushes local → cloud)
 */

import { useAuth } from '../hooks/useAuth';

export function CloudSyncModal() {
  const { pendingConflict, resolveConflictUseCloud, resolveConflictKeepLocal } =
    useAuth();

  if (!pendingConflict) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl border border-border">
        <h2 className="text-lg font-bold text-primary mb-2">
          Sync Conflict Detected
        </h2>
        <p className="text-sm text-secondary mb-4">
          This device has existing progress, and your cloud backup also has
          progress. Please choose which version to keep.
        </p>

        {/* Per-key details */}
        <div className="mb-5 space-y-2">
          {pendingConflict.comparisons
            .filter(c => c.direction !== 'equal')
            .map(c => (
              <div
                key={c.key}
                className="flex items-center justify-between rounded-lg bg-surface-alt px-3 py-2 text-xs"
              >
                <span className="font-mono text-primary">{c.key}</span>
                <span
                  className={
                    c.direction === 'cloud'
                      ? 'text-blue-500'
                      : c.direction === 'local'
                        ? 'text-green-600'
                        : 'text-amber-500'
                  }
                >
                  {c.direction === 'cloud'
                    ? 'Cloud newer'
                    : c.direction === 'local'
                      ? 'Local newer'
                      : 'Conflict'}
                </span>
              </div>
            ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={resolveConflictUseCloud}
            className="flex-1 rounded-xl bg-accent-blue px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/90"
          >
            Use Cloud Data
          </button>
          <button
            onClick={resolveConflictKeepLocal}
            className="flex-1 rounded-xl bg-surface-alt px-4 py-2.5 text-sm font-semibold text-primary border border-border transition-colors hover:bg-border-light"
          >
            Keep Local Data
          </button>
        </div>

        <p className="mt-3 text-xs text-tertiary text-center">
          &ldquo;Use Cloud&rdquo; replaces local progress with the cloud backup.
          &ldquo;Keep Local&rdquo; overwrites the cloud with this device's data.
        </p>
      </div>
    </div>
  );
}
