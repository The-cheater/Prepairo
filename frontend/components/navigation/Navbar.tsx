'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/frontend/components/auth/AuthProvider';
import CreditBadge from '@/frontend/components/gamification/CreditBadge';
import ThemeToggle from '@/frontend/components/theme/ThemeToggle';
import { LogOut, User as UserIcon, Trophy, Sparkles, Menu, X, ArrowRight, ShieldCheck, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, logout, openProfileSetup } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
    { label: 'Upload', href: '/upload' },
    { label: 'Requests', href: '/requests' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Contributors', href: '/contributors' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand: Prepairo (IISER TVM badge removed per request) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-950 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="Prepairo Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-cal text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Prepairo
              </span>
              <span className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                Prepare smarter, together
              </span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 p-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Auth State & Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle (Desktop & Mobile) */}
          <ThemeToggle />

          {user && profile ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Credits Pill */}
              <CreditBadge credits={profile.totalCredits} size="sm" />

              {/* User Dashboard Profile Button */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full border transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
                  {profile.username}
                </span>
              </Link>

              {/* Quick Profile Edit (Desktop) */}
              <button
                onClick={() => openProfileSetup()}
                title="Edit Profile"
                className="hidden sm:flex p-2 rounded-full text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Logout (Desktop only) */}
              <button
                onClick={() => logout()}
                title="Sign out"
                className="hidden sm:flex p-2 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 shadow-xs transition-all active:scale-95"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-pill-black text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1 active:scale-95"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer / Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Auth Buttons when not logged in */}
          {!user && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 rounded-full btn-pill-black text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Register</span>
              </Link>
            </div>
          )}

          {user && profile && (
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.username}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center">
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-zinc-950 dark:text-white">{profile.fullName}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">@{profile.username} {profile.batch ? `• ${profile.batch}` : ''}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openProfileSetup();
                  }}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <CreditBadge credits={profile.totalCredits} size="sm" />
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Quick Scrollable Secondary Nav Bar */}
      <div className="lg:hidden border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 px-3 py-2 flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 overflow-x-auto scrollbar-none">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap text-[11px] ${
              pathname === item.href
                ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                : 'hover:bg-zinc-200/60 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
