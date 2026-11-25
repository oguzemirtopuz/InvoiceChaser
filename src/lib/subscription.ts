// ============================================================
// InvoiceChaser — SaaS Fiyatlandırma ve Abonelik Katmanı
// ============================================================

export interface PricingPlan {
  id: 'free' | 'pro';
  name: string;
  nameTr: string;
  priceMonthly: number;
  currency: string;
  maxActiveInvoices: number;
  features: string[];
  featuresTr: string[];
}

export const PRICING_PLANS: Record<'free' | 'pro', PricingPlan> = {
  free: {
    id: 'free',
    name: 'Starter Tier',
    nameTr: 'Başlangıç Planı',
    priceMonthly: 0,
    currency: 'USD',
    maxActiveInvoices: 3,
    features: [
      'Up to 3 active invoices',
      'Basic progressive reminder templates (TR/EN)',
      '1-Click "Paid" status toggle',
      'CSV invoice export',
      'Community support',
    ],
    featuresTr: [
      '3 aktif faturaya kadar ücretsiz takip',
      'Standart kademeli hatırlatma şablonları (TR/EN)',
      'Tek tıkla "Ödendi" işaretleme',
      'CSV fatura dışa aktarma',
      'Topluluk desteği',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Growth & Business Pro',
    nameTr: 'Büyüme & İşletme Pro',
    priceMonthly: 19,
    currency: 'USD',
    maxActiveInvoices: 999999,
    features: [
      'Unlimited active invoices',
      'Google Gemini 1.5 Flash cognitive reminder AI',
      'Automated daily cron checking (/api/check-invoices)',
      'Resend custom SMTP / Domain email dispatch',
      'Custom company branding, IBAN & payment links',
      'Priority support',
    ],
    featuresTr: [
      'Sınırsız aktif fatura takibi',
      'Google Gemini 1.5 Flash ile dinamik AI üretimi',
      'Günlük otomatik cron kontrol servisi (/api/check-invoices)',
      'Resend özel domain e-posta gönderimi',
      'Özel şirket markalaması, IBAN ve ödeme linkleri',
      'Öncelikli destek',
    ],
  },
};
