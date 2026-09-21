'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthProvider';
import { Sparkles, Camera, Check, X, AlertCircle, GraduationCap, Building2, Calendar, User } from 'lucide-react';

const MAX_AVATAR_SIZE_BYTES = 500 * 1024; // strictly 500 KB limit

export default function ProfileSetupModal() {
  const { profile, updateProfile, isProfileSetupOpen, closeProfileSetup } = useAuth();

  const [name, setName] = useState('');
  const [course, setCourse] = useState('BS-MS');
  const [department, setDepartment] = useState('Foundation');
  const [batch, setBatch] = useState('Batch 2026');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when profile loads or modal opens
  useEffect(() => {
    if (profile) {
      setName(profile.fullName || '');
      setCourse(profile.course || 'BS-MS');
      setDepartment(profile.department || 'Foundation');
      setBatch(profile.batch || 'Batch 2026');
      setAvatarUrl(profile.avatarUrl || '');
    }
  }, [profile, isProfileSetupOpen]);

  if (!isProfileSetupOpen || !profile) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_AVATAR_SIZE_BYTES) {
        setAvatarError(`Image size is ${(file.size / 1024).toFixed(1)} KB. Maximum allowed size is 500 KB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setAvatarUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setAvatarError('Please provide your name.');
      return;
    }

    setIsSaving(true);
    setAvatarError('');

    const res = await updateProfile({
      fullName: name.trim(),
      course,
      department,
      batch,
      avatarUrl,
    });

    setIsSaving(false);
    if (res?.error) {
      setAvatarError(res.error);
    } else {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        closeProfileSetup();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-card text-card-foreground rounded-[32px] border border-border p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={closeProfileSetup}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" /> Student Profile Setup
          </div>
          <h2 className="font-cal text-2xl sm:text-3xl font-bold tracking-tight">
            Tell us about yourself
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Your details help personalize your verified question papers, credits, and community acknowledgments.
          </p>
        </div>

        {avatarError && (
          <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{avatarError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center justify-center gap-2 py-1">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center shadow-inner">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
                title="Change photo (< 500 KB)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileChange}
            />
            <p className="text-[11px] text-muted-foreground">
              Google picture fetched automatically • Custom image under 500 KB
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rohan Jena"
              className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              required
            />
          </div>

          {/* Degree / Course & Year / Batch in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" /> Course / Program
              </label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="BS-MS">BS-MS Dual Degree</option>
                <option value="MSc">M.Sc.</option>
                <option value="iPhD">Integrated Ph.D.</option>
                <option value="PhD">Ph.D.</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Year / Batch
              </label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="Batch 2026">26 Batch (Current)</option>
                <option value="Batch 2025">25 Batch</option>
                <option value="Batch 2024">24 Batch</option>
                <option value="Batch 2023">23 Batch</option>
                <option value="Batch 2022">22 Batch</option>
                <option value="Batch 2021">21 Batch</option>
                <option value="Batch 2020">20 Batch</option>
                <option value="PhD 26">PhD 26 Batch</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>

          {/* Department / School */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> School / Major Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            >
              <option value="Foundation">Foundation (Years 1 & 2 Core)</option>
              <option value="Biological Sciences">School of Biological Sciences</option>
              <option value="Chemical Sciences">School of Chemical Sciences</option>
              <option value="Physical Sciences">School of Physical Sciences</option>
              <option value="Mathematical Sciences">School of Mathematical Sciences</option>
              <option value="Data Science">School of Data Science</option>
              <option value="Earth Sciences">School of Earth, Environmental & Planetary Sciences</option>
            </select>
          </div>

          {/* Save Action */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeProfileSetup}
              className="px-5 py-2.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Remind Later
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : isSaving ? (
                <span>Saving details...</span>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
