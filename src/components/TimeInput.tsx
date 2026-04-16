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
    <div className="w-full">
      <div className="flex flex-row gap-0.5 items-center justify-center">
        <div className="flex items-center gap-0.5">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={hour}
            onChange={handleHourChange}
            placeholder="HH"
            className="w-4 sm:w-5 !px-0 !py-0.5 text-center text-[7px] sm:text-[8.5px] font-black bg-black/60 border-white/10 rounded focus:border-white/30"
          />
          <span className="text-[6.5px] font-black opacity-30">:</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={minute}
            onChange={handleMinuteChange}
            placeholder="MM"
            className="w-4 sm:w-5 !px-0 !py-0.5 text-center text-[7px] sm:text-[8.5px] font-black bg-black/60 border-white/10 rounded focus:border-white/30"
          />
        </div>

        <div className="flex gap-0 bg-black/40 p-0.5 rounded border border-white/10">
          {(['AM', 'PM'] as const).map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-0.5 py-0.5 text-[7px] sm:text-[9px] font-black rounded transition-all ${
                period === p
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Removed secondary raw input for compactness */}
      </div>

      {/* Removed formatted time display rectangle to prevent duplicate labels in table cells */}
    </div>
  );
}