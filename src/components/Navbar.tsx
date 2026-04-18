'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun, Zap } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '2.5rem',
        background: isDark ? 'rgba(12, 12, 12, 0.92)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark
          ? '0 1px 8px rgba(255,255,255,0.02)'
          : '0 1px 8px rgba(0,0,0,0.06)',
        color: isDark ? '#f4f4f5' : '#18181b',
      }}
    >
      <div
        style={{
          width: '92%',
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', paddingLeft: '0.25rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Daily Ending
          </span>
        </div>

        {/* Right — Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Live indicator */}
          <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '0.3rem' }}>
            <span className="animate-pulse" style={{ width: '0.3rem', height: '0.3rem', borderRadius: '50%', background: '#22c55e', opacity: 0.6 }} />
            <span style={{ fontSize: '0.45rem', fontWeight: 700, opacity: 0.3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live</span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block" style={{ width: '1px', height: '0.7rem', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.45rem',
              borderRadius: '0.3rem',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              border: 'none',
              cursor: 'pointer',
              color: isDark ? '#f4f4f5' : '#18181b',
              fontSize: '0.45rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'background 0.2s',
            }}
          >
            {isDark ? <Sun size={10} /> : <Moon size={10} />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
