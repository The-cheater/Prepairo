'use client';

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Heart, Users, Sparkles, CheckCircle2, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import BananaShakeCard from '@/frontend/components/support/BananaShakeCard';
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

      {/* About the Creator */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 p-5 sm:p-12 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* Emblem */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[24px] bg-zinc-950 flex items-center justify-center text-white overflow-hidden shadow-inner">
              <img src="/logo.png" alt="IISER TVM" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4 text-center md:text-left">
            <div>
              <span className="pill-tag bg-zinc-100 text-zinc-900 border border-zinc-200 mb-2 inline-flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Creator & Maintainer
              </span>
              <h1 className="font-cal text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-2">
                Rohan Kumar Jena
              </h1>
              <p className="text-sm text-zinc-600 font-medium mt-1">
                Ph.D. Student, Data Science • IISER Thiruvananthapuram
              </p>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed max-w-xl">
              A Data Science Ph.D. student who struggled badly in his 1st year to find previous year question papers.
              Scrolling through countless dead Google Drive links, hunting in chaotic WhatsApp groups, and asking seniors
              who had already graduated — the process was painful. So I decided no one else should face the same problem.
            </p>

            <p className="text-sm text-zinc-600 leading-relaxed max-w-xl">
              This project was born out of that frustration. A clean, structured, community-powered repository where
              every student at IISER TVM can find verified PYQs without the hassle. Together, we grow.
            </p>

            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-2">
              <span className="pill-tag bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Batch 26 Ph.D.
              </span>
              <span className="pill-tag bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs">
                IISER TVM
              </span>
              <span className="pill-tag bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs">
                Open Source
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Me a Banana Shake (Interactive 3D Flip Card) */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-[28px] sm:rounded-[32px] border border-amber-200 p-5 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-between">

          {/* Interactive Flip Card */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <BananaShakeCard />
          </div>

          {/* Text */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                🍌 Support the Project
              </span>
              <h2 className="font-cal text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-3">
                Buy Me a Banana Shake
              </h2>
              <p className="text-sm text-zinc-600 font-normal leading-relaxed mt-2 max-w-lg">
                This entire platform is 100% free and open for every student at IISER TVM. If it helped you prepare, consider buying me a banana shake for ₹20!
                Click the card to reveal the QR code, scan it, and click to celebrate! 🍌
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
              <div className="bg-white rounded-2xl border border-amber-200 px-5 py-3 text-center shadow-xs">
                <p className="font-cal text-3xl font-bold text-zinc-950">₹20</p>
                <p className="text-xs text-zinc-500">One Banana Shake</p>
              </div>
              <div className="text-xs text-zinc-600 max-w-xs leading-relaxed">
                Countless hours of work went into saving you hours of searching. Every shake fuels more late-night development sessions for IISER TVM! 🍌
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Contributors Section */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 p-6 sm:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 pill-tag bg-zinc-100 text-zinc-900 border border-zinc-200">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" />
          <span>Real Community Contributors</span>
        </div>

        <h2 className="font-cal text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Built by Students. For Students.
        </h2>

        <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-xl mx-auto">
          Every question paper in this repository is verified and contributed by student community members.
        </p>
      </div>

      {/* Grid of Real Contributor Badges */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-[28px] border border-zinc-200 p-6 h-40 animate-pulse bg-zinc-50" />
          ))}
        </div>
      ) : contributors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((c) => (
            <div
              key={c.id || c.username}
              className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm flex flex-col justify-between hover-lift transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="pill-tag bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Contributor
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {c.course || 'IISER TVM'}
                  </span>
                </div>

                <div>
                  <h3 className="font-cal text-lg font-bold text-zinc-950">
                    {c.full_name || c.username}
                  </h3>
                  <p className="text-xs text-zinc-500 font-normal mt-0.5">
                    {c.papers_approved} approved papers • {c.total_credits} credits
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-normal">
                <span>{c.department || 'IISER TVM Community'}</span>
                <Award className="w-4 h-4 text-zinc-300" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-50 rounded-[28px] border border-zinc-200 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-zinc-800">No community contributors recorded yet.</p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Be the very first student to upload a verified question paper and earn credits on the platform!
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

      {/* Become a Contributor Section */}
      <div className="bg-zinc-950 text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-12 text-center space-y-4">
        <h2 className="font-cal text-2xl sm:text-3xl font-bold text-white">
          Have papers from your previous semester?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
          Help the next batch prepare with confidence. Upload question papers with your name acknowledged or anonymously.
        </p>
        <div className="pt-2">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-3 font-semibold text-xs hover:bg-zinc-100 transition-colors"
          >
            Upload a Question Paper
          </Link>
        </div>
      </div>

    </div>
  );
}
