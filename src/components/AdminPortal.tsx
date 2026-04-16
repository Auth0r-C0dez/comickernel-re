'use client';

import { useState, useEffect, useRef } from 'react';
import { loginAdmin, logoutAdmin } from '@/app/actions';
import { LogOut, Lock, X as XIcon } from 'lucide-react';

export default function AdminPortal({ isAdmin }: { isAdmin: boolean }) {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const escCount = useRef(0);
  const escTimer = useRef<NodeJS.Timeout | null>(null);
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escCount.current += 1;
        if (escTimer.current) clearTimeout(escTimer.current);
        if (escCount.current >= 5) {
          setShowLogin(true);
          escCount.current = 0;
        } else {
          escTimer.current = setTimeout(() => { escCount.current = 0; }, 2000);
        }
      }
    };

    const handleTap = () => {
      tapCount.current += 1;
      if (tapTimer.current) clearTimeout(tapTimer.current);
      if (tapCount.current >= 5) {
        setShowLogin(true);
        tapCount.current = 0;
      } else {
        tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleTap);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleTap);
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const res = await loginAdmin(password);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  if (isAdmin) {
    return (
      <button
        onClick={() => logoutAdmin()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.25rem 0.6rem',
          fontSize: '0.55rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#ef4444',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: '0.35rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <LogOut size={10} /> Log Out
      </button>
    );
  }

  return (
    <>
      {showLogin && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '22rem',
              background: 'var(--bg-card, rgba(20,20,20,0.9))',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: '2rem 1.75rem',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            }}
          >
            {/* Close button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button
                onClick={() => setShowLogin(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3, color: 'var(--text-primary, #fff)', padding: '0.25rem' }}
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.6rem', background: 'var(--accent, rgba(255,255,255,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={16} style={{ opacity: 0.5 }} />
                </div>
              </div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.3rem' }}>
                Admin Access
              </h2>
              <p style={{ fontSize: '0.55rem', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                Enter credentials to continue
              </p>
            </div>

            {/* Input */}
            <input
              type="password"
              placeholder="Access Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                letterSpacing: '0.2em',
                textAlign: 'center',
                background: 'var(--accent, rgba(255,255,255,0.03))',
                border: '1px solid var(--border-strong, rgba(255,255,255,0.1))',
                borderRadius: '0.5rem',
                color: 'var(--text-primary, #fff)',
                outline: 'none',
                boxShadow: 'none',
                marginBottom: '1rem',
              }}
            />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'var(--text-primary, #fff)',
                  color: 'var(--bg-deep, #000)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {loading ? 'Verifying...' : 'Log In'}
              </button>
              <button
                onClick={() => setShowLogin(false)}
                style={{
                  flex: 1,
                  padding: '0.55rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: 'transparent',
                  color: 'var(--text-primary, #fff)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  opacity: 0.5,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
