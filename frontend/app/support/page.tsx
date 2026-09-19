'use client';

import React from 'react';
import { Heart, Coffee, ShieldCheck, Server, Database, Sparkles, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Banner */}
      <div className="bg-white rounded-[32px] border border-zinc-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
        <div className="inline-flex items-center gap-1.5 pill-tag bg-rose-50 text-rose-700 border border-rose-200">
          <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
          <span>Voluntary Community Support</span>
        </div>

        <h1 className="font-cal text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
          Keeping IISER TVM PYQ 100% Free Forever
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-xl mx-auto">
          Access to previous year question papers will <strong>never</strong> be paywalled, subscription-gated, or restricted. If you find the platform helpful, voluntary contributions help cover server, database, and PDF storage costs.
        </p>
      </div>

      {/* Cost Transparency Breakdown */}
      <div className="bg-white rounded-[32px] border border-zinc-200 p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="font-cal text-xl font-bold text-zinc-950">
            Operational Transparency
          </h2>
          <p className="text-xs text-zinc-500 font-normal">
            Where your voluntary contributions go:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-cal text-base font-bold text-zinc-900">Hosting & Bandwidth</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              High-speed edge servers to ensure question paper previews and downloads remain instantaneous during exam week traffic surges.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-cal text-base font-bold text-zinc-900">Cloud Storage (S3 / R2)</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              High-durability document storage for thousands of scanned PDF papers across multiple batches and curriculum revisions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-cal text-base font-bold text-zinc-900">Future Expansions</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              Syllabus topic tagging, recurring question frequency analysis, and expansion to sister IISERs and universities.
            </p>
          </div>
        </div>
      </div>

      {/* Voluntary Contribution Tiers (Coffee Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Tier 1 */}
        <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm flex flex-col justify-between hover-lift transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cal text-lg font-bold text-zinc-950">Chai / Coffee</h3>
              <p className="font-cal text-2xl font-bold text-zinc-900 mt-1">₹50 / $1</p>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              Covers 1,000 document download bandwidth requests.
            </p>
          </div>

          <button
            onClick={() => alert('Thank you! Voluntary contribution gateway can be configured with your preferred UPI or Stripe link in .env.')}
            className="btn-pill-white text-xs w-full mt-6 py-2"
          >
            Buy a Chai
          </button>
        </div>

        {/* Tier 2 (Highlighted) */}
        <div className="bg-zinc-950 text-white rounded-[28px] p-6 shadow-md flex flex-col justify-between hover-lift transition-all relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cal text-lg font-bold text-white">Semester Supporter</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                  Popular
                </span>
              </div>
              <p className="font-cal text-2xl font-bold text-white mt-1">₹250 / $5</p>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Covers cloud database and backup services for an entire academic semester.
            </p>
          </div>

          <button
            onClick={() => alert('Thank you! Voluntary contribution gateway can be configured with your preferred UPI or Stripe link in .env.')}
            className="rounded-full bg-white text-black text-xs font-semibold w-full mt-6 py-2.5 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Support for a Semester
          </button>
        </div>

        {/* Tier 3 */}
        <div className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm flex flex-col justify-between hover-lift transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-800">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-cal text-lg font-bold text-zinc-950">Alumni Patron</h3>
              <p className="font-cal text-2xl font-bold text-zinc-900 mt-1">₹1,000 / $15</p>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              Sponsors domain, high-availability PDF storage, and archive preservation for a year.
            </p>
          </div>

          <button
            onClick={() => alert('Thank you! Voluntary contribution gateway can be configured with your preferred UPI or Stripe link in .env.')}
            className="btn-pill-white text-xs w-full mt-6 py-2"
          >
            Become a Patron
          </button>
        </div>

      </div>

      {/* Return to Browse */}
      <div className="text-center pt-4">
        <Link href="/browse" className="text-xs text-zinc-500 hover:text-black inline-flex items-center gap-1 font-semibold">
          Return to browsing question papers <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
