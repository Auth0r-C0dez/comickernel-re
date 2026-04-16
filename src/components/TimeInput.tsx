'use client';

import { useState, useEffect } from 'react';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TimeInput({ value, onChange, placeholder = "HH:MM AM" }: TimeInputProps) {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const [rawInput, setRawInput] = useState('');
  const [formattedTime, setFormattedTime] = useState('');

  // Parse existing value when it changes
  useEffect(() => {
    if (value) {
      const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        setHour(String(parseInt(match[1]))); // remove leading zero for editing
        setMinute(String(parseInt(match[2])));
        setPeriod(match[3].toUpperCase() as 'AM' | 'PM');
        setRawInput('');
      }
    }
  }, [value]);

  const formatTimeInput = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length === 0) return;

    let h = '';
    let m = '';

    if (digits.length <= 2) {
      h = digits;
    } else {
      h = digits.slice(0, 2);
      m = digits.slice(2, 4);
    }

    const hourNum = parseInt(h);
    if (h && hourNum > 12) {
      h = h.slice(0, 1);
    }

    const minNum = parseInt(m);
    if (m && minNum > 60) {
      m = m.slice(0, 1);
    }

    setHour(h);
    setMinute(m);

    if (h && m) {
      updateTime(h, m, period);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRawInput(val);
    formatTimeInput(val);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let h = e.target.value.replace(/\D/g, '');

    if (h.length > 2) h = h.slice(0, 2);
    
    // Allow empty for deletion, but validate range if not empty
    if (h) {
      const hourNum = parseInt(h);
      if (hourNum > 12) {
        return; // Don't update if exceeds 12
      }
      if (hourNum === 0) {
        return; // Don't allow 0
      }
    }

    setHour(h);

    if (h && minute) {
      updateTime(h, minute, period);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let m = e.target.value.replace(/\D/g, '');

    if (m.length > 2) m = m.slice(0, 2);
    
    // Allow empty for deletion, but validate range if not empty
    if (m) {
      const minNum = parseInt(m);
      if (minNum > 60) {
        return; // Don't update if exceeds 60
      }
      if (minNum === 0) {
        return; // Don't allow 0
      }
    }

    setMinute(m);

    if (hour && m) {
      updateTime(hour, m, period);
    }
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM'): void => {
    setPeriod(newPeriod);
    if (hour && minute) {
      updateTime(hour, minute, newPeriod);
    }
  };

  const updateTime = (h: string, m: string, p: 'AM' | 'PM') => {
    if (h && m) {
      const hourNum = parseInt(h);
      const minNum = parseInt(m);

      if (hourNum >= 1 && hourNum <= 12 && minNum >= 1 && minNum <= 60) {
        const hourFormatted = h.padStart(2, '0');
        const minFormatted = m.padStart(2, '0');
        const timeString = `${hourFormatted}:${minFormatted} ${p}`;

        onChange(timeString);
        setFormattedTime(timeString);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Input controls */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={hour}
            onChange={handleHourChange}
            placeholder="HH"
            className="w-12 !px-2 !py-2 text-center text-xs font-bold bg-black/60 border-white/10 rounded-lg focus:border-white/30"
          />
          <span className="text-xs font-bold opacity-50">:</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={minute}
            onChange={handleMinuteChange}
            placeholder="MM"
            className="w-12 !px-2 !py-2 text-center text-xs font-bold bg-black/60 border-white/10 rounded-lg focus:border-white/30"
          />
        </div>

        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
          {(['AM', 'PM'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-2 py-1 text-xs font-bold rounded transition-all ${
                period === p
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={rawInput}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 hidden sm:block !px-3 !py-2 text-xs font-mono bg-black/60 border-white/10 rounded-lg focus:border-white/30"
        />
      </div>

      {/* Formatted time display rectangle */}
      {formattedTime && (
        <div className="w-full px-4 py-3 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-lg text-center">
          <p className="text-xs text-white/70 mb-1">Formatted Time</p>
          <p className="text-lg font-bold text-white font-mono">{formattedTime}</p>
        </div>
      )}
    </div>
  );
}