'use client';

import { useState, useEffect, useRef } from 'react';
import { loginAdmin, logoutAdmin } from '@/app/actions';
import { LogOut } from 'lucide-react';

export default function AdminPortal({ isAdmin }: { isAdmin: boolean }) {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const escCount = useRef(0);
  const escTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escCount.current += 1;
        
        if (escTimer.current) clearTimeout(escTimer.current);
        
        if (escCount.current >= 5) {
          setShowLogin(true);
          escCount.current = 0;
        } else {
          escTimer.current = setTimeout(() => {
            escCount.current = 0;
          }, 2000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      <button onClick={() => logoutAdmin()} className="btn btn-sm !px-3 font-bold text-red-500 hover:bg-red-500/10 border-red-500/20">
        Log Out
      </button>
    );
  }

  return (
    <>
      {showLogin && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="glass max-w-sm w-full !p-8 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-lg font-black uppercase tracking-[0.2em] text-white">Security Override</h2>
              <p className="text-[10px] text-secondary opacity-50 uppercase tracking-widest">Identification Required</p>
            </div>
            
            <input
              type="password"
              placeholder="Enter Access Key"
              className="w-full !py-3 !px-4 bg-white/5 border-white/10 rounded-lg text-center tracking-[0.5em] focus:border-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />

            <div className="flex gap-4">
              <button onClick={handleLogin} disabled={loading} className="btn flex-1 bg-white text-black border-white hover:bg-white/90">
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <button onClick={() => setShowLogin(false)} className="btn btn-ghost flex-1 border-white/10 hover:bg-white/5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
