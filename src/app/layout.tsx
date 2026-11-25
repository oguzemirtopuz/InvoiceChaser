import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InvoiceChaser — Autonomous Invoice & Payment Follow-Up Bot',
  description: 'Collect overdue invoices faster without awkward conversations. Automated, progressive AI reminder emails in Turkish and English.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased`}>
        <LanguageProvider>
          {children}
          <Toaster position="top-right" theme="dark" richColors />
        </LanguageProvider>
      </body>
    </html>
  );
}
