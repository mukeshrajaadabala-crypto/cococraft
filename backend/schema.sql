-- =========================================================
-- Konaseema CocoCraft - Neon PostgreSQL Database Schema
-- =========================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    sno INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) DEFAULT '',
    tag VARCHAR(255),
    image TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    alt TEXT,
    description TEXT,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 2. Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    sno INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    code VARCHAR(50) PRIMARY KEY,
    min_subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_percent NUMERIC(5, 4) NOT NULL, -- e.g. 0.05 for 5%
    max_discount NUMERIC(10, 2) DEFAULT NULL, -- NULL indicates no cap
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    sno INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    id VARCHAR(50) PRIMARY KEY,
    idempotency_key VARCHAR(120) UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_state VARCHAR(100) NOT NULL,
    customer_pincode VARCHAR(20) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 100,
    total_amount NUMERIC(10, 2) NOT NULL,
    coupon_code VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    sno INT GENERATED ALWAYS AS IDENTITY UNIQUE,
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
