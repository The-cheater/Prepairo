'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { store } from '@/frontend/store/store';
import { PaperRecord } from '@/backend/models/mock-papers';
import { SCHOOLS } from '@/backend/models/subjects-seed';
import PaperGrid from '@/frontend/components/papers/PaperGrid';
import { Search, Filter, X, SlidersHorizontal, BookOpen } from 'lucide-react';

export default function SearchPage() {
  const [papers, setPapers] = useState<PaperRecord[]>([]);
  const [query, setQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');

  useEffect(() => {
    setPapers(store.getPapers());
    const unsub = store.subscribe(() => {
      setPapers(store.getPapers());
    });
    return () => unsub();
  }, []);

  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesQuery =
          p.subjectName.toLowerCase().includes(q) ||
          (p.courseCode && p.courseCode.toLowerCase().includes(q)) ||
          p.examYear.toString().includes(q) ||
          p.uploaderName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (selectedSchool !== 'all' && p.schoolId !== selectedSchool) return false;
      if (selectedYear !== 'all' && p.examYear.toString() !== selectedYear) return false;
      if (selectedType !== 'all' && p.examType !== selectedType) return false;
      if (selectedSemester !== 'all' && p.semester.toString() !== selectedSemester) return false;
      return true;
    });
  }, [papers, query, selectedSchool, selectedYear, selectedType, selectedSemester]);

  const clearFilters = () => {
    setQuery('');
    setSelectedSchool('all');
    setSelectedYear('all');
    setSelectedType('all');
    setSelectedSemester('all');
  };

  const hasActiveFilters = query || selectedSchool !== 'all' || selectedYear !== 'all' || selectedType !== 'all' || selectedSemester !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="pill-tag bg-zinc-100 text-zinc-900 border border-zinc-200">
          Global Repository Search
        </span>
        <h1 className="font-cal text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
          Search Question Papers
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl font-normal">
          Filter through question papers across subjects, course codes, examination years, and categories.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by course code (e.g. PHY111, MTH301), subject name, or exam year..."
          className="w-full pl-12 pr-10 py-4 bg-white rounded-full border border-zinc-200 shadow-xs text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Multi-facet Filter Controls */}
      <div className="bg-white rounded-[28px] border border-zinc-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Options
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* School */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">School / Stream</label>
            <select
              value={selectedSchool}
              onChange={e => setSelectedSchool(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
            >
              <option value="all">All Schools & Foundation</option>
              {SCHOOLS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Exam Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
            >
              <option value="all">All Exam Categories</option>
              <option value="end-sem">End-Semester</option>
              <option value="mid-sem">Mid-Semester</option>
              <option value="quiz">Quiz / Minor</option>
              <option value="supplementary">Supplementary</option>
            </select>
          </div>

          {/* Exam Year */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Exam Year</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
            >
              <option value="all">All Years</option>
              {[2024, 2023, 2022, 2021, 2020].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 block mb-1">Semester</label>
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                <option key={s} value={s.toString()}>Semester {s}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <p className="text-sm font-semibold text-zinc-900">
          Showing {filteredPapers.length} {filteredPapers.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Paper Grid */}
      <PaperGrid papers={filteredPapers} showGrouping={false} />

    </div>
  );
}
