'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { mockInvoices } from '@/lib/mock-data';
import type { Invoice } from '@/lib/types';
import { SimulatorPanel } from '@/components/simulator/SimulatorPanel';
import { Sparkles, Bot, Info } from 'lucide-react';

export default function SimulatorPage() {
  const { t } = useLanguage();
  const [invoices] = useState<Invoice[]>(mockInvoices);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>{t.simulator.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {t.simulator.subtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Bot className="w-4 h-4" />
          <span>Gemini 1.5 Flash Cognitive Engine</span>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span>
          Bu simülatör, faturanın durumuna ve seçilen kademeye göre yapay zekanın üreteceği hatırlatma e-postasını ve yanıt gecikmesini test etmenizi sağlar.
        </span>
      </div>

      {/* Simulator Component */}
      <SimulatorPanel invoices={invoices} />
    </div>
  );
}
