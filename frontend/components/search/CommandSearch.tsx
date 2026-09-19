'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ArrowRight, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaperRecord } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';
import PaperModal from '@/frontend/components/papers/PaperModal';
import { getApiUrl } from '@/frontend/lib/api';

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState<PaperRecord[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperRecord | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch papers from backend when query changes
  useEffect(() => {
    if (!query.trim()) {
      setPapers([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(query.trim());
        const res = await fetch(getApiUrl(`/api/papers?q=${q}`));
        if (res.ok) {
          const data = await res.json();
          setPapers((data.papers || []).slice(0, 8));
        }
      } catch (err) {
        console.warn('Search fetch error:', err);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          const evt = new CustomEvent('open-search');
          window.dispatchEvent(evt);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-20 px-3 sm:px-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-150">
        <div 
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Input header */}
          <div className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 border-b border-zinc-100 gap-2.5 sm:gap-3">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by subject, code (BIO111), exam year..."
              className="w-full text-sm sm:text-base bg-transparent border-0 outline-none text-zinc-900 placeholder:text-zinc-400 font-medium"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd 
              onClick={onClose}
              className="text-[10px] sm:text-[11px] font-mono text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md cursor-pointer hover:bg-zinc-200 flex-shrink-0"
            >
              ESC
            </kbd>
          </div>

          {/* Results list */}
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="py-10 sm:py-12 px-4 sm:px-6 text-center text-zinc-400 text-sm">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
                <p className="font-medium text-zinc-600">Search the repository</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Try typing <span className="text-zinc-700 font-mono">Quantum</span>, <span className="text-zinc-700 font-mono">BIO111</span>, or <span className="text-zinc-700 font-mono">2024 End-Sem</span>
                </p>
              </div>
            ) : papers.length === 0 ? (
              <div className="py-10 sm:py-12 px-4 sm:px-6 text-center text-zinc-500 text-sm">
                <p className="font-medium text-zinc-800">No question papers found</p>
                <p className="text-xs text-zinc-400 mt-1">Can&apos;t find what you need? You can post a request on the Request Board.</p>
                <button
                  onClick={() => {
                    onClose();
                    router.push('/requests');
                  }}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-black font-semibold bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full"
                >
                  Request this Paper <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {papers.map(paper => (
                  <div
                    key={paper.id}
                    onClick={() => {
                      setSelectedPaper(paper);
                    }}
                    className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl hover:bg-zinc-50 transition-colors cursor-pointer group border border-transparent hover:border-zinc-200 gap-2"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-black truncate">
                            {paper.subjectName}
                          </h4>
                          {paper.courseCode && (
                            <span className="text-[10px] sm:text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 flex-shrink-0">
                              {paper.courseCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-zinc-500 mt-0.5 truncate">
                          {paper.examYear} • {formatExamType(paper.examType)} • Sem {paper.semester}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {paper.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> <span className="hidden sm:inline">Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> <span className="hidden sm:inline">Pending</span>
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Quick Action */}
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-normal">
            <span>Press <kbd className="font-mono text-zinc-600 bg-white border border-zinc-200 px-1 rounded">ESC</kbd> to exit</span>
            <span className="hidden sm:inline">Showing live results for IISER TVM</span>
          </div>
        </div>
      </div>

      {/* PDF Modal if paper is clicked */}
      {selectedPaper && (
        <PaperModal 
          paper={selectedPaper} 
          onClose={() => setSelectedPaper(null)} 
        />
      )}
    </>
  );
}
