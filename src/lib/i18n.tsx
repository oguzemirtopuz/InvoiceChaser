'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { Language } from '@/lib/types';

// ============================================================
// Sözlük Tipi (Exhaustive & 100% Typed)
// ============================================================

export interface Dictionary {
  landing: {
    hero: { title: string; subtitle: string; cta: string; secondaryCta: string };
    features: {
      title: string; subtitle: string;
      items: { title: string; description: string }[];
    };
    howItWorks: {
      title: string;
      steps: { title: string; description: string }[];
    };
    footer: { copyright: string; builtBy: string };
  };
  dashboard: {
    sidebar: {
      overview: string; invoices: string; rules: string;
      simulator: string; settings: string; logout: string;
    };
    topbar: { welcome: string; searchPlaceholder: string };
    overview: {
      title: string; subtitle: string;
      metrics: {
        totalInvoices: string; pendingAmount: string;
        overdueCount: string; collectionRate: string;
      };
      recentInvoices: string; viewAll: string; completed: string;
      changes: {
        thisWeek: string; pendingCollection: string;
        interventionNeeded: string; allClean: string; rateIncrease: string;
      };
    };
  };
  invoices: {
    title: string; subtitle: string; addInvoice: string;
    table: {
      client: string; invoiceNo: string; amount: string;
      dueDate: string; daysRemaining: string; status: string; actions: string;
    };
    status: { paid: string; upcoming: string; overdue: string; pending: string };
    filters: { all: string; upcoming: string; overdue: string; paid: string };
    modal: {
      title: string; clientName: string; clientEmail: string;
      invoiceNo: string; amount: string; currency: string;
      dueDate: string; paymentLink: string; cancel: string; save: string;
    };
    actions: { markPaid: string; sendReminder: string; delete: string };
    empty: string;
    days: { left: string; overdue: string; today: string };
    toasts: {
      markedPaid: string; deleted: string; reminderQueued: string; csvExported: string;
    };
  };
  rules: {
    title: string; subtitle: string;
    badgeActive: string;
    tierPrefix: string;
    statusActive: string;
    statusPassive: string;
    howItWorksTitle: string;
    howItWorksDesc: string;
    tiers: {
      tier1: { name: string; description: string; timing: string };
      tier2: { name: string; description: string; timing: string };
      tier3: { name: string; description: string; timing: string };
      tier4: { name: string; description: string; timing: string };
    };
    enable: string; disable: string;
    toastToggled: (name: string, enabled: boolean) => string;
  };
  simulator: {
    title: string; subtitle: string;
    notice: string;
    selectInvoice: string; selectTier: string;
    generateReminder: string; generatedSubject: string;
    generatedBody: string; generating: string;
    latency: string; noInvoiceSelected: string;
    previewTitle: string; copy: string; copied: string;
    tierPrefix: string;
    modelLabel: string;
    engineLabel: string;
  };
  settings: {
    title: string; subtitle: string;
    companyName: string; companyEmail: string;
    iban: string; paymentLink: string; emailSignature: string;
    defaultCurrency: string; reminderTone: string;
    toneOptions: { gentle: string; professional: string; firm: string };
    save: string; saved: string; saving: string;
  };
  common: {
    search: string; filter: string; export: string;
    cancel: string; save: string; delete: string;
    edit: string; close: string; back: string;
    loading: string; error: string; success: string;
    confirm: string; yes: string; no: string;
    signIn: string;
  };
}

// ============================================================
// Türkçe Sözlük
// ============================================================

