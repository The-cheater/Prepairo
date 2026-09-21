'use client';

import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '@/frontend/lib/api';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewRequestModal({ isOpen, onClose }: NewRequestModalProps) {
  const [subjectName, setSubjectName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [academicYear, setAcademicYear] = useState(2);
  const [semester, setSemester] = useState(3);
  const [examYear, setExamYear] = useState(2023);
  const [examType, setExamType] = useState<'mid-sem' | 'end-sem'>('end-sem');
  const [notes, setNotes] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/requests'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: subjectName.trim(),
          courseCode: courseCode.trim() || undefined,
          academicYear,
          semester,
          examYear,
          examType,
          notes: notes.trim() || undefined,
          requesterName: requesterName.trim() || 'Student'
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.warn('Failed to create request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl border border-zinc-200 overflow-hidden p-5 sm:p-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="font-cal text-xl font-bold text-zinc-950">
              Request a Missing Paper
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
            <h4 className="font-cal text-xl font-bold text-zinc-900">Request Posted!</h4>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto">
              Your request for {subjectName} is now visible on the community request board.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Subject Title *
              </label>
              <input
                type="text"
                required
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                placeholder="e.g. Condensed Matter Physics I"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Course Code
                </label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  placeholder="e.g. PHY316"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Exam Year *
                </label>
                <select
                  value={examYear}
                  onChange={e => setExamYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={e => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Exam Type *
                </label>
                <select
                  value={examType}
                  onChange={e => setExamType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                >
                  <option value="end-sem">End-Semester</option>
                  <option value="mid-sem">Mid-Semester</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Notes / Additional Details (Optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Specific professor questions, topics covered, or batch information..."
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Your Name / Year
              </label>
              <input
                type="text"
                value={requesterName}
                onChange={e => setRequesterName(e.target.value)}
                placeholder="e.g. Meera K. (Batch 22)"
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>

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
                Post Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
