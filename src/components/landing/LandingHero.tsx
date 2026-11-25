'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { ArrowRight, CheckCircle2, Bot, Sparkles, TrendingUp, Clock } from 'lucide-react';

export function LandingHero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-20 pb-24 px-6">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Tiered AI Payment Follow-Up Bot</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          {t.landing.hero.title}
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t.landing.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-all"
          >
            <span>{t.landing.hero.cta}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <span>{t.landing.hero.secondaryCta}</span>
          </a>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>%40 Daha Hızlı Tahsilat</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-sm">
            <Bot className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Gemini AI Kademeli Tonlama</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-sm">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Otomatik Vade Sayacı</span>
          </div>
        </div>
      </div>
    </section>
  );
}
