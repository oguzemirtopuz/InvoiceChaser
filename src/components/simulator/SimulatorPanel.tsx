'use client';

import React, { useState } from 'react';
import type { Invoice, ReminderTier } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';
import { formatAmount } from '@/lib/mock-data';
import { Sparkles, Copy, Check, Clock, Bot, Send, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SimulatorPanelProps {
  invoices: Invoice[];
}

export function SimulatorPanel({ invoices }: SimulatorPanelProps) {
  const { t, language } = useLanguage();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoices[0]?.id || '');
  const [selectedTier, setSelectedTier] = useState<ReminderTier>(1);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  const handleGenerate = async () => {
    if (!selectedInvoice) return;

    setLoading(true);
    setLatency(null);
    setResult(null);

    const startTime = performance.now();

    // Simülasyon gecikmesi (gerçekçi AI motoru gecikmesi)
    await new Promise((r) => setTimeout(r, 650));

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    setLatency(duration);

    // Kademeli dinamik şablon üretici (Phase 1 yerel prototip; Phase 3'te Gemini API'ye bağlanacak)
    const clientName = selectedInvoice.clientName;
    const invoiceNo = selectedInvoice.invoiceNo;
    const amountStr = formatAmount(selectedInvoice.amount, selectedInvoice.currency);
    const dueDate = selectedInvoice.dueDate;
    const payLink = selectedInvoice.paymentLink;

    let subject = '';
    let body = '';

    if (language === 'tr') {
      if (selectedTier === 1) {
        subject = `Ön Bilgilendirme: ${invoiceNo} Numaralı Faturanız (${amountStr})`;
        body = `Merhaba Sayın ${clientName},\n\nUmarız her şey yolundadır.\n\n${invoiceNo} numaralı ve ${amountStr} tutarındaki faturanızın vadesi ${dueDate} tarihinde dolmaktadır. Ödemelerinizi kolayca planlayabilmeniz adına bu ön hatırlatmayı iletiyoruz.\n\nÖdemenizi aşağıdaki bağlantı üzerinden güvenle gerçekleştirebilirsiniz:\n🔗 ${payLink}\n\nHerhangi bir sorunuz olursa lütfen bize bildirin.\n\nİyi çalışmalar dileriz,\nInvoiceChaser Muhasebe`;
      } else if (selectedTier === 2) {
        subject = `Vade Günü Hatırlatması: ${invoiceNo} Nolu Fatura (${amountStr})`;
        body = `Merhaba Sayın ${clientName},\n\n${invoiceNo} nolu faturanızın vadesi bugün (${dueDate}) dolmuştur.\n\nHesabınızın güncel kalması için ödemenizi gün içerisinde tamamlamanızı rica ederiz.\n\nÖdeme Bağlantısı: ${payLink}\n\nÖdeme yaptıysanız lütfen bu mesajı dikkate almayınız.\n\nSaygılarımızla,\nInvoiceChaser Ekibi`;
      } else if (selectedTier === 3) {
        subject = `Önemli Takip: ${invoiceNo} Numaralı Faturanız Gecikmede`;
        body = `Sayın ${clientName},\n\n${dueDate} vadeli ${invoiceNo} numaralı faturanızın ödemesi henüz sistemimize yansımamıştır.\n\nYoğunluğunuz nedeniyle gözden kaçmış olabileceğini düşündüğümüz için bu hatırlatmayı iletiyoruz.\n\nLütfen aşağıdaki bağlantı üzerinden en kısa sürede ödemenizi tamamlayınız:\n${payLink}\n\nİş birliğiniz için teşekkür ederiz.`;
      } else {
        subject = `RESMİ BİLDİRİM: ${invoiceNo} Nolu Gecikmiş Alacak Hakkında`;
        body = `Sayın ${clientName},\n\n${dueDate} vadeli ve ${amountStr} tutarındaki ${invoiceNo} numaralı faturanız 7 günden uzun süredir gecikmededir.\n\nHizmet sözleşmemiz ve muhasebe mevzuatı gereği yasal takip sürecine girmemek adına, bakiyenin ivedilikle kapatılması gerekmektedir.\n\nDoğrudan Ödeme Linki:\n${payLink}\n\nDekontu bu e-postaya yanıt olarak iletmenizi rica ederiz.\n\nInvoiceChaser Finans & Hukuk Birimi`;
      }
    } else {
      if (selectedTier === 1) {
        subject = `Friendly Reminder: Upcoming Invoice ${invoiceNo} (${amountStr})`;
        body = `Hi ${clientName},\n\nHope this email finds you well.\n\nThis is a quick courtesy reminder that invoice ${invoiceNo} for ${amountStr} is due on ${dueDate}.\n\nYou can review and pay directly using the secure link below:\n🔗 ${payLink}\n\nLet us know if you have any questions!\n\nBest regards,\nInvoiceChaser Accounts Team`;
      } else if (selectedTier === 2) {
        subject = `Due Today: Invoice ${invoiceNo} (${amountStr})`;
        body = `Hi ${clientName},\n\nInvoice ${invoiceNo} for ${amountStr} is due today (${dueDate}).\n\nPlease complete your payment using this link to keep your account current:\n${payLink}\n\nIf you have already processed this payment, please disregard this note.\n\nThank you,\nInvoiceChaser Team`;
      } else if (selectedTier === 3) {
        subject = `Follow-Up: Overdue Invoice ${invoiceNo}`;
        body = `Dear ${clientName},\n\nWe noticed that payment for invoice ${invoiceNo} (due on ${dueDate}) has not been recorded yet.\n\nWe understand things get busy, so we wanted to bring this to your attention.\n\nPlease process the outstanding amount of ${amountStr} via:\n${payLink}\n\nThank you for your prompt attention.`;
      } else {
        subject = `FORMAL NOTICE: Overdue Payment for Invoice ${invoiceNo}`;
        body = `Dear ${clientName},\n\nYour account shows that invoice ${invoiceNo} for ${amountStr} is now substantially overdue past its due date (${dueDate}).\n\nTo avoid service disruption or escalation, please settle the outstanding balance immediately via:\n${payLink}\n\nKindly forward the payment confirmation upon completion.\n\nSincerely,\nInvoiceChaser Finance & Compliance`;
      }
    }

    setResult({ subject, body });
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!result) return;
    const fullText = `Subject: ${result.subject}\n\n${result.body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Panoya kopyalandı');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Control Box */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>{t.simulator.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t.simulator.subtitle}</p>
        </div>

        {/* Invoice Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t.simulator.selectInvoice}
          </label>
          <select
            value={selectedInvoiceId}
            onChange={(e) => setSelectedInvoiceId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
          >
            {invoices.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.invoiceNo} — {inv.clientName} ({formatAmount(inv.amount, inv.currency)}) [{inv.status}]
              </option>
            ))}
          </select>
        </div>

        {/* Tier Selector Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t.simulator.selectTier}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[1, 2, 3, 4].map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedTier(tier as ReminderTier)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTier === tier
                    ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider">
                  Kademe {tier}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">
                  {tier === 1 && 'Vadeden 3 gün önce'}
                  {tier === 2 && 'Vade günü'}
                  {tier === 3 && 'Gecikme 3. gün'}
                  {tier === 4 && 'Gecikme 7+ gün'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !selectedInvoice}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{t.simulator.generating}</span>
            </>
          ) : (
            <>
              <Bot className="w-4 h-4" />
              <span>{t.simulator.generateReminder}</span>
            </>
          )}
        </button>

        {latency !== null && (
          <div className="flex items-center justify-between text-xs text-slate-400 px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.simulator.latency}</span>
            </span>
            <span className="font-mono font-bold text-emerald-400">{latency} ms</span>
          </div>
        )}
      </div>

      {/* Output Preview */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-indigo-400" />
              <span>E-posta Önizleme</span>
            </span>
            {result && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            )}
          </div>

          {result ? (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {t.simulator.generatedSubject}
                </span>
                <p className="text-sm font-semibold text-white bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {result.subject}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {t.simulator.generatedBody}
                </span>
                <div className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-[280px] overflow-y-auto">
                  {result.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 p-6">
              <Bot className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-sm">{t.simulator.noInvoiceSelected}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Model: Gemini 1.5 Flash</span>
          <span>Bilingual i18n Motoru</span>
        </div>
      </div>
    </div>
  );
}
