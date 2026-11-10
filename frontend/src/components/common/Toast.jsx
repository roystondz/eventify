import React, { useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const AUTO_DISMISS_MS = { success: 4000, info: 5000, error: 7000 };

export default function Toast({ message, type = 'success', onClose }) {
  // Callers pass an inline onClose; keep the latest without restarting the timer.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => onCloseRef.current?.(), AUTO_DISMISS_MS[type] ?? 5000);
    return () => clearTimeout(timer);
  }, [message, type]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      role={isError ? 'alert' : 'status'}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.9rem 1.25rem',
        background: '#180711',
        border: `1px solid ${isSuccess ? '#4ADE80' : isError ? 'var(--button-highlight)' : 'var(--gold-accent)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        color: '#FFFFFF',
        maxWidth: 'min(400px, calc(100vw - 4rem))',
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      {isSuccess && <CheckCircle size={20} color="#4ADE80" />}
      {isError && <AlertCircle size={20} color="var(--button-highlight)" />}
      {!isSuccess && !isError && <Info size={20} color="var(--light-champagne)" />}

      <span style={{ fontSize: '0.9rem', flex: 1 }}>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
