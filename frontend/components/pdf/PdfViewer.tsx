'use client';

import React, { useState } from 'react';
import { Download, ZoomIn, ZoomOut, Maximize2, Minimize2, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { PaperRecord } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';

interface PdfViewerProps {
  paper: PaperRecord;
  onDownload?: () => void;
}

export default function PdfViewer({ paper, onDownload }: PdfViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const hasValidPdfUrl = paper.fileUrl && (paper.fileUrl.startsWith('http') || paper.fileUrl.startsWith('blob:') || paper.fileUrl.endsWith('.pdf'));

  // Load PDF via proxy as same-origin Blob to guarantee inline rendering without white screen
  React.useEffect(() => {
    let isMounted = true;
    if (!hasValidPdfUrl) return;

    let createdUrl: string | null = null;

    async function loadPdfBlob() {
      setIsLoadingPdf(true);
      setLoadError(false);
      try {
        const streamUrl = paper.fileUrl.startsWith('http')
          ? `/api/papers/proxy?url=${encodeURIComponent(paper.fileUrl)}&filename=${encodeURIComponent(paper.fileName || `${paper.subjectName}.pdf`)}`
          : paper.fileUrl;

        const res = await fetch(streamUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rawBlob = await res.blob();
        const pdfBlob = new Blob([rawBlob], { type: 'application/pdf' });
        createdUrl = URL.createObjectURL(pdfBlob);
        if (isMounted) {
          setBlobUrl(createdUrl);
        }
      } catch (err) {
        console.warn('Blob PDF fetch fallback:', err);
        // Fall back directly to proxy stream URL if client-side blob fails
        if (isMounted) {
          const streamFallback = paper.fileUrl.startsWith('http')
            ? `/api/papers/proxy?url=${encodeURIComponent(paper.fileUrl)}&filename=${encodeURIComponent(paper.fileName || `${paper.subjectName}.pdf`)}`
            : paper.fileUrl;
          setBlobUrl(streamFallback);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPdf(false);
        }
      }
    }

    loadPdfBlob();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [paper.fileUrl, hasValidPdfUrl, paper.fileName, paper.subjectName]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }

    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = paper.fileName || `${paper.subjectName}_${paper.examType}_${paper.examYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (hasValidPdfUrl) {
      const a = document.createElement('a');
      a.href = paper.fileUrl;
      a.download = paper.fileName || `${paper.subjectName}_${paper.examType}_${paper.examYear}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const element = document.createElement('a');
      const file = new Blob([
        `%PDF-1.4\n% Prepairo - IISER Thiruvananthapuram\nSubject: ${paper.subjectName}\nCourse Code: ${paper.courseCode || 'N/A'}\nExam: ${formatExamType(paper.examType)} (${paper.examYear})\nSemester: ${paper.semester}\nUploaded by: ${paper.uploaderName}\nVerified: ${paper.status === 'verified' ? 'YES' : 'PENDING'}\n\n[Prepairo Academic Repository - Document Archived]`
      ], { type: 'application/pdf' });
      element.href = URL.createObjectURL(file);
      element.download = paper.fileName || `${paper.courseCode || 'PYQ'}_${paper.examType}_${paper.examYear}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className={`flex flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 transition-all ${isFullscreen ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl' : 'w-full h-[60vh] sm:h-[600px]'}`}>
      
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-950/90 text-zinc-300 border-b border-zinc-800 text-xs select-none gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
          <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-mono truncate font-medium text-white text-[11px] sm:text-xs">
            {paper.fileName || `${paper.subjectName}_${paper.examYear}.pdf`}
          </span>
          <span className="hidden md:inline text-zinc-500 font-mono text-[11px] flex-shrink-0">
            ({((paper.fileSizeBytes || 500000) / (1024 * 1024)).toFixed(2)} MB)
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-900 px-1.5 sm:px-2 py-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <span className="font-mono text-[10px] sm:text-[11px] w-7 sm:w-9 text-center text-zinc-400">{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(150, z + 10))}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:text-white hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="btn-pill-white text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-1 font-semibold text-zinc-950 bg-white hover:bg-zinc-100"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* Viewer Main Viewport */}
      <div className="flex-1 bg-zinc-900/90 overflow-auto p-2 sm:p-4 flex items-center justify-center relative">
        {isLoadingPdf ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-16 text-zinc-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono">Loading PDF document...</p>
          </div>
        ) : hasValidPdfUrl && blobUrl && !loadError ? (
          <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-150"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <object
              data={`${blobUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full min-h-[350px] sm:min-h-[520px] rounded-lg shadow-xl bg-white"
              onError={() => setLoadError(true)}
            >
              {/* Fallback iframe */}
              <iframe
                src={`${blobUrl}#toolbar=1`}
                className="w-full h-full min-h-[350px] sm:min-h-[520px] rounded-lg shadow-xl bg-white border-0"
                onError={() => setLoadError(true)}
                title={paper.subjectName}
              />
            </object>
          </div>
        ) : (
          /* Rendered In-App Question Paper Layout */
          <div 
            className="w-full max-w-3xl bg-white text-zinc-900 rounded-xl shadow-2xl p-4 sm:p-12 transition-transform duration-150 my-auto"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* Exam Header */}
            <div className="text-center pb-4 sm:pb-6 border-b-2 border-zinc-900 space-y-1 sm:space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                <img src="/logo.png" alt="IISER TVM" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-800">
                  IISER Thiruvananthapuram
                </span>
              </div>
              <h2 className="font-cal text-base sm:text-2xl font-bold text-zinc-950">
                {formatExamType(paper.examType).toUpperCase()} EXAMINATION — {paper.examYear}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs text-zinc-600 font-mono pt-1">
                <span>Course: {paper.courseCode || paper.subjectName}</span>
                <span>•</span>
                <span>Sem {paper.semester}</span>
                <span>•</span>
                <span>Time: 3 Hours</span>
                <span>•</span>
                <span>Marks: 50</span>
              </div>
            </div>

            {/* Questions Body */}
            <div className="py-6 space-y-6 text-sm text-zinc-800 leading-relaxed">
              <div className="space-y-1">
                <p className="font-bold text-zinc-950">Section A: Core Concepts & Principles (15 Marks)</p>
                <p className="text-xs text-zinc-700">
                  1. (a) Derive and explain the governing equations for {paper.subjectName}. State all physical constraints and initial conditions clearly.
                </p>
                <p className="text-xs text-zinc-700">
                  (b) Under what conditions does the perturbative solution diverge? Provide physical justification.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-zinc-950">Section B: Analytical Formulations (20 Marks)</p>
                <p className="text-xs text-zinc-700">
                  2. Construct the Hamiltonian or transfer matrix for the two-dimensional lattice configuration. Determine the eigenvalues and characterize the ground state symmetry.
                </p>
                <p className="text-xs text-zinc-700">
                  3. Evaluate the asymptotic scaling behavior when the coupling constant approaches the critical threshold.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-zinc-950">Section C: Advanced Synthesis (15 Marks)</p>
                <p className="text-xs text-zinc-700">
                  4. Prove that the energy spectrum remains bounded from below. Discuss the thermodynamic implications at finite temperature.
                </p>
              </div>
            </div>

            {/* Inbuilt Watermark */}
            <div className="pt-6 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
              <span>Prepairo In-App PDF Viewer • IISER TVM</span>
              <span>Status: {paper.status.toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Viewer Footer */}
      <div className="px-4 py-2 bg-zinc-950 text-zinc-400 border-t border-zinc-800 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          {paper.status === 'verified' ? (
            <span className="text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Admin
            </span>
          ) : paper.status === 'rejected' ? (
            <span className="text-rose-400 flex items-center gap-1 font-semibold text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" /> Disapproved
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1 font-semibold text-[11px]">
              <Clock className="w-3.5 h-3.5" /> Awaiting Admin Check
            </span>
          )}
          <span>•</span>
          <span className="text-[11px]">Uploaded by: {paper.isAnonymous ? 'Anonymous' : paper.uploaderName}</span>
        </div>

        <button
          onClick={handleDownload}
          className="text-white hover:text-amber-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>Save File</span>
        </button>
      </div>
    </div>
  );
}
