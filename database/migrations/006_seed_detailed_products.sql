-- 006_seed_detailed_products.sql (Idempotent Version)

-- 1. LINEN SHIRT (Camisa Tulum)
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('00512000', 'Camisa de Lino Premium', 'Premium Linen Shirt', 'premium-linen-shirt-white', 
'Confeccionada con 100% lino europeo, esta camisa es la definición de frescura y elegancia relajada. Su corte moderno y transpirabilidad la hacen ideal para el verano o climas cálidos. Botones de madreperla genuina.', 
'Crafted from 100% European linen, this shirt is the definition of freshness and relaxed elegance. Its modern cut and breathability make it ideal for summer or warm climates. Genuine mother-of-pearl buttons.',
'clothing', 'shirts', 289.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (S-XL - Blanco, Arena)
INSERT INTO product_variants (product_id, size, color, sku_variant, barcode, stock_quantity, additional_price)
SELECT id, 'S', 'Blanco', '00512000081', '00512000081', 12, 0 FROM products WHERE sku = '00512000' UNION ALL
SELECT id, 'M', 'Blanco', '00512000082', '00512000082', 18, 0 FROM products WHERE sku = '00512000' UNION ALL
SELECT id, 'L', 'Blanco', '00512000083', '00512000083', 20, 0 FROM products WHERE sku = '00512000' UNION ALL
SELECT id, 'XL', 'Blanco', '00512000084', '00512000084', 10, 0 FROM products WHERE sku = '00512000' UNION ALL
SELECT id, 'M', 'Arena', '00512000422', '00512000422', 15, 0 FROM products WHERE sku = '00512000' UNION ALL
SELECT id, 'L', 'Arena', '00512000423', '00512000423', 15, 0 FROM products WHERE sku = '00512000'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1598032446167-d1d73a87163c?q=80&w=2787&auto=format&fit=crop', 'Camisa de lino blanca', true, 0 FROM products WHERE sku = '00512000' 
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1598032446167-d1d73a87163c?q=80&w=2787&auto=format&fit=crop')
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=2787&auto=format&fit=crop', 'Detalle camisa lino', false, 1 FROM products WHERE sku = '00512000'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=2787&auto=format&fit=crop');


-- 2. PIMA COTTON POLO (Polo Pima Básico)
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('00501000', 'Polo Pima Deluxe', 'Deluxe Pima Polo', 'deluxe-pima-polo-navy', 
'El básico perfecto elevado a la perfección. Hecho con el algodón Pima peruano más fino del mundo, conocido por su suavidad excepcional y durabilidad. Corte regular fit que favorece sin apretar.', 
'The perfect basic elevated to perfection. Made with the world''s finest Peruvian Pima cotton, known for its exceptional softness and durability. Regular fit cut that flatters without tightening.',
'clothing', 'polos', 129.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (S-XL - Azul Marino, Negro)
INSERT INTO product_variants (product_id, size, color, sku_variant, barcode, stock_quantity, additional_price)
SELECT id, 'S', 'Azul Marino', '00501000021', '00501000021', 20, 0 FROM products WHERE sku = '00501000' UNION ALL
SELECT id, 'M', 'Azul Marino', '00501000022', '00501000022', 30, 0 FROM products WHERE sku = '00501000' UNION ALL
SELECT id, 'L', 'Azul Marino', '00501000023', '00501000023', 25, 0 FROM products WHERE sku = '00501000' UNION ALL
SELECT id, 'M', 'Negro', '00501000252', '00501000252', 25, 0 FROM products WHERE sku = '00501000' UNION ALL
SELECT id, 'L', 'Negro', '00501000253', '00501000253', 20, 0 FROM products WHERE sku = '00501000'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2942&auto=format&fit=crop', 'Polo azul marino hombre', true, 0 FROM products WHERE sku = '00501000' 
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2942&auto=format&fit=crop')
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=3072&auto=format&fit=crop', 'Polo negro textura', false, 1 FROM products WHERE sku = '00501000'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=3072&auto=format&fit=crop');


-- 3. MERINO WOOL SWEATER (Chompa Merino)
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('00513000', 'Chompa Merino Essential', 'Essential Merino Sweater', 'merino-sweater-grey', 
'Tejida con lana merino extrafina, esta chompa ligera regula la temperatura corporal, manteniéndote cálido en invierno y fresco en transición. Su diseño minimalista la hace perfecta para usar sobre camisa o polo.', 
'Knitted with extra-fine merino wool, this lightweight sweater regulates body temperature, keeping you warm in winter and cool in transition. Its minimalist design makes it perfect for layering over a shirt or polo.',
'clothing', 'sweaters', 349.00, false, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (Gris, Gris Carbón)
INSERT INTO product_variants (product_id, size, color, sku_variant, barcode, stock_quantity, additional_price)
SELECT id, 'M', 'Gris', '00513000142', '00513000142', 10, 0 FROM products WHERE sku = '00513000' UNION ALL
SELECT id, 'L', 'Gris', '00513000143', '00513000143', 12, 0 FROM products WHERE sku = '00513000' UNION ALL
SELECT id, 'M', 'Gris Carbón', '00513000162', '00513000162', 8, 0 FROM products WHERE sku = '00513000'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2872&auto=format&fit=crop', 'Chompa gris hombre', true, 0 FROM products WHERE sku = '00513000'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2872&auto=format&fit=crop');


-- 4. BOMBER JACKET
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('00506000', 'Casaca Bomber Técnica', 'Technical Bomber Jacket', 'tech-bomber-jacket-olive', 
'La clásica silueta bomber reinterpretada con tejido técnico repelente al agua. Interior forrado en viscosa suave. Detalles metálicos en acabado gunmetal y puños acanalados de alta resistencia.', 
'The classic bomber silhouette reinterpreted with water-repellent technical fabric. Interior lined in soft viscose. Gunmetal finish metal details and high-resistance ribbed cuffs.',
'clothing', 'jackets', 459.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (Verde Oliva, Negro)
INSERT INTO product_variants (product_id, size, color, sku_variant, barcode, stock_quantity, additional_price)
SELECT id, 'M', 'Verde Oliva', '00506000372', '00506000372', 8, 0 FROM products WHERE sku = '00506000' UNION ALL
SELECT id, 'L', 'Verde Oliva', '00506000373', '00506000373', 10, 0 FROM products WHERE sku = '00506000' UNION ALL
SELECT id, 'M', 'Negro', '00506000252', '00506000252', 12, 0 FROM products WHERE sku = '00506000'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop', 'Casaca bomber verde oliva', true, 0 FROM products WHERE sku = '00506000'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop');


-- 5. LEATHER LOAFERS
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('00508000', 'Mocasines Penny Cuero', 'Penny Leather Loafers', 'penny-leather-loafers-brown', 
'Hechos a mano por artesanos expertos. Cuero de grano completo que envejece maravillosamente. Suela de cuero con inserto de goma para mayor tracción. El zapato versátil definitivo.', 
'Handmade by expert artisans. Full-grain leather that ages beautifully. Leather sole with rubber insert for added traction. The ultimate versatile shoe.',
'footwear', 'shoes', 589.00, false, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants (40-44)
INSERT INTO product_variants (product_id, size, color, sku_variant, barcode, stock_quantity, additional_price)
SELECT id, '40', 'Marrón', '00508000207', '00508000207', 5, 0 FROM products WHERE sku = '00508000'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2852&auto=format&fit=crop', 'Mocasines cuero marrón', true, 0 FROM products WHERE sku = '00508000'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2852&auto=format&fit=crop');
ormat&fit=crop');
