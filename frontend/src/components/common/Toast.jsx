import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
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
        maxWidth: '400px',
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
