import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Invoice, ReminderTier, Language } from '@/lib/types';
import { formatAmount } from '@/lib/mock-data';

const apiKey = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export interface ReminderGenerationResult {
  subject: string;
  body: string;
  tier: ReminderTier;
  language: Language;
  source: 'gemini' | 'smart-fallback';
}

/**
 * Akıllı yedek şablon (API Key yokken veya hata anında kullanılır)
 */
export function generateFallbackReminder(
  invoice: Invoice,
  tier: ReminderTier,
  lang: Language
): { subject: string; body: string } {
  const amountStr = formatAmount(invoice.amount, invoice.currency);
  const clientName = invoice.clientName;
  const invoiceNo = invoice.invoiceNo;
  const dueDate = invoice.dueDate;
  const payLink = invoice.paymentLink;

  if (lang === 'tr') {
    switch (tier) {
      case 1:
        return {
          subject: `Ön Bilgilendirme: ${invoiceNo} Numaralı Faturanız (${amountStr})`,
          body: `Merhaba Sayın ${clientName},\n\nUmarız her şey yolundadır.\n\n${invoiceNo} numaralı ve ${amountStr} tutarındaki faturanızın vadesi ${dueDate} tarihinde dolacaktır. Ödemelerinizi kolayca planlayabilmeniz için bu ön hatırlatmayı iletiyoruz.\n\nÖdemenizi aşağıdaki güvenli bağlantı üzerinden yapabilirsiniz:\n🔗 ${payLink}\n\nHerhangi bir sorunuz olursa lütfen bize bildirin.\n\nİyi çalışmalar dileriz,\nInvoiceChaser Muhasebe`,
        };
      case 2:
        return {
          subject: `Vade Günü Hatırlatması: ${invoiceNo} Nolu Fatura (${amountStr})`,
          body: `Merhaba Sayın ${clientName},\n\n${invoiceNo} nolu faturanızın vadesi bugün (${dueDate}) dolmuştur.\n\nHesabınızın güncel kalması için ödemenizi gün içerisinde tamamlamanızı rica ederiz.\n\nÖdeme Bağlantısı:\n🔗 ${payLink}\n\nÖdeme yaptıysanız lütfen bu mesajı dikkate almayınız.\n\nSaygılarımızla,\nInvoiceChaser Ekibi`,
        };
      case 3:
        return {
          subject: `Önemli Takip: ${invoiceNo} Numaralı Faturanız Gecikmede`,
          body: `Sayın ${clientName},\n\n${dueDate} vadeli ${invoiceNo} numaralı faturanızın ödemesi henüz sistemimize yansımamıştır.\n\nYoğunluğunuz nedeniyle gözden kaçmış olabileceğini düşündüğümüz için bu hatırlatmayı iletiyoruz.\n\nLütfen aşağıdaki bağlantı üzerinden en kısa sürede ödemenizi tamamlayınız:\n🔗 ${payLink}\n\nİş birliğiniz için teşekkür ederiz.`,
        };
      case 4:
      default:
        return {
          subject: `RESMİ BİLDİRİM: ${invoiceNo} Nolu Gecikmiş Alacak Hakkında`,
          body: `Sayın ${clientName},\n\n${dueDate} vadeli ve ${amountStr} tutarındaki ${invoiceNo} numaralı faturanız 7 günden uzun süredir gecikmededir.\n\nHizmet sözleşmemiz ve muhasebe mevzuatı gereği yasal takip sürecine girmemek adına, bakiyenin ivedilikle kapatılması gerekmektedir.\n\nDoğrudan Ödeme Linki:\n🔗 ${payLink}\n\nDekontu bu e-postaya yanıt olarak iletmenizi rica ederiz.\n\nInvoiceChaser Finans & Hukuk Birimi`,
        };
    }
  } else {
    switch (tier) {
      case 1:
        return {
          subject: `Friendly Reminder: Upcoming Invoice ${invoiceNo} (${amountStr})`,
          body: `Hi ${clientName},\n\nHope this email finds you well.\n\nThis is a quick courtesy reminder that invoice ${invoiceNo} for ${amountStr} is due on ${dueDate}.\n\nYou can review and pay directly using the secure link below:\n🔗 ${payLink}\n\nLet us know if you have any questions!\n\nBest regards,\nInvoiceChaser Accounts Team`,
        };
      case 2:
        return {
          subject: `Due Today: Invoice ${invoiceNo} (${amountStr})`,
          body: `Hi ${clientName},\n\nInvoice ${invoiceNo} for ${amountStr} is due today (${dueDate}).\n\nPlease complete your payment using this link to keep your account current:\n🔗 ${payLink}\n\nIf you have already processed this payment, please disregard this note.\n\nThank you,\nInvoiceChaser Team`,
        };
      case 3:
        return {
          subject: `Follow-Up: Overdue Invoice ${invoiceNo}`,
          body: `Dear ${clientName},\n\nWe noticed that payment for invoice ${invoiceNo} (due on ${dueDate}) has not been recorded yet.\n\nWe understand things get busy, so we wanted to bring this to your attention.\n\nPlease process the outstanding amount of ${amountStr} via:\n🔗 ${payLink}\n\nThank you for your prompt attention.`,
        };
      case 4:
      default:
        return {
          subject: `FORMAL NOTICE: Overdue Payment for Invoice ${invoiceNo}`,
          body: `Dear ${clientName},\n\nYour account shows that invoice ${invoiceNo} for ${amountStr} is now substantially overdue past its due date (${dueDate}).\n\nTo avoid service disruption or escalation, please settle the outstanding balance immediately via:\n🔗 ${payLink}\n\nKindly forward the payment confirmation upon completion.\n\nSincerely,\nInvoiceChaser Finance & Compliance`,
        };
    }
  }
}

