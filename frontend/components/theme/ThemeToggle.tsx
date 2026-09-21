'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={`w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center opacity-50 ${className}`}>
        <Sun className="w-4 h-4 text-zinc-400" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle theme"
      className={`relative p-2 rounded-full border transition-all duration-200 cursor-pointer ${
        theme === 'dark'
          ? 'bg-zinc-900 border-zinc-700 text-amber-300 hover:bg-zinc-800 hover:text-amber-200 shadow-sm'
          : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 shadow-xs'
      } ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
