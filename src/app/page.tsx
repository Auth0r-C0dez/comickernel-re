import { isAdmin, getResults } from './actions';
import ResultTable from '@/components/ResultTable';
import AdminPortal from '@/components/AdminPortal';
import VisitorId from '@/components/VisitorId';
import { Search, Calendar, ShieldCheck, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const admin = await isAdmin();
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = searchParams.date || today;
  const results = await getResults(selectedDate);

  return (
    <main className="min-h-screen pb-32 animate-entrance">
      <div className="container !py-10">

        {/* --- Header Section --- */}
        <header className="relative flex flex-col items-center text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 !px-4 !py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            <Activity size={12} className="text-secondary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary opacity-70">Live Distribution Network</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="uppercase tracking-tighter">
              Play India <span className="opacity-30">Lottery</span>
            </h1>
            <p className="text-secondary opacity-40 max-w-sm mx-auto text-[11px] uppercase tracking-[0.3em] font-medium">
              Real-Time Result Protocol
            </p>
          </div>
        </header>

        <div className="force-spacer-sm" />

        {/* --- Dashboard Controls --- */}
        <div className="glass !p-2 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 !p-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="opacity-30" />
                <span className="text-[11px] font-black text-secondary uppercase tracking-widest opacity-60">Archive Query</span>
              </div>
              
              <form action="/" method="GET" className="flex items-center gap-3">
                <input
                  type="date"
                  name="date"
                  defaultValue={selectedDate}
                  className="!py-2 !px-4 text-xs font-mono bg-white/5 border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 transition-all"
                />
                <button type="submit" className="btn btn-primary !py-2 !px-4 h-full">
                  <Search size={14} className="mr-2" /> <span className="text-[10px] uppercase font-bold">Search</span>
                </button>
              </form>
            </div>

            <div className="hidden lg:flex items-center gap-4 bg-white/5 !px-4 !py-2 rounded-xl border border-white/5">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold opacity-30 uppercase tracking-tighter">Node Status</span>
                <span className="text-[10px] font-mono text-green-500 uppercase font-black">Operational</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
          </div>
        </div>

        <div className="force-spacer-sm" />

        {/* --- Results Display --- */}
        <section className="space-y-6">
          <div className="flex items-center justify-between !px-2">
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-white/20" />
              <h2 className="text-[11px] uppercase tracking-[0.4em] font-black opacity-80 flex items-center gap-3">
                Session <span className="opacity-30">/</span> {selectedDate}
              </h2>
            </div>
            
            {admin && (
              <div className="flex items-center gap-3 !px-3 !py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <ShieldCheck size={14} className="text-red-500" />
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Administrator</span>
              </div>
            )}
          </div>

          <div className="relative">
            {results.length > 0 ? (
              <ResultTable initialResults={results} date={selectedDate} adminMode={admin} />
            ) : (
              <div className="glass !py-24 text-center space-y-4">
                <div className="opacity-10 scale-150 mb-4 inline-block">
                  <Activity size={48} strokeWidth={1} />
                </div>
                <p className="text-secondary text-xs uppercase tracking-widest opacity-40 font-bold">No Records Found for this Sequence</p>
                {admin && (
                  <div className="max-w-4xl mx-auto !px-4">
                    <ResultTable initialResults={[]} date={selectedDate} adminMode={admin} />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="force-spacer" />

        {/* --- Persistent Navigation (Monochrome) --- */}
        <footer className="fixed bottom-0 left-0 right-0 glass !p-0 z-50 border-t border-white/10" style={{ borderRadius: 0 }}>
          <div className="container !py-3 flex justify-between items-center gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">System Synchronized</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <VisitorId />
              <div className="h-4 w-[1px] bg-white/10" />
              <AdminPortal isAdmin={admin} />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
