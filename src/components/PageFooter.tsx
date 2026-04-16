'use client';

import VisitorId from './VisitorId';
import AdminPortal from './AdminPortal';

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
          <div style={{ height: '0.75rem', width: '1px', background: 'var(--border)' }} />
          <AdminPortal isAdmin={isAdmin} />
        </div>
      </div>
    </footer>
  );
}
