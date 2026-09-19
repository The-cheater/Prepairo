import React from 'react';
import UserDashboard from '@/frontend/components/dashboard/UserDashboard';

export const metadata = {
  title: 'Student Dashboard | Prepairo — IISER TVM Question Paper Platform',
  description: 'Manage your uploaded question papers, check verification and disapproval status with admin comments, view credits, and redeem cash rewards.'
};

export default function DashboardPage() {
  return <UserDashboard />;
}
