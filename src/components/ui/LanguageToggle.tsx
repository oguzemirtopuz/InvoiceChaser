'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all duration-200"
      aria-label="Toggle language"
    >
      <Globe className="w-3.5 h-3.5 text-indigo-400" />
      <span className={language === 'tr' ? 'text-indigo-400 font-bold' : 'text-zinc-400'}>TR</span>
      <span className="text-zinc-600">/</span>
      <span className={language === 'en' ? 'text-indigo-400 font-bold' : 'text-zinc-400'}>EN</span>
    </button>
  );
}
