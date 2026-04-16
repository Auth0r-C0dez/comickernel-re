'use client';

import { useState, useEffect, useRef } from 'react';
import { upsertResult, deleteResult } from '@/app/actions';
import type { LotteryResult } from '@/lib/db';
import { Trash2, Edit2, Check, X, Plus, Clock } from 'lucide-react';

interface Props {
  initialResults: LotteryResult[];
  date: string;
  adminMode: boolean;
}

export default function ResultTable({ initialResults, date, adminMode }: Props) {
  const [results, setResults] = useState(initialResults);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<LotteryResult | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    setResults(initialResults);
  }, [initialResults]);

  // Handle swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
  };

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
    } catch (err) {
      alert('Failed to save result');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this record?')) {
      await deleteResult(id);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className="glass overflow-hidden !p-0"
        ref={tableContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
              {results.map((res, idx) => (
                <tr key={res.id} className="group transition-colors" style={{ borderBottom: '1px solid var(--table-border)' }}>
                  <td style={{ padding: '0.5rem 0.25rem', borderLeft: '1px solid var(--table-border)', borderRight: '1px solid var(--table-border)', minWidth: 0, overflow: 'hidden', lineHeight: 1 }}>
                    {editingId === res.id ? (
                      <input
                        type="text"
                        value={editForm?.draw_time || ''}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, draw_time: e.target.value }) : null)}
                        placeholder="HH:MM AM"
                        style={{ padding: '0.15rem 0.1rem', fontSize: '0.55rem', minWidth: 0, maxWidth: '100%', width: '100%', textAlign: 'center', borderRadius: '0.2rem', border: '1px solid var(--border)', background: 'var(--accent)', boxShadow: 'none' }}
                      />
                    ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', overflow: 'hidden' }}>
                      <Clock size={7} className="hidden sm:block" style={{ opacity: 0.15, flexShrink: 0 }} />
                      <span style={{ fontSize: 'clamp(0.5rem, 1.8vw, 0.7rem)', fontWeight: 900, letterSpacing: '-0.03em', whiteSpace: 'nowrap', lineHeight: 1 }}>
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
                        <div style={{ fontSize: 'clamp(0.45rem, 1.2vw, 0.65rem)', fontFamily: 'monospace', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                  <td className="!py-3 !px-1 leading-none border-l border-white/5 min-w-0 overflow-hidden">
                    <input
                      type="text"
                      value={editForm?.draw_time || ''}
                      onChange={(e) => setEditForm(prev => prev ? ({ ...prev, draw_time: e.target.value }) : null)}
                      placeholder="HH:MM AM"
                      style={{ padding: '0.15rem 0.1rem', fontSize: '0.5rem', width: '100%', minWidth: 0, maxWidth: '100%', textAlign: 'center', borderRadius: '0.2rem', border: '1px solid var(--border)', background: 'var(--accent)' }}
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
        <button
          onClick={handleNew}
          className="btn btn-ghost w-full !py-3 border-dashed border-white/10 hover:border-white/20 text-[11px] font-bold tracking-widest opacity-60 hover:opacity-100 mt-2"
        >
          <Plus size={14} className="mr-2" /> Add New Row
        </button>
      )}
    </div>
  );
}

