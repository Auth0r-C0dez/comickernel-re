'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Moon, Sun, RefreshCw } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function MenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-lg transition-colors"
        style={{ width: '2rem', height: '2rem', opacity: isOpen ? 1 : 0.5, background: isOpen ? 'var(--accent)' : 'transparent' }}
        aria-label="More options"
      >
        <MoreVertical size={15} />
      </button>

      {isOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            right: 0,
            marginTop: '0.5rem',
            width: '11rem',
            padding: '0.25rem',
            zIndex: 50,
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '0.6rem',
          }}
        >
          <button
            onClick={() => { toggleTheme(); setIsOpen(false); }}
            className="flex items-center gap-2.5 w-full text-left rounded-md transition-colors"
            style={{ padding: '0.5rem 0.65rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--table-row-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {theme === 'light' ? <Moon size={13} style={{ opacity: 0.6 }} /> : <Sun size={13} style={{ opacity: 0.6 }} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>

          <button
            onClick={() => { window.location.reload(); setIsOpen(false); }}
            className="flex items-center gap-2.5 w-full text-left rounded-md transition-colors"
            style={{ padding: '0.5rem 0.65rem', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--table-row-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <RefreshCw size={13} style={{ opacity: 0.6 }} />
            <span>Refresh</span>
          </button>
        </div>
      )}
    </div>
  );
}
