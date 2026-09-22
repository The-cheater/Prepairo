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
    totalSubjects: 0,
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
          setStats(prev => ({
            ...prev,
            ...data,
            verifiedPapers: Number(data.verifiedPapers) || 0,
            totalSubjects: Number(data.totalSubjects) || 0,
            contributorsCount: Number(data.contributorsCount) || 0,
            openRequests: Number(data.openRequests) || 0,
            requestsFulfilled: Number(data.requestsFulfilled) || 0,
            pendingPapers: Number(data.pendingPapers) || 0,
            totalPapers: Number(data.totalPapers) || 0,
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const tiles = [
    {
      title: 'Approved Papers',
      value: `${stats.verifiedPapers ?? 0}`,
      caption: (stats.verifiedPapers || 0) > 0 ? 'Verified by admin and ready for exam practice' : 'Be the first student to upload a past paper',
      icon: FileCheck,
      href: '/browse'
    },
    {
      title: 'Subjects Covered',
      value: `${stats.totalSubjects ?? 0}`,
      caption: 'Organized cleanly across all batches and semesters',
      icon: BookOpen,
      href: '/browse'
    },
    {
      title: 'Student Contributors',
      value: `${stats.contributorsCount ?? 0}`,
      caption: (stats.contributorsCount || 0) > 0 ? 'Students earning credits and helping friends' : 'Earn 10 credits for every paper you upload',
      icon: Users,
      href: '/contributors'
    },
    {
      title: 'Paper Requests',
      value: `${stats.openRequests ?? 0}`,
      caption: (stats.openRequests || 0) > 0 ? 'Papers students need right now—upload to earn credits' : 'Need a paper? Post a quick request',
      icon: HelpCircle,
      href: '/requests'
    }
  ];

  return (
    <section className="py-16 border-t border-zinc-100/80 dark:border-zinc-800 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Community Stats
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white font-cal">
              Simple numbers, real help.
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md font-normal">
            Real past exam papers uploaded by students, approved by admins, and available 100% free.
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
                className="group relative bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-200/90 dark:border-zinc-800 p-7 shadow-sm hover-lift transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-zinc-400 dark:text-zinc-500 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <p className="font-cal text-4xl sm:text-5xl font-bold text-zinc-950 dark:text-white tracking-tight">
                    {tile.value}
                  </p>
                  
                  <h3 className="font-cal text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                    {tile.title}
                  </h3>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
