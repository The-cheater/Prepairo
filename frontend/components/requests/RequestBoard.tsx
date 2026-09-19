'use client';

import React, { useState, useEffect } from 'react';
import { PaperRequest } from '@/backend/models/mock-papers';
import { formatExamType } from '@/frontend/lib/utils';
import { HelpCircle, CheckCircle2, Upload, Plus, Calendar, GraduationCap, MessageSquare } from 'lucide-react';
import NewRequestModal from './NewRequestModal';
import Link from 'next/link';
import { getApiUrl } from '@/frontend/lib/api';

export default function RequestBoard() {
  const [requests, setRequests] = useState<PaperRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'fulfilled'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const statusParam = filter === 'all' ? '' : `?status=${filter}`;
      const res = await fetch(getApiUrl(`/api/requests${statusParam}`));
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.warn('Failed to fetch requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const handleFulfill = async (id: string) => {
    try {
      await fetch(getApiUrl(`/api/requests/${id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'fulfilled' })
      });
    } catch (err) {
      console.warn('Failed to fulfill request:', err);
    }
  };

  const handleNewRequestCreated = () => {
    setIsModalOpen(false);
    fetchRequests();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-white rounded-[28px] sm:rounded-[32px] border border-zinc-200 p-5 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="pill-tag bg-zinc-100 text-zinc-900 border border-zinc-200">
              Community Board
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              • Seniors & Alumni Helping Juniors
            </span>
          </div>
          <h2 className="font-cal text-2xl sm:text-3xl font-bold text-zinc-950">
            Request a Missing Paper
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl font-normal">
            Can&apos;t find a question paper you need? Post a request here. Any student, senior, or alumnus who has it can upload and fulfill the request.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-pill-black text-xs px-5 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto flex-shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Request</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 overflow-x-auto no-scrollbar gap-3">
        <div className="flex items-center gap-2 flex-shrink-0">
          {[
            { id: 'all', label: 'All Requests' },
            { id: 'open', label: 'Open Requests' },
            { id: 'fulfilled', label: 'Fulfilled' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`pill-tag border transition-all cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-zinc-400 font-mono flex-shrink-0">
          {requests.length} {requests.length === 1 ? 'request' : 'requests'}
        </span>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-500">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-zinc-200 p-12 text-center">
          <HelpCircle className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-cal text-lg font-bold text-zinc-900">No requests found</h3>
          <p className="text-xs text-zinc-500 mt-1">
            There are currently no active requests matching this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map(req => (
            <div
              key={req.id}
              className="bg-white rounded-[28px] border border-zinc-200/90 p-6 shadow-sm flex flex-col justify-between hover-lift transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="pill-tag bg-zinc-100 text-zinc-800 border border-zinc-200">
                    {formatExamType(req.examType)}
                  </span>

                  {req.status === 'open' ? (
                    <span className="pill-tag bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Looking for paper
                    </span>
                  ) : (
                    <span className="pill-tag bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Fulfilled
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-cal text-lg font-bold text-zinc-950">
                    {req.subjectName}
                  </h3>
                  {req.courseCode && (
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 mt-1 inline-block">
                      {req.courseCode}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Exam: {req.examYear}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Semester {req.semester}</span>
                  </div>
                </div>

                {req.notes && (
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100 text-xs text-zinc-600 flex items-start gap-2 mt-2">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
                    <p className="italic">{req.notes}</p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  Requested by {req.requesterName}
                </span>

                {req.status === 'open' ? (
                  <Link
                    href={`/upload`}
                    onClick={() => handleFulfill(req.id)}
                    className="btn-pill-black text-xs py-1.5 px-3.5 flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Fulfill Request</span>
                  </Link>
                ) : (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Paper Uploaded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      <NewRequestModal
        isOpen={isModalOpen}
        onClose={handleNewRequestCreated}
      />
    </div>
  );
}
