'use client';

import React, { useState, useEffect } from 'react';
import { store } from '@/frontend/store/store';
import { PaperRecord, SubjectSuggestion } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  Edit,
  Sparkles,
  Lock,
  LogOut,
  Send,
  MessageSquare,
  Award,
  Zap,
  Trash2
} from 'lucide-react';
import PaperModal from '@/frontend/components/papers/PaperModal';
import confetti from 'canvas-confetti';
import { getApiUrl } from '@/frontend/lib/api';

const ADMIN_STORAGE_KEY = 'prepairo_admin_authenticated';

export default function AdminDashboard() {
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected' | 'suggestions' | 'duplicates'>('pending');
  const [papers, setPapers] = useState<PaperRecord[]>([]);
  const [suggestions, setSuggestions] = useState<SubjectSuggestion[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperRecord | null>(null);
  const [editingPaper, setEditingPaper] = useState<PaperRecord | null>(null);

  // Approval Modal state
  const [approvingPaper, setApprovingPaper] = useState<PaperRecord | null>(null);
  const [approveComment, setApproveComment] = useState('');

  // Disapproval Modal state
  const [rejectingPaper, setRejectingPaper] = useState<PaperRecord | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  // Deletion Modal state
  const [deletingPaper, setDeletingPaper] = useState<PaperRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deletingPaper) return;
    setIsDeleting(true);
    try {
      await fetch(getApiUrl(`/api/papers/${deletingPaper.id}`), {
        method: 'DELETE',
      });
      store.deletePaper(deletingPaper.id);
      setDeletingPaper(null);
      refreshData();
    } catch (err) {
      console.warn('Failed to delete paper:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check admin session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuthed = sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
      setIsAdminAuthed(isAuthed);
    }
  }, []);

  // Fetch papers & suggestions from backend & store
  const refreshData = async () => {
    try {
      const res = await fetch(getApiUrl('/api/papers'));
      if (res.ok) {
        const data = await res.json();
        setPapers(data.papers || []);
      } else {
        setPapers(store.getPapers());
      }
    } catch {
      setPapers(store.getPapers());
    }

    try {
      const resSug = await fetch(getApiUrl('/api/suggestions'));
      if (resSug.ok) {
        const dataSug = await resSug.json();
        if (dataSug.suggestions && dataSug.suggestions.length > 0) {
          // Merge with any local storage suggestions
          const backendIds = new Set((dataSug.suggestions as SubjectSuggestion[]).map(s => s.id));
          const localOnly = store.getSuggestions().filter(s => !backendIds.has(s.id));
          setSuggestions([...dataSug.suggestions, ...localOnly]);
        } else {
          setSuggestions(store.getSuggestions());
        }
      } else {
        setSuggestions(store.getSuggestions());
      }
    } catch {
      setSuggestions(store.getSuggestions());
    }
  };

  useEffect(() => {
    if (isAdminAuthed) {
      refreshData();
      const unsub = store.subscribe(() => {
        refreshData();
      });
      return () => unsub();
    }
  }, [isAdminAuthed]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Credentials strictly as requested: rohanjena / 1234554321
    if (adminUsername.trim() === 'rohanjena' && adminPassword === '1234554321') {
      setIsAdminAuthed(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      }
    } else {
      setLoginError('Invalid admin credentials. Access restricted to authorized administrators.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthed(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  };

  // Approve paper with optional comment & award 10 credits
  const handleConfirmApproval = async () => {
    if (!approvingPaper) return;

    try {
      // 1. Update backend via PATCH
      await fetch(getApiUrl(`/api/papers/${approvingPaper.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'verified',
          comment: approveComment.trim() || 'Verified by admin. Excellent contribution!',
        }),
      });

      // 2. Update local store
      store.updatePaperStatus(approvingPaper.id, 'verified', undefined, approveComment.trim() || 'Verified by admin.');

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch {}

      setApprovingPaper(null);
      setApproveComment('');
      refreshData();
    } catch (err) {
      console.warn('Failed to approve paper:', err);
    }
  };

  // Disapprove paper with mandatory comment & reflect on user dashboard
  const handleConfirmDisapproval = async () => {
    if (!rejectingPaper) return;

    const comment = rejectComment.trim() || 'File is corrupted, illegible, or does not match examination metadata.';

    try {
      // 1. Update backend via PATCH
      await fetch(getApiUrl(`/api/papers/${rejectingPaper.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          comment: comment,
          rejectionReason: comment,
        }),
      });

      // 2. Update local store
      store.updatePaperStatus(rejectingPaper.id, 'rejected', comment, comment);

      setRejectingPaper(null);
      setRejectComment('');
      refreshData();
    } catch (err) {
      console.warn('Failed to disapprove paper:', err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPaper) {
      try {
        await fetch(getApiUrl(`/api/papers/${editingPaper.id}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingPaper),
        });
      } catch {}
      store.updatePaperMetadata(editingPaper.id, editingPaper);
      setEditingPaper(null);
      refreshData();
    }
  };

  const handleApproveSuggestion = async (id: string) => {
    try {
      await fetch(getApiUrl(`/api/suggestions/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          adminNotes: 'Approved by admin and added to catalog.',
        }),
      });
    } catch {}
    store.updateSuggestionStatus(id, 'approved', 'Approved by admin and added to catalog.');
    refreshData();
  };

  const handleRejectSuggestion = async (id: string) => {
    try {
      await fetch(getApiUrl(`/api/suggestions/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          adminNotes: 'Course is already present or invalid entry.',
        }),
      });
    } catch {}
    store.updateSuggestionStatus(id, 'rejected', 'Course is already present or invalid entry.');
    refreshData();
  };

  // If not authenticated as Admin, show Admin Login Screen
  if (!isAdminAuthed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[32px] border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-6">
          <div className="w-12 h-12 bg-zinc-950 text-white rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="font-cal text-2xl font-bold text-zinc-950">
              Admin Portal
            </h2>
            <p className="text-xs text-zinc-500">
              Enter administrator credentials to access the moderation dashboard.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Admin Username</label>
              <input
                type="text"
                required
                placeholder="rohanjena"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700">Admin Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-pill-black text-xs py-3 font-semibold mt-2 cursor-pointer"
            >
              Sign In to Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingPapers = papers.filter((p) => p.status === 'pending');
  const verifiedPapers = papers.filter((p) => p.status === 'verified');
  const rejectedPapers = papers.filter((p) => p.status === 'rejected');
  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending');

  // Detect duplicate groups
  const duplicateGroups: { key: string; papers: PaperRecord[] }[] = [];
  const map = new Map<string, PaperRecord[]>();
  papers.forEach((p) => {
    const key = `${p.subjectName.toLowerCase()}_${p.examYear}_${p.examType}_${p.semester}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  });
  map.forEach((items, key) => {
    if (items.length > 1) duplicateGroups.push({ key, papers: items });
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Admin Header */}
      <div className="bg-white rounded-[32px] border border-zinc-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="pill-tag bg-zinc-950 text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Prepairo Admin Moderation
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Logged in as rohanjena
            </span>
          </div>
          <h2 className="font-cal text-2xl sm:text-3xl font-bold text-zinc-950 mt-1">
            Verification & Quality Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl font-normal">
            Approve incoming papers to award 10 credits and display on Browse Papers, or disapprove with constructive comments that reflect on student dashboards.
          </p>
        </div>

        {/* Quick Stats Pill + Logout */}
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto pt-2 sm:pt-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-zinc-50 p-1.5 sm:p-2 rounded-2xl border border-zinc-200 text-xs">
            <div className="px-2.5 sm:px-3 py-1 bg-white rounded-xl shadow-xs text-amber-700 font-bold">
              {pendingPapers.length} Pending
            </div>
            <div className="px-2.5 sm:px-3 py-1 bg-white rounded-xl shadow-xs text-emerald-700 font-bold">
              {verifiedPapers.length} Verified
            </div>
            <div className="px-2.5 sm:px-3 py-1 bg-white rounded-xl shadow-xs text-rose-700 font-bold">
              {rejectedPapers.length} Disapproved
            </div>
          </div>

          <button
            onClick={handleAdminLogout}
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer flex-shrink-0"
            title="Sign out of admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'pending', label: `Incoming Papers (${pendingPapers.length})` },
          { id: 'verified', label: `Verified Catalog (${verifiedPapers.length})` },
          { id: 'rejected', label: `Disapproved Papers (${rejectedPapers.length})` },
          { id: 'suggestions', label: `Subject Suggestions (${pendingSuggestions.length})` },
          { id: 'duplicates', label: `Duplicate Scanner (${duplicateGroups.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pill-tag border transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-black text-white border-black shadow-sm'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content for Incoming Pending Papers */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingPapers.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-cal text-xl font-bold text-zinc-900">Verification Queue is Empty</h3>
              <p className="text-xs text-zinc-500 mt-1">
                All incoming student uploads have been reviewed and cataloged.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-cal text-lg font-bold text-zinc-950">
                          {paper.subjectName}
                        </h4>
                        {paper.courseCode && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold">
                            {paper.courseCode}
                          </span>
                        )}
                        <span className="pill-tag bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                          Awaiting Review
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {paper.program} • Semester {paper.semester} • {formatExamType(paper.examType)} • Year {paper.examYear}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Uploaded by: <strong>{paper.isAnonymous ? 'Anonymous' : paper.uploaderName}</strong>
                        {paper.uploaderId && ` (${paper.uploaderId})`} • {((paper.fileSizeBytes || 500000) / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
                    <button
                      onClick={() => setSelectedPaper(paper)}
                      className="btn-pill-white text-xs px-3 py-1.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                    <button
                      onClick={() => setEditingPaper(paper)}
                      className="btn-pill-white text-xs px-3 py-1.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    
                    {/* Disapprove button: Opens disapproval modal */}
                    <button
                      onClick={() => {
                        setRejectingPaper(paper);
                        setRejectComment('Scan is blurry, illegible, or incorrect examination type.');
                      }}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Disapprove
                    </button>

                    {/* Approve button: Opens approval modal */}
                    <button
                      onClick={() => {
                        setApprovingPaper(paper);
                        setApproveComment('Verified. High quality paper approved!');
                      }}
                      className="btn-pill-black text-xs px-4 py-1.5 flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve (+10 Credits)
                    </button>

                    {/* Delete button: Opens delete modal */}
                    <button
                      onClick={() => setDeletingPaper(paper)}
                      className="p-1.5 rounded-full text-zinc-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer flex-shrink-0"
                      title="Delete paper permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for Verified Catalog */}
      {activeTab === 'verified' && (
        <div className="bg-white rounded-[32px] border border-zinc-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedPapers.map((paper) => (
              <div key={paper.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="pill-tag bg-white text-zinc-800 border border-zinc-200 text-[10px]">
                    {paper.examType.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live on Browse
                  </span>
                </div>
                <h4 className="font-cal text-sm font-bold text-zinc-950">{paper.subjectName}</h4>
                <p className="text-[11px] text-zinc-500">
                  {paper.examYear} • Sem {paper.semester} • {paper.courseCode || 'No code'}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400 border-t border-zinc-200/60">
                  <span>By: {paper.uploaderName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPaper(paper)}
                      className="text-zinc-900 font-semibold hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeletingPaper(paper)}
                      className="text-zinc-400 hover:text-rose-600 font-semibold p-1 hover:bg-rose-50 rounded transition-colors"
                      title="Delete paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content for Disapproved Papers Tab */}
      {activeTab === 'rejected' && (
        <div className="space-y-4">
          {rejectedPapers.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-cal text-xl font-bold text-zinc-900">No Disapproved Papers</h3>
              <p className="text-xs text-zinc-500 mt-1">No uploads currently rejected.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rejectedPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="bg-white rounded-[28px] border border-rose-200 p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-cal text-base font-bold text-zinc-950">{paper.subjectName}</h4>
                        <span className="pill-tag bg-rose-50 text-rose-800 border border-rose-200 text-[10px]">
                          Disapproved
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {paper.program} • Semester {paper.semester} • {formatExamType(paper.examType)} • Year {paper.examYear} • Contributor: {paper.uploaderName}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="btn-pill-white text-xs px-3 py-1 flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={() => setDeletingPaper(paper)}
                        className="px-3 py-1 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Disapproval Comment Shown */}
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Comment shown to student:</span>
                      <p className="mt-0.5 text-rose-800">{paper.adminComment || paper.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for Subject Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          {pendingSuggestions.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="font-cal text-xl font-bold text-zinc-900">No Pending Suggestions</h3>
              <p className="text-xs text-zinc-500 mt-1">Students have not submitted any new subject requests.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSuggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="bg-white rounded-[28px] border border-zinc-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-cal text-lg font-bold text-zinc-950">{sug.suggestedName}</h4>
                      {sug.courseCode && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold">
                          {sug.courseCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">
                      School: {sug.schoolName} • Suggested for Semester {sug.semester}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Suggested by: {sug.studentName} • {sug.adminNotes}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
                    <button
                      onClick={() => handleRejectSuggestion(sug.id)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleApproveSuggestion(sug.id)}
                      className="btn-pill-black text-xs px-4 py-1.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content for Duplicate Scanner */}
      {activeTab === 'duplicates' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600">
            <p className="font-semibold text-zinc-900">Automated Duplicate Scanner:</p>
            <p>Scans the repository for papers sharing the same subject, exam year, exam type, and semester to prevent redundant files.</p>
          </div>

          {duplicateGroups.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-cal text-xl font-bold text-zinc-900">No Duplicates Found</h3>
              <p className="text-xs text-zinc-500 mt-1">All uploaded papers in the repository are unique.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {duplicateGroups.map((group) => (
                <div key={group.key} className="bg-white rounded-[28px] border border-amber-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Potential Duplicate Group: {group.papers[0].subjectName} ({group.papers[0].examYear} {group.papers[0].examType})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.papers.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-zinc-900">{p.fileName}</p>
                          <p className="text-zinc-500">By {p.uploaderName} • Status: {p.status}</p>
                        </div>
                        <button
                          onClick={() => setSelectedPaper(p)}
                          className="btn-pill-white text-xs px-3 py-1"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal (In-App PDF Viewer) */}
      {selectedPaper && (
        <PaperModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
      )}

      {/* Approval Modal */}
      {approvingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-zinc-200 p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <span className="pill-tag bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Paper
              </span>
              <h3 className="font-cal text-xl font-bold text-zinc-950">
                Confirm Approval: {approvingPaper.subjectName}
              </h3>
              <p className="text-xs text-zinc-500 font-normal">
                Approving this paper will publish it live to <strong>Browse Papers</strong> and award <strong className="text-amber-600">10 credits</strong> to the contributor ({approvingPaper.uploaderName}).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700">Optional Review Note</label>
              <textarea
                rows={2}
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                placeholder="e.g. Verified. Clean scan and accurate examination type!"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApprovingPaper(null)}
                className="btn-pill-white text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="btn-pill-black text-xs px-5 py-2 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Approve & Award 10 Credits</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disapproval Modal with Comment Field */}
      {rejectingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-zinc-200 p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <span className="pill-tag bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1 w-fit">
                <XCircle className="w-3.5 h-3.5" /> Disapprove Paper
              </span>
              <h3 className="font-cal text-xl font-bold text-zinc-950">
                Disapprove: {rejectingPaper.subjectName}
              </h3>
              <p className="text-xs text-zinc-500 font-normal">
                This paper will not appear on Browse Papers. The comment you provide below will be shown on the student&apos;s dashboard so they understand why it was disapproved.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700">
                Reason / Comment for Disapproval (Shown on User Dashboard)
              </label>
              <textarea
                rows={3}
                required
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                placeholder="Explain why the paper is being disapproved..."
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />

              {/* Quick Reason Suggestions */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase">Quick Feedback:</span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Scan is blurry or illegible.',
                    'Wrong course code or semester.',
                    'Duplicate of already existing paper.',
                    'Incomplete question paper pages.',
                    'Incorrect examination year specified.'
                  ].map((quick) => (
                    <button
                      key={quick}
                      type="button"
                      onClick={() => setRejectComment(quick)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    >
                      {quick}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingPaper(null)}
                className="btn-pill-white text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisapproval}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                Confirm Disapproval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-zinc-200 overflow-hidden p-6 sm:p-8">
            <h3 className="font-cal text-xl font-bold text-zinc-950 mb-4">Edit Paper Metadata</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700">Subject Name</label>
                <input
                  type="text"
                  value={editingPaper.subjectName}
                  onChange={(e) => setEditingPaper({ ...editingPaper, subjectName: e.target.value })}
                  className="w-full mt-1 px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Course Code</label>
                  <input
                    type="text"
                    value={editingPaper.courseCode || ''}
                    onChange={(e) => setEditingPaper({ ...editingPaper, courseCode: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700">Exam Year</label>
                  <input
                    type="number"
                    value={editingPaper.examYear}
                    onChange={(e) => setEditingPaper({ ...editingPaper, examYear: Number(e.target.value) })}
                    className="w-full mt-1 px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingPaper(null)}
                  className="btn-pill-white text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pill-black text-xs px-5 py-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-zinc-200 p-6 sm:p-8 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-cal text-xl font-bold text-zinc-950">
                Delete Question Paper?
              </h3>
              <p className="text-xs text-zinc-600 font-normal leading-relaxed">
                Are you sure you want to permanently delete <strong>{deletingPaper.subjectName}</strong> ({deletingPaper.examYear} {deletingPaper.examType})? This will remove the paper from both the verification queue and catalog.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-500 space-y-0.5">
              <p><strong>Contributor:</strong> {deletingPaper.uploaderName}</p>
              <p><strong>Status:</strong> {deletingPaper.status}</p>
              <p><strong>File:</strong> {deletingPaper.fileName}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPaper(null)}
                disabled={isDeleting}
                className="btn-pill-white text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-60 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
