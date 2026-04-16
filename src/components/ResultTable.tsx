'use client';

import { useState, useEffect, useRef } from 'react';
import { upsertResult, deleteResult } from '@/app/actions';
import type { LotteryResult } from '@/lib/db';
import { Trash2, Edit2, Check, X, Plus, Clock } from 'lucide-react';
import TimeInput from './TimeInput';

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
        className="overflow-x-auto rounded-lg border border-white/10"
        ref={tableContainerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <table className="w-full table-simple">
          <thead>
            <tr className="table-header">
              <th className="col-timestamp">Time</th>
              <th className="col-lottery">Sangam</th>
              <th className="col-lottery">Chetak</th>
              <th className="col-lottery">Super</th>
              <th className="col-lottery">MP Deluxe</th>
              <th className="col-lottery">Bhagya</th>
              <th className="col-lottery">Diamond</th>
              {adminMode && <th className="col-action">Action</th>}
            </tr>
          </thead>
          <tbody className="table-body">
              {results.map((res) => (
                <tr key={res.id} className="table-row">
                  <td className="col-timestamp">
                    {editingId === res.id ? (
                      <TimeInput
                        value={editForm?.draw_time || ''}
                        onChange={(val) => setEditForm(prev => prev ? ({ ...prev, draw_time: val }) : null)}
                      />
                    ) : (
                      <span className="font-mono font-bold">{res.draw_time}</span>
                    )}
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="col-lottery">
                      {editingId === res.id ? (
                        <input
                          type="text"
                          value={(editForm as any)?.[key]}
                          onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                          className="w-full !px-2 !py-1 text-xs text-center"
                        />
                      ) : (
                        <span className="font-mono text-sm font-bold">{(res as any)[key] || '--'}</span>
                      )}
                    </td>
                  ))}
                  {adminMode && (
                    <td className="col-action">
                      <div className="flex items-center gap-2 justify-center">
                        {editingId === res.id ? (
                          <>
                            <button onClick={handleSave} title="Save" className="text-green-400 hover:scale-110 transition-all !p-1"><Check size={16} /></button>
                            <button onClick={() => setEditingId(null)} title="Cancel" className="text-red-400 hover:scale-110 transition-all !p-1"><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEdit(res)} title="Edit" className="opacity-40 hover:opacity-100 hover:text-blue-400 transition-all !p-1"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(res.id!)} title="Delete" className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all !p-1"><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {editingId === 'new' && (
                <tr className="table-row bg-white/[0.05]">
                  <td className="col-timestamp">
                    <TimeInput
                      value={editForm?.draw_time || ''}
                      onChange={(val) => setEditForm(prev => prev ? ({ ...prev, draw_time: val }) : null)}
                      placeholder="HH:MM AM"
                    />
                  </td>
                  {['sangam', 'chetak', 'super', 'mp_deluxe', 'bhagya_rekha', 'diamond'].map((key) => (
                    <td key={key} className="col-lottery">
                      <input
                        type="text"
                        placeholder="--"
                        value={(editForm as any)?.[key]}
                        onChange={(e) => setEditForm(prev => prev ? ({ ...prev, [key]: e.target.value }) : null)}
                        className="w-full !px-2 !py-1 text-xs text-center"
                      />
                    </td>
                  ))}
                  <td className="col-action">
                    <div className="flex items-center gap-2 justify-center">
                      <button onClick={handleSave} className="text-green-400 hover:scale-110 transition-all !p-1 bg-white/5 rounded-full"><Check size={16} /></button>
                      <button onClick={() => setEditingId(null)} className="text-red-400 hover:scale-110 transition-all !p-1 bg-white/5 rounded-full"><X size={16} /></button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

