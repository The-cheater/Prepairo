'use client';

import React from 'react';
import { Trophy, Medal, Zap, CheckCircle2, User } from 'lucide-react';

interface LeaderboardItem {
  rank: number;
  id: string;
  username: string;
  full_name: string;
  course: string;
  department: string;
  total_credits: number;
  papers_approved: number;
  avatar_url?: string;
}

interface LeaderboardTableProps {
  items: LeaderboardItem[];
  isLoading?: boolean;
}

export default function LeaderboardTable({ items, isLoading }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-zinc-500">Loading top contributors...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h3 className="font-cal text-xl font-bold text-zinc-900">Leaderboard is Fresh</h3>
        <p className="text-xs text-zinc-500 mt-1">Upload verified question papers to earn 10 credits per paper and become #1!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/70 text-zinc-500 text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
              <th className="py-3 sm:py-4 px-2.5 sm:px-6 w-12 sm:w-16 text-center">Rank</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6">Student Contributor</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">Program & Dept</th>
              <th className="py-3 sm:py-4 px-2 sm:px-6 text-center">Approved</th>
              <th className="py-3 sm:py-4 px-3 sm:px-6 text-right">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {items.map((item) => {
              const isTop3 = item.rank <= 3;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-zinc-50/60 transition-colors ${
                    item.rank === 1 ? 'bg-amber-50/30' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 sm:py-4 px-2.5 sm:px-6 text-center">
                    <div className="flex items-center justify-center">
                      {item.rank === 1 ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-xs">
                          <Trophy className="w-4 h-4 text-zinc-950" />
                        </div>
                      ) : item.rank === 2 ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-xs">
                          <Medal className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                        </div>
                      ) : item.rank === 3 ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-700/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shadow-xs">
                          <Medal className="w-4 h-4 text-amber-800 dark:text-amber-300" />
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-zinc-400">
                          #{item.rank}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Contributor Info */}
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {item.avatar_url ? (
                        <img
                          src={item.avatar_url}
                          alt={item.username}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-zinc-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {item.full_name?.charAt(0) || item.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-900 flex items-center gap-1 sm:gap-1.5 truncate text-xs sm:text-sm">
                          <span className="truncate">{item.full_name || item.username}</span>
                          {isTop3 && <Medal className="w-3.5 h-3.5 text-amber-500 inline flex-shrink-0" />}
                        </p>
                        <p className="text-[10px] sm:text-xs text-zinc-400 font-mono truncate">
                          @{item.username}
                        </p>
                        <p className="text-[10px] text-zinc-500 sm:hidden truncate">
                          {item.course}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Program & Department */}
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell text-xs text-zinc-600">
                    <p className="font-medium text-zinc-800">{item.course}</p>
                    <p className="text-zinc-400 text-[11px]">{item.department}</p>
                  </td>

                  {/* Papers Approved */}
                  <td className="py-3 sm:py-4 px-2 sm:px-6 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] sm:text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{item.papers_approved}</span>
                    </span>
                  </td>

                  {/* Credits */}
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                      <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                      <span>{item.total_credits}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
