'use client';

import React from 'react';
import { Heart, Sparkles, GraduationCap, Mail, Coffee, ExternalLink, Code2 } from 'lucide-react';
import BananaShakeCard from '@/frontend/components/support/BananaShakeCard';

export default function ContributorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* 1. About the Creator & Maintainer */}
      <div className="bg-white dark:bg-zinc-900 rounded-[28px] sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-12 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* Emblem / Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] bg-zinc-950 flex items-center justify-center text-white overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700">
              <img src="/logo.png" alt="Prepairo Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <span className="pill-tag bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 mb-2 inline-flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Creator & Maintainer
              </span>
              <h1 className="font-cal text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white mt-1">
                Rohan Kumar Jena
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                Ph.D. Student, Data Science
              </p>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              I struggled during my first year to find previous year question papers—hunting through dead Google Drive links, searching chaotic WhatsApp groups, and asking graduated seniors. It was a huge hassle, so I decided to build a proper solution.
            </p>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Prepairo is a clean, open platform engineered to simplify exam preparation. I design, develop, and maintain the platform's infrastructure, search algorithms, and document pipeline.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="https://github.com/The-cheater/Prepairo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3 text-zinc-400 ml-0.5" />
              </a>
              <span className="text-xs text-zinc-400 font-normal">
                Built with Next.js, Fastify & Supabase
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Buy Me a Banana Shake (₹20 Donation Section) */}
      <div className="bg-amber-50/50 dark:bg-zinc-900/60 rounded-[28px] sm:rounded-[32px] border border-amber-200/80 dark:border-amber-900/40 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
          
          <div className="space-y-3 text-center md:text-left max-w-md">
            <div className="inline-flex items-center gap-1.5 pill-tag bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800 text-xs">
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Support the Developer</span>
            </div>
            
            <h2 className="font-cal text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">
              Buy Me a Banana Shake (₹20) 🍌
            </h2>
            
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              Prepairo is a self-funded open-source project maintained late at night between research work. If this platform saved you study time, buy a ₹20 banana shake to fuel further development and hosting costs!
            </p>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-center md:justify-start gap-1 font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Direct UPI • Tap the card on the right to reveal payment QR
            </p>
          </div>

          <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
            <BananaShakeCard />
          </div>

        </div>
      </div>

    </div>
  );
}
