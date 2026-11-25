'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Zap, Heart } from 'lucide-react';

export function LandingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-300">InvoiceChaser</span>
          <span className="text-xs text-slate-500">— {t.landing.footer.copyright}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>{t.landing.footer.builtBy}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
        </div>
      </div>
    </footer>
  );
}
