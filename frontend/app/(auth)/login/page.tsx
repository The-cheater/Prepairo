import React from 'react';
import LoginForm from '@/frontend/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In | Prepairo — IISER TVM Question Paper Repository',
  description: 'Sign in to Prepairo to manage your uploaded question papers, check verification status, view credits, and redeem rewards.'
};

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
}
