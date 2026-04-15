'use client';

import { useState, useEffect } from 'react';
import { upsertResult, deleteResult } from '@/app/actions';
import type { LotteryResult } from '@/lib/db';
import { Trash2, Edit2, Check, X, Plus, Clock, Loader2 } from 'lucide-react';

interface Props {
  initialResults: LotteryResult[];
  date: string;
  adminMode: boolean;
}

export default function ResultTable({ initialResults, date, adminMode }: Props) {
  const [results, setResults] = useState(initialResults);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [editForm, setEditForm] = useState<LotteryResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setResults(initialResults);
  }, [initialResults]);

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
    setIsSubmitting(true);
    try {
      await upsertResult(editForm);
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      alert('Authentication error or database timeout. Please verify access.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Permanently remove this entry from the ledger?')) {
      await deleteResult(id);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass overflow-hidden !p-0 border-white/5 shadow-2xl">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse table-auto min-w-max">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                <th className="!py-5 !px-8 text-[10px] uppercase tracking-[0.25em] text-secondary font-black opacity-40">Time Sequence</th>
                {['Sangam', 'Chetak', 'Super', 'MP Deluxe', 'Bhagya', 'Diamond'].map(h => (
                  <th key={h} className="!py-5 !px-6 text-[10px] uppercase tracking-[0.25em] text-secondary font-black opacity-40">{h}</th>
                ))}
                {adminMode && <th className="!py-5 !px-6 text-[10px] uppercase tracking-[0.25em] text-secondary font-black opacity-40">Command</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {results.map((res) => (
                <tr key={res.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                  <td className="!py-6 !px-8 leading-none">
                    {editingId === res.id ? (
                      <input
                        type="text"
                        value={editForm?.draw_time}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, draw_time: e.target.value }) : null)}
                        className="w-[120px] !px-4 !py-2.5 bg-black/40 border-white/10 rounded-xl text-xs font-bold focus:border-white/40 outline-none"
                      />
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full border border-white/20 group-hover:border-white/50 transition-colors" />
                        <span className="text-xs font-black text-white tracking-widest">{res.draw_time}</span>
                      </div>
                    )}
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="!py-6 !px-6">
                      {editingId === res.id ? (
                        <input
                          type="text"
                          value={(editForm as any)?.[key]}
                          onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                          className="w-full min-w-[100px] !px-4 !py-2.5 bg-black/40 border-white/10 rounded-xl text-xs text-center focus:border-white/40 outline-none"
                        />
                      ) : (
                        <div className="text-sm font-mono opacity-40 group-hover:opacity-100 group-hover:scale-110 origin-center transition-all duration-300 whitespace-nowrap">
                          {(res as any)[key] || '--'}
                        </div>
                      )}
                    </td>
                  ))}
                  {adminMode && (
                    <td className="!py-6 !px-6">
                      <div className="flex items-center gap-2">
                        {editingId === res.id ? (
                          <>
                            <button onClick={handleSave} disabled={isSubmitting} className="p-2.5 rounded-full bg-white text-black hover:scale-110 transition-all disabled:opacity-50">
                              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(res)} className="p-2.5 opacity-20 hover:opacity-100 hover:bg-white/5 rounded-lg transition-all"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(res.id!)} className="p-2.5 opacity-20 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all"><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              
              {editingId === 'new' && (
                <tr className="bg-white/[0.05] animate-in fade-in zoom-in-95 duration-500">
                  <td className="!py-8 !px-8">
                    <input
                      type="text"
                      placeholder="TIME"
                      value={editForm?.draw_time}
                      onChange={(e) => setEditForm(prev => prev ? ({ ...prev, draw_time: e.target.value }) : null)}
                      className="w-[120px] !px-4 !py-3 bg-black/60 border-white/20 rounded-xl text-xs font-bold outline-none ring-1 ring-white/10 shadow-xl"
                    />
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="!py-8 !px-6">
                      <input
                        type="text"
                        placeholder="--"
                        value={(editForm as any)?.[key]}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                        className="w-full min-w-[100px] !px-4 !py-3 bg-black/60 border-white/20 rounded-xl text-xs text-center outline-none ring-1 ring-white/10 shadow-xl"
                      />
                    </td>
                  ))}
                  <td className="!py-8 !px-6">
                    <div className="flex items-center gap-3">
                      <button onClick={handleSave} disabled={isSubmitting} className="p-3 rounded-full bg-white text-black hover:scale-110 transition-all shadow-xl shadow-white/10">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                        <X size={18} />
                      </button>
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
          className="group w-full !py-6 border-2 border-dashed border-white/5 hover:border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-500 hover:bg-white/[0.02]"
        >
          <div className="p-3 rounded-full bg-white/5 group-hover:bg-white group-hover:text-black transition-all">
            <Plus size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 transition-all">Introduce New Sequence Record</span>
        </button>
      )}
    </div>
  );
}
