'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { SCHOOLS, ALL_SUBJECTS, SubjectItem } from '@/backend/models/subjects-seed';
import { PaperRecord } from '@/backend/models/mock-papers';
import PaperGrid from '@/frontend/components/papers/PaperGrid';
import BranchedMenu, { BranchedMenuItem } from '@/frontend/components/react-bits/BranchedMenu';
import { GraduationCap, BookOpen, Layers, Calendar, ChevronRight, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';


export default function GuidedBrowse() {
  const [institute, setInstitute] = useState('IISER-TVM');
  const [program, setProgram] = useState('BS-MS');
  const [academicYear, setAcademicYear] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);
  const [selectedSchool, setSelectedSchool] = useState<string>('foundation');
  const [selectedSubject, setSelectedSubject] = useState<string>('Principles of Life I');
  const [matchingPapers, setMatchingPapers] = useState<PaperRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTreeOpenOnMobile, setIsTreeOpenOnMobile] = useState(false);

  // Available semesters based on academic year
  const availableSemesters = useMemo(() => {
    return [academicYear * 2 - 1, academicYear * 2];
  }, [academicYear]);

  // Adjust semester if year changes
  const handleYearChange = (year: number) => {
    setAcademicYear(year);
    const newSem = year * 2 - 1;
    setSemester(newSem);
    if (year <= 2) {
      setSelectedSchool('foundation');
    } else if (selectedSchool === 'foundation') {
      setSelectedSchool('physics');
    }
  };

  // Filter subjects based on school, year, and semester
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter(sub => {
      if (selectedSchool === 'foundation') {
        return sub.schoolId === 'foundation' && sub.year === academicYear;
      }
      return sub.schoolId === selectedSchool;
    });
  }, [selectedSchool, academicYear]);

  // Prepare items for BranchedMenu
  const branchedMenuItems: BranchedMenuItem[] = useMemo(() => {
    return SCHOOLS.map(school => {
      const schoolSubjects = ALL_SUBJECTS.filter(s => s.schoolId === school.id);
      return {
        label: school.name,
        children: schoolSubjects.slice(0, 6).map(sub => ({
          value: sub.name,
          label: sub.name
        }))
      };
    });
  }, []);

  // Fetch papers from backend when subject changes
  useEffect(() => {
    const fetchPapers = async () => {
      setIsLoading(true);
      try {
        const q = encodeURIComponent(selectedSubject);
        const res = await fetch(getApiUrl(`/api/papers?q=${q}&status=verified`));
        if (res.ok) {
          const data = await res.json();
          // Filter more precisely on subject name match
          const filtered = (data.papers || []).filter(
            (p: PaperRecord) => p.subjectName.toLowerCase() === selectedSubject.toLowerCase()
          );
          setMatchingPapers(filtered);
        }
      } catch (err) {
        console.warn('Failed to fetch papers:', err);
        setMatchingPapers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPapers();
  }, [selectedSubject]);

  return (
    <div className="space-y-8 sm:space-y-10">
      
      {/* SaaS Step Navigator */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 p-4 sm:p-8 shadow-sm">
        
        {/* Step indicator breadcrumb */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider pb-4 sm:pb-6 border-b border-zinc-100">
          <span className="text-zinc-900 font-bold">1. Institute</span>
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <span className="text-zinc-900 font-bold">2. Program</span>
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <span className="text-zinc-900 font-bold">3. Year & Sem</span>
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <span className="text-zinc-900 font-bold">4. School & Subject</span>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 sm:pt-6">
          
          {/* 1. Institute */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Institute
            </label>
            <div className="p-2.5 sm:p-3 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center gap-2.5">
              <img src="/logo.png" alt="IISER TVM" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
              <div className="text-xs min-w-0">
                <p className="font-bold text-zinc-900 truncate">IISER Thiruvananthapuram</p>
                <p className="text-zinc-400 text-[10px]">Active Institute</p>
              </div>
            </div>
          </div>

          {/* 2. Program */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Program
            </label>
            <div className="flex gap-1 bg-zinc-50 p-1 sm:p-1.5 rounded-2xl border border-zinc-200">
              {['BS-MS', 'M.Sc.', 'Ph.D.'].map(p => (
                <button
                  key={p}
                  onClick={() => setProgram(p)}
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    program === p
                      ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Academic Year */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Academic Year
            </label>
            <div className="flex gap-1 bg-zinc-50 p-1 sm:p-1.5 rounded-2xl border border-zinc-200">
              {[1, 2, 3, 4, 5].map(yr => (
                <button
                  key={yr}
                  onClick={() => handleYearChange(yr)}
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    academicYear === yr
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Y{yr}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Semester */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Semester
            </label>
            <div className="flex gap-1 bg-zinc-50 p-1 sm:p-1.5 rounded-2xl border border-zinc-200">
              {availableSemesters.map(s => (
                <button
                  key={s}
                  onClick={() => setSemester(s)}
                  className={`flex-1 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    semester === s
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* School selector pill list */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Select School / Stream
            </label>
            <span className="text-[11px] text-zinc-400 font-normal">
              {academicYear <= 2 ? 'Core Foundation Recommended' : 'Major / Discipline Schools'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SCHOOLS.map(sch => {
              const isSelected = selectedSchool === sch.id;
              return (
                <button
                  key={sch.id}
                  onClick={() => {
                    setSelectedSchool(sch.id);
                    const first = ALL_SUBJECTS.find(s => s.schoolId === sch.id);
                    if (first) setSelectedSubject(first.name);
                  }}
                  className={`pill-tag text-xs border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {sch.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Browse Section: BranchedMenu + Subject Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Tree Navigator: BranchedMenu (Collapsible on mobile) */}
        <div className="lg:col-span-4 bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 p-5 sm:p-6 shadow-sm lg:sticky lg:top-28">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100">
            <button
              onClick={() => setIsTreeOpenOnMobile(!isTreeOpenOnMobile)}
              className="lg:pointer-events-none flex items-center gap-2 font-cal text-base font-bold text-zinc-900 w-full lg:w-auto justify-between lg:justify-start"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-500" />
                Schools & Catalog Tree
              </span>
              <span className="lg:hidden text-xs text-zinc-500 font-normal border border-zinc-200 px-2 py-0.5 rounded-full bg-zinc-50">
                {isTreeOpenOnMobile ? 'Hide Tree ▲' : 'Show Tree ▼'}
              </span>
            </button>
            <span className="hidden lg:inline-block text-[11px] font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
              Hierarchical
            </span>
          </div>

          {/* Tree body - always open on lg, togglable on mobile */}
          <div className={`${isTreeOpenOnMobile ? 'block' : 'hidden lg:block'} pt-4 lg:pt-0`}>
            <div className="overflow-x-auto max-h-[450px] sm:max-h-[500px] overflow-y-auto pr-1">
              <BranchedMenu
                items={branchedMenuItems}
                defaultOpen={[0, 1]}
                defaultActive={selectedSubject}
                onSelect={(val) => {
                  setSelectedSubject(val);
                  const sub = ALL_SUBJECTS.find(s => s.name === val);
                  if (sub) setSelectedSchool(sub.schoolId);
                }}
                color="#18181b"
                accentColor="#000000"
                lineColor="#e4e4e7"
                width={280}
                rowHeight={34}
                fontSize={13}
              />
            </div>

            <div className="mt-4 sm:mt-6 pt-4 border-t border-zinc-100">
              <Link
                href="/upload?suggest=true"
                className="text-xs text-zinc-600 hover:text-black font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Can&apos;t find your subject? Suggest it here</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Content: Selected Subject Papers */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Subject Banner */}
          <div className="bg-zinc-950 text-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  IISER TVM
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  Semester {semester}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  Year {academicYear}
                </span>
              </div>

              <h2 className="font-cal text-xl sm:text-3xl font-bold tracking-tight text-white pt-1">
                {selectedSubject}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-normal">
                Browse verified mid-semester and end-semester previous year question papers.
              </p>
            </div>

            {/* Background subtle geometric accent */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-zinc-800/40 to-transparent pointer-events-none" />
          </div>

          {/* Quick Subject Switcher for current school */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Subjects in this category ({filteredSubjects.length})
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
              {filteredSubjects.map(sub => {
                const isCurrent = sub.name === selectedSubject;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.name)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium ${
                      isCurrent
                        ? 'bg-black text-white border-black font-semibold'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {sub.name} {sub.code && <span className="opacity-60 text-[10px]">({sub.code})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Papers Grid */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 p-4 sm:p-8 shadow-sm">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-zinc-500">Loading papers...</p>
              </div>
            ) : (
              <PaperGrid papers={matchingPapers} showGrouping={true} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
