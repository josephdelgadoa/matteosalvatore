-- 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name_es VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description_es TEXT,
  description_en TEXT,
  category VARCHAR(50) NOT NULL, -- 'clothing', 'footwear'
  subcategory VARCHAR(50), -- 'pants', 'polos', 'hoodies', 'sneakers'
  base_price DECIMAL(10,2) NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title_es VARCHAR(60),
  seo_title_en VARCHAR(60),
  seo_description_es VARCHAR(160),
  seo_description_en VARCHAR(160),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT VARIANTS
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(10), -- 'S', 'M', 'L', 'XL', '39', '40', '41', '42', '43'
  color VARCHAR(50), -- 'blanco', 'negro', 'azul', 'beige', 'rojo'
  color_hex VARCHAR(7), -- '#FFFFFF', '#000000', etc.
  sku_variant VARCHAR(50) UNIQUE NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  additional_price DECIMAL(10,2) DEFAULT 0, -- precio adicional por variante
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCT IMAGES
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  alt_text_es VARCHAR(255),
  alt_text_en VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUSTOMERS
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  document_type VARCHAR(10), -- 'DNI', 'CE', 'RUC'
  document_number VARCHAR(20),
  password_hash TEXT, -- bcrypt hash
  is_verified BOOLEAN DEFAULT false,
  language_preference VARCHAR(2) DEFAULT 'es', -- 'es', 'en'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADDRESSES
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  label VARCHAR(50), -- 'Casa', 'Oficina', 'Otro'
  street_address VARCHAR(255) NOT NULL,
  district VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'Lima',
  region VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10),
  country VARCHAR(2) DEFAULT 'PE',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL, -- 'MS-20250204-0001'
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', 
  -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  
  -- Totales
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL, -- IGV 18%
  shipping_cost DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PEN',
  
  -- Shipping
  shipping_first_name VARCHAR(100),
  shipping_last_name VARCHAR(100),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_district VARCHAR(100),
  shipping_city VARCHAR(100),
  shipping_region VARCHAR(100),
  
  -- Billing (si es empresa)
  billing_company_name VARCHAR(255),
  billing_ruc VARCHAR(20),
  billing_address TEXT,
  
  -- Tracking
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  language VARCHAR(2) DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name VARCHAR(255) NOT NULL,
  variant_details VARCHAR(100), -- 'Talla: M, Color: Negro'
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  culqi_charge_id VARCHAR(100) UNIQUE,
  payment_method VARCHAR(20), -- 'card', 'yape', 'plin'
  card_brand VARCHAR(20), -- 'visa', 'mastercard', 'amex'
  card_last_four VARCHAR(4),
  status VARCHAR(20) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'PEN',
  culqi_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CART (Redis-like persistent structure for session persistence if needed, though usually Redis is used)
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(100),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHATBOT CONVERSATIONS
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  context JSONB, -- información del cart, usuario, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO METADATA
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type VARCHAR(50) NOT NULL, -- 'home', 'category', 'product', 'custom'
  slug VARCHAR(255),
  title_es VARCHAR(60),
  title_en VARCHAR(60),
  description_es VARCHAR(160),
  description_en VARCHAR(160),
  keywords_es TEXT[],
  keywords_en TEXT[],
  og_image_url TEXT,
  schema_markup JSONB,
  canonical_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
