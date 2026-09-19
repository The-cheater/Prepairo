'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, RotateCw, CheckCircle2 } from 'lucide-react';

export default function BananaShakeCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Auto-dismiss Thank You message after 4 seconds (between 3-5 seconds as requested)
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

  const handleFrontClick = () => {
    setIsFlipped(true);
  };

  const handleBackClick = () => {
    // Trigger confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#ec4899']
      });
    } catch {}

    setShowThankYou(true);
  };

  return (
    <div className="relative flex flex-col items-center">
      
      {/* Thank You Popup Message (pops for 3-5 seconds) */}
      {showThankYou && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200 w-max max-w-[90vw] sm:max-w-sm">
          <div className="bg-zinc-950 text-white border border-amber-400/50 shadow-2xl rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center flex-shrink-0 font-bold">
              🍌
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
                Thank you so much! <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-300">
                Your support fuels Prepairo & restores lost potassium!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3D Flip Card Container */}
      <div
        className="w-52 h-52 sm:w-64 sm:h-64 cursor-pointer select-none"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full duration-700 transition-transform rounded-[24px] shadow-sm"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front Side: image.png */}
          <div
            onClick={handleFrontClick}
            className="absolute inset-0 w-full h-full rounded-[24px] bg-white border border-amber-200 p-2 overflow-hidden flex flex-col items-center justify-center group"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full rounded-[18px] overflow-hidden relative">
              <img
                src="/image.png"
                alt="Buy a Banana Shake"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-3">
                <span className="text-[11px] font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
                  <RotateCw className="w-3 h-3 text-amber-400 animate-spin" />
                  Click to Flip for QR Code
                </span>
              </div>
            </div>
          </div>

          {/* Back Side: QR Code */}
          <div
            onClick={handleBackClick}
            className="absolute inset-0 w-full h-full rounded-[24px] bg-white border border-amber-300 p-3 flex flex-col items-center justify-between"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden bg-white p-1">
                <img
                  src="/banana-shake-qr.png"
                  alt="Scan QR for ₹20 Banana Shake"
                  className="w-full h-full object-contain hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-medium text-center">
                Click QR after scanning for a thank you! 🍌
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Helper caption below card */}
      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        {isFlipped ? (
          <button
            onClick={() => setIsFlipped(false)}
            className="text-[11px] text-zinc-600 hover:text-black font-semibold flex items-center gap-1 underline cursor-pointer"
          >
            <RotateCw className="w-3 h-3" /> Flip back to image
          </button>
        ) : (
          <span className="text-[11px] text-zinc-400">
            Click the card to reveal the payment QR code
          </span>
        )}
      </div>

    </div>
  );
}
