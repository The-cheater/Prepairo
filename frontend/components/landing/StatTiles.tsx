'use client';

import React, { useState, useEffect } from 'react';
import { FileCheck, BookOpen, Users, HelpCircle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';

interface Stats {
  verifiedPapers: number;
  totalSubjects: number;
  contributorsCount: number;
  requestsFulfilled: number;
  pendingPapers: number;
  openRequests: number;
  totalPapers: number;
}

export default function StatTiles() {
  const [stats, setStats] = useState<Stats>({
    verifiedPapers: 0,
    totalSubjects: 200,
    contributorsCount: 0,
    requestsFulfilled: 0,
    pendingPapers: 0,
    openRequests: 0,
    totalPapers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(getApiUrl('/api/stats'));
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.warn('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const tiles = [
    {
      title: 'Verified Papers',
      value: `${stats.verifiedPapers}`,
      caption: 'Accurately classified by year and semester',
      icon: FileCheck,
      href: '/browse'
    },
    {
      title: 'Subjects Cataloged',
      value: `${stats.totalSubjects}+`,
      caption: 'Foundation, Biological, Chemical, Physical & Data Sciences',
      icon: BookOpen,
      href: '/browse'
    },
    {
      title: 'Student Contributors',
      value: `${stats.contributorsCount}`,
      caption: 'Seniors and alumni giving back anonymously or acknowledged',
      icon: Users,
      href: '/contributors'
    },
    {
      title: 'Open Requests',
      value: `${stats.openRequests}`,
      caption: 'Papers the community is looking for right now',
      icon: HelpCircle,
      href: '/requests'
    }
  ];

  return (
    <section className="py-16 border-t border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Platform Metrics
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 font-cal">
              Data. In Motion.
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-md font-normal">
            Real-time repository statistics reflecting community contributions across IISER Thiruvananthapuram batches.
          </p>
        </div>

        {/* 4 Large Rounded Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.title}
                href={tile.href}
                className="group relative bg-white rounded-[28px] border border-zinc-200/90 p-7 shadow-sm hover-lift transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-zinc-400 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <p className="font-cal text-4xl sm:text-5xl font-bold text-zinc-950 tracking-tight">
                    {tile.value}
                  </p>
                  
                  <h3 className="font-cal text-base font-bold text-zinc-900 mt-2">
                    {tile.title}
                  </h3>
                </div>

                <p className="text-xs text-zinc-500 font-normal mt-4 pt-4 border-t border-zinc-100">
                  {tile.caption}
                </p>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
