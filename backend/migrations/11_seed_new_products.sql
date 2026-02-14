-- Migration: Seed 5 new products from screenshot
-- 1. Pantalones Cargo Fit
INSERT INTO products (slug, name_es, name_en, description_es, description_en, base_price, category, subcategory, is_active, is_featured)
VALUES (
    'pantalones-cargo-fit',
    'Pantalones Cargo Fit',
    'Cargo Fit Pants',
    'Material: Drill 100% algodón. Pantalones cargo cómodos y resistentes, ideales para un look urbano.',
    'Material: 100% Cotton Drill. Comfortable and durable cargo pants, ideal for an urban look.',
    119.00,
    'bottoms',
    'cargo-fit',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Variants for Cargo Fit
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, '30', 'Beige', 15, true FROM products WHERE slug = 'pantalones-cargo-fit'
UNION ALL SELECT id, '32', 'Beige', 15, true FROM products WHERE slug = 'pantalones-cargo-fit'
UNION ALL SELECT id, '34', 'Beige', 15, true FROM products WHERE slug = 'pantalones-cargo-fit'
UNION ALL SELECT id, '30', 'Black', 15, true FROM products WHERE slug = 'pantalones-cargo-fit'
UNION ALL SELECT id, '32', 'Black', 15, true FROM products WHERE slug = 'pantalones-cargo-fit'
UNION ALL SELECT id, '34', 'Black', 15, true FROM products WHERE slug = 'pantalones-cargo-fit';


-- 2. Pantalones Skinny MS
INSERT INTO products (slug, name_es, name_en, description_es, description_en, base_price, category, subcategory, is_active, is_featured)
VALUES (
    'pantalones-skinny-ms',
    'Pantalones Skinny MS',
    'Skinny Fit Pants MS',
    'Material: Drill Strech. Ajuste perfecto y máxima comodidad con nuestro drill stretch premium.',
    'Material: Stretch Drill. Perfect fit and maximum comfort with our premium stretch drill.',
    89.00,
    'bottoms',
    'joggers', -- Using joggers as fallback or general bottoms if skinny not specific
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Variants for Skinny MS
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, '30', 'Black', 20, true FROM products WHERE slug = 'pantalones-skinny-ms'
UNION ALL SELECT id, '32', 'Black', 20, true FROM products WHERE slug = 'pantalones-skinny-ms'
UNION ALL SELECT id, '34', 'Black', 20, true FROM products WHERE slug = 'pantalones-skinny-ms';


-- 3. Conjunto Rangla MS
INSERT INTO products (slug, name_es, name_en, description_es, description_en, base_price, category, subcategory, is_active, is_featured)
VALUES (
    'conjunto-rangla-ms',
    'Conjunto Rangla MS',
    'Rangla Set MS',
    'Material del producto: Polo algodón pima y Short french terry 100% algodón. Un conjunto fresco y de alta calidad.',
    'Product material: Pima cotton polo and French terry 100% cotton shorts. A fresh and high-quality set.',
    89.00,
    'matching-sets',
    'conjunto-rangla',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Variants for Conjunto Rangla
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, 'S', 'Black/Grey', 10, true FROM products WHERE slug = 'conjunto-rangla-ms'
UNION ALL SELECT id, 'M', 'Black/Grey', 10, true FROM products WHERE slug = 'conjunto-rangla-ms'
UNION ALL SELECT id, 'L', 'Black/Grey', 10, true FROM products WHERE slug = 'conjunto-rangla-ms';


-- 4. Polos Básicos MS
INSERT INTO products (slug, name_es, name_en, description_es, description_en, base_price, category, subcategory, is_active, is_featured)
VALUES (
    'polos-basicos-ms',
    'Polos Básicos MS',
    'Basic Polos MS',
    'Material: Polo algodón pima. El básico esencial con la suavidad del algodón pima.',
    'Material: Pima cotton polo. The essential basic with the softness of pima cotton.',
    39.90,
    'tops',
    'basics',
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Variants for Polos Básicos
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, 'S', 'Red', 25, true FROM products WHERE slug = 'polos-basicos-ms'
UNION ALL SELECT id, 'M', 'Red', 25, true FROM products WHERE slug = 'polos-basicos-ms'
UNION ALL SELECT id, 'L', 'Red', 25, true FROM products WHERE slug = 'polos-basicos-ms'
UNION ALL SELECT id, 'S', 'White', 25, true FROM products WHERE slug = 'polos-basicos-ms'
UNION ALL SELECT id, 'M', 'White', 25, true FROM products WHERE slug = 'polos-basicos-ms'
UNION ALL SELECT id, 'L', 'White', 25, true FROM products WHERE slug = 'polos-basicos-ms';


-- 5. Conjunto Tulum MS
INSERT INTO products (slug, name_es, name_en, description_es, description_en, base_price, category, subcategory, is_active, is_featured)
VALUES (
    'conjunto-tulum-ms',
    'Conjunto Tulum MS',
    'Tulum Set MS',
    'Material: Lino. Elegancia y frescura para tus días de verano.',
    'Material: Linen. Elegance and freshness for your summer days.',
    129.00,
    'matching-sets',
    'conjunto-canguro', -- Mapping to closest matching set subcategory or just generic
    true,
    true
) ON CONFLICT (slug) DO NOTHING;

-- Variants for Conjunto Tulum
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, 'S', 'Beige', 8, true FROM products WHERE slug = 'conjunto-tulum-ms'
UNION ALL SELECT id, 'M', 'Beige', 8, true FROM products WHERE slug = 'conjunto-tulum-ms'
UNION ALL SELECT id, 'L', 'Beige', 8, true FROM products WHERE slug = 'conjunto-tulum-ms';
