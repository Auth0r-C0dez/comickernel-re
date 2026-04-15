'use client';

import { useState, useEffect } from 'react';
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
      <div className="glass overflow-hidden !p-0">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03]">
                <th className="!py-4 !px-6 text-[10px] uppercase tracking-[0.2em] text-secondary font-black opacity-60">Timestamp</th>
                {['Sangam', 'Chetak', 'Super', 'MP Deluxe', 'Bhagya', 'Diamond'].map(h => (
                  <th key={h} className="!py-4 !px-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-black opacity-60">{h}</th>
                ))}
                {adminMode && <th className="!py-4 !px-4 text-[10px] uppercase tracking-[0.2em] text-secondary font-black opacity-60">Control</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {results.map((res) => (
                <tr key={res.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="!py-5 !px-6">
                    {editingId === res.id ? (
                      <input
                        type="text"
                        value={editForm?.draw_time}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, draw_time: e.target.value }) : null)}
                        className="w-full !px-3 !py-2 bg-black/40 border-white/10 rounded-md text-xs font-bold focus:border-white/20"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Clock size={14} className="opacity-20" />
                        <span className="text-xs font-black text-white tracking-tight">{res.draw_time}</span>
                      </div>
                    )}
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="!py-5 !px-4">
                      {editingId === res.id ? (
                        <input
                          type="text"
                          value={(editForm as any)?.[key]}
                          onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                          className="w-full min-w-[120px] !px-3 !py-2 bg-black/40 border-white/10 rounded-md text-xs text-center focus:border-white/20"
                        />
                      ) : (
                        <div className="text-sm font-mono opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                          {(res as any)[key] || '--'}
                        </div>
                      )}
                    </td>
                  ))}
                  {adminMode && (
                    <td className="!py-5 !px-4">
                      <div className="flex items-center gap-4">
                        {editingId === res.id ? (
                          <>
                            <button onClick={handleSave} className="text-green-400 hover:scale-110 transition-transform"><Check size={18} /></button>
                            <button onClick={() => setEditingId(null)} className="text-red-400 hover:scale-110 transition-transform"><X size={18} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(res)} className="opacity-20 hover:opacity-100 hover:text-blue-400 transition-all"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(res.id!)} className="opacity-20 hover:opacity-100 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {editingId === 'new' && (
                <tr className="bg-white/[0.04] animate-in fade-in slide-in-from-top-2">
                  <td className="!py-6 !px-6">
                    <input
                      type="text"
                      placeholder="HH:MM AM"
                      value={editForm?.draw_time}
                      onChange={(e) => setEditForm(prev => prev ? ({ ...prev, draw_time: e.target.value }) : null)}
                      className="w-full !px-3 !py-2 bg-black/60 border-white/20 rounded-md text-xs font-bold"
                    />
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="!py-6 !px-4">
                      <input
                        type="text"
                        placeholder="--"
                        value={(editForm as any)?.[key]}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                        className="w-full min-w-[120px] !px-3 !py-2 bg-black/60 border-white/20 rounded-md text-xs text-center"
                      />
                    </td>
                  ))}
                  <td className="!py-6 !px-4">
                    <div className="flex items-center gap-4">
                      <button onClick={handleSave} className="text-green-400 hover:scale-110 transition-transform"><Check size={20} /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-400 hover:scale-110 transition-transform"><X size={20} /></button>
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
