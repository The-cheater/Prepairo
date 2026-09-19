'use client';

import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CreditBadgeProps {
  credits: number;
  size?: 'sm' | 'md' | 'lg';
  showLink?: boolean;
}

export default function CreditBadge({ credits, size = 'md', showLink = true }: CreditBadgeProps) {
  const content = (
    <div
      className={`inline-flex items-center gap-1.5 font-bold transition-all rounded-full ${
        size === 'sm'
          ? 'px-2.5 py-0.5 text-[11px] bg-amber-500/10 text-amber-700 border border-amber-500/20'
          : size === 'lg'
          ? 'px-4 py-2 text-sm bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-yellow-500/15 text-amber-900 border border-amber-500/30 shadow-xs'
          : 'px-3 py-1 text-xs bg-amber-500/10 text-amber-800 border border-amber-500/20 hover:bg-amber-500/20'
      }`}
    >
      <Zap className={`fill-amber-500 text-amber-500 ${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'}`} />
      <span>{credits}</span>
      <span className="font-normal text-amber-700/80 text-[10px] uppercase tracking-wider">Credits</span>
    </div>
  );

  if (showLink) {
    return (
      <Link href="/dashboard" title="View credits & dashboard">
        {content}
      </Link>
    );
  }

  return content;
}
