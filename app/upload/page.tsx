import React from 'react';
import UploadForm from '@/frontend/components/upload/UploadForm';

export const metadata = {
  title: 'Upload Question Paper | IISER TVM PYQ Repository',
  description: 'Contribute a previous year question paper to the IISER Thiruvananthapuram community repository.'
};

export default function UploadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <UploadForm />
    </div>
  );
}
