import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
let resendClient: Resend | null = null;

if (resendApiKey) {
  resendClient = new Resend(resendApiKey);
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  invoiceNo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated: boolean;
  error?: string;
}

/**
 * E-posta gönderim fonksiyonu.
 * RESEND_API_KEY varsa gerçek e-posta gönderir; yoksa güvenle konsola loglar (simülasyon).
 */
export async function sendReminderEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'billing@invoicechaser.com';

  if (!resendClient || !resendApiKey) {
    console.log('[Email Simülasyonu] RESEND_API_KEY tanımlanmadığı için e-posta konsola yazdırıldı:');
    console.log(`To: ${params.to}`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Body:\n${params.body}`);

    return {
      success: true,
      messageId: `sim-${Date.now()}`,
      simulated: true,
    };
  }

  try {
    const data = await resendClient.emails.send({
      from: `InvoiceChaser <${fromEmail}>`,
      to: [params.to],
      subject: params.subject,
      text: params.body,
    });

    if (data.error) {
      console.error('[Resend Error]', data.error);
      return {
        success: false,
        simulated: false,
        error: data.error.message,
      };
    }

    return {
      success: true,
      messageId: data.data?.id,
      simulated: false,
    };
  } catch (error) {
    console.error('[Resend Exception]', error);
    return {
      success: false,
      simulated: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
    };
  }
}
