'use client';

import React, { useState } from 'react';
import { FileText, Eye, Download, CheckCircle2, Clock, Calendar, GraduationCap } from 'lucide-react';
import { PaperRecord } from '@/backend/models/mock-papers';
import { formatExamType, getExamTypeColor } from '@/frontend/lib/utils';
import PaperModal from './PaperModal';

interface PaperCardProps {
  paper: PaperRecord;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const examColor = getExamTypeColor(paper.examType);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const element = document.createElement('a');
    const file = new Blob([
      `IISER Thiruvananthapuram - PYQ Hub\n\nSubject: ${paper.subjectName}\nCourse Code: ${paper.courseCode || 'N/A'}\nExam: ${formatExamType(paper.examType)} (${paper.examYear})\nSemester: ${paper.semester}\n\n[PYQ Hub - Download completed.]`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${paper.courseCode || 'PYQ'}_${paper.examType}_${paper.examYear}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div 
        onClick={() => setIsPreviewOpen(true)}
        className="group relative bg-white rounded-[28px] border border-zinc-200/90 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover-lift transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Top badges bar */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className={`pill-tag border ${examColor.bg} ${examColor.text} ${examColor.border}`}>
              {formatExamType(paper.examType)}
            </span>

            {paper.status === 'verified' ? (
              <span className="pill-tag bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            ) : (
              <span className="pill-tag bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending
              </span>
            )}
          </div>

          {/* Subject & Course Code */}
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-cal text-lg font-bold text-zinc-950 group-hover:text-black transition-colors leading-snug">
                {paper.subjectName}
              </h3>
            </div>
            
            {paper.courseCode && (
              <div className="inline-block">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {paper.courseCode}
                </span>
              </div>
            )}
          </div>

          {/* Metadata details */}
          <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-2 gap-2 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Exam: {paper.examYear}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
              <span>Semester {paper.semester}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-normal">
            By {paper.isAnonymous ? 'Anonymous' : paper.uploaderName}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              className="p-2 rounded-full text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
              title="View in reader"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="btn-pill-black text-xs py-1 px-3 flex items-center gap-1.5"
              title="Download file"
            >
              <Download className="w-3 h-3" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <PaperModal 
          paper={paper} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
    </>
  );
}
