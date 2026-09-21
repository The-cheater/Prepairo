import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/frontend/components/navigation/Navbar';
import Footer from '@/frontend/components/navigation/Footer';
import { AuthProvider } from '@/frontend/components/auth/AuthProvider';
import GlobalBackground from '@/frontend/components/layout/GlobalBackground';

export const metadata: Metadata = {
  title: 'Prepairo — Prepare Smarter, Together',
  description: 'Upload your past exam papers, get verified by admins, and earn credits towards real cash rewards. Plus, get 10 free bonus credits as soon as you sign in!',
  keywords: ['Prepairo', 'Question Papers', 'Past Exams', 'PYQ', 'Student Notes', 'Exam Prep'],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900 relative">
        <GlobalBackground />
        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
