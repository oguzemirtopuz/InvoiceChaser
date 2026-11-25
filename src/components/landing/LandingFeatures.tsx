'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { MessageSquareText, Globe2, CheckCircle, BarChart3 } from 'lucide-react';

export function LandingFeatures() {
  const { t } = useLanguage();

  const icons = [
    <MessageSquareText key="1" className="w-6 h-6 text-indigo-400" />,
    <Globe2 key="2" className="w-6 h-6 text-violet-400" />,
    <CheckCircle key="3" className="w-6 h-6 text-emerald-400" />,
    <BarChart3 key="4" className="w-6 h-6 text-sky-400" />,
  ];

  return (
    <section className="py-20 px-6 border-t border-slate-900 bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            {t.landing.features.title}
          </h2>
          <p className="text-slate-400">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.landing.features.items.map((feat, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {icons[idx]}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
