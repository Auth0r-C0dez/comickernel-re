'use client';

import { useState } from 'react';
import { loginAdmin } from '@/app/actions';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await loginAdmin(password);
    if (res.success) {
      window.location.href = '/';
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'var(--bg-deep)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '20rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          padding: '2rem 1.75rem',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Back link */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.55rem', opacity: 0.35, textDecoration: 'none', color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 600 }}>
          <ArrowLeft size={10} /> Back to Results
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.6rem', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={16} style={{ opacity: 0.5 }} />
            </div>
          </div>
          <h2 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 0.3rem' }}>
            Admin Access
          </h2>
          <p style={{ fontSize: '0.5rem', opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Authorized personnel only
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
            padding: '0.6rem 0.75rem',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            letterSpacing: '0.2em',
            textAlign: 'center',
            background: 'var(--accent)',
            border: '1px solid var(--border-strong)',
            borderRadius: '0.5rem',
            color: 'var(--text-primary)',
            outline: 'none',
            boxShadow: 'none',
            marginBottom: '1rem',
          }}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.55rem',
            fontSize: '0.6rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: 'var(--text-primary)',
            color: 'var(--bg-deep)',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Verifying...' : 'Log In'}
        </button>
      </div>
    </div>
  );
}
