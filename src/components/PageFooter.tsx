'use client';

import VisitorId from './VisitorId';
import AdminPortal from './AdminPortal';

interface PageFooterProps {
  isAdmin: boolean;
}

export default function PageFooter({ isAdmin }: PageFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 !py-2 z-40" style={{ borderRadius: 0 }}>
      <div className="container flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-green-500/60" />
          <span className="text-[9px] uppercase font-bold tracking-widest opacity-30">Live</span>
        </div>

        <div className="flex items-center gap-3">
          <VisitorId />
          <div className="h-3 w-[1px] bg-white/10" />
          <AdminPortal isAdmin={isAdmin} />
        </div>
      </div>
    </footer>
  );
}
