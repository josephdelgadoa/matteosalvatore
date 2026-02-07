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
-- 006_seed_detailed_products.sql

-- 1. LINEN SHIRT
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SHIRT-LINEN-001', 'Camisa de Lino Premium', 'Premium Linen Shirt', 'premium-linen-shirt-white', 
'Confeccionada con 100% lino europeo, esta camisa es la definición de frescura y elegancia relajada. Su corte moderno y transpirabilidad la hacen ideal para el verano o climas cálidos. Botones de madreperla genuina.', 
'Crafted from 100% European linen, this shirt is the definition of freshness and relaxed elegance. Its modern cut and breathability make it ideal for summer or warm climates. Genuine mother-of-pearl buttons.',
'clothing', 'shirts', 289.00, true, true);

-- Variants (S, M, L, XL - White, Beige, Light Blue)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'White', 'MS-SHIRT-LIN-WHT-S', 12, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'M', 'White', 'MS-SHIRT-LIN-WHT-M', 18, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'L', 'White', 'MS-SHIRT-LIN-WHT-L', 20, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'XL', 'White', 'MS-SHIRT-LIN-WHT-XL', 10, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'M', 'Sand', 'MS-SHIRT-LIN-SND-M', 15, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'L', 'Sand', 'MS-SHIRT-LIN-SND-L', 15, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'M', 'Sky Blue', 'MS-SHIRT-LIN-SKY-M', 12, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001';

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1598032446167-d1d73a87163c?q=80&w=2787&auto=format&fit=crop', 'Camisa de lino blanca', true, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=2787&auto=format&fit=crop', 'Detalle camisa lino', false, 1 FROM products WHERE sku = 'MS-SHIRT-LINEN-001';


-- 2. PIMA COTTON POLO
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-POLO-PIMA-001', 'Polo Pima Deluxe', 'Deluxe Pima Polo', 'deluxe-pima-polo-navy', 
'El básico perfecto elevado a la perfección. Hecho con el algodón Pima peruano más fino del mundo, conocido por su suavidad excepcional y durabilidad. Corte regular fit que favorece sin apretar.', 
'The perfect basic elevated to perfection. Made with the world''s finest Peruvian Pima cotton, known for its exceptional softness and durability. Regular fit cut that flatters without tightening.',
'clothing', 'polos', 129.00, true, true);

-- Variants (S-XL - Navy, Black, Burgundy)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'Navy', 'MS-POLO-PIMA-NVY-S', 20, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'M', 'Navy', 'MS-POLO-PIMA-NVY-M', 30, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'L', 'Navy', 'MS-POLO-PIMA-NVY-L', 25, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-POLO-PIMA-BLK-M', 25, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'L', 'Black', 'MS-POLO-PIMA-BLK-L', 20, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001';

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2942&auto=format&fit=crop', 'Polo azul marino hombre', true, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=3072&auto=format&fit=crop', 'Polo negro textura', false, 1 FROM products WHERE sku = 'MS-POLO-PIMA-001';


-- 3. MERINO WOOL SWEATER
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SWTR-MERINO-001', 'Chompa Merino Essential', 'Essential Merino Sweater', 'merino-sweater-grey', 
'Tejida con lana merino extrafina, esta chompa ligera regula la temperatura corporal, manteniéndote cálido en invierno y fresco en transición. Su diseño minimalista la hace perfecta para usar sobre camisa o polo.', 
'Knitted with extra-fine merino wool, this lightweight sweater regulates body temperature, keeping you warm in winter and cool in transition. Its minimalist design makes it perfect for layering over a shirt or polo.',
'clothing', 'sweaters', 349.00, false, true);

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'M', 'Grey', 'MS-SWTR-MER-GRY-M', 10, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001' UNION ALL
SELECT id, 'L', 'Grey', 'MS-SWTR-MER-GRY-L', 12, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001' UNION ALL
SELECT id, 'M', 'Charcoal', 'MS-SWTR-MER-CHR-M', 8, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001';

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2872&auto=format&fit=crop', 'Chompa gris hombre', true, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001';


-- 4. BOMBER JACKET
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-JKT-BOMBER-001', 'Casaca Bomber Técnica', 'Technical Bomber Jacket', 'tech-bomber-jacket-olive', 
'La clásica silueta bomber reinterpretada con tejido técnico repelente al agua. Interior forrado en viscosa suave. Detalles metálicos en acabado gunmetal y puños acanalados de alta resistencia.', 
'The classic bomber silhouette reinterpreted with water-repellent technical fabric. Interior lined in soft viscose. Gunmetal finish metal details and high-resistance ribbed cuffs.',
'clothing', 'jackets', 459.00, true, true);

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'M', 'Olive', 'MS-JKT-BOMB-OLV-M', 8, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001' UNION ALL
SELECT id, 'L', 'Olive', 'MS-JKT-BOMB-OLV-L', 10, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-JKT-BOMB-BLK-M', 12, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001';

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop', 'Casaca bomber verde oliva', true, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001';


-- 5. LEATHER LOAFERS
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SHOE-LOAFER-001', 'Mocasines Penny Cuero', 'Penny Leather Loafers', 'penny-leather-loafers-brown', 
'Hechos a mano por artesanos expertos. Cuero de grano completo que envejece maravillosamente. Suela de cuero con inserto de goma para mayor tracción. El zapato versátil definitivo.', 
'Handmade by expert artisans. Full-grain leather that ages beautifully. Leather sole with rubber insert for added traction. The ultimate versatile shoe.',
'footwear', 'shoes', 589.00, false, true);

-- Variants (40-44)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, '40', 'Dark Brown', 'MS-LOAFER-BRN-40', 5, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001' UNION ALL
SELECT id, '41', 'Dark Brown', 'MS-LOAFER-BRN-41', 6, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001' UNION ALL
SELECT id, '42', 'Dark Brown', 'MS-LOAFER-BRN-42', 8, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001' UNION ALL
SELECT id, '43', 'Dark Brown', 'MS-LOAFER-BRN-43', 5, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001';

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2852&auto=format&fit=crop', 'Mocasines cuero marrón', true, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001';
