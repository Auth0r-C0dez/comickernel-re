'use client';

import { useState, useEffect, useRef } from 'react';
import { loginAdmin, logoutAdmin } from '@/app/actions';
import { ShieldAlert, Zap, Lock, Unlock, Loader2, X } from 'lucide-react';

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
    if (!password) return;
    setLoading(true);
    const res = await loginAdmin(password);
    if (res.success) {
      window.location.reload();
    } else {
      alert('ACCESS DENIED: Credentials Mismatch Detected.');
    }
    setLoading(false);
  };

  if (isAdmin) {
    return (
      <button 
        onClick={() => logoutAdmin()} 
        className="flex items-center gap-2 !px-4 !py-2 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        <Lock size={12} /> Terminate Root Session
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setShowLogin(true)} 
        className="text-[9px] font-bold text-secondary opacity-20 uppercase tracking-[0.2em] hover:opacity-100 transition-opacity"
      >
        Access Portal
      </button>

      {showLogin && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-[40px] flex items-center justify-center z-[100] animate-in fade-in duration-500 p-4">
          <div className="max-w-md w-full glass !p-1 space-y-px overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] border-white/10 group">
            
            <div className="bg-white/5 !p-8 space-y-8 relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 p-4 opacity-5 animate-pulse">
                <ShieldAlert size={120} strokeWidth={0.5} />
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-2">
                  <ShieldAlert size={20} className="text-white opacity-80" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white">Security Protocol</h2>
                  <p className="text-[10px] text-secondary opacity-40 uppercase tracking-[0.5em] mt-2">Level 4 Clearance Required</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="ENTER ACCESS KEY"
                    className="w-full !py-5 !px-6 bg-black/40 border-white/5 rounded-2xl text-center tracking-[1em] focus:border-white/20 focus:bg-black/60 outline-none transition-all placeholder:tracking-widest placeholder:opacity-20 font-black text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    autoFocus
                  />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/0 group-focus-within:border-white/10 transition-all scale-105 opacity-0 group-focus-within:opacity-100 group-focus-within:scale-100" />
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleLogin} 
                    disabled={loading || !password} 
                    className="flex-[2] btn bg-white text-black font-black border-none hover:scale-[1.02] disabled:opacity-20"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <><Unlock size={14} className="mr-2" /> OVERRIDE</>}
                  </button>
                  <button 
                    onClick={() => setShowLogin(false)} 
                    className="flex-1 btn bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-4 opacity-20">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-0.5 bg-white/20" />
                ))}
              </div>
            </div>

            <div className="bg-white/5 !py-3 !px-8 flex justify-between items-center">
              <span className="text-[9px] font-mono text-secondary opacity-30 uppercase tracking-widest">Auth_Gateway_v4.2</span>
              <div className="flex gap-2">
                <Zap size={10} className="text-secondary opacity-20" />
                <div className="w-2 h-2 rounded-full bg-green-500/20" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
