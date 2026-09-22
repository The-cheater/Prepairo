'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, X, ShieldCheck, Zap } from 'lucide-react';
import { SCHOOLS, ALL_SUBJECTS } from '@/backend/models/subjects-seed';
import SubjectSuggestModal from './SubjectSuggestModal';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { useAuth } from '@/frontend/components/auth/AuthProvider';
import { getApiUrl } from '@/frontend/lib/api';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const CURRENT_YEAR = Math.max(new Date().getFullYear(), 2026);
const EXAM_YEARS = Array.from({ length: CURRENT_YEAR - 2015 }, (_, i) => CURRENT_YEAR - i);

export default function UploadForm() {
  const { user, profile } = useAuth();
  const [program, setProgram] = useState('BS-MS');
  const [academicYear, setAcademicYear] = useState(1);
  const [semester, setSemester] = useState(1);
  const [schoolId, setSchoolId] = useState('foundation');
  const [subjectName, setSubjectName] = useState('Principles of Life I');
  const [examType, setExamType] = useState<'mid-sem' | 'end-sem'>('end-sem');
  const [examYear, setExamYear] = useState(CURRENT_YEAR);
  const [batch, setBatch] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRecord, setSuccessRecord] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      if (profile.fullName) setUploaderName(profile.fullName);
      else if (profile.username) setUploaderName(profile.username);
    }
  }, [profile]);

  // Available subjects based on school
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter(s => {
      if (schoolId === 'foundation') return s.schoolId === 'foundation';
      return s.schoolId === schoolId;
    });
  }, [schoolId]);

  const handleSubjectChange = (name: string) => {
    setSubjectName(name);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        if (selected.size > MAX_FILE_SIZE) {
          setErrorMsg(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Your file is ${(selected.size / 1024 / 1024).toFixed(2)} MB.`);
          return;
        }
        setErrorMsg('');
        setFile(selected);
      } else {
        setErrorMsg('Please upload a PDF document.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > MAX_FILE_SIZE) {
        setErrorMsg(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Your file is ${(selected.size / 1024 / 1024).toFixed(2)} MB.`);
        return;
      }
      setErrorMsg('');
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!file) {
      setErrorMsg('Please attach the question paper PDF file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMsg(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subjectName', subjectName);
      formData.append('examType', examType);
      formData.append('examYear', examYear.toString());
      formData.append('schoolId', schoolId);
      formData.append('program', program);
      formData.append('academicYear', academicYear.toString());
      formData.append('semester', semester.toString());
      if (batch.trim()) formData.append('batch', batch.trim());
      formData.append('uploaderName', isAnonymous ? 'Anonymous' : (uploaderName.trim() || 'Student Contributor'));
      if (!isAnonymous && profile?.id) {
        formData.append('uploaderId', profile.id);
      }
      formData.append('isAnonymous', isAnonymous.toString());

      const res = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Upload failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}

      setSuccessRecord(data.paper);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successRecord) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-cal text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
            Paper Uploaded Successfully!
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto">
            Your paper for <strong className="text-zinc-950 dark:text-white">{successRecord.subjectName}</strong> ({successRecord.examYear}) has been submitted. Our admin will check it shortly.
          </p>
        </div>

        {/* Credit Reward Notice */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center flex-shrink-0 font-bold">
            <Zap className="w-5 h-5 fill-amber-950" />
          </div>
          <div>
            <p className="font-bold text-amber-950 dark:text-amber-200">+10 Credits on Approval</p>
            <p className="text-amber-800 dark:text-amber-400 text-[11px]">
              Once the admin approves your paper, 10 credits will be added to your account. Reach 499 credits to cash out for real money!
            </p>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
          <p><strong>Status:</strong> Waiting for Admin Check</p>
          <p><strong>Contributed As:</strong> {successRecord.uploaderName}</p>
          <p><strong>Exam:</strong> {successRecord.examType.toUpperCase()}</p>
          <p><strong>File:</strong> {successRecord.fileName}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => {
              setSuccessRecord(null);
              setFile(null);
            }}
            className="btn-pill-white text-xs px-6 py-2.5 w-full sm:w-auto"
          >
            Upload Another Paper
          </button>
          <Link
            href="/dashboard"
            className="btn-pill-black text-xs px-6 py-2.5 w-full sm:w-auto"
          >
            Go to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 bg-white dark:bg-zinc-900 rounded-[28px] sm:rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-4 sm:p-10 shadow-sm max-w-3xl mx-auto">
        
        {/* Form Title & Notice */}
        <div className="space-y-2 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="pill-tag bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              Upload & Earn
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
              • PDF only • Up to {MAX_FILE_SIZE_MB}MB
            </span>
          </div>
          <h2 className="font-cal text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
            Upload a Past Exam Paper
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            Pick your subject and exam year, then attach your PDF. Once our admin checks and approves it, you earn 10 credits towards real cash rewards!
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-900">
              <p className="font-bold">Upload Error</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Section 1: Academic Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            1. Academic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Program */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Program *</label>
              <select
                value={program}
                onChange={e => {
                  const p = e.target.value;
                  setProgram(p);
                  if ((p === 'M.Sc.' || p === 'Ph.D.') && academicYear > 2) {
                    setAcademicYear(1);
                    setSemester(1);
                  }
                  if ((p === 'M.Sc.' || p === 'Ph.D.') && schoolId === 'foundation') {
                    setSchoolId('data-science');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              >
                <option value="BS-MS">BS-MS Dual Degree (10 Sem)</option>
                <option value="M.Sc.">M.Sc. (4 Sem)</option>
                <option value="Ph.D.">Ph.D. / I-Ph.D. (Max 4 Sem Coursework)</option>
              </select>
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Academic Year *</label>
              <select
                value={academicYear}
                onChange={e => {
                  const y = Number(e.target.value);
                  setAcademicYear(y);
                  setSemester(y * 2 - 1);
                  if (program === 'BS-MS' && y <= 2) setSchoolId('foundation');
                }}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              >
                {(program === 'BS-MS' ? [1, 2, 3, 4, 5] : [1, 2]).map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Semester *</label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              >
                {[academicYear * 2 - 1, academicYear * 2].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* School & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* School */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">School / Department *</label>
              <select
                value={schoolId}
                onChange={e => {
                  setSchoolId(e.target.value);
                  const first = ALL_SUBJECTS.find(s => s.schoolId === e.target.value);
                  if (first) {
                    setSubjectName(first.name);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              >
                {SCHOOLS.map(sch => (
                  <option key={sch.id} value={sch.id}>{sch.name}</option>
                ))}
              </select>
            </div>

            {/* Subject with "Can't find" action */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700">Subject Name *</label>
                <button
                  type="button"
                  onClick={() => setIsSuggestOpen(true)}
                  className="text-[11px] text-zinc-600 hover:text-black font-semibold underline cursor-pointer"
                >
                  Can&apos;t find my subject?
                </button>
              </div>
              <select
                value={subjectName}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              >
                {filteredSubjects.map(sub => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name} {sub.code ? `(${sub.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Examination Details */}
        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            2. Examination Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Exam Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Exam Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'end-sem', label: 'End-Semester' },
                  { value: 'mid-sem', label: 'Mid-Semester' }
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setExamType(item.value as any)}
                    className={`py-2.5 px-3 text-[11px] sm:text-xs font-semibold rounded-xl border transition-all cursor-pointer text-center truncate ${
                      examType === item.value
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Exam Year *</label>
              <select
                value={examYear}
                onChange={e => setExamYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
              >
                {EXAM_YEARS.map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Batch */}
          <div className="pt-1">
            <label className="text-xs font-semibold text-zinc-700">Batch / Curriculum Year (Optional)</label>
            <input
              type="text"
              value={batch}
              onChange={e => setBatch(e.target.value)}
              placeholder="e.g. Batch 23 or 2022 Curriculum"
              className="w-full mt-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-950 transition-colors"
            />
          </div>
        </div>

        {/* Section 3: File Upload */}
        <div className="space-y-4 pt-4 border-t border-zinc-100">
          <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
            3. Question Paper Document (PDF)
          </h3>

          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 text-center cursor-pointer transition-all ${
              file
                ? 'border-zinc-900 bg-zinc-50/80'
                : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 hover:bg-zinc-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-black text-white flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-zinc-950 truncate max-w-[170px] sm:max-w-xs">{file.name}</p>
                  <p className="text-[11px] sm:text-xs text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for upload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 ml-2 sm:ml-4 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-600">
                  <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-900">
                    Click to select PDF or drag and drop here
                  </p>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                    Clear, readable scans preferred (Max file size: {MAX_FILE_SIZE_MB} MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Contributor Details & Anonymous Toggle */}
        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
            4. Your Name & Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                id="anonymous-toggle"
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-black dark:text-white focus:ring-zinc-900 cursor-pointer"
              />
              <label htmlFor="anonymous-toggle" className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                Upload anonymously (your name will not be shown publicly)
              </label>
            </div>

            {!isAnonymous && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Your Name or Display Name
                </label>
                <input
                  type="text"
                  value={uploaderName}
                  onChange={e => setUploaderName(e.target.value)}
                  placeholder="e.g. Rohan Jena (or leave blank to show 'Student Contributor')"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs sm:text-sm font-medium text-zinc-900 dark:text-white focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-zinc-950 dark:focus:border-white transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-normal">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Checked by admin • +10 credits awarded upon approval</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-pill-black text-sm px-8 py-3 w-full sm:w-auto disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading paper...
              </span>
            ) : (
              'Submit Exam Paper'
            )}
          </button>
        </div>
      </form>

      {/* Suggest Modal */}
      <SubjectSuggestModal
        isOpen={isSuggestOpen}
        onClose={() => setIsSuggestOpen(false)}
        defaultSchool={schoolId}
        defaultSemester={semester}
      />
    </>
  );
}
