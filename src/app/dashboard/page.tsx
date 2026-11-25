'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { mockInvoices, formatAmount, formatDate } from '@/lib/mock-data';
import type { Invoice } from '@/lib/types';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusBadge } from '@/components/invoices/StatusBadge';
import { AddInvoiceModal } from '@/components/invoices/AddInvoiceModal';
import {
  Receipt,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardOverviewPage() {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Metrik hesaplamaları
  const totalCount = invoices.length;
  const overdueCount = invoices.filter((i) => i.status === 'overdue').length;
  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const collectionRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  const pendingAmount = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const handleMarkPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'paid', paidAt: new Date().toISOString() } : inv
      )
    );
    toast.success(t.invoices.toasts.markedPaid);
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices((prev) => [newInv, ...prev]);
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t.dashboard.overview.title}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {t.dashboard.overview.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/simulator"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Simülatör</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.invoices.addInvoice}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t.dashboard.overview.metrics.totalInvoices}
          value={totalCount}
          change={t.dashboard.overview.changes.thisWeek}
          trend="up"
          accent="indigo"
          icon={<Receipt className="w-5 h-5 text-indigo-400" />}
        />
        <MetricCard
          label={t.dashboard.overview.metrics.pendingAmount}
          value={formatAmount(pendingAmount, 'TRY')}
          change={t.dashboard.overview.changes.pendingCollection}
          trend="neutral"
          accent="amber"
          icon={<DollarSign className="w-5 h-5 text-amber-400" />}
        />
        <MetricCard
          label={t.dashboard.overview.metrics.overdueCount}
          value={overdueCount}
          change={overdueCount > 0 ? t.dashboard.overview.changes.interventionNeeded : t.dashboard.overview.changes.allClean}
          trend={overdueCount > 0 ? 'down' : 'up'}
          accent="rose"
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
        />
        <MetricCard
          label={t.dashboard.overview.metrics.collectionRate}
          value={`%${collectionRate}`}
          change={t.dashboard.overview.changes.rateIncrease}
          trend="up"
          accent="emerald"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Recent Invoices Preview Table */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">
            {t.dashboard.overview.recentInvoices}
          </h2>
          <Link
            href="/dashboard/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>{t.dashboard.overview.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">{t.invoices.table.client}</th>
                <th className="pb-3 font-semibold">{t.invoices.table.invoiceNo}</th>
                <th className="pb-3 font-semibold">{t.invoices.table.amount}</th>
                <th className="pb-3 font-semibold">{t.invoices.table.dueDate}</th>
                <th className="pb-3 font-semibold">{t.invoices.table.status}</th>
                <th className="pb-3 font-semibold text-right">{t.invoices.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.slice(0, 5).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pr-4 font-semibold text-white">
                    <div>{inv.clientName}</div>
                    <div className="text-xs font-normal text-slate-500">{inv.clientEmail}</div>
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-xs text-slate-400">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-200">
                    {formatAmount(inv.amount, inv.currency)}
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-slate-400">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="py-3.5 pr-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3.5 text-right">
                    {inv.status !== 'paid' ? (
                      <button
                        type="button"
                        onClick={() => handleMarkPaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.invoices.actions.markPaid}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">{t.dashboard.overview.completed}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddInvoiceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddInvoice}
      />
    </div>
  );
}
