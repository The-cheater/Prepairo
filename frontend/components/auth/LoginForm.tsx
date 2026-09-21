'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const { loginWithGoogle, login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayError = error || urlError;

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSubmitting(true);
    await login('student_demo', 'password123');
    setIsSubmitting(false);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> +10 Free Credits upon Login
          </div>
          <h1 className="font-cal text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Welcome to Prepairo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            Sign in with Google to get 10 free credits right away! Upload past papers, earn credits when approved by our admin, and redeem them for real cash rewards.
          </p>
        </div>

        {displayError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Google OAuth Login Button (Primary & Sole method) */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
            {/* Official Google SVG Logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSubmitting ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          <p className="text-[11px] text-center text-zinc-400 dark:text-zinc-500">
            Instant 1-click login • Profile photo & details sync automatically
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center space-y-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-zinc-900 dark:text-white underline">
              Sign up with Google
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400">Loading sign in...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
