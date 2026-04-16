'use client';

import VisitorId from './VisitorId';
import { logoutAdmin } from '@/app/actions';
import { LogOut } from 'lucide-react';

interface PageFooterProps {
  isAdmin: boolean;
}

export default function PageFooter({ isAdmin }: PageFooterProps) {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 glass z-40"
      style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '0.5rem 0' }}
    >
      <div className="container flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="rounded-full" style={{ width: '0.35rem', height: '0.35rem', background: '#22c55e', opacity: 0.5 }} />
          <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.12em', opacity: 0.25 }}>Live</span>
        </div>

        <div className="flex items-center gap-3">
          <VisitorId />
          {isAdmin && (
            <>
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
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
