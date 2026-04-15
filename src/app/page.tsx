import { isAdmin, getResults } from './actions';
import ResultTable from '@/components/ResultTable';
import AdminPortal from '@/components/AdminPortal';
import VisitorId from '@/components/VisitorId';
import { Search } from 'lucide-react';

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
    <main className="min-h-screen pb-24">
      <div className="container py-10">

        {/* Header */}
        <header className="flex flex-col items-center text-center mb-2">
          <h1 className="uppercase tracking-tight leading-none">Play India Lottery</h1>
          <p className="text-secondary opacity-50 max-w-md mx-auto mt-1 text-xs">
            Daily Result Chart
          </p>
        </header>

        <div className="force-spacer" />

        {/* Control Bar */}
        <div className="glass control-bar !py-4 !px-5 flex flex-wrap items-center justify-between gap-6">
          <div className="control-row flex items-center gap-4 flex-wrap">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-50">Select Date</span>
            <form action="/" method="GET" className="flex items-center gap-3">
              <input
                type="date"
                name="date"
                defaultValue={selectedDate}
                className="!py-2 !px-3 text-xs font-mono"
              />
              <button type="submit" className="btn btn-sm">
                <Search size={13} /> Search
              </button>
            </form>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/5 !px-3 !py-1 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
            <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Online</span>
          </div>
        </div>

        <div className="force-spacer" />

        {/* Results Header */}
        <div className="flex items-center justify-between !px-1 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-6 bg-white/20" />
            <h2 className="text-xs uppercase tracking-widest font-bold opacity-70">
              Results — {selectedDate}
            </h2>
          </div>
          {admin && (
            <div className="flex items-center gap-2">
              <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Admin</span>
            </div>
          )}
        </div>

        {/* Data Table */}
        <section className="relative">
          {results.length > 0 ? (
            <ResultTable initialResults={results} date={selectedDate} adminMode={admin} />
          ) : (
            <div className="glass !py-14 text-center">
              <p className="text-secondary text-sm opacity-40">No results for this date.</p>
              {admin && (
                <div className="mt-8">
                  <ResultTable initialResults={[]} date={selectedDate} adminMode={admin} />
                </div>
              )}
            </div>
          )}
        </section>

        <div className="force-spacer" />

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 !py-2 z-40" style={{ borderRadius: 0 }}>
          <div className="container flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500/60" />
              <span className="text-[9px] uppercase font-bold tracking-widest opacity-30">Live</span>
            </div>

            <div className="flex items-center gap-3">
              <VisitorId />
              <div className="h-3 w-[1px] bg-white/10" />
              <AdminPortal isAdmin={admin} />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
