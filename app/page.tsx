'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/frontend/components/landing/HeroSection';
import StatTiles from '@/frontend/components/landing/StatTiles';
import FeaturedSchools from '@/frontend/components/landing/FeaturedSchools';
import RequestCarousel from '@/frontend/components/requests/RequestCarousel';
import PaperCard from '@/frontend/components/papers/PaperCard';
import { PaperRecord } from '@/backend/models/mock-papers';
import { ArrowRight, Sparkles, UploadCloud } from 'lucide-react';
import Link from 'next/link';
import CurvedLoop from '@/frontend/components/react-bits/CurvedLoop';
import { getApiUrl } from '@/frontend/lib/api';

export default function HomePage() {
  const [recentPapers, setRecentPapers] = useState<PaperRecord[]>([]);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const res = await fetch(getApiUrl('/api/papers?status=verified'));
        if (res.ok) {
          const data = await res.json();
          setRecentPapers((data.papers || []).slice(0, 6));
        }
      } catch (err) {
        console.warn('Failed to fetch recent papers:', err);
      }
    };
    fetchPapers();
  }, []);

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* Interactive Curved Loop Marquee Banner */}
      <div className="w-full bg-zinc-950 text-white py-3 overflow-hidden border-y border-zinc-800">
        <CurvedLoop
          marqueeText="PREPAIRO ✦ IISER THIRUVANANTHAPURAM ✦ PREPARE SMARTER, TOGETHER ✦ PAST EXAMS ✦"
          speed={2}
          curveAmount={120}
          direction="left"
          interactive={true}
          className="text-amber-400 font-bold"
        />
      </div>

      {/* 2. Platform Metrics from Backend */}
      <StatTiles />

      {/* 3. Featured Schools & Foundation Streams */}
      <FeaturedSchools />

      {/* 4. Request Carousel — community-powered requests */}
      <RequestCarousel />

      {/* 5. Recent Verified Question Papers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="pill-tag bg-zinc-100 text-zinc-900 border border-zinc-200 mb-2">
                Recently Archived
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-cal">
                Latest Verified Papers
              </h2>
              <p className="text-sm text-zinc-500 font-normal mt-1">
                Verified question papers across BS-MS foundation and higher semester school courses.
              </p>
            </div>

            <Link
              href="/browse"
              className="btn-pill-black text-xs px-5 py-2.5 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore All Papers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Paper Cards Grid */}
          {recentPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPapers.map(paper => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-50 rounded-[28px] border border-zinc-200 p-12 text-center">
              <p className="text-sm text-zinc-500">No verified papers yet. Be the first to <Link href="/upload" className="font-bold text-zinc-900 underline">upload one</Link>!</p>
            </div>
          )}

        </div>
      </section>

      {/* 6. Community Mission / Contribute Callout */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-950 text-white rounded-[32px] p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 bg-white/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Pay It Forward
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-cal">
                Give your juniors the confidence to excel
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                Found your mid-sem or end-sem question paper in your backpack or downloads folder? Take 30 seconds to upload it. It takes one person to help hundreds of future students.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/upload"
                className="rounded-full bg-white text-black font-bold text-xs px-6 py-3 hover:bg-zinc-100 transition-colors flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload a Paper</span>
              </Link>
              <Link
                href="/requests"
                className="rounded-full bg-white/10 text-white hover:bg-white/20 font-semibold text-xs px-6 py-3 transition-colors"
              >
                <span>View Requested Papers</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
