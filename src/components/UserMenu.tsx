import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { CloudBackupModal } from './AuthButton';
import ThemeToggle from './ThemeToggle';

const themes = [
  {
    id: 'default' as const,
    label: 'Default',
    swatches: ['#3b82f6', '#f3f4f6', '#ffffff'],
  },
  {
    id: 'paper' as const,
    label: 'Paper Study',
    swatches: ['#5C84E6', '#F7F3EC', '#FFFDF9'],
  },
];

/** Desktop dropdown for theme + appearance settings */
export function UserMenu() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthEnabled, isResolvingCloudSync, isSyncReady } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showCloudModal, setShowCloudModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Appearance settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Palette icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl shadow-soft-lg border border-border py-3 z-50">
          {/* Dark mode section */}
          <div className="px-4 pb-3 border-b border-border-light">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                Appearance
              </span>
              <ThemeToggle />
            </div>
          </div>

          {/* Theme section */}
          <div className="px-4 pt-3">
            <span className="text-xs font-medium text-secondary uppercase tracking-wide">
              Theme
            </span>
            <div className="mt-2 space-y-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left ${
                    theme === t.id
                      ? 'bg-accent-blue/10 text-accent-blue font-medium'
                      : 'text-primary hover:bg-surface-alt'
                  }`}
                >
                  {/* Color swatches */}
                  <div className="flex -space-x-1">
                    {t.swatches.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/50"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{t.label}</span>
                  {theme === t.id && (
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cloud Backup */}
          {isAuthEnabled && (
            <div className="px-4 pt-3 mt-2 border-t border-border-light">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCloudModal(true);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left text-primary hover:bg-surface-alt transition-colors"
              >
                <svg
                  className="w-4 h-4 text-accent-blue"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <span className="text-sm">Cloud Backup</span>
                {user && (
                  <span
                    className={`w-2 h-2 rounded-full ml-auto ${
                      isResolvingCloudSync
                        ? 'bg-amber-400 animate-pulse'
                        : isSyncReady
                          ? 'bg-green-400'
                          : 'bg-gray-400'
                    }`}
                  />
                )}
              </button>
            </div>
          )}
        </div>
      )}

      <CloudBackupModal
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
      />
    </div>
  );
}

/** Inline version for mobile bottom sheets */
export function UserMenuMobile() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthEnabled, isResolvingCloudSync, isSyncReady } = useAuth();
  const [showCloudModal, setShowCloudModal] = useState(false);

  return (
    <>
    <div className="space-y-3">
      {/* Dark mode row */}
      <div className="flex items-center justify-between p-3 bg-surface-alt rounded-xl">
        <span className="text-sm font-medium text-primary">Appearance</span>
        <ThemeToggle />
      </div>

      {/* Theme selection */}
      <div className="p-3 bg-surface-alt rounded-xl">
        <span className="text-xs font-medium text-secondary uppercase tracking-wide">
          Theme
        </span>
        <div className="mt-2 space-y-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors text-left ${
                theme === t.id
                  ? 'bg-accent-blue/10 text-accent-blue font-medium'
                  : 'text-primary hover:bg-surface'
              }`}
            >
              <div className="flex -space-x-1">
                {t.swatches.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-white/50"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-sm">{t.label}</span>
              {theme === t.id && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cloud Backup */}
      {isAuthEnabled && (
        <button
          onClick={() => setShowCloudModal(true)}
          className="flex items-center gap-3 w-full p-3 rounded-xl bg-surface-alt text-primary hover:bg-border-light transition-colors"
        >
          <svg
            className="w-5 h-5 text-accent-blue"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
          <span className="text-sm font-medium">Cloud Backup</span>
          {user && (
            <span
              className={`w-2 h-2 rounded-full ml-auto ${
                isResolvingCloudSync
                  ? 'bg-amber-400 animate-pulse'
                  : isSyncReady
                    ? 'bg-green-400'
                    : 'bg-gray-400'
              }`}
            />
          )}
        </button>
      )}
    </div>

    <CloudBackupModal
      isOpen={showCloudModal}
      onClose={() => setShowCloudModal(false)}
    />
    </>
  );
}
