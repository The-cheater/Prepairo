'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { getApiUrl } from '@/frontend/lib/api';

export default function HeroSection() {
  const [stats, setStats] = useState({ totalSubjects: 0, verifiedPapers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl('/api/stats'));
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalSubjects: Number(data.totalSubjects) || 0,
            verifiedPapers: Number(data.verifiedPapers) || 0,
          });
        }
      } catch {}
    };
    fetchStats();
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-6 pb-16 sm:pt-12 sm:pb-20">

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        
        {/* Floating Friendly Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass-card shadow-sm border border-zinc-200/80 dark:border-zinc-800 text-[11px] sm:text-xs font-semibold text-zinc-800 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span>Prepairo</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 inline" /> 10 Free Credits on Sign In
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal hidden md:inline">Made by students, for students</span>
        </div>

        {/* Friendly Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white font-cal leading-[1.1]">
            <span>Find past exam papers. </span>
            <span className="font-serif-accent italic font-normal text-zinc-700 dark:text-zinc-300 block sm:inline">
              Skip the stress.
            </span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed px-2">
            Students upload their previous exam papers, our admin checks and approves them, and you earn credits. Once you reach 499 credits, you can cash them out for real money! Plus, get 10 free credits just for signing in.
          </p>
        </div>

        {/* Floating Glass-style Stats Card */}
        <div className="pt-2 sm:pt-4">
          <div className="inline-grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-12 px-4 sm:px-10 py-3 sm:py-4 rounded-[24px] sm:rounded-[28px] glass-card shadow-sm border border-zinc-200/80 dark:border-zinc-800 max-w-full">
            <div className="text-center sm:text-left">
              <p className="font-cal text-lg sm:text-2xl font-bold text-zinc-950 dark:text-white">{stats.totalSubjects}</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">Subjects</p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="font-cal text-lg sm:text-2xl font-bold text-zinc-950 dark:text-white">{stats.verifiedPapers}</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">Approved Papers</p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="font-cal text-lg sm:text-2xl font-bold text-zinc-950 dark:text-white">100%</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">Free to Use</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
