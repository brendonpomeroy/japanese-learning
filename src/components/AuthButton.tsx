/**
 * CloudBackupModal — a standalone modal opened from Settings.
 *
 * Shows:
 *  - Email OTP sign-in form when signed out
 *  - 6-digit code entry after email is sent
 *  - Account info + sign-out when signed in
 *  - Sync status indicator
 */

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';

interface CloudBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CloudBackupModal({ isOpen, onClose }: CloudBackupModalProps) {
  const {
    user,
    isAuthEnabled,
    isAuthenticating,
    isResolvingCloudSync,
    isSyncReady,
    sendOtp,
    verifyOtp,
    signOut,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'verifying' | 'error'>(
    'idle',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMsg('');
      setEmail('');
      setOtpCode('');
    }
  }, [isOpen]);

  // Auto-focus OTP input when code entry shows
  useEffect(() => {
    if (status === 'sent') {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [status]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !isAuthEnabled) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('idle');
    setErrorMsg('');

    const { error } = await sendOtp(email.trim());
    if (error) {
      setStatus('error');
      setErrorMsg(error);
    } else {
      setStatus('sent');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length !== 6) return;
    setErrorMsg('');

    const { error } = await verifyOtp(email.trim(), otpCode.trim());
    if (error) {
      setStatus('sent');
      setErrorMsg(error);
    }
    // On success, onAuthStateChange fires and the modal shows signed-in state
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
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
            <h2 className="text-lg font-bold text-primary">Cloud Backup</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-secondary hover:text-primary hover:bg-surface-alt transition-colors"
            aria-label="Close"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Signed in */}
        {user ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-alt p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-sm font-bold">
                  {user.email?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-secondary">Signed in</p>
                </div>
              </div>

              {/* Sync status */}
              <div className="flex items-center gap-2 pt-1">
                {isResolvingCloudSync ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs text-amber-500">Syncing…</span>
                  </>
                ) : isSyncReady ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Backup active
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-xs text-secondary">Idle</span>
                  </>
                )}
              </div>
            </div>

            <p className="text-xs text-secondary">
              Your progress is backed up to the cloud and can be restored on
              other devices by signing in with the same email.
            </p>

            <button
              onClick={handleSignOut}
              className="w-full rounded-xl bg-surface-alt px-4 py-2.5 text-sm font-medium text-primary border border-border transition-colors hover:bg-border-light"
            >
              Sign Out
            </button>
          </div>
        ) : status === 'sent' ? (
          /* OTP code entry */
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-accent-blue/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-blue"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-primary">
                Enter your code
              </p>
              <p className="text-xs text-secondary">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <input
                ref={otpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={e =>
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-3 rounded-xl bg-surface-alt text-primary placeholder-tertiary border border-border focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition-colors"
              />

              {errorMsg && (
                <p className="text-xs text-red-500 text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || otpCode.length !== 6}
                className="w-full rounded-xl bg-accent-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent-blue/90 transition-colors"
              >
                {isAuthenticating ? 'Verifying…' : 'Verify Code'}
              </button>
            </form>

            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setStatus('idle');
                  setOtpCode('');
                  setErrorMsg('');
                }}
                className="text-xs text-accent-blue hover:underline"
              >
                Use a different email
              </button>
              <button
                onClick={() => handleSendCode({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isAuthenticating}
                className="text-xs text-accent-blue hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </div>
        ) : (
          /* Sign in form */
          <div className="space-y-4">
            <p className="text-sm text-secondary">
              Sign in with your email to enable cloud backup. We'll send you a
              code — no password needed.
            </p>

            <form onSubmit={handleSendCode} className="space-y-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-surface-alt text-primary placeholder-tertiary border border-border focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/30 transition-colors"
                autoFocus
              />

              {status === 'error' && (
                <p className="text-xs text-red-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={isAuthenticating || !email.trim()}
                className="w-full rounded-xl bg-accent-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-accent-blue/90 transition-colors"
              >
                {isAuthenticating ? 'Sending…' : 'Send Code'}
              </button>
            </form>

            <p className="text-xs text-tertiary text-center">
              Your progress is always saved locally. Cloud backup is optional.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
