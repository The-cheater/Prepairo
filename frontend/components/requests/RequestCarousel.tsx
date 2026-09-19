'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PaperRequest } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';
import { HelpCircle, Upload, ChevronLeft, ChevronRight, Calendar, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';

export default function RequestCarousel() {
  const [requests, setRequests] = useState<PaperRequest[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive cardsPerView based on window width
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(getApiUrl('/api/requests?status=open'));
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
        }
      } catch (err) {
        console.warn('Failed to fetch requests:', err);
      }
    };
    fetchRequests();
  }, []);

  const maxIndex = Math.max(0, requests.length - cardsPerView);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (requests.length <= cardsPerView) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [requests.length, cardsPerView, maxIndex]);

  const resetTimer = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
  };

  const goTo = (idx: number) => {
    const clamped = Math.min(Math.max(0, idx), maxIndex);
    setCurrentIndex(clamped);
    resetTimer();
  };

  const goPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? maxIndex : prev - 1));
    resetTimer();
  };

  const goNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    resetTimer();
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (requests.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-transparent border-t border-zinc-100/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="pill-tag bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              <HelpCircle className="w-3 h-3 inline mr-1" />
              Community Requests
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-cal">
              Papers People Are Looking For
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-normal mt-1">
              Have any of these? Upload and help a fellow student.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={goPrev}
              className="w-9 h-9 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Previous request"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              className="w-9 h-9 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Next request"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/requests"
              className="btn-pill-black text-xs px-4 sm:px-5 py-2 ml-1 sm:ml-2"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={scrollRef}
            className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="bg-white rounded-[24px] border border-zinc-200 p-5 sm:p-6 shadow-sm h-full flex flex-col justify-between hover-lift transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="pill-tag bg-zinc-100 text-zinc-800 border border-zinc-200 text-[11px]">
                        {formatExamType(req.examType)}
                      </span>
                      <span className="pill-tag bg-amber-50 text-amber-700 border border-amber-200 text-[11px] flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" /> Needed
                      </span>
                    </div>

                    <h3 className="font-cal text-base sm:text-lg font-bold text-zinc-950 leading-tight">
                      {req.subjectName}
                    </h3>

                    {req.courseCode && (
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 inline-block">
                        {req.courseCode}
                      </span>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Exam: {req.examYear}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Semester {req.semester}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-zinc-500 italic bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                        &ldquo;{req.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-100">
                    <Link
                      href="/upload"
                      className="btn-pill-black text-xs py-2 px-4 w-full flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3 h-3" />
                      <span>I Have This Paper</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        {requests.length > cardsPerView && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'bg-zinc-950 w-5'
                    : 'bg-zinc-300 hover:bg-zinc-400 w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
