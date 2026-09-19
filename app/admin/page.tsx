import React from 'react';
import AdminDashboard from '@/frontend/components/admin/AdminDashboard';

export const metadata = {
  title: 'Admin Verification Queue | Prepairo — IISER Thiruvananthapuram',
  description: 'Administrator dashboard for reviewing uploaded question papers, approving credits, and moderating content.'
};

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminDashboard />
    </div>
  );
}
