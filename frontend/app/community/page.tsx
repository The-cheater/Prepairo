'use client';

import React, { Suspense } from 'react';
import CommunityChat from '@/frontend/components/community/CommunityChat';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <span className="pill-tag bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Student Community & Doubts
          </span>
          <h1 className="font-cal text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Ask Seniors & Discuss PYQs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal mt-1 max-w-2xl">
            Ask seniors which topics are most important, discuss high-probability exam questions, and tag peers with @username for instant notifications.
          </p>
        </div>
      </div>

      {/* Community Chat Interface */}
      <Suspense fallback={<div className="p-12 text-center text-zinc-400">Loading community channels...</div>}>
        <CommunityChat />
      </Suspense>

    </div>
  );
}
