-- ==============================================================================
-- KODRAN.DEV — Kurumsal Veritabanı & SQL Şeması (PostgreSQL / MySQL / SQLite)
-- ==============================================================================

-- 1. KULLANICILAR & MÜŞTERİ HESAPLARI (USERS)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    company_name VARCHAR(128),
    email VARCHAR(191) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_telegram VARCHAR(64),
    role VARCHAR(32) DEFAULT 'customer', -- 'customer', 'enterprise', 'admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. YAZILIM KATEGORİLERİ (CATEGORIES)
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    slug VARCHAR(128) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. HAZIR YAZILIM & BOT HAVUZU (PRODUCTS)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(191) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    badge VARCHAR(64) DEFAULT 'Yeni',
    sales_badge VARCHAR(128),
    roi_text VARCHAR(255),
    price_try DECIMAL(12, 2) NOT NULL,
    price_usd DECIMAL(12, 2) NOT NULL,
    price_eur DECIMAL(12, 2) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    icon VARCHAR(64) DEFAULT 'Layers',
    accent_color VARCHAR(32) DEFAULT '#4f46e5',
    description TEXT NOT NULL,
    tech_stack JSONB NOT NULL DEFAULT '[]',
    specs JSONB NOT NULL DEFAULT '[]',
    code_snippet TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ÜRÜN LİSANS SEVİYELERİ (PRODUCT_LICENSES)
CREATE TABLE IF NOT EXISTS product_licenses (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
    license_type VARCHAR(128) NOT NULL, -- 'Standart Lisans', 'Ticari Lisans', 'Tam Kaynak Kod'
    price_multiplier DECIMAL(4, 2) DEFAULT 1.0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SİPARİŞLER & CHECKOUT İŞLEMLERİ (ORDERS)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'TRY',
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    coupon_code VARCHAR(32),
    payment_method VARCHAR(32) NOT NULL, -- 'card', 'crypto', 'bank'
    payment_status VARCHAR(32) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    transaction_ref VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SİPARİŞ KALEMLERİ (ORDER_ITEMS)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    license_type VARCHAR(128) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT DEFAULT 1,
    subtotal DECIMAL(12, 2) NOT NULL
);

-- 7. ÜRETİLEN KRİPTOGRAFİK LİSANS ANAHTARLARI (LICENSES)
CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(128) UNIQUE NOT NULL, -- Format: KDR-XXXXX-XXXXX-PRO
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(128) NOT NULL,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_title VARCHAR(191) NOT NULL,
    license_type VARCHAR(128) NOT NULL,
    status VARCHAR(32) DEFAULT 'active', -- 'active', 'revoked', 'expired'
    max_activations INT DEFAULT 1,
    current_activations INT DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ÖZEL PROJE VE TEKLİF TALEPLERİ (CUSTOM_LEADS / CRM)
CREATE TABLE IF NOT EXISTS custom_leads (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    client_name VARCHAR(128) NOT NULL,
    contact_info VARCHAR(128) NOT NULL, -- E-posta, Telefon veya Telegram
    category VARCHAR(64) NOT NULL,
    budget_range VARCHAR(64) NOT NULL,
    project_details TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'Yeni', -- 'Yeni', 'İletişime Geçildi', 'Teklif Sunuldu', 'Tamamlandı'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. GÜVENLİK İNDEKSLERİ (PERFORMANCE INDEXES)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_leads_status ON custom_leads(status);
