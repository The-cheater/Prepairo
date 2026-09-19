import React from 'react';
import RequestBoard from '@/frontend/components/requests/RequestBoard';

export const metadata = {
  title: 'Request a Paper | IISER TVM PYQ Repository',
  description: 'Community board where students request missing previous year question papers and peers fulfill them.'
};

export default function RequestsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RequestBoard />
    </div>
  );
}
