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
    <section className="py-20 bg-transparent border-t border-zinc-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="pill-tag bg-white text-zinc-800 border border-zinc-200 mb-3">
              Curriculum Navigation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 font-cal">
              Explore by School & Stream
            </h2>
            <p className="text-sm text-zinc-500 font-normal mt-1">
              Curated archive matching IISER TVM&apos;s foundational 2-year core and specialized discipline schools.
            </p>
          </div>

          <Link
            href="/browse"
            className="btn-pill-black text-xs px-5 py-2.5 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>All Subjects Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid of schools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOOLS.map(school => {
            const Icon = getSchoolIcon(school.id);
            return (
              <Link
                key={school.id}
                href={`/browse?school=${school.id}`}
                className="group bg-white rounded-[28px] border border-zinc-200/90 p-6 shadow-sm hover-lift transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-800 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                      {school.code}
                    </span>
                  </div>

                  <h3 className="font-cal text-lg font-bold text-zinc-950 group-hover:text-black">
                    {school.name}
                  </h3>

                  <p className="text-xs text-zinc-500 font-normal mt-2 line-clamp-2 leading-relaxed">
                    {school.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-900">
                  <span>Browse Papers</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 group-hover:text-black transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
