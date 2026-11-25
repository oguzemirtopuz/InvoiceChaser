'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { Bell, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function DashboardTopBar() {
  const { t } = useLanguage();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-300">
          {t.dashboard.topbar.welcome}, <span className="text-white font-bold">Oğuz Emir</span> 👋
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/simulator"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Simulator</span>
        </Link>

        <LanguageToggle />

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
          OE
        </div>
      </div>
    </header>
  );
}
