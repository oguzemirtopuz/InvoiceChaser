'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import { mockInvoices, formatAmount, formatDate, getDaysRemaining } from '@/lib/mock-data';
import type { Invoice, InvoiceStatus } from '@/lib/types';
import { StatusBadge } from '@/components/invoices/StatusBadge';
import { AddInvoiceModal } from '@/components/invoices/AddInvoiceModal';
import {
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Send,
  Trash2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function InvoicesPage() {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtreleme mantığı
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
        inv.clientEmail.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const handleMarkPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'paid', paidAt: new Date().toISOString() } : inv
      )
    );
    toast.success('Fatura ödendi olarak işaretlendi.');
  };

  const handleDelete = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    toast.success('Fatura silindi.');
  };

  const handleSendReminder = (inv: Invoice) => {
    toast.info(`AI Hatırlatma e-postası ${inv.clientEmail} adresine kuyruğa alındı.`);
  };

  const handleAddInvoice = (newInv: Invoice) => {
    setInvoices((prev) => [newInv, ...prev]);
  };

  const handleExportCSV = () => {
    const headers = ['Fatura No', 'Musteri', 'Email', 'Tutar', 'Para Birimi', 'Vade', 'Durum'];
    const rows = filteredInvoices.map((i) => [
      i.invoiceNo,
      i.clientName,
      i.clientEmail,
      i.amount,
      i.currency,
      i.dueDate,
      i.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `faturalar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV dosyası indirildi.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t.invoices.title}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {t.invoices.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>{t.common.export} CSV</span>
          </button>

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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.dashboard.topbar.searchPlaceholder}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 font-semibold"
          >
            <option value="all">Tüm Durumlar ({invoices.length})</option>
            <option value="upcoming">Vadesi Yaklaşanlar</option>
            <option value="overdue">Gecikmedekiler</option>
            <option value="paid">Ödenenler</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">{t.invoices.table.client}</th>
                <th className="py-3 px-4 font-semibold">{t.invoices.table.invoiceNo}</th>
                <th className="py-3 px-4 font-semibold">{t.invoices.table.amount}</th>
                <th className="py-3 px-4 font-semibold">{t.invoices.table.dueDate}</th>
                <th className="py-3 px-4 font-semibold">{t.invoices.table.daysRemaining}</th>
                <th className="py-3 px-4 font-semibold">{t.invoices.table.status}</th>
                <th className="py-3 px-4 font-semibold text-right">{t.invoices.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => {
                  const daysLeft = getDaysRemaining(inv.dueDate);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        <div>{inv.clientName}</div>
                        <div className="text-xs font-normal text-slate-500">{inv.clientEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                        {inv.invoiceNo}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-100">
                        {formatAmount(inv.amount, inv.currency)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {formatDate(inv.dueDate)}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold">
                        {inv.status === 'paid' ? (
                          <span className="text-slate-500">—</span>
                        ) : daysLeft > 0 ? (
                          <span className="text-indigo-400">{daysLeft} gün kaldı</span>
                        ) : daysLeft === 0 ? (
                          <span className="text-amber-400">Bugün son gün</span>
                        ) : (
                          <span className="text-rose-400 font-bold">{Math.abs(daysLeft)} gün gecikti</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {inv.status !== 'paid' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSendReminder(inv)}
                                title={t.invoices.actions.sendReminder}
                                className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-indigo-600/30 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMarkPaid(inv.id)}
                                title={t.invoices.actions.markPaid}
                                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600/30 transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(inv.id)}
                            title={t.common.delete}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <AlertCircle className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-semibold">{t.invoices.empty}</p>
                  </td>
                </tr>
              )}
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
