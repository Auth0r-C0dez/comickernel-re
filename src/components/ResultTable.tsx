'use client';

import { useState, useEffect, useRef } from 'react';
import { upsertResult, deleteResult } from '@/app/actions';
import type { LotteryResult } from '@/lib/db';
import { Trash2, Edit2, Check, X, Plus, Clock, Search } from 'lucide-react';

const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 9999;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 9999;
  
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === 'PM';
  
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;
  
  return h * 60 + m;
};

// Compact inline time editor — stays within column width
function CompactTimeEdit({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Parse "HH:MM AM" into parts
  const parts = (value || '').match(/(\d{0,2}):?(\d{0,2})\s*(AM|PM)?/i);
  const hh = parts?.[1] || '';
  const mm = parts?.[2] || '';
  const ampm = parts?.[3]?.toUpperCase() || 'AM';

  const update = (h: string, m: string, p: string) => {
    onChange(`${h}:${m} ${p}`);
  };

  const fieldStyle: React.CSSProperties = {
    width: '1.4rem', padding: '0.1rem', fontSize: '0.5rem', fontWeight: 700,
    textAlign: 'center', borderRadius: '0.15rem', border: '1px solid var(--border)',
    background: 'var(--accent)', boxShadow: 'none', minWidth: 0, outline: 'none',
    color: 'var(--text-primary)',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.1rem', overflow: 'hidden', flexWrap: 'nowrap' }}>
      <input type="text" maxLength={2} value={hh} placeholder="HH"
        onChange={(e) => update(e.target.value.replace(/\D/g, '').slice(0, 2), mm, ampm)}
        style={fieldStyle} />
      <span style={{ fontSize: '0.45rem', fontWeight: 700, opacity: 0.4, lineHeight: 1 }}>:</span>
      <input type="text" maxLength={2} value={mm} placeholder="MM"
        onChange={(e) => update(hh, e.target.value.replace(/\D/g, '').slice(0, 2), ampm)}
        style={fieldStyle} />
      <select value={ampm} onChange={(e) => update(hh, mm, e.target.value)}
        style={{ ...fieldStyle, width: '2rem', fontSize: '0.42rem', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

interface Props {
  initialResults: LotteryResult[];
  date: string;
  adminMode: boolean;
}

export default function ResultTable({ initialResults, date, adminMode }: Props) {
  const [results, setResults] = useState(initialResults);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<LotteryResult | null>(null);

  useEffect(() => {
    setResults(initialResults);
  }, [initialResults]);

  const sortedResults = [...results].sort((a, b) => 
    timeToMinutes(a.draw_time) - timeToMinutes(b.draw_time)
  );

  const handleEdit = (res: LotteryResult) => {
    setEditingId(res.id || null);
    setEditForm({ ...res });
  };

  const handleNew = () => {
    setEditingId('new');
    setEditForm({
      date,
      draw_time: '',
      sangam: '',
      chetak: '',
      super: '',
      mp_deluxe: '',
      bhagya_rekha: '',
      diamond: ''
    });
  };

  const handleSave = async () => {
    if (!editForm) return;
    try {
      await upsertResult(editForm);
      setEditingId(null);
      setEditForm(null);
      window.location.reload(); // Refresh to get fresh data
    } catch (err) {
      alert('Failed to save result');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this record?')) {
      await deleteResult(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="scroll-lock">
        <div className="w-full overflow-hidden" style={{ maxWidth: '100%' }}>
          <table className="w-full text-left border-collapse table-fixed" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr style={{ background: 'var(--table-header-bg)', borderBottom: '2px solid var(--table-border)' }}>
                <th style={{ padding: '0.6rem 0.35rem', fontSize: 'clamp(0.42rem, 1vw, 0.6rem)', textTransform: 'uppercase', letterSpacing: '-0.02em', fontWeight: 900, opacity: 0.45, width: '22%', borderLeft: '1px solid var(--table-border)', borderRight: '1px solid var(--table-border)' }}>Time</th>
                {['Sangam', 'Chetak', 'Super', 'MP', 'Bhagya', 'Diamond'].map(h => (
                  <th key={h} style={{ padding: '0.6rem 0.15rem', fontSize: 'clamp(0.38rem, 0.9vw, 0.52rem)', textTransform: 'uppercase', letterSpacing: '-0.01em', fontWeight: 900, opacity: 0.45, textAlign: 'center', borderRight: '1px solid var(--table-border)' }}>{h}</th>
                ))}
                {adminMode && <th style={{ padding: '0.6rem 0.2rem', fontSize: 'clamp(0.38rem, 0.9vw, 0.5rem)', textTransform: 'uppercase', fontWeight: 900, opacity: 0.45, width: '12%', textAlign: 'center', borderRight: '1px solid var(--table-border)' }}>Ctrl</th>}
              </tr>
            </thead>
            <tbody>
              {sortedResults.map((res, idx) => (
                <tr key={res.id} className="group transition-colors" style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td style={{ padding: '0.5rem 0.25rem', borderLeft: '1px solid var(--table-border)', borderRight: '1px solid var(--table-border)', minWidth: 0, overflow: 'hidden', lineHeight: 1 }}>
                    {editingId === res.id ? (
                      <CompactTimeEdit
                        value={editForm?.draw_time || ''}
                        onChange={(val) => setEditForm(prev => prev ? ({ ...prev, draw_time: val }) : null)}
                      />
                    ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.15rem', overflow: 'hidden' }}>
                      <Clock size={6} className="hidden sm:block" style={{ opacity: 0.12, flexShrink: 0 }} />
                      <span style={{ fontSize: 'clamp(0.5rem, 1.3vw, 0.68rem)', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '-0.02em', whiteSpace: 'nowrap', lineHeight: 1 }}>
                        {res.draw_time}
                      </span>
                    </div>
                    )}
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} style={{ padding: '0.5rem 0.1rem', textAlign: 'center', minWidth: 0, overflow: 'hidden', borderRight: '1px solid var(--table-border)' }}>
                      {editingId === res.id ? (
                        <input
                          type="text"
                          value={(editForm as any)?.[key]}
                          onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                          style={{ padding: '0.15rem 0.1rem', fontSize: '0.5rem', width: '100%', minWidth: 0, maxWidth: '100%', textAlign: 'center', borderRadius: '0.2rem', border: '1px solid var(--border)', background: 'var(--accent)' }}
                        />
                      ) : (
                        <div style={{ fontSize: 'clamp(0.5rem, 1.3vw, 0.68rem)', fontFamily: 'monospace', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                          {(res as any)[key] || '--'}
                        </div>
                      )}
                    </td>
                  ))}
                  {adminMode && (
                    <td style={{ padding: '0.5rem 0.1rem', borderRight: '1px solid var(--table-border)' }}>
                      <div className="flex items-center justify-center gap-0.5 flex-nowrap">
                        {editingId === res.id ? (
                          <>
                            <button onClick={handleSave} className="text-green-400 hover:scale-110 !p-1"><Check size={12} /></button>
                            <button onClick={() => setEditingId(null)} className="text-red-400 hover:scale-110 !p-1"><X size={12} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(res)} className="opacity-20 hover:opacity-100 hover:text-blue-400 !p-0.5"><Edit2 size={11} /></button>
                            <button onClick={() => handleDelete(res.id!)} className="opacity-20 hover:opacity-100 hover:text-red-500 !p-0.5"><Trash2 size={11} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {editingId === 'new' && (
                <tr className="bg-white/[0.05] animate-in fade-in slide-in-from-top-4 divide-x divide-white/5">
                  <td style={{ padding: '0.5rem 0.25rem', borderLeft: '1px solid var(--table-border)', borderRight: '1px solid var(--table-border)', minWidth: 0, overflow: 'hidden', lineHeight: 1 }}>
                    <CompactTimeEdit
                      value={editForm?.draw_time || ''}
                      onChange={(val) => setEditForm(prev => prev ? ({ ...prev, draw_time: val }) : null)}
                    />
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="!py-3 !px-0.5 text-center min-w-0 overflow-hidden">
                      <input
                        type="text"
                        placeholder="--"
                        value={(editForm as any)?.[key]}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                        className=""
                        style={{ padding: '0.15rem 0.1rem', fontSize: '0.5rem', width: '100%', minWidth: 0, maxWidth: '100%', textAlign: 'center', borderRadius: '0.2rem', border: '1px solid var(--border)', background: 'var(--accent)' }}
                      />
                    </td>
                  ))}
                  <td className="!py-3 !px-0.5 text-center border-r border-white/5">
                    <div className="flex items-center justify-center gap-0.5 flex-nowrap">
                      <button onClick={handleSave} className="text-green-400 hover:scale-110 !p-1 bg-white/5 rounded-full"><Check size={12} /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-400 hover:scale-110 !p-1 bg-white/5 rounded-full"><X size={12} /></button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {adminMode && editingId !== 'new' && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
          <button
            onClick={handleNew}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.3rem 0.85rem',
              fontSize: '0.5rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '999px',
              border: '1px dashed var(--border-strong)',
              background: 'transparent',
              color: 'var(--text-primary)',
              opacity: 0.4,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Plus size={10} /> Add Row
          </button>
        </div>
      )}
    </div>
  );
}
