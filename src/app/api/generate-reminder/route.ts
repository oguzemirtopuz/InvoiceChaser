import { NextResponse } from 'next/server';
import { generateAIEmailReminder } from '@/lib/gemini';
import type { Invoice, ReminderTier, Language } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invoice, tier, language } = body as {
      invoice?: Invoice;
      tier?: ReminderTier;
      language?: Language;
    };

    if (!invoice || !tier) {
      return NextResponse.json(
        { error: 'invoice ve tier alanları zorunludur' },
        { status: 400 }
      );
    }

    const result = await generateAIEmailReminder(invoice, tier, language || 'tr');

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('API /api/generate-reminder error:', error);
    return NextResponse.json(
      { error: 'Hatırlatma oluşturulamadı', details: String(error) },
      { status: 500 }
    );
  }
}
