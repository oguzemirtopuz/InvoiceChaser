import { NextResponse } from 'next/server';
import { mockInvoices, getDaysRemaining } from '@/lib/mock-data';
import { generateAIEmailReminder } from '@/lib/gemini';
import { sendReminderEmail } from '@/lib/email';
import type { ReminderTier } from '@/lib/types';

export async function GET() {
  return handleCheck();
}

export async function POST() {
  return handleCheck();
}

async function handleCheck() {
  const scanned = mockInvoices.filter((inv) => inv.status !== 'paid');
  const dispatches: Array<{
    invoiceNo: string;
    clientEmail: string;
    tier: ReminderTier;
    subject: string;
    simulated: boolean;
  }> = [];

  for (const inv of scanned) {
    const daysLeft = getDaysRemaining(inv.dueDate);
    let matchedTier: ReminderTier | null = null;

    if (daysLeft === 3) {
      matchedTier = 1;
    } else if (daysLeft === 0) {
      matchedTier = 2;
    } else if (daysLeft === -3 || daysLeft === -5) {
      matchedTier = 3;
    } else if (daysLeft <= -7) {
      matchedTier = 4;
    }

    if (matchedTier) {
      const reminder = await generateAIEmailReminder(inv, matchedTier, 'tr');
      const emailResult = await sendReminderEmail({
        to: inv.clientEmail,
        subject: reminder.subject,
        body: reminder.body,
        invoiceNo: inv.invoiceNo,
      });

      dispatches.push({
        invoiceNo: inv.invoiceNo,
        clientEmail: inv.clientEmail,
        tier: matchedTier,
        subject: reminder.subject,
        simulated: emailResult.simulated,
      });
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    scannedCount: scanned.length,
    dispatchedCount: dispatches.length,
    dispatches,
  });
}
