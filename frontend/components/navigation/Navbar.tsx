'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/frontend/components/auth/AuthProvider';
import CreditBadge from '@/frontend/components/gamification/CreditBadge';
import { LogOut, User as UserIcon, Trophy, Sparkles, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand: Prepairo with IISER TVM logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-zinc-200 bg-zinc-950 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="IISER TVM Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-cal text-lg sm:text-xl font-bold tracking-tight text-zinc-950">
                  Prepairo
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                  IISER TVM
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-zinc-500 font-medium">
                Prepare smarter, together
              </span>
            </div>
          </Link>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-50 p-1.5 rounded-full border border-zinc-200/80 shadow-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Auth State & Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user && profile ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Credits Pill */}
              <CreditBadge credits={profile.totalCredits} size="sm" />

              {/* User Dashboard Profile Button */}
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-full border transition-all ${
                  pathname === '/dashboard'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                }`}
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-200"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
                  {profile.username}
                </span>
              </Link>

              {/* Logout (Desktop only) */}
              <button
                onClick={() => logout()}
                title="Sign out"
                className="hidden sm:flex p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-zinc-700 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-pill-black text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                <span>Register</span>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full text-zinc-700 hover:bg-zinc-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer / Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-4 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
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
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </nav>

          {user && profile && (
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-950">{profile.fullName}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">@{profile.username}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-semibold px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mobile Quick Scrollable Secondary Nav Bar */}
      <div className="lg:hidden border-t border-zinc-100 bg-zinc-50/80 px-3 py-2 flex items-center gap-1.5 text-xs font-medium text-zinc-600 overflow-x-auto scrollbar-none">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap text-[11px] ${
              pathname === item.href
                ? 'bg-black text-white font-semibold'
                : 'hover:bg-zinc-200/60 bg-white border border-zinc-200 text-zinc-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
