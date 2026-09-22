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

      {/* How Students Can Support Without Money */}
      <div className="bg-white rounded-[32px] border border-zinc-200 p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="font-cal text-xl font-bold text-zinc-950">
            How You Can Support Prepairo
          </h2>
          <p className="text-xs text-zinc-500 font-normal">
            Prepairo does not solicit money or donations from students. The best ways to support the community:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-cal text-base font-bold text-zinc-900">Upload Past Exam Papers</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Share question papers from your previous semesters. Every paper you upload is reviewed, verified, and awarded with credits on your contributor dashboard.
              </p>
            </div>
            <Link
              href="/upload"
              className="btn-pill-black text-xs py-2.5 px-5 text-center inline-flex items-center justify-center gap-1.5"
            >
              <span>Upload Question Paper</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-cal text-base font-bold text-zinc-900">Fulfill Paper Requests</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                Students regularly request exam papers for upcoming mid-sems and end-sems. Check the requests board and upload what your batchmates need.
              </p>
            </div>
            <Link
              href="/requests"
              className="btn-pill-white text-xs py-2.5 px-5 text-center inline-flex items-center justify-center gap-1.5"
            >
              <span>View Open Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
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
