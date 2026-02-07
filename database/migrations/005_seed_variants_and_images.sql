-- 005_seed_variants_and_images.sql

-- Helper function/block to insert data relative to existing products
-- We use DO block to allow variables, but standard SQL migrations in Supabase running in editor might not support complex PL/pgSQL blocks easily without wrapping in a function. 
-- Simple subqueries are safer for raw SQL execution.

-- 1. VARIANTS FOR T-SHIRT (MS-TEE-001) values: S/M/L/XL, White/Black/Navy
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'White', 'MS-TEE-001-WHT-S', 10, 0 FROM products WHERE sku = 'MS-TEE-001'
UNION ALL
SELECT id, 'M', 'White', 'MS-TEE-001-WHT-M', 15, 0 FROM products WHERE sku = 'MS-TEE-001'
UNION ALL
SELECT id, 'L', 'White', 'MS-TEE-001-WHT-L', 20, 0 FROM products WHERE sku = 'MS-TEE-001'
UNION ALL
SELECT id, 'M', 'Black', 'MS-TEE-001-BLK-M', 15, 0 FROM products WHERE sku = 'MS-TEE-001'
UNION ALL
SELECT id, 'L', 'Black', 'MS-TEE-001-BLK-L', 20, 0 FROM products WHERE sku = 'MS-TEE-001'
UNION ALL
SELECT id, 'M', 'Navy', 'MS-TEE-001-NVY-M', 12, 0 FROM products WHERE sku = 'MS-TEE-001';

-- 2. VARIANTS FOR CHINO (MS-PANT-001) values: 30/32/34, Beige/Navy
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, '30', 'Beige', 'MS-PANT-001-BGE-30', 8, 0 FROM products WHERE sku = 'MS-PANT-001'
UNION ALL
SELECT id, '32', 'Beige', 'MS-PANT-001-BGE-32', 12, 0 FROM products WHERE sku = 'MS-PANT-001'
UNION ALL
SELECT id, '32', 'Navy', 'MS-PANT-001-NVY-32', 10, 0 FROM products WHERE sku = 'MS-PANT-001'
UNION ALL
SELECT id, '34', 'Navy', 'MS-PANT-001-NVY-34', 8, 0 FROM products WHERE sku = 'MS-PANT-001';

-- 3. VARIANTS FOR SNEAKERS (MS-SHOE-001) values: 40/41/42/43, White
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, '40', 'White', 'MS-SHOE-001-WHT-40', 5, 0 FROM products WHERE sku = 'MS-SHOE-001'
UNION ALL
SELECT id, '41', 'White', 'MS-SHOE-001-WHT-41', 8, 0 FROM products WHERE sku = 'MS-SHOE-001'
UNION ALL
SELECT id, '42', 'White', 'MS-SHOE-001-WHT-42', 8, 0 FROM products WHERE sku = 'MS-SHOE-001'
UNION ALL
SELECT id, '43', 'White', 'MS-SHOE-001-WHT-43', 6, 0 FROM products WHERE sku = 'MS-SHOE-001';

-- 4. IMAGES FOR T-SHIRT
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2960&auto=format&fit=crop', 'Camiseta blanca hombre', true, 0 FROM products WHERE sku = 'MS-TEE-001'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2787&auto=format&fit=crop', 'Camiseta negra detalle', false, 1 FROM products WHERE sku = 'MS-TEE-001';

-- 5. IMAGES FOR CHINO
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=2787&auto=format&fit=crop', 'Pantalón chino beige', true, 0 FROM products WHERE sku = 'MS-PANT-001';

-- 6. IMAGES FOR SNEAKERS
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?q=80&w=2787&auto=format&fit=crop', 'Zapatillas cuero blancas', true, 0 FROM products WHERE sku = 'MS-SHOE-001'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1600185365483-26d7a042b612?q=80&w=2874&auto=format&fit=crop', 'Zapatillas cuero detalle', false, 1 FROM products WHERE sku = 'MS-SHOE-001';
