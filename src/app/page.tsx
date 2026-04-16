import { isAdmin, getResults } from './actions';
import ResultTable from '@/components/ResultTable';
import PageFooter from '@/components/PageFooter';
import DateResetHandler from '@/components/DateResetHandler';
import { ThemeToggle } from '@/components/ThemeProvider';
import { Search, Database, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  let date = '';
  let admin = false;
  let results: any[] = [];
  let errorMsg = '';

  try {
    const params = await searchParams;
    date = params.date || '';
    
    // Sanitize date to prevent accidental characters (like :1 from console)
    if (date) {
      date = date.split(':')[0].trim();
    }

    admin = await isAdmin();
    
    const today = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toISOString().split('T')[0];
    const selectedDate = date || today;
    
    results = await getResults(selectedDate);
    
    return (
      <main className="min-h-screen pb-24 w-screen overflow-x-hidden">
        <DateResetHandler />
        <div className="container py-10">

          {/* Header */}
          <header className="flex items-center justify-between mb-2">
            <div className="flex flex-col items-center text-center flex-1">
              <h1 className="uppercase tracking-tight leading-none">Play India Lottery</h1>
              <p className="text-secondary opacity-50 max-w-md mx-auto mt-1 text-xs">
                Daily Result Chart
              </p>
            </div>
            <div className="absolute top-6 right-6">
              <ThemeToggle />
            </div>
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
              <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Connected</span>
            </div>
          </div>

          <div className="force-spacer" />

          {/* Results Header */}
          <div className="flex items-center justify-between !px-1 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-6 bg-white/20" />
              <h2 className="text-xs uppercase tracking-widest font-bold opacity-70">
                Session — {selectedDate}
              </h2>
            </div>
            {admin && (
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Admin Mode</span>
              </div>
            )}
          </div>

          {/* Data Table */}
          <section className="relative">
            {results.length > 0 ? (
              <ResultTable initialResults={results} date={selectedDate} adminMode={admin} />
            ) : (
              <div className="glass !py-14 text-center">
                <div className="flex justify-center mb-4 opacity-10">
                  <Database size={40} />
                </div>
                <p className="text-secondary text-sm opacity-40 font-bold">No sequences confirmed for {selectedDate}</p>
                <p className="text-[10px] text-secondary opacity-20 mt-2 uppercase tracking-widest">Verification Status: Queried Successfully</p>
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
          <PageFooter isAdmin={admin} />
        </div>
      </main>
    );
  } catch (e: any) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-10 font-mono text-xs text-red-500 text-center">
        <div className="space-y-4 max-w-sm">
          <AlertTriangle size={48} className="mx-auto" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Critical Execution Error</h2>
          <p className="opacity-60">{e.message}</p>
          <div className="pt-4 border-t border-red-900/30">
            <a href="/" className="btn btn-sm text-white border-red-900 bg-red-900/20">Attempt Recovery</a>
          </div>
        </div>
      </div>
    );
  }
}
