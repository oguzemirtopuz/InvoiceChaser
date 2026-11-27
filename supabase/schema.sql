-- ============================================================
-- InvoiceChaser — PostgreSQL Veritabanı Şeması & RLS Güvenliği
-- ============================================================

-- Gerekli eklentiler
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANİZASYONLAR (Multi-Tenant Ana Tablo)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    iban VARCHAR(64),
    payment_link TEXT,
    default_currency VARCHAR(8) DEFAULT 'TRY',
    reminder_tone VARCHAR(32) DEFAULT 'professional',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MÜŞTERİLER
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    language VARCHAR(8) DEFAULT 'tr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FATURALAR
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    invoice_no VARCHAR(64) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'TRY',
    due_date DATE NOT NULL,
    payment_link TEXT,
    status VARCHAR(32) DEFAULT 'upcoming', -- 'upcoming', 'overdue', 'paid', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- 4. GÖNDERİLMİŞ HATIRLATMALAR
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    tier INT NOT NULL CHECK (tier BETWEEN 1 AND 4),
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 5. HATIRLATMA KURALLARI
CREATE TABLE IF NOT EXISTS reminder_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tier INT NOT NULL CHECK (tier BETWEEN 1 AND 4),
    trigger_days INT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- İNDEKSLER (Performans Optimizasyonu)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_invoices_org_id ON invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_no ON invoices(invoice_no);
CREATE INDEX IF NOT EXISTS idx_clients_org_id ON clients(org_id);
CREATE INDEX IF NOT EXISTS idx_reminders_invoice_id ON reminders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_rules_org_id ON reminder_rules(org_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI (%100 Idempotent)
-- Her kullanıcı sadece kendi organizasyonunun kayıtlarını görebilir
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_rules ENABLE ROW LEVEL SECURITY;

-- Organizations politikası
DROP POLICY IF EXISTS "Users can access their own organization" ON organizations;
CREATE POLICY "Users can access their own organization"
    ON organizations FOR ALL
    USING (auth.uid() = user_id);

-- Invoices politikası
DROP POLICY IF EXISTS "Users can access their own invoices" ON invoices;
CREATE POLICY "Users can access their own invoices"
    ON invoices FOR ALL
    USING (
        org_id IN (
            SELECT id FROM organizations WHERE user_id = auth.uid()
        )
    );

-- Clients politikası
DROP POLICY IF EXISTS "Users can access their own clients" ON clients;
CREATE POLICY "Users can access their own clients"
    ON clients FOR ALL
    USING (
        org_id IN (
            SELECT id FROM organizations WHERE user_id = auth.uid()
        )
    );

-- Reminders politikası
DROP POLICY IF EXISTS "Users can access reminders of their invoices" ON reminders;
CREATE POLICY "Users can access reminders of their invoices"
    ON reminders FOR ALL
    USING (
        invoice_id IN (
            SELECT id FROM invoices WHERE org_id IN (
                SELECT id FROM organizations WHERE user_id = auth.uid()
            )
        )
    );

-- Rules politikası
DROP POLICY IF EXISTS "Users can access their own reminder rules" ON reminder_rules;
CREATE POLICY "Users can access their own reminder rules"
    ON reminder_rules FOR ALL
    USING (
        org_id IN (
            SELECT id FROM organizations WHERE user_id = auth.uid()
        )
    );
