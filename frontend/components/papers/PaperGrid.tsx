'use client';

import React, { useState } from 'react';
import { PaperRecord } from '@/backend/models/mock-papers';
import PaperCard from './PaperCard';
import { FileText, Filter, Calendar, Layers } from 'lucide-react';
import { formatExamType } from '@/frontend/lib/utils';

interface PaperGridProps {
  papers: PaperRecord[];
  showGrouping?: boolean;
}

export default function PaperGrid({ papers, showGrouping = true }: PaperGridProps) {
  const [selectedType, setSelectedType] = useState<string>('all');

  const filtered = papers.filter(p => {
    if (selectedType !== 'all' && p.examType !== selectedType) return false;
    return true;
  });

  // Group by exam year descending
  const years = Array.from(new Set(filtered.map(p => p.examYear))).sort((a, b) => b - a);

  const examTypes = [
    { value: 'all', label: 'All Exam Types' },
    { value: 'end-sem', label: 'End-Sem' },
    { value: 'mid-sem', label: 'Mid-Sem' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'supplementary', label: 'Supplementary' }
  ];

  if (papers.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center my-8">
        <FileText className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
        <h3 className="font-cal text-xl font-bold text-zinc-900">No question papers found</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto mt-1">
          There are currently no uploaded papers for this selection. You can upload one or post a paper request to notify the community.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {examTypes.map(t => (
          <button
            key={t.value}
            onClick={() => setSelectedType(t.value)}
            className={`pill-tag border transition-all cursor-pointer ${
              selectedType === t.value
                ? 'bg-black text-white border-black shadow-sm'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {showGrouping ? (
        <div className="space-y-12">
          {years.map(year => {
            const yearPapers = filtered.filter(p => p.examYear === year);
            if (yearPapers.length === 0) return null;

            return (
              <div key={year} className="space-y-4">
                {/* Year Header Badge */}
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
                  <span className="flex items-center gap-1.5 font-cal text-xl font-bold text-zinc-950">
                    <Calendar className="w-5 h-5 text-zinc-400" />
                    Examination Year {year}
                  </span>
                  <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                    {yearPapers.length} {yearPapers.length === 1 ? 'paper' : 'papers'}
                  </span>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {yearPapers.map(paper => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(paper => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
}
