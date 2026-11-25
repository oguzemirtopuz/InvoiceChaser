'use client';

import React from 'react';
import type { InvoiceStatus } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();

  const configs: Record<InvoiceStatus, { label: string; icon: React.ReactNode; className: string }> = {
    paid: {
      label: t.invoices.status.paid,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    upcoming: {
      label: t.invoices.status.upcoming,
      icon: <Clock className="w-3.5 h-3.5 text-amber-400" />,
      className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    overdue: {
      label: t.invoices.status.overdue,
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
      className: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    },
    pending: {
      label: t.invoices.status.pending,
      icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
      className: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
