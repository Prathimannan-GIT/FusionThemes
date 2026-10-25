-- ===================================================================
-- FUSION THEMES MARKETPLACE: COMPLETE PRODUCTION POSTGRESQL SCHEMA
-- Compatible with Supabase, Neon, AWS RDS, Railway, or standard PostgreSQL
-- ===================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===================================================================
-- 2. USERS & PROFILES TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    login_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('developer', 'client', 'admin')) NOT NULL DEFAULT 'client',
    company TEXT,
    avatar_url TEXT,
    bio TEXT,
    hourly_rate NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 3. CATEGORIES TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0
);

-- ===================================================================
-- 4. TEMPLATES TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    category_id TEXT REFERENCES categories(id) ON DELETE RESTRICT,
    developer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    developer_name TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT NOT NULL,
    demo_url TEXT NOT NULL,
    source_zip_url TEXT,
    language TEXT NOT NULL DEFAULT 'JavaScript (ES6+)',
    framework TEXT NOT NULL DEFAULT 'React 18 & Tailwind CSS',
    technologies TEXT[] DEFAULT '{}',
    description TEXT,
    features TEXT[] DEFAULT '{}',
    sales_count INTEGER NOT NULL DEFAULT 0,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 5. ORDERS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- e.g., 'ORD-582910'
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('Pending', 'Completed', 'Failed', 'Refunded')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 6. ORDER LINE ITEMS TABLE (Many-to-Many: Order <-> Template)
-- ===================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    template_id TEXT REFERENCES templates(id) ON DELETE RESTRICT,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 7. PAYMENT TRANSACTIONS TABLE (Payment Gateway Verification Ledger)
-- ===================================================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    transaction_reference TEXT UNIQUE NOT NULL, -- e.g. 'txn_stripe_srv_...'
    gateway TEXT NOT NULL DEFAULT 'Stripe',
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    payment_status TEXT CHECK (payment_status IN ('succeeded', 'declined', 'pending', 'cancelled', 'refunded')) NOT NULL,
    card_brand TEXT,
    card_last4 TEXT,
    verified_by_server BOOLEAN DEFAULT FALSE,
    raw_response JSONB,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 8. REVIEWS & RATINGS TABLE
-- ===================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 9. TEMPLATE LIKES TABLE (Guarantees 1 like per user per template)
-- ===================================================================
CREATE TABLE IF NOT EXISTS template_likes (
    template_id TEXT REFERENCES templates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (template_id, user_id)
);

-- ===================================================================
-- 10. CLIENT-TO-DEVELOPER CONVERSATIONS & MESSAGES
-- ===================================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    developer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id TEXT REFERENCES templates(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sender_role TEXT CHECK (sender_role IN ('developer', 'client', 'admin')) NOT NULL,
    sender_name TEXT NOT NULL,
    text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 11. CLIENT CUSTOM PROJECT BRIEFS
-- ===================================================================
CREATE TABLE IF NOT EXISTS client_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_ref_id TEXT REFERENCES templates(id) ON DELETE SET NULL,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================
-- 12. INDEXES (Optimized for search & low latency)
-- ===================================================================
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_developer ON templates(developer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_template ON order_items(template_id);
CREATE INDEX IF NOT EXISTS idx_payment_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_template ON reviews(template_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_template_likes_template ON template_likes(template_id);

-- ===================================================================
-- 13. AUTOMATED HELPER FUNCTIONS
-- ===================================================================

-- Function to increment template sales atomically upon verified transaction
CREATE OR REPLACE FUNCTION increment_template_sales(target_template_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE templates
    SET sales_count = sales_count + 1
    WHERE id = target_template_id;
END;
$$ LANGUAGE plpgsql;

-- View: Templates with Live Aggregated Rating & Likes (Zero Fabrication)
CREATE OR REPLACE VIEW v_template_marketplace AS
SELECT 
    t.*,
    COALESCE(AVG(r.rating), NULL) AS calculated_rating,
    COUNT(DISTINCT r.id) AS reviews_count,
    COUNT(DISTINCT l.user_id) AS likes_count,
    u.full_name AS author_name,
    u.email AS author_email
FROM templates t
LEFT JOIN users u ON t.developer_id = u.id
LEFT JOIN reviews r ON t.id = r.template_id
LEFT JOIN template_likes l ON t.id = l.template_id
GROUP BY t.id, u.id;
