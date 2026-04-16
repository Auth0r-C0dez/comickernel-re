import { isAdmin, getResults } from './actions';
import ResultTable from '@/components/ResultTable';
import PageFooter from '@/components/PageFooter';
import DateResetHandler from '@/components/DateResetHandler';
import Navbar from '@/components/Navbar';
import { Search, Database, AlertTriangle, Calendar } from 'lucide-react';

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
      <main className="min-h-screen pb-24 w-screen overflow-x-hidden" style={{ paddingTop: '2.5rem' }}>
        <Navbar />
        <DateResetHandler />
        <div className="container" style={{ paddingTop: 'clamp(0.75rem, 2vw, 1.25rem)', paddingBottom: '2rem' }}>

          {/* Date Selector — Curvy Square */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <form action="/" method="GET" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0', borderRadius: '0.75rem', border: '1px solid var(--border-strong, var(--border))', background: 'var(--bg-card)', overflow: 'hidden', width: 'auto', maxWidth: '100%', flexWrap: 'nowrap', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0.55rem 0.85rem', gap: '0.45rem', flexShrink: 1, minWidth: 0 }}>
                <Calendar size={14} style={{ opacity: 0.35, flexShrink: 0 }} />
                <input
                  type="date"
                  name="date"
                  defaultValue={selectedDate}
                  style={{ padding: '0', fontSize: '0.78rem', fontFamily: 'monospace', fontWeight: 600, background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', width: 'auto', minWidth: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}
                />
              </div>
              <button
                type="submit"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.55rem 0.85rem', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--accent)', color: 'var(--button-text)', border: 'none', borderLeft: '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.2s' }}
              >
                <Search size={12} /> Go
              </button>
            </form>
          </div>

          {/* Section Divider */}
          <div className="flex items-center justify-between" style={{ padding: '0.75rem 0.25rem 0.5rem' }}>
            <div className="flex items-center gap-2.5">
              <div style={{ height: '1px', width: '1.5rem', background: 'var(--border-strong, var(--border))' }} />
              <h2 style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, opacity: 0.5, margin: 0 }}>
                {selectedDate}
              </h2>
              <div style={{ height: '1px', width: '1.5rem', background: 'var(--border-strong, var(--border))' }} />
            </div>
            {admin && (
              <div className="flex items-center gap-1.5">
                <span className="animate-pulse rounded-full" style={{ width: '0.4rem', height: '0.4rem', background: '#ef4444' }} />
                <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Admin</span>
              </div>
            )}
          </div>

          {/* Data Table */}
          <section className="relative animate-fade-up">
            {results.length > 0 ? (
              <ResultTable initialResults={results} date={selectedDate} adminMode={admin} />
            ) : (
              <div className="glass text-center" style={{ padding: '3rem 1.5rem' }}>
                <div className="flex justify-center" style={{ marginBottom: '1rem', opacity: 0.08 }}>
                  <Database size={36} />
                </div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.35 }}>No results for {selectedDate}</p>
                <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.15, marginTop: '0.5rem' }}>Awaiting data feed</p>
                {admin && (
                  <div style={{ marginTop: '2rem' }}>
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
      <div className="min-h-screen flex items-center justify-center" style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#ef4444', textAlign: 'center', background: '#050505' }}>
        <div style={{ maxWidth: '22rem' }}>
          <AlertTriangle size={40} style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>System Error</h2>
          <p style={{ opacity: 0.5, marginTop: '0.5rem' }}>{e.message}</p>
          <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
            <a href="/" className="btn btn-sm" style={{ color: 'white', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)' }}>Retry</a>
          </div>
        </div>
      </div>
    );
  }
}
