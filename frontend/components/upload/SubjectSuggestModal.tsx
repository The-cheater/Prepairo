'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { SCHOOLS } from '@/backend/models/subjects-seed';
import { store } from '@/frontend/store/store';

interface SubjectSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSchool?: string;
  defaultSemester?: number;
}

export default function SubjectSuggestModal({
  isOpen,
  onClose,
  defaultSchool = 'foundation',
  defaultSemester = 1
}: SubjectSuggestModalProps) {
  const [subjectName, setSubjectName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [schoolName, setSchoolName] = useState(defaultSchool);
  const [semester, setSemester] = useState(defaultSemester);
  const [studentName, setStudentName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    store.addSuggestion({
      suggestedName: subjectName.trim(),
      courseCode: courseCode.trim() || undefined,
      schoolName,
      semester,
      studentName: studentName.trim() || 'Anonymous Student',
      adminNotes: 'Submitted via "Can\'t find my subject" form.'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl border border-zinc-200 overflow-hidden p-5 sm:p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-cal text-xl font-bold text-zinc-950">
              Can&apos;t find your subject?
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-cal text-xl font-bold text-zinc-900">Subject Suggestion Received!</h4>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Thank you! Our administrators will review &quot;{subjectName}&quot; and add or map it to the repository catalog.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              If your course or elective is newly introduced or not listed, enter its details below. It will be reviewed by an administrator and mapped to the catalog.
            </p>

            {/* Subject Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                placeholder="e.g. Advanced Quantum Field Theory"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>

            {/* Course Code */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Course Code (Optional)
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={e => setCourseCode(e.target.value)}
                placeholder="e.g. PHY502"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors uppercase font-mono"
              />
            </div>

            {/* School */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                School / Department
              </label>
              <select
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              >
                {SCHOOLS.map(sch => (
                  <option key={sch.id} value={sch.name}>
                    {sch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Offered in Semester
              </label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Contributor Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Student Name or leave blank for anonymous"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                className="btn-pill-white text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-pill-black text-xs px-5 py-2"
              >
                Submit for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
