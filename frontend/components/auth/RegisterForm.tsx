'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Award, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const { loginWithGoogle, login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignUp = async () => {
    setError('');
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
    }
  };

  const handleDemoSignUp = async () => {
    setIsSubmitting(true);
    await login('new_student', 'password123');
    setIsSubmitting(false);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-[32px] border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            <Award className="w-3.5 h-3.5 text-amber-600" /> Welcome 10 Credits Bonus
          </div>
          <h1 className="font-cal text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Join Prepairo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Sign up with Google to upload verified exam papers, earn 10 credits per approved paper, and redeem at 499 credits.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
          >
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
            <span>Sign Up with Google</span>
          </button>

          <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
            Your profile will be automatically configured from your Google account.
          </p>
        </div>

        {/* Demo preview */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-100"></div>
            <span className="flex-shrink mx-3 text-[10px] text-zinc-400 font-medium uppercase">Or local preview</span>
            <div className="flex-grow border-t border-zinc-100"></div>
          </div>

          <button
            type="button"
            onClick={handleDemoSignUp}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo Student Sign Up
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-zinc-100 text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/login" className="text-zinc-950 font-bold hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
