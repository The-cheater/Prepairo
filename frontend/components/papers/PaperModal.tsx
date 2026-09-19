'use client';

import React from 'react';
import { X, Share2, FileText } from 'lucide-react';
import { PaperRecord } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';
import PdfViewer from '@/frontend/components/pdf/PdfViewer';

interface PaperModalProps {
  paper: PaperRecord;
  onClose: () => void;
}

export default function PaperModal({ paper, onClose }: PaperModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[96vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-zinc-100 bg-white gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-zinc-950 font-cal truncate">
                  {paper.subjectName}
                </h3>
                {paper.courseCode && (
                  <span className="font-mono text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold flex-shrink-0">
                    {paper.courseCode}
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 font-normal mt-0.5 truncate">
                {paper.program} • Sem {paper.semester} • {formatExamType(paper.examType)} {paper.examYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Copy link"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            {copied && (
              <span className="text-[11px] sm:text-xs text-emerald-600 font-semibold">Copied!</span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: In-App PDF Viewer */}
        <div className="p-2 sm:p-6 bg-zinc-100/60 overflow-hidden flex-1 flex flex-col">
          <PdfViewer paper={paper} />
        </div>
      </div>
    </div>
  );
}
