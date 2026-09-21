import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12 sm:py-16 mt-16 sm:mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-zinc-100 dark:border-zinc-800">
          
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Prepairo Logo" className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" />
              <span className="font-cal text-xl font-bold text-zinc-950 dark:text-white">Prepairo</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Prepare smarter, together. A student-built question paper platform where you can upload past exams, earn credits, and redeem them for real cash rewards.
            </p>
            <div className="text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
              <p className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> Built for students • Open Access
              </p>
            </div>
          </div>

          {/* Browse */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Browse Papers</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              {['foundation', 'physics', 'biology', 'chemistry', 'data-science', 'mathematics'].map((s) => (
                <li key={s}>
                  <Link
                    href={`/browse?school=${s}`}
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors capitalize"
                  >
                    {s === 'data-science'
                      ? 'Data Science'
                      : s === 'foundation'
                      ? 'Years 1–2 Foundation'
                      : `School of ${s.charAt(0).toUpperCase() + s.slice(1)}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li>
                <Link href="/upload" className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1">
                  Upload a Paper <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1">
                  Leaderboard <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/requests" className="hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1">
                  Requested Papers <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/contributors" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Contributors & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Rewards & About */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-white">Rewards</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Earn 10 credits for each paper approved by our admin team. When you collect 499 credits, you can cash out for real money!
            </p>
            <div className="pt-2">
              <Link
                href="/support"
                className="inline-flex items-center gap-1.5 text-xs text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-full transition-colors font-medium border border-zinc-200 dark:border-zinc-700"
              >
                Buy a Shake 🍌
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Prepairo. Free student educational resource.</p>
          <p className="text-zinc-500 dark:text-zinc-400">Prepare Smarter, Together</p>
        </div>
      </div>
    </footer>
  );
}
