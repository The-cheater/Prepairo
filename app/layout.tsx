import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/frontend/components/navigation/Navbar';
import Footer from '@/frontend/components/navigation/Footer';
import { AuthProvider } from '@/frontend/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'Prepairo — Prepare Smarter, Together | IISER TVM Question Paper Platform',
  description: 'Prepairo: A gamified, student-driven previous year question paper platform for IISER Thiruvananthapuram. Upload verified past exams, earn credits, and climb the leaderboard.',
  keywords: ['Prepairo', 'IISER', 'IISER TVM', 'Previous Year Questions', 'PYQ', 'Question Papers', 'BS-MS', 'Physics', 'Biology', 'Chemistry', 'Data Science', 'Mathematics'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
