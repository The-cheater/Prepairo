import React from 'react';
import GuidedBrowse from '@/frontend/components/browse/GuidedBrowse';

export const metadata = {
  title: 'Browse Question Papers | IISER TVM PYQ Repository',
  description: 'Hierarchical guided browse across IISER Thiruvananthapuram foundation courses, specialized schools, and semesters.'
};

export default function BrowsePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1">
        <span className="pill-tag bg-zinc-100 text-zinc-900 border border-zinc-200">
          Guided Directory
        </span>
        <h1 className="font-cal text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Browse Previous Year Papers
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl font-normal">
          Select your academic year, semester, and school to view verified past examination papers organized by year and exam category.
        </p>
      </div>

      <GuidedBrowse />
    </div>
  );
}
