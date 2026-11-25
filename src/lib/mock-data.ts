// ============================================================
// InvoiceChaser — Demo/Mock Veriler
// Ortam değişkenleri olmadan uygulamanın sorunsuz çalışması için
// ============================================================

import type { Invoice, ReminderRule, CompanySettings } from '@/lib/types';

// ============================================================
// Tarih yardımcıları
// ============================================================

/** Bugünden itibaren gün farkı hesapla */
function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function daysAgo(days: number): string {
  return daysFromNow(-days);
}

// ============================================================
// Demo Faturalar
// ============================================================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-2026-001',
    clientId: 'cli-001',
    clientName: 'Ahmet Yılmaz',
    clientEmail: 'ahmet@acmetr.com',
    amount: 15000,
    currency: 'TRY',
    dueDate: daysFromNow(5),
    paymentLink: 'https://pay.example.com/inv-001',
    status: 'upcoming',
    createdAt: daysAgo(10),
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-2026-002',
    clientId: 'cli-002',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sarah@globaltech.com',
    amount: 2500,
    currency: 'USD',
    dueDate: daysAgo(5),
    paymentLink: 'https://pay.example.com/inv-002',
    status: 'overdue',
    createdAt: daysAgo(20),
  },
  {
    id: 'inv-003',
    invoiceNo: 'INV-2026-003',
    clientId: 'cli-003',
    clientName: 'Elif Demir',
    clientEmail: 'elif@webajans.com.tr',
    amount: 8500,
    currency: 'TRY',
    dueDate: daysAgo(0),
    paymentLink: 'https://pay.example.com/inv-003',
    status: 'upcoming',
    createdAt: daysAgo(15),
  },
  {
    id: 'inv-004',
    invoiceNo: 'INV-2026-004',
    clientId: 'cli-004',
    clientName: 'James Carter',
    clientEmail: 'james@enterprise.io',
    amount: 4200,
    currency: 'EUR',
    dueDate: daysAgo(12),
    paymentLink: 'https://pay.example.com/inv-004',
    status: 'overdue',
    createdAt: daysAgo(30),
  },
  {
    id: 'inv-005',
    invoiceNo: 'INV-2026-005',
    clientId: 'cli-005',
    clientName: 'Mehmet Kaya',
    clientEmail: 'mehmet@kayainsaat.com',
    amount: 32000,
    currency: 'TRY',
    dueDate: daysAgo(3),
    paymentLink: 'https://pay.example.com/inv-005',
    status: 'paid',
    createdAt: daysAgo(25),
    paidAt: daysAgo(1),
  },
  {
    id: 'inv-006',
    invoiceNo: 'INV-2026-006',
    clientId: 'cli-006',
    clientName: 'Anna Schmidt',
    clientEmail: 'anna@berlindesign.de',
    amount: 1800,
    currency: 'EUR',
    dueDate: daysFromNow(12),
    paymentLink: 'https://pay.example.com/inv-006',
    status: 'pending',
    createdAt: daysAgo(5),
  },
];

// ============================================================
// Varsayılan Hatırlatma Kuralları
// ============================================================

export const mockRules: ReminderRule[] = [
  {
    id: 'rule-001',
    tier: 1,
    triggerDays: 3,
    enabled: true,
    name: 'Nazik Hatırlatma',
    description: 'Vadeden 3 gün önce nazik bir ön bilgilendirme gönderilir.',
  },
  {
    id: 'rule-002',
    tier: 2,
    triggerDays: 0,
    enabled: true,
    name: 'Vade Günü Hatırlatması',
    description: 'Vade gününde ödeme bağlantısı ile birlikte samimi hatırlatma.',
  },
  {
    id: 'rule-003',
    tier: 3,
    triggerDays: -3,
    enabled: true,
    name: 'Profesyonel Takip',
    description: 'Gecikmenin 3. gününde profesyonel üslupla takip.',
  },
  {
    id: 'rule-004',
    tier: 4,
    triggerDays: -7,
    enabled: true,
    name: 'Resmi Bildirim',
    description: 'Gecikmenin 7+ gününde sözleşme ve muhasebe referanslı resmi bildirim.',
  },
];

// ============================================================
// Varsayılan Şirket Ayarları
// ============================================================

export const mockSettings: CompanySettings = {
  name: 'Demo Şirketi A.Ş.',
  email: 'muhasebe@demo-sirket.com',
  iban: 'TR00 0000 0000 0000 0000 0000 00',
  paymentLink: 'https://pay.example.com',
  emailSignature: 'Saygılarımızla,\nDemo Şirketi Muhasebe Birimi',
  defaultCurrency: 'TRY',
  reminderTone: 'professional',
};

// ============================================================
// Yardımcı: Faturanın kalan/gecikmiş gün sayısı
// ============================================================

export function getDaysRemaining(dueDate: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================
// Yardımcı: Tutarı formatla
// ============================================================

export function formatAmount(amount: number, currency: string): string {
  const localeMap: Record<string, string> = {
    TRY: 'tr-TR',
    USD: 'en-US',
    EUR: 'de-DE',
  };
  const currencyMap: Record<string, string> = {
    TRY: 'TRY',
    USD: 'USD',
    EUR: 'EUR',
  };
  return new Intl.NumberFormat(localeMap[currency] ?? 'tr-TR', {
    style: 'currency',
    currency: currencyMap[currency] ?? 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ============================================================
// Yardımcı: Tarihi formatla
// ============================================================

export function formatDate(dateStr: string, locale: string = 'tr-TR'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
