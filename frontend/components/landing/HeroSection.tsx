'use client';

import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import CommandSearch from '@/frontend/components/search/CommandSearch';
import { getApiUrl } from '@/frontend/lib/api';

export default function HeroSection() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [stats, setStats] = useState({ totalSubjects: 0, verifiedPapers: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl('/api/stats'));
        if (res.ok) {
          const data = await res.json();
          setStats({ totalSubjects: data.totalSubjects, verifiedPapers: data.verifiedPapers });
        }
      } catch {}
    };
    fetchStats();
  }, []);

  return (
    <div className="relative w-full overflow-hidden pt-6 pb-20 sm:pt-10 sm:pb-28">

      {/* Main Centered Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8">
        
        {/* Floating Glass Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full glass-card shadow-sm border border-zinc-200/80 dark:border-zinc-800 text-[11px] sm:text-xs font-semibold text-zinc-800 dark:text-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <span className="hidden sm:inline">Prepairo • IISER Thiruvananthapuram Academic Repository</span>
          <span className="sm:hidden">Prepairo • IISER TVM</span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal hidden md:inline">Prepare Smarter, Together</span>
        </div>

        {/* Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-white font-cal leading-[1.1]">
            <span>Find every paper. </span>
            <span className="font-serif-accent italic font-normal text-zinc-700 dark:text-zinc-300 block sm:inline">
              Skip the scrolling.
            </span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed px-2">
            A centralized, community-verified repository for mid-sems, end-sems, and quizzes. No dead drive links, no chaotic WhatsApp groups—just clean academic archives for seniors and juniors.
          </p>
        </div>

        {/* Global Instant Search Bar Trigger */}
        <div className="max-w-xl mx-auto px-2 sm:px-0">
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="group flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-[0_12px_36px_rgb(0,0,0,0.1)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors truncate">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 truncate">
                Search course code, subject, or year...
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <kbd className="text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Centered Pill CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 px-4 sm:px-0 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/browse"
            className="btn-pill-black text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span>Start Guided Browse</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/upload"
            className="btn-pill-white text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <UploadCloud className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            <span>Upload a Paper</span>
          </Link>

          <Link
            href="/requests"
            className="btn-pill-white text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span>Request Missing Paper</span>
          </Link>
        </div>

        {/* Floating Glass-style Stats Card — real numbers from backend */}
        <div className="pt-4 sm:pt-6">
          <div className="inline-grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-12 px-4 sm:px-10 py-3 sm:py-4 rounded-[24px] sm:rounded-[28px] glass-card shadow-sm border border-zinc-200/80 dark:border-zinc-800 max-w-full">
            <div className="text-center sm:text-left">
              <p className="font-cal text-lg sm:text-2xl font-bold text-zinc-950 dark:text-white">{stats.totalSubjects}</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">Subjects</p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="font-cal text-lg sm:text-2xl font-bold text-zinc-950 dark:text-white">{stats.verifiedPapers}</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">Verified</p>
            </div>
            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="font-cal text-lg sm:text-2xl font-bold text-zinc-950 dark:text-white">100%</p>
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">Free Access</p>
            </div>
          </div>
        </div>

      </div>

      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
