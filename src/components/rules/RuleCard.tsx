'use client';

import React from 'react';
import type { ReminderRule } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { Clock, ShieldAlert, Sparkles, Send } from 'lucide-react';

interface RuleCardProps {
  rule: ReminderRule;
  onToggle: (id: string) => void;
}

export function RuleCard({ rule, onToggle }: RuleCardProps) {
  const { t } = useLanguage();

  const tierMeta: Record<number, { icon: React.ReactNode; color: string; badge: string; name: string; desc: string }> = {
    1: {
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/20 bg-indigo-500/5',
      badge: t.rules.tiers.tier1.timing,
      name: t.rules.tiers.tier1.name,
      desc: t.rules.tiers.tier1.description,
    },
    2: {
      icon: <Send className="w-5 h-5 text-violet-400" />,
      color: 'border-violet-500/20 bg-violet-500/5',
      badge: t.rules.tiers.tier2.timing,
      name: t.rules.tiers.tier2.name,
      desc: t.rules.tiers.tier2.description,
    },
    3: {
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/20 bg-amber-500/5',
      badge: t.rules.tiers.tier3.timing,
      name: t.rules.tiers.tier3.name,
      desc: t.rules.tiers.tier3.description,
    },
    4: {
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'border-rose-500/20 bg-rose-500/5',
      badge: t.rules.tiers.tier4.timing,
      name: t.rules.tiers.tier4.name,
      desc: t.rules.tiers.tier4.description,
    },
  };

  const meta = tierMeta[rule.tier] || tierMeta[1];

  return (
    <div className={`p-6 rounded-2xl border ${meta.color} transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700/50">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.rules.tierPrefix} {rule.tier}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {meta.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">{meta.name}</h3>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          type="button"
          onClick={() => onToggle(rule.id)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            rule.enabled ? 'bg-indigo-600' : 'bg-slate-700'
          }`}
          role="switch"
          aria-checked={rule.enabled}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              rule.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-4">
        {meta.desc}
      </p>

      <div className="text-xs text-slate-500 flex items-center justify-between pt-3 border-t border-slate-800/80">
        <span>{t.invoices.table.status}: {rule.enabled ? t.rules.statusActive : t.rules.statusPassive}</span>
        <span className="font-mono text-indigo-400">Gemini 1.5 Flash</span>
      </div>
    </div>
  );
}
