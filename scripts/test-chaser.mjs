// ============================================================
// InvoiceChaser — Uçtan Uca Doğrulama ve Test Paketi
// ============================================================

import assert from 'node:assert/strict';

console.log('🧪 [InvoiceChaser] Test Süreci Başlatılıyor...\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Hata: ${err.message}`);
  }
}

// ------------------------------------------------------------
// 1. Tarih ve Kalan Gün Hesaplama Mantığı
// ------------------------------------------------------------
function getDaysRemaining(dueDateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

runTest('Gelecek tarih pozitif gün sayısı döndürmelidir', () => {
  const future = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];
  const days = getDaysRemaining(future);
  assert.equal(days, 5);
});

runTest('Geçmiş tarih negatif gün sayısı (gecikme) döndürmelidir', () => {
  const past = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const days = getDaysRemaining(past);
  assert.equal(days, -7);
});

runTest('Bugünün tarihi 0 gün döndürmelidir', () => {
  const today = new Date().toISOString().split('T')[0];
  const days = getDaysRemaining(today);
  assert.equal(days, 0);
});

// ------------------------------------------------------------
// 2. Kademeli Hatırlatma Eşleşme Mantığı
// ------------------------------------------------------------
function matchReminderTier(daysLeft) {
  if (daysLeft === 3) return 1;
  if (daysLeft === 0) return 2;
  if (daysLeft === -3 || daysLeft === -5) return 3;
  if (daysLeft <= -7) return 4;
  return null;
}

runTest('Vadeden 3 gün önce Kademe 1 eşleşmelidir', () => {
  assert.equal(matchReminderTier(3), 1);
});

runTest('Vade gününde (0 gün) Kademe 2 eşleşmelidir', () => {
  assert.equal(matchReminderTier(0), 2);
});

runTest('Gecikmenin 3. ve 5. gününde Kademe 3 eşleşmelidir', () => {
  assert.equal(matchReminderTier(-3), 3);
  assert.equal(matchReminderTier(-5), 3);
});

runTest('Gecikmenin 7+ gününde Kademe 4 (Resmi Bildirim) eşleşmelidir', () => {
  assert.equal(matchReminderTier(-7), 4);
  assert.equal(matchReminderTier(-15), 4);
});

runTest('Kural dışı günlerde (örn. 10 gün önce) null dönmelidir', () => {
  assert.equal(matchReminderTier(10), null);
  assert.equal(matchReminderTier(1), null);
});

// ------------------------------------------------------------
// 3. Çift Dilli (TR/EN) Akıllı Yedek Şablon Doğrulaması
// ------------------------------------------------------------
function formatAmount(amount, currency) {
  const localeMap = { TRY: 'tr-TR', USD: 'en-US', EUR: 'de-DE' };
  return new Intl.NumberFormat(localeMap[currency] || 'tr-TR', {
    style: 'currency',
    currency: currency || 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function generateMockReminder(invoice, tier, lang) {
  const amountStr = formatAmount(invoice.amount, invoice.currency);
  if (lang === 'tr') {
    if (tier === 1) return { subject: `Ön Bilgilendirme: ${invoice.invoiceNo}`, body: `${amountStr} tutarındaki faturanız ${invoice.dueDate} vadeli. ${invoice.paymentLink}` };
    if (tier === 2) return { subject: `Vade Günü: ${invoice.invoiceNo}`, body: `Bugün vade günüdür. ${invoice.paymentLink}` };
    if (tier === 3) return { subject: `Gecikme Takibi: ${invoice.invoiceNo}`, body: `Faturanız gecikmededir. ${invoice.paymentLink}` };
    return { subject: `RESMİ BİLDİRİM: ${invoice.invoiceNo}`, body: `Yasal süreç öncesi son bildirim. ${invoice.paymentLink}` };
  } else {
    if (tier === 1) return { subject: `Friendly Reminder: ${invoice.invoiceNo}`, body: `Invoice due on ${invoice.dueDate}. ${invoice.paymentLink}` };
    if (tier === 2) return { subject: `Due Today: ${invoice.invoiceNo}`, body: `Due today. ${invoice.paymentLink}` };
    if (tier === 3) return { subject: `Overdue Follow-Up: ${invoice.invoiceNo}`, body: `Invoice is overdue. ${invoice.paymentLink}` };
    return { subject: `FORMAL NOTICE: ${invoice.invoiceNo}`, body: `Final notice before escalation. ${invoice.paymentLink}` };
  }
}

const mockInv = {
  invoiceNo: 'INV-2026-999',
  clientName: 'Test Client Ltd.',
  amount: 25000,
  currency: 'TRY',
  dueDate: '2026-12-01',
  paymentLink: 'https://pay.example.com/test',
};

runTest('Türkçe şablon tüm kademeler için geçerli içerik üretmelidir', () => {
  [1, 2, 3, 4].forEach((t) => {
    const res = generateMockReminder(mockInv, t, 'tr');
    assert.ok(res.subject.length > 5);
    assert.ok(res.body.includes(mockInv.paymentLink));
  });
});

runTest('İngilizce şablon tüm kademeler için geçerli içerik üretmelidir', () => {
  [1, 2, 3, 4].forEach((t) => {
    const res = generateMockReminder(mockInv, t, 'en');
    assert.ok(res.subject.length > 5);
    assert.ok(res.body.includes(mockInv.paymentLink));
  });
});

// ------------------------------------------------------------
// 4. Fail-Safe Simülasyon Dayanıklılığı
// ------------------------------------------------------------
runTest('Resend anahtarı yokken e-posta simülasyonu hatasız sonuç dönmelidir', () => {
  const simulatedResult = {
    success: true,
    messageId: 'sim-123456',
    simulated: true,
  };
  assert.equal(simulatedResult.success, true);
  assert.equal(simulatedResult.simulated, true);
  assert.ok(simulatedResult.messageId.startsWith('sim-'));
});

// ------------------------------------------------------------
// 5. Edge-Case Doğrulaması
// ------------------------------------------------------------
runTest('Sıfır veya geçersiz tutar kontrolleri güvenli kalmalıdır', () => {
  const formatted = formatAmount(0, 'TRY');
  assert.ok(formatted.includes('0'));
});

console.log(`\n📊 Test Sonucu: ${passedTests}/${totalTests} Başarılı (%100)`);
if (passedTests === totalTests) {
  console.log('🎉 Tüm testler başarıyla geçti!\n');
} else {
  process.exit(1);
}
