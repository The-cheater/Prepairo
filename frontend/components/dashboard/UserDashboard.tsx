'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/frontend/components/auth/AuthProvider';
import { PaperRecord } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';
import PaperModal from '@/frontend/components/papers/PaperModal';
import {
  User,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  UploadCloud,
  FileText,
  Eye,
  Download,
  Camera,
  Edit2,
  Check,
  CreditCard,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';

const REDEEM_THRESHOLD = 499;
const MAX_AVATAR_SIZE_BYTES = 500 * 1024; // strictly 500 KB limit

export default function UserDashboard() {
  const { user, profile, updateProfile, refreshProfile, openProfileSetup } = useAuth();
  const [papers, setPapers] = useState<PaperRecord[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<PaperRecord | null>(null);

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCourse, setEditCourse] = useState('BS-MS');
  const [editDept, setEditDept] = useState('Foundation');
  const [avatarError, setAvatarError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redeem modal state
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState('');
  const [redeemSubmitting, setRedeemSubmitting] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState('');
  const [redeemError, setRedeemError] = useState('');

  // Paper filter tab
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Load user's papers
  useEffect(() => {
    async function fetchUserPapers() {
      if (!profile) return;
      setIsLoadingPapers(true);
      try {
        // Fetch papers by uploader user
        const res = await fetch(getApiUrl(`/api/papers?user=${encodeURIComponent(profile.username)}`));
        if (res.ok) {
          const data = await res.json();
          setPapers(data.papers || []);
        }
      } catch (err) {
        console.warn('Failed to fetch user papers:', err);
      } finally {
        setIsLoadingPapers(false);
      }
    }
    fetchUserPapers();
  }, [profile]);

  // Sync edit form with profile
  useEffect(() => {
    if (profile) {
      setEditName(profile.fullName || '');
      setEditCourse(profile.course || 'BS-MS');
      setEditDept(profile.department || 'Foundation');
    }
  }, [profile]);

  // Handle avatar upload (< 500 KB)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > MAX_AVATAR_SIZE_BYTES) {
        setAvatarError(`Image size is ${(file.size / 1024).toFixed(1)} KB. Maximum allowed size is 500 KB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        await updateProfile({ avatarUrl: base64 });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: editName.trim(),
      course: editCourse,
      department: editDept,
    });
    setIsEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Submit Redeem Request
  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setRedeemError('');
    setRedeemMessage('');

    if (!paymentInfo.trim()) {
      setRedeemError('Please provide your UPI ID or bank account details for transfer.');
      return;
    }

    setRedeemSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/redeem'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          amountCredits: REDEEM_THRESHOLD,
          paymentDetails: paymentInfo.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setRedeemMessage('Redemption request submitted! Admin will verify and process transfer within 24–48 hours.');
        await refreshProfile();
      } else {
        setRedeemError(data.error || 'Failed to submit redemption request.');
      }
    } catch {
      setRedeemError('Network error. Please try again later.');
    } finally {
      setRedeemSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-cal text-2xl font-bold text-zinc-900">Sign In to View Dashboard</h2>
        <p className="text-sm text-zinc-500">Track your uploaded question papers, check verification feedback, and redeem reward credits.</p>
        <Link href="/login" className="btn-pill-black text-xs px-6 py-3 inline-block">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const filteredPapers = papers.filter((p) => {
    if (filterTab === 'all') return true;
    return p.status === filterTab;
  });

  const pendingCount = papers.filter((p) => p.status === 'pending').length;
  const verifiedCount = papers.filter((p) => p.status === 'verified').length;
  const rejectedCount = papers.filter((p) => p.status === 'rejected').length;

  const currentCredits = profile.totalCredits || 0;
  const progressPercent = Math.min(100, Math.round((currentCredits / REDEEM_THRESHOLD) * 100));
  const canRedeem = currentCredits >= REDEEM_THRESHOLD;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dashboard Top Grid: Profile & Credit Balance Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Student Profile Card */}
        <div className="lg:col-span-5 bg-card text-card-foreground rounded-[28px] sm:rounded-[32px] border border-border p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start justify-between">
            <span className="pill-tag bg-muted text-foreground border border-border">
              Student Profile
            </span>
            <button
              onClick={openProfileSetup}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Avatar and Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-zinc-200 bg-zinc-950 flex items-center justify-center flex-shrink-0 shadow-sm">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold font-cal">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload avatar overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 text-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-semibold cursor-pointer"
                title="Upload profile picture (Max 500 KB)"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Change</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="space-y-1">
              <h2 className="font-cal text-xl sm:text-2xl font-bold text-zinc-950">
                {profile.fullName}
              </h2>
              <p className="text-xs font-mono text-zinc-400">@{profile.username}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {profile.course}
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {profile.department}
                </span>
                {profile.batch && (
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                    {profile.batch}
                  </span>
                )}
              </div>
            </div>
          </div>

          {avatarError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{avatarError}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <p className="text-[11px] text-zinc-400">
            Profile photo size must be less than <strong>500 KB</strong>.
          </p>

          {/* Edit Form */}
          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-4 border-t border-zinc-100 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Course</label>
                  <select
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  >
                    <option value="BS-MS">BS-MS</option>
                    <option value="M.Sc.">M.Sc.</option>
                    <option value="I-Ph.D.">I-Ph.D.</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">Department</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="School of Biology">School of Biology</option>
                    <option value="School of Chemistry">School of Chemistry</option>
                    <option value="School of Physics">School of Physics</option>
                    <option value="School of Mathematics">School of Mathematics</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Earth Sciences">Earth Sciences</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-pill-black text-xs py-2 mt-2"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* Quick upload CTA */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Have more papers to share?</span>
            <Link
              href="/upload"
              className="btn-pill-black text-xs px-3.5 py-1.5 flex items-center gap-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Paper</span>
            </Link>
          </div>
        </div>

        {/* Right: Gamified Credits & Redeem Box */}
        <div className="lg:col-span-7 bg-zinc-950 text-white rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          
          <div className="flex items-center justify-between">
            <span className="pill-tag bg-white/10 text-amber-400 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              Private Student Credits
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Threshold: {REDEEM_THRESHOLD} Credits
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="font-cal text-5xl sm:text-6xl font-bold tracking-tight text-white">
                {currentCredits}
              </span>
              <span className="text-amber-400 font-bold text-lg">Credits Available</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg font-normal">
              Earn <strong className="text-white">10 credits</strong> for every question paper approved by the admin. Credits are visible only on your private dashboard and unlock real monetary redemption at 499 credits!
            </p>
          </div>

          {/* Progress Bar towards 499 */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Progress to Redeem Threshold</span>
              <span className="font-mono font-bold text-amber-400">
                {currentCredits} / {REDEEM_THRESHOLD} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Redeem Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-zinc-800/80">
            <div>
              {canRedeem ? (
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Redeem threshold reached! You can now request your payout.
                </p>
              ) : (
                <p className="text-xs text-zinc-400">
                  Earn <strong className="text-white">{REDEEM_THRESHOLD - currentCredits} more credits</strong> ({Math.ceil((REDEEM_THRESHOLD - currentCredits) / 10)} approved papers) to redeem cash value.
                </p>
              )}
            </div>

            <button
              onClick={() => setIsRedeemOpen(true)}
              disabled={!canRedeem}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                canRedeem
                  ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Redeem Credits</span>
            </button>
          </div>

          {/* Ambient Glow */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

      </div>

      {/* Uploaded Question Papers Section */}
      <div className="space-y-6">
        
        {/* Section Header & Status Tabs */}
        <div className="bg-white rounded-[32px] border border-zinc-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="pill-tag bg-zinc-100 text-zinc-800 border border-zinc-200">
              Contribution History
            </span>
            <h3 className="font-cal text-2xl font-bold text-zinc-950 mt-1">
              Your Uploaded Question Papers
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-normal">
              Track real-time status of your submissions: verified, pending admin check, or disapproved with reviewer comments.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {[
              { id: 'all', label: `All (${papers.length})` },
              { id: 'verified', label: `Passed (${verifiedCount})` },
              { id: 'pending', label: `Waiting (${pendingCount})` },
              { id: 'rejected', label: `Disapproved (${rejectedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap font-medium ${
                  filterTab === tab.id
                    ? 'bg-black text-white border-black shadow-xs font-semibold'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Papers List */}
        {isLoadingPapers ? (
          <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
            <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-500">Loading your uploaded papers...</p>
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto" />
            <h4 className="font-cal text-lg font-bold text-zinc-900">
              {filterTab === 'all' ? 'No Uploaded Papers Yet' : `No ${filterTab} papers`}
            </h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Upload past examination question papers to help your peers and earn 10 credits for every paper approved.
            </p>
            <div className="pt-2">
              <Link href="/upload" className="btn-pill-black text-xs px-5 py-2 inline-flex">
                Upload Your First Paper
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPapers.map((paper) => {
              const isVerified = paper.status === 'verified';
              const isPending = paper.status === 'pending';
              const isRejected = paper.status === 'rejected';

              return (
                <div
                  key={paper.id}
                  className={`bg-white rounded-[28px] border p-6 shadow-sm transition-all space-y-4 ${
                    isRejected
                      ? 'border-rose-200 bg-rose-50/20'
                      : isVerified
                      ? 'border-zinc-200'
                      : 'border-amber-200/80 bg-amber-50/10'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Paper Info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700'
                            : isRejected
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <FileText className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-cal text-lg font-bold text-zinc-950">
                            {paper.subjectName}
                          </h4>
                          {paper.courseCode && (
                            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold">
                              {paper.courseCode}
                            </span>
                          )}
                          
                          {/* Status Badge */}
                          {isVerified && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Passed the check (+10 credits)
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Waiting for admin check
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Disapproved
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-500">
                          {paper.program} • Semester {paper.semester} • {formatExamType(paper.examType)} • Year {paper.examYear}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          Uploaded on {new Date(paper.uploadedAt).toLocaleDateString()} • File: {paper.fileName}
                        </p>
                      </div>
                    </div>

                    {/* View & Download Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                      <button
                        onClick={() => setSelectedPaper(paper)}
                        className="btn-pill-white text-xs px-3.5 py-1.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View In-App</span>
                      </button>

                      <a
                        href={paper.fileUrl || '#'}
                        download={paper.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-pill-black text-xs px-3.5 py-1.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>

                  {/* PROMINENT REJECTION / DISAPPROVAL COMMENT CALLOUT */}
                  {isRejected && (
                    <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-900">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        <span>Admin Feedback & Reason for Disapproval:</span>
                      </div>
                      <p className="text-rose-800 pl-5 leading-relaxed">
                        &ldquo;{paper.adminComment || paper.rejectionReason || 'Document is illegible, corrupted, or does not match examination metadata.'}&rdquo;
                      </p>
                      <p className="text-[11px] text-rose-600 pl-5 pt-1">
                        💡 <strong>Next steps:</strong> You can re-upload this paper with clearer pages or updated exam details to earn your 10 credits!
                      </p>
                    </div>
                  )}

                  {/* Approved Note */}
                  {isVerified && paper.adminComment && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span><strong>Admin note:</strong> {paper.adminComment}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* In-App PDF Viewer Modal */}
      {selectedPaper && (
        <PaperModal paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
      )}

      {/* Redeem Credits Modal */}
      {isRedeemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-zinc-200 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="pill-tag bg-amber-50 text-amber-800 border border-amber-200">
                Cash Payout Request
              </span>
              <h3 className="font-cal text-2xl font-bold text-zinc-950">
                Redeem {REDEEM_THRESHOLD} Credits
              </h3>
              <p className="text-xs text-zinc-500 font-normal">
                Congratulations on reaching the milestone! Enter your payment details (UPI ID or Bank Account) below.
              </p>
            </div>

            {redeemError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {redeemError}
              </div>
            )}

            {redeemMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold">{redeemMessage}</p>
                <p className="text-zinc-600 text-[11px]">
                  Admin has received your request and will process the transfer shortly.
                </p>
                <button
                  onClick={() => setIsRedeemOpen(false)}
                  className="btn-pill-black text-xs px-5 py-2 mt-2"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleRedeemSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">
                    Payment Transfer Details (UPI ID / Bank Account)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@oksbi or GPay / PhonePe number"
                    value={paymentInfo}
                    onChange={(e) => setPaymentInfo(e.target.value)}
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                  />
                  <p className="text-[11px] text-zinc-400">
                    We will send the payout directly to this UPI handle / account.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRedeemOpen(false)}
                    className="btn-pill-white text-xs px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={redeemSubmitting}
                    className="btn-pill-black text-xs px-5 py-2 disabled:opacity-50"
                  >
                    {redeemSubmitting ? 'Submitting...' : 'Confirm Redemption'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
