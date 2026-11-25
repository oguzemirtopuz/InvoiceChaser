// ============================================================
// InvoiceChaser — Merkezi TypeScript Tip Tanımlamaları
// ============================================================

/** Fatura durumu */
export type InvoiceStatus = 'paid' | 'upcoming' | 'overdue' | 'pending';

/** Hatırlatma kademesi (1=nazik → 4=resmi) */
export type ReminderTier = 1 | 2 | 3 | 4;

/** Para birimi */
export type Currency = 'TRY' | 'USD' | 'EUR';

/** Dil */
export type Language = 'tr' | 'en';

/** Hatırlatma üslubu */
export type ReminderTone = 'gentle' | 'professional' | 'firm';

// ============================================================
// Ana Varlıklar (Entities)
// ============================================================

/** Müşteri */
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  language: Language;
}

/** Fatura */
export interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: Currency;
  dueDate: string;
  paymentLink: string;
  status: InvoiceStatus;
  createdAt: string;
  paidAt?: string;
}

/** Gönderilmiş hatırlatma */
export interface Reminder {
  id: string;
  invoiceId: string;
  tier: ReminderTier;
  subject: string;
  body: string;
  sentAt: string;
  deliveredAt?: string;
}

/** Hatırlatma kuralı */
export interface ReminderRule {
  id: string;
  tier: ReminderTier;
  triggerDays: number;
  enabled: boolean;
  name: string;
  description: string;
}

/** Şirket ayarları */
export interface CompanySettings {
  name: string;
  email: string;
  iban: string;
  paymentLink: string;
  emailSignature: string;
  defaultCurrency: Currency;
  reminderTone: ReminderTone;
}

// ============================================================
// Dashboard Metrik Kartı
// ============================================================

export interface MetricData {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

// ============================================================
// Fatura Oluşturma Formu
// ============================================================

export interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  invoiceNo: string;
  amount: string;
  currency: Currency;
  dueDate: string;
  paymentLink: string;
}
