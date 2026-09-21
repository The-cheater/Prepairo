import React from 'react';
import Link from 'next/link';
import { Coffee, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-6 sm:py-8 mt-10 sm:mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          {/* Brand & Mini Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="Prepairo Logo" 
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-zinc-200 dark:border-zinc-700" 
              />
              <span className="font-cal text-base sm:text-lg font-bold text-zinc-950 dark:text-white">
                Prepairo
              </span>
            </Link>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Prepare smarter, together. Free student past exam repository.
            </p>
          </div>

          {/* Essential Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <Link href="/browse" className="hover:text-black dark:hover:text-white transition-colors">
              Browse
            </Link>
            <Link href="/upload" className="hover:text-black dark:hover:text-white transition-colors">
              Upload
            </Link>
            <Link href="/community" className="hover:text-black dark:hover:text-white transition-colors text-blue-600 dark:text-blue-400 font-bold">
              Community
            </Link>
            <Link href="/requests" className="hover:text-black dark:hover:text-white transition-colors">
              Requests
            </Link>
            <Link href="/leaderboard" className="hover:text-black dark:hover:text-white transition-colors">
              Leaderboard
            </Link>
            <Link href="/contributors" className="hover:text-black dark:hover:text-white transition-colors">
              Contributors
            </Link>
            <Link href="/support" className="hover:text-black dark:hover:text-white transition-colors text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5" />
              <span>Support</span>
            </Link>
          </nav>

        </div>

        {/* Bottom micro copyright */}
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 gap-2 text-center sm:text-left">
          <p className="flex items-center gap-1 justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} Prepairo. Built with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for students.</span>
          </p>
          <p>Verified exam papers & community doubts hub</p>
        </div>
      </div>
    </footer>
  );
}
