'use client';

import React, { useState, useEffect } from 'react';
import LeaderboardTable from '@/frontend/components/gamification/LeaderboardTable';
import { Trophy, Zap, Award, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';

export default function LeaderboardPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const res = await fetch(getApiUrl('/api/leaderboard?limit=50'));
        if (res.ok) {
          const data = await res.json();
          setItems(data.leaderboard || []);
        }
      } catch (e) {
        console.warn('Failed to load leaderboard:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-zinc-950 text-white rounded-[32px] p-8 sm:p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-400 border border-white/10 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5" /> Prepairo Hall of Fame
          </div>
          <h1 className="font-cal text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Top Student Contributors
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Every verified past exam paper earns <strong className="text-white">10 credits</strong>. Climb the ranks to become an IISER TVM Hall of Fame top contributor!
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/upload"
              className="btn-pill-white text-xs px-5 py-2.5 flex items-center gap-1.5 font-bold text-zinc-950"
            >
              <span>Upload Paper & Earn 10 Credits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              Check My Credits
            </Link>
          </div>
        </div>

        {/* Decorative Trophy glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold font-cal text-zinc-950">10 Credits</p>
            <p className="text-xs text-zinc-500">Per approved question paper</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-cal text-zinc-950">Hall of Fame</p>
            <p className="text-xs text-zinc-500">Top student contributor standing</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold font-cal text-zinc-950">100% Free</p>
            <p className="text-xs text-zinc-500">Peer-powered open academic access</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable items={items} isLoading={isLoading} />
    </div>
  );
}