const tr: Dictionary = {
  landing: {
    hero: {
      title: 'Alacaklarınızı Otomatik Takip Edin',
      subtitle: 'Faturalarınızı yükleyin, yapay zeka ile kademeli hatırlatma e-postaları oluşturun ve ödeme tahsilatını hızlandırın. Rahatsız edici aramalar yok, sadece profesyonel takip.',
      cta: 'Ücretsiz Dene',
      secondaryCta: 'Nasıl Çalışır?',
    },
    features: {
      title: 'Neden InvoiceChaser?',
      subtitle: 'Küçük işletmeler ve serbest çalışanlar için tasarlandı.',
      items: [
        { title: 'Kademeli AI Hatırlatma', description: 'Vadeden 3 gün önce nazik bir hatırlatmadan başlayıp, gecikmede resmi takip e-postalarına kadar kademeli tonlama.' },
        { title: 'Çift Dilli Üretim', description: 'Müşterinizin diline göre otomatik Türkçe veya akıcı İngilizce e-posta metinleri.' },
        { title: 'Tek Tıkla "Ödendi"', description: 'Faturayı ödendi olarak işaretleyin, hatırlatma akışı anında dursun.' },
        { title: 'Gerçek Zamanlı Dashboard', description: 'Toplam alacak, geciken fatura sayısı ve tahsilat oranınızı tek panelde görün.' },
      ],
    },
    howItWorks: {
      title: 'Nasıl Çalışır?',
      steps: [
        { title: '1. Faturanızı Ekleyin', description: 'Müşteri bilgisi, tutar ve vade tarihini girin. 30 saniyede hazır.' },
        { title: '2. AI Hatırlatma Oluşturulsun', description: 'Yapay zeka, vade durumuna göre kademeli ve profesyonel e-posta metni üretir.' },
        { title: '3. Tahsilatınızı Hızlandırın', description: 'Otomatik hatırlatmalar sayesinde alacaklarınız %40 daha hızlı kapanır.' },
      ],
    },
    footer: {
      copyright: '© 2026 InvoiceChaser. Tüm hakları saklıdır.',
      builtBy: 'Oğuz Emir Topuz tarafından geliştirildi',
    },
  },
  dashboard: {
    sidebar: {
      overview: 'Genel Bakış',
      invoices: 'Faturalar',
      rules: 'Hatırlatma Kuralları',
      simulator: 'AI Simülatör',
      settings: 'Ayarlar',
      logout: 'Çıkış Yap',
    },
    topbar: {
      welcome: 'Hoş geldiniz',
      searchPlaceholder: 'Fatura veya müşteri ara...',
    },
    overview: {
      title: 'Genel Bakış',
      subtitle: 'Alacak durumunuzun anlık özeti.',
      metrics: {
        totalInvoices: 'Toplam Fatura',
        pendingAmount: 'Bekleyen Tutar',
        overdueCount: 'Geciken Fatura',
        collectionRate: 'Tahsilat Oranı',
      },
      recentInvoices: 'Son Faturalar',
      viewAll: 'Tümünü Gör',
      completed: 'Tamamlandı',
      changes: {
        thisWeek: '+2 bu hafta',
        pendingCollection: 'Bekleyen tahsilat',
        interventionNeeded: 'Müdahale gerekebilir',
        allClean: 'Tümü güncel',
        rateIncrease: '+8% artış',
      },
    },
  },
  invoices: {
    title: 'Faturalar',
    subtitle: 'Tüm faturalarınızı yönetin ve takip edin.',
    addInvoice: 'Yeni Fatura Ekle',
    table: {
      client: 'Müşteri',
      invoiceNo: 'Fatura No',
      amount: 'Tutar',
      dueDate: 'Vade Tarihi',
      daysRemaining: 'Kalan Gün',
      status: 'Durum',
      actions: 'İşlemler',
    },
    status: {
      paid: 'Ödendi',
      upcoming: 'Vadesi Yaklaşıyor',
      overdue: 'Gecikmede',
      pending: 'Beklemede',
    },
    filters: {
      all: 'Tüm Durumlar',
      upcoming: 'Vadesi Yaklaşanlar',
      overdue: 'Gecikmedekiler',
      paid: 'Ödenenler',
    },
    modal: {
      title: 'Yeni Fatura Ekle',
      clientName: 'Müşteri Adı',
      clientEmail: 'Müşteri E-postası',
      invoiceNo: 'Fatura Numarası',
      amount: 'Tutar',
      currency: 'Para Birimi',
      dueDate: 'Vade Tarihi',
      paymentLink: 'Ödeme Linki',
      cancel: 'İptal',
      save: 'Kaydet',
    },
    actions: {
      markPaid: 'Ödendi İşaretle',
      sendReminder: 'Hatırlatma Gönder',
      delete: 'Sil',
    },
    empty: 'Henüz fatura bulunmuyor. İlk faturanızı ekleyin!',
    days: {
      left: 'gün kaldı',
      overdue: 'gün gecikti',
      today: 'Bugün son gün',
    },
    toasts: {
      markedPaid: 'Fatura ödendi olarak işaretlendi. Hatırlatmalar durduruldu.',
      deleted: 'Fatura başarıyla silindi.',
      reminderQueued: 'AI hatırlatma e-postası kuyruğa alındı.',
      csvExported: 'CSV dosyası başarıyla indirildi.',
    },
  },
  rules: {
    title: 'Hatırlatma Kuralları',
    subtitle: 'Kademeli hatırlatma zamanlamasını yapılandırın.',
    badgeActive: 'Kademeli Akıllı Koruma Aktif',
    tierPrefix: 'Kademe',
    statusActive: 'Aktif',
    statusPassive: 'Pasif',
    howItWorksTitle: 'Nasıl Çalışır?',
    howItWorksDesc: 'Cron servisi her gün çalışır. Vadesi gelen faturalar için yukarıda aktif olan kurallara göre yapay zeka tarafından özelleştirilmiş e-postalar otomatik olarak müşterilerinize gönderilir. Müşteri ödeme yaptığında hatırlatma serisi anında sonlanır.',
    tiers: {
      tier1: { name: 'Nazik Hatırlatma', description: 'Vadeden önce planlama odaklı, nazik bir ön bilgilendirme.', timing: 'Vadeden 3 gün önce' },
      tier2: { name: 'Vade Günü Hatırlatması', description: 'Samimi, ödeme bağlantısını doğrudan sunan hatırlatma.', timing: 'Vade günü' },
      tier3: { name: 'Profesyonel Takip', description: '"Gözünüzden kaçmış olabilir" üslubuyla profesyonel takip.', timing: 'Gecikme 3. gün' },
      tier4: { name: 'Resmi Bildirim', description: 'Sözleşme ve muhasebe hatırlatması içeren resmi bildirim.', timing: 'Gecikme 7+ gün' },
    },
    enable: 'Etkinleştir',
    disable: 'Devre Dışı Bırak',
    toastToggled: (name, enabled) => `${name} kuralı ${enabled ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`,
  },
  simulator: {
    title: 'AI Hatırlatma Simülatörü',
    subtitle: 'Yapay zekanın kademeli hatırlatma e-postalarını canlı test edin.',
    notice: 'Bu simülatör, faturanın durumuna ve seçilen kademeye göre yapay zekanın üreteceği hatırlatma e-postasını ve yanıt gecikmesini test etmenizi sağlar.',
    selectInvoice: 'Fatura seçin',
    selectTier: 'Kademe seçin',
    generateReminder: 'Hatırlatma Oluştur',
    generatedSubject: 'Oluşturulan Konu',
    generatedBody: 'Oluşturulan İçerik',
    generating: 'AI üretiyor...',
    latency: 'Yanıt süresi',
    noInvoiceSelected: 'Lütfen bir fatura ve kademe seçin.',
    previewTitle: 'E-posta Önizleme',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    tierPrefix: 'Kademe',
    modelLabel: 'Model: Gemini 1.5 Flash',
    engineLabel: 'Çift Dilli AI Motoru',
  },
  settings: {
    title: 'Ayarlar',
    subtitle: 'Şirket profilinizi ve hatırlatma tercihlerinizi yönetin.',
    companyName: 'Şirket Adı',
    companyEmail: 'Şirket E-postası',
    iban: 'IBAN / Hesap Numarası',
    paymentLink: 'Varsayılan Ödeme Linki',
    emailSignature: 'E-posta İmzası',
    defaultCurrency: 'Varsayılan Para Birimi',
    reminderTone: 'Hatırlatma Üslubu',
    toneOptions: {
      gentle: 'Nazik (Kibar ve anlayışlı)',
      professional: 'Profesyonel (Standart kurumsal)',
      firm: 'Resmi (Kesin ve net)',
    },
    save: 'Kaydet',
    saved: 'Ayarlar başarıyla kaydedildi!',
    saving: 'Kaydediliyor...',
  },
  common: {
    search: 'Ara',
    filter: 'Filtrele',
    export: 'Dışa Aktar',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
    back: 'Geri',
    loading: 'Yükleniyor...',
    error: 'Bir hata oluştu.',
    success: 'İşlem başarılı!',
    confirm: 'Emin misiniz?',
    yes: 'Evet',
    no: 'Hayır',
    signIn: 'Giriş Yap',
  },
};

