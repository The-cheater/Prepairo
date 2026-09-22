'use client';

import React from 'react';
import { SCHOOLS } from '@/backend/models/subjects-seed';
import { ArrowRight, BookOpen, Atom, Dna, FlaskConical, Binary, Globe2, Compass } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedSchools() {
  const getSchoolIcon = (id: string) => {
    switch (id) {
      case 'foundation':
        return Compass;
      case 'biology':
        return Dna;
      case 'chemistry':
        return FlaskConical;
      case 'data-science':
        return Binary;
      case 'earth-sciences':
        return Globe2;
      case 'mathematics':
        return BookOpen;
      case 'physics':
        return Atom;
      default:
        return BookOpen;
    }
  };

  return (
    <section className="py-20 bg-transparent border-t border-zinc-100/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="pill-tag bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 mb-3">
              Browse by Department
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white font-cal">
              Pick your branch or school
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-normal mt-1">
              Find mid-sem, end-sem, and quiz papers categorized neatly for your courses.
            </p>
          </div>

          <Link
            href="/browse"
            className="btn-pill-black text-xs px-5 py-2.5 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>See All Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid of schools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOOLS.map(school => {
            const Icon = getSchoolIcon(school.id);
            const imageSrc = `/schools/${school.id}.jpg`;

            return (
              <Link
                key={school.id}
                href={`/browse?school=${school.id}`}
                className="group relative rounded-[28px] border border-zinc-200/80 dark:border-zinc-800 p-6 shadow-sm hover-lift transition-all flex flex-col justify-between overflow-hidden min-h-[300px]"
              >
                {/* Full-Card Animated / Cartoon Background Image */}
                <img
                  src={imageSrc}
                  alt={school.name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out pointer-events-none"
                />

                {/* Rich Gradient Dark Overlay for crystal clear readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/45 group-hover:via-zinc-950/80 transition-colors pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white font-bold border border-white/25 shadow-sm">
                      {school.code}
                    </span>
                  </div>

                  <h3 className="font-cal text-xl font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow-sm">
                    {school.name}
                  </h3>

                  <p className="text-xs text-zinc-300 font-normal mt-2 line-clamp-3 leading-relaxed drop-shadow-sm">
                    {school.description}
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-white">
                  <span className="group-hover:text-amber-300 transition-colors">Browse Papers</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
