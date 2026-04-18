'use client';

import { logoutAdmin } from '@/app/actions';
import { LogOut } from 'lucide-react';

interface PageFooterProps {
  isAdmin: boolean;
}

export default function PageFooter({ isAdmin }: PageFooterProps) {
  if (!isAdmin) return null;

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 glass z-40"
      style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '0.35rem 1rem' }}
    >
      <div className="flex justify-end items-center gap-3">
        <div style={{ height: '0.75rem', width: '1px', background: 'var(--border)' }} />
        <button
          onClick={() => logoutAdmin()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.2rem 0.5rem',
            fontSize: '0.5rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#ef4444',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: '0.3rem',
            cursor: 'pointer',
          }}
        >
          <LogOut size={9} /> Log Out
        </button>
      </div>
    </footer>
  );
}