// ============================================================
// İngilizce Sözlük
// ============================================================

const en: Dictionary = {
  landing: {
    hero: {
      title: 'Automate Your Invoice Follow-Ups',
      subtitle: 'Upload your invoices, generate progressive AI-powered reminder emails, and accelerate your payment collection. No awkward calls, just professional follow-ups.',
      cta: 'Try Free',
      secondaryCta: 'How It Works',
    },
    features: {
      title: 'Why InvoiceChaser?',
      subtitle: 'Designed for small businesses and freelancers.',
      items: [
        { title: 'Progressive AI Reminders', description: 'From a gentle heads-up 3 days before due date to formal follow-ups for overdue invoices — tone escalates automatically.' },
        { title: 'Bilingual Generation', description: 'Automatically generates fluent Turkish or English email copy based on your client\'s language.' },
        { title: 'One-Click "Paid"', description: 'Mark an invoice as paid and the reminder flow stops instantly.' },
        { title: 'Real-Time Dashboard', description: 'See total receivables, overdue invoice count, and collection rate in a single panel.' },
      ],
    },
    howItWorks: {
      title: 'How It Works',
      steps: [
        { title: '1. Add Your Invoice', description: 'Enter client info, amount, and due date. Ready in 30 seconds.' },
        { title: '2. AI Generates Reminders', description: 'AI crafts progressive, professional email copy based on due date status.' },
        { title: '3. Accelerate Collection', description: 'Automated reminders help you collect receivables 40% faster.' },
      ],
    },
    footer: {
      copyright: '© 2026 InvoiceChaser. All rights reserved.',
      builtBy: 'Built by Oğuz Emir Topuz',
    },
  },
  dashboard: {
    sidebar: {
      overview: 'Overview',
      invoices: 'Invoices',
      rules: 'Reminder Rules',
      simulator: 'AI Simulator',
      settings: 'Settings',
      logout: 'Logout',
    },
    topbar: {
      welcome: 'Welcome',
      searchPlaceholder: 'Search invoices or clients...',
    },
    overview: {
      title: 'Overview',
      subtitle: 'Real-time overview of your receivables.',
      metrics: {
        totalInvoices: 'Total Invoices',
        pendingAmount: 'Pending Amount',
        overdueCount: 'Overdue Invoices',
        collectionRate: 'Collection Rate',
      },
      recentInvoices: 'Recent Invoices',
      viewAll: 'View All',
      completed: 'Completed',
      changes: {
        thisWeek: '+2 this week',
        pendingCollection: 'Pending collection',
        interventionNeeded: 'Action required',
        allClean: 'All up to date',
        rateIncrease: '+8% increase',
      },
    },
  },
  invoices: {
    title: 'Invoices',
    subtitle: 'Manage and track all your invoices.',
    addInvoice: 'Add New Invoice',
    table: {
      client: 'Client',
      invoiceNo: 'Invoice No',
      amount: 'Amount',
      dueDate: 'Due Date',
      daysRemaining: 'Days Remaining',
      status: 'Status',
      actions: 'Actions',
    },
    status: {
      paid: 'Paid',
      upcoming: 'Upcoming',
      overdue: 'Overdue',
      pending: 'Pending',
    },
    filters: {
      all: 'All Statuses',
      upcoming: 'Upcoming',
      overdue: 'Overdue',
      paid: 'Paid',
    },
    modal: {
      title: 'Add New Invoice',
      clientName: 'Client Name',
      clientEmail: 'Client Email',
      invoiceNo: 'Invoice Number',
      amount: 'Amount',
      currency: 'Currency',
      dueDate: 'Due Date',
      paymentLink: 'Payment Link',
      cancel: 'Cancel',
      save: 'Save',
    },
    actions: {
      markPaid: 'Mark as Paid',
      sendReminder: 'Send Reminder',
      delete: 'Delete',
    },
    empty: 'No invoices yet. Add your first invoice!',
    days: {
      left: 'days left',
      overdue: 'days overdue',
      today: 'Due today',
    },
    toasts: {
      markedPaid: 'Invoice marked as paid. Reminder sequence stopped.',
      deleted: 'Invoice deleted successfully.',
      reminderQueued: 'AI reminder email queued for dispatch.',
      csvExported: 'CSV file downloaded successfully.',
    },
  },
  rules: {
    title: 'Reminder Rules',
    subtitle: 'Configure your progressive reminder timing.',
    badgeActive: 'Progressive Smart Protection Active',
    tierPrefix: 'Tier',
    statusActive: 'Active',
    statusPassive: 'Disabled',
    howItWorksTitle: 'How It Works',
    howItWorksDesc: 'The cron service executes daily. Invoices reaching their milestone triggers automatically receive AI-crafted emails matching the active rules above. Once settled, sequences halt instantly.',
    tiers: {
      tier1: { name: 'Gentle Reminder', description: 'A polite heads-up focused on planning before the due date.', timing: '3 days before due' },
      tier2: { name: 'Due Date Reminder', description: 'Friendly reminder with a direct payment link.', timing: 'On due date' },
      tier3: { name: 'Professional Follow-Up', description: '"This may have slipped through" professional tone follow-up.', timing: '3 days overdue' },
      tier4: { name: 'Formal Notice', description: 'Formal notification referencing contract and accounting terms.', timing: '7+ days overdue' },
    },
    enable: 'Enable',
    disable: 'Disable',
    toastToggled: (name, enabled) => `Rule "${name}" has been ${enabled ? 'enabled' : 'disabled'}.`,
  },
  simulator: {
    title: 'AI Reminder Simulator',
    subtitle: 'Test AI-generated progressive reminder emails live.',
    notice: 'This simulator lets you test the generated email copy and latency based on invoice status and escalation tier.',
    selectInvoice: 'Select invoice',
    selectTier: 'Select tier',
    generateReminder: 'Generate Reminder',
    generatedSubject: 'Generated Subject',
    generatedBody: 'Generated Body',
    generating: 'AI is generating...',
    latency: 'Response time',
    noInvoiceSelected: 'Please select an invoice and tier.',
    previewTitle: 'Email Preview',
    copy: 'Copy',
    copied: 'Copied',
    tierPrefix: 'Tier',
    modelLabel: 'Model: Gemini 1.5 Flash',
    engineLabel: 'Bilingual AI Engine',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Manage your company profile and reminder preferences.',
    companyName: 'Company Name',
    companyEmail: 'Company Email',
    iban: 'IBAN / Account Number',
    paymentLink: 'Default Payment Link',
    emailSignature: 'Email Signature',
    defaultCurrency: 'Default Currency',
    reminderTone: 'Reminder Tone',
    toneOptions: {
      gentle: 'Gentle (Courteous & considerate)',
      professional: 'Professional (Standard corporate)',
      firm: 'Firm (Direct & resolute)',
    },
    save: 'Save',
    saved: 'Settings saved successfully!',
    saving: 'Saving...',
  },
  common: {
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    loading: 'Loading...',
    error: 'An error occurred.',
    success: 'Operation successful!',
    confirm: 'Are you sure?',
    yes: 'Yes',
    no: 'No',
    signIn: 'Sign In',
  },
};

// ============================================================
// Sözlük Haritası
// ============================================================

const dictionaries: Record<Language, Dictionary> = { tr, en };

// ============================================================
// Context & Provider
// ============================================================

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('tr');

  // İlk yüklemede localStorage'dan oku
  useEffect(() => {
    const stored = localStorage.getItem('invoicechaser-lang') as Language | null;
    if (stored === 'tr' || stored === 'en') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('invoicechaser-lang', lang);
  }, []);

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
