'use client';

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Heart, Users, Sparkles, CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';

interface Contributor {
  id: string;
  username: string;
  full_name: string;
  department?: string;
  course?: string;
  total_credits: number;
  papers_approved: number;
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const res = await fetch(getApiUrl('/api/leaderboard?limit=20'));
        if (res.ok) {
          const data = await res.json();
          setContributors(data.leaderboard || []);
        }
      } catch (err) {
        console.warn('Failed to load contributors:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContributors();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* 1. About the Creator */}
      <div className="bg-white dark:bg-zinc-900 rounded-[28px] sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-5 sm:p-12 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* Emblem / Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] bg-zinc-950 flex items-center justify-center text-white overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700">
              <img src="/logo.png" alt="Prepairo Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4 text-center md:text-left">
            <div>
              <span className="pill-tag bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 mb-2 inline-flex items-center gap-1">
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

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
              I struggled during my first year to find previous year question papers—hunting through dead Google Drive links, searching chaotic WhatsApp groups, and asking graduated seniors. It was a huge hassle, so I decided to build a proper solution.
            </p>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
              Prepairo is a clean, student-powered library where everyone can upload verified exam papers, earn reward credits, and prepare without the stress.
            </p>

          </div>
        </div>
      </div>

      {/* 2. Real Contributors Section Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-[28px] sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 text-center max-w-3xl mx-auto shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 pill-tag bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
          <span>Community Contributors</span>
        </div>

        <h2 className="font-cal text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Built by Students. For Students.
        </h2>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto">
          Every question paper in this repository is uploaded and verified by student community members who earn credits for sharing.
        </p>
      </div>

      {/* 3. Grid of Real Contributor Badges */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 p-6 h-40 animate-pulse bg-zinc-50" />
          ))}
        </div>
      ) : contributors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((c) => (
            <div
              key={c.id || c.username}
              className="bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col justify-between hover-lift transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="pill-tag bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Contributor
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {c.course || 'Student'}
                  </span>
                </div>

                <div>
                  <h3 className="font-cal text-lg font-bold text-zinc-950 dark:text-white">
                    {c.full_name || c.username}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
                    {c.papers_approved} approved papers • {c.total_credits} credits
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-normal">
                <span>{c.department || 'Student Community'}</span>
                <Award className="w-4 h-4 text-zinc-300" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[28px] border border-zinc-200 dark:border-zinc-800 p-10 text-center space-y-3">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No community contributors recorded yet.</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Be the first student to upload a verified question paper and earn 10 credits!
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 btn-pill-black text-xs px-5 py-2.5 mt-2"
          >
            <span>Upload the First Paper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 4. Have papers from your previous semester? (Upload CTA) */}
      <div className="bg-zinc-950 dark:bg-zinc-900 text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 text-center space-y-4 border border-zinc-800">
        <h2 className="font-cal text-xl sm:text-2xl font-bold text-white">
          Have papers from your previous semester?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
          Help the next batch prepare with confidence. Upload question papers with your name credited or completely anonymously, and earn reward credits.
        </p>
        <div className="pt-1">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2.5 font-semibold text-xs hover:bg-zinc-100 transition-colors"
          >
            Upload a Question Paper
          </Link>
        </div>
      </div>


    </div>
  );
}
