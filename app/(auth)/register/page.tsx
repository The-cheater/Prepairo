import React from 'react';
import RegisterForm from '@/frontend/components/auth/RegisterForm';

export const metadata = {
  title: 'Register Student Account | Prepairo — IISER TVM Question Paper Repository',
  description: 'Join Prepairo to upload past exam papers, earn 10 credits per approved paper, and redeem rewards.'
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}