/**
 * Gemini 1.5 Flash ile dinamik kademeli hatırlatma metni oluşturur.
 * API anahtarı yoksa veya hata alınırsa akıllı yedek şablona düşer.
 */
export async function generateAIEmailReminder(
  invoice: Invoice,
  tier: ReminderTier,
  lang: Language = 'tr'
): Promise<ReminderGenerationResult> {
  const fallback = generateFallbackReminder(invoice, tier, lang);

  if (!genAI || !apiKey) {
    return {
      subject: fallback.subject,
      body: fallback.body,
      tier,
      language: lang,
      source: 'smart-fallback',
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const amountStr = formatAmount(invoice.amount, invoice.currency);

    const toneGuide = {
      1: lang === 'tr' ? 'Vadeden 3 gün önce, son derece nazik, kibar, planlama odaklı' : '3 days before due date, polite, courteous, planning-oriented',
      2: lang === 'tr' ? 'Vade günü, samimi, doğrudan ödeme linkini sunan' : 'Due date, warm, clearly presenting payment link',
      3: lang === 'tr' ? 'Gecikme 3. gün, "gözden kaçmış olabilir" üslubuyla profesyonel takip' : '3 days overdue, professional "might have slipped through" tone',
      4: lang === 'tr' ? 'Gecikme 7+ gün, resmi, hukuki ve muhasebe hatırlatması' : '7+ days overdue, formal, legal and accounting notice',
    };

    const prompt = `
Sen B2B alacak tahsilatını hızlandıran profesyonel bir yapay zeka asistanısın (InvoiceChaser).
Aşağıdaki fatura bilgilerine göre bir e-posta hatırlatması hazırla.

Fatura Bilgileri:
- Müşteri Adı: ${invoice.clientName}
- Fatura No: ${invoice.invoiceNo}
- Tutar: ${amountStr}
- Vade Tarihi: ${invoice.dueDate}
- Ödeme Linki: ${invoice.paymentLink}
- Kademe: ${tier} (${toneGuide[tier]})
- İstenen Dil: ${lang === 'tr' ? 'Türkçe' : 'İngilizce'}

Kurallar:
1. Çıktıyı JSON formatında ver: {"subject": "...", "body": "..."}
2. Markdown codeblock (\`\`\`json) KULLANMA, sadece saf JSON döndür.
3. İçerikte mutlaka tutar, fatura numarası ve ödeme linki yer alsın.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // JSON temizliği
    const cleanJson = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (parsed.subject && parsed.body) {
      return {
        subject: parsed.subject,
        body: parsed.body,
        tier,
        language: lang,
        source: 'gemini',
      };
    }

    return {
      subject: fallback.subject,
      body: fallback.body,
      tier,
      language: lang,
      source: 'smart-fallback',
    };
  } catch (error) {
    console.warn('[Gemini AI] Hatırlatma üretiminde hata, fallback kullanılıyor:', error);
    return {
      subject: fallback.subject,
      body: fallback.body,
      tier,
      language: lang,
      source: 'smart-fallback',
    };
  }
}
