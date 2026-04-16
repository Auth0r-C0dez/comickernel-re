'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Get theme from localStorage or default to light
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('app-theme') as Theme | null;
      const preferredTheme = savedTheme || 'light';
      setTheme(preferredTheme);
      applyTheme(preferredTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('app-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-sm !px-3 font-bold transition-all duration-300"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={14} />
      ) : (
        <Sun size={14} />
      )}
      <span className="ml-1 text-xs uppercase tracking-widest">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
