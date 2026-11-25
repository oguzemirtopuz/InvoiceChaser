'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { mockRules } from '@/lib/mock-data';
import type { ReminderRule } from '@/lib/types';
import { RuleCard } from '@/components/rules/RuleCard';
import { Sliders, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function RulesPage() {
  const { t } = useLanguage();
  const [rules, setRules] = useState<ReminderRule[]>(mockRules);

  const handleToggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newState = !r.enabled;
          toast.success(
            `${r.name} kuralı ${newState ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`
          );
          return { ...r, enabled: newState };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-400" />
            <span>{t.rules.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {t.rules.subtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Kademeli Akıllı Koruma Aktif</span>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} onToggle={handleToggle} />
        ))}
      </div>

      {/* Info Card */}
      <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-start gap-4">
        <CheckCircle2 className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <h4 className="font-bold text-white mb-1">
            Nasıl Çalışır?
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Cron servisi her gün sabah saat 09:00'da çalışır. Vadesi gelen faturalar için yukarıda aktif olan kurallara göre yapay zeka tarafından özelleştirilmiş e-postalar otomatik olarak müşterilerinize gönderilir. Müşteri ödeme yaptığında hatırlatma serisi anında sonlanır.
          </p>
        </div>
      </div>
    </div>
  );
}
