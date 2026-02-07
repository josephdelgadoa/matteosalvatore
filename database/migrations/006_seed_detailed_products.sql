-- 006_seed_detailed_products.sql (Idempotent Version)

-- 1. LINEN SHIRT
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SHIRT-LINEN-001', 'Camisa de Lino Premium', 'Premium Linen Shirt', 'premium-linen-shirt-white', 
'Confeccionada con 100% lino europeo, esta camisa es la definición de frescura y elegancia relajada. Su corte moderno y transpirabilidad la hacen ideal para el verano o climas cálidos. Botones de madreperla genuina.', 
'Crafted from 100% European linen, this shirt is the definition of freshness and relaxed elegance. Its modern cut and breathability make it ideal for summer or warm climates. Genuine mother-of-pearl buttons.',
'clothing', 'shirts', 289.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (S, M, L, XL - White, Beige, Light Blue)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'White', 'MS-SHIRT-LIN-WHT-S', 12, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'M', 'White', 'MS-SHIRT-LIN-WHT-M', 18, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'L', 'White', 'MS-SHIRT-LIN-WHT-L', 20, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'XL', 'White', 'MS-SHIRT-LIN-WHT-XL', 10, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'M', 'Sand', 'MS-SHIRT-LIN-SND-M', 15, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'L', 'Sand', 'MS-SHIRT-LIN-SND-L', 15, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' UNION ALL
SELECT id, 'M', 'Sky Blue', 'MS-SHIRT-LIN-SKY-M', 12, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
-- Note: product_images usually doesn't have a unique constraint on (product_id, image_url), so we'll just check existence via subquery to avoid duplicates if re-running.
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1598032446167-d1d73a87163c?q=80&w=2787&auto=format&fit=crop', 'Camisa de lino blanca', true, 0 FROM products WHERE sku = 'MS-SHIRT-LINEN-001' 
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1598032446167-d1d73a87163c?q=80&w=2787&auto=format&fit=crop')
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=2787&auto=format&fit=crop', 'Detalle camisa lino', false, 1 FROM products WHERE sku = 'MS-SHIRT-LINEN-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=2787&auto=format&fit=crop');


-- 2. PIMA COTTON POLO
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-POLO-PIMA-001', 'Polo Pima Deluxe', 'Deluxe Pima Polo', 'deluxe-pima-polo-navy', 
'El básico perfecto elevado a la perfección. Hecho con el algodón Pima peruano más fino del mundo, conocido por su suavidad excepcional y durabilidad. Corte regular fit que favorece sin apretar.', 
'The perfect basic elevated to perfection. Made with the world''s finest Peruvian Pima cotton, known for its exceptional softness and durability. Regular fit cut that flatters without tightening.',
'clothing', 'polos', 129.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (S-XL - Navy, Black, Burgundy)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'Navy', 'MS-POLO-PIMA-NVY-S', 20, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'M', 'Navy', 'MS-POLO-PIMA-NVY-M', 30, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'L', 'Navy', 'MS-POLO-PIMA-NVY-L', 25, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-POLO-PIMA-BLK-M', 25, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' UNION ALL
SELECT id, 'L', 'Black', 'MS-POLO-PIMA-BLK-L', 20, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2942&auto=format&fit=crop', 'Polo azul marino hombre', true, 0 FROM products WHERE sku = 'MS-POLO-PIMA-001' 
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2942&auto=format&fit=crop')
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=3072&auto=format&fit=crop', 'Polo negro textura', false, 1 FROM products WHERE sku = 'MS-POLO-PIMA-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=3072&auto=format&fit=crop');


-- 3. MERINO WOOL SWEATER
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SWTR-MERINO-001', 'Chompa Merino Essential', 'Essential Merino Sweater', 'merino-sweater-grey', 
'Tejida con lana merino extrafina, esta chompa ligera regula la temperatura corporal, manteniéndote cálido en invierno y fresco en transición. Su diseño minimalista la hace perfecta para usar sobre camisa o polo.', 
'Knitted with extra-fine merino wool, this lightweight sweater regulates body temperature, keeping you warm in winter and cool in transition. Its minimalist design makes it perfect for layering over a shirt or polo.',
'clothing', 'sweaters', 349.00, false, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'M', 'Grey', 'MS-SWTR-MER-GRY-M', 10, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001' UNION ALL
SELECT id, 'L', 'Grey', 'MS-SWTR-MER-GRY-L', 12, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001' UNION ALL
SELECT id, 'M', 'Charcoal', 'MS-SWTR-MER-CHR-M', 8, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2872&auto=format&fit=crop', 'Chompa gris hombre', true, 0 FROM products WHERE sku = 'MS-SWTR-MERINO-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2872&auto=format&fit=crop');


-- 4. BOMBER JACKET
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-JKT-BOMBER-001', 'Casaca Bomber Técnica', 'Technical Bomber Jacket', 'tech-bomber-jacket-olive', 
'La clásica silueta bomber reinterpretada con tejido técnico repelente al agua. Interior forrado en viscosa suave. Detalles metálicos en acabado gunmetal y puños acanalados de alta resistencia.', 
'The classic bomber silhouette reinterpreted with water-repellent technical fabric. Interior lined in soft viscose. Gunmetal finish metal details and high-resistance ribbed cuffs.',
'clothing', 'jackets', 459.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'M', 'Olive', 'MS-JKT-BOMB-OLV-M', 8, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001' UNION ALL
SELECT id, 'L', 'Olive', 'MS-JKT-BOMB-OLV-L', 10, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-JKT-BOMB-BLK-M', 12, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop', 'Casaca bomber verde oliva', true, 0 FROM products WHERE sku = 'MS-JKT-BOMBER-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop');


-- 5. LEATHER LOAFERS
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SHOE-LOAFER-001', 'Mocasines Penny Cuero', 'Penny Leather Loafers', 'penny-leather-loafers-brown', 
'Hechos a mano por artesanos expertos. Cuero de grano completo que envejece maravillosamente. Suela de cuero con inserto de goma para mayor tracción. El zapato versátil definitivo.', 
'Handmade by expert artisans. Full-grain leather that ages beautifully. Leather sole with rubber insert for added traction. The ultimate versatile shoe.',
'footwear', 'shoes', 589.00, false, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (40-44)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, '40', 'Dark Brown', 'MS-LOAFER-BRN-40', 5, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001' UNION ALL
SELECT id, '41', 'Dark Brown', 'MS-LOAFER-BRN-41', 6, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001' UNION ALL
SELECT id, '42', 'Dark Brown', 'MS-LOAFER-BRN-42', 8, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001' UNION ALL
SELECT id, '43', 'Dark Brown', 'MS-LOAFER-BRN-43', 5, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2852&auto=format&fit=crop', 'Mocasines cuero marrón', true, 0 FROM products WHERE sku = 'MS-SHOE-LOAFER-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2852&auto=format&fit=crop');
