'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { FilePlus2, Sparkles, Trophy } from 'lucide-react';

export function LandingHowItWorks() {
  const { t } = useLanguage();

  const stepIcons = [
    <FilePlus2 key="1" className="w-6 h-6 text-indigo-400" />,
    <Sparkles key="2" className="w-6 h-6 text-violet-400" />,
    <Trophy key="3" className="w-6 h-6 text-emerald-400" />,
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            {t.landing.howItWorks.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {t.landing.howItWorks.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col items-center text-center group hover:border-slate-700 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {stepIcons[idx]}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
