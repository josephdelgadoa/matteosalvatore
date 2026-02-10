-- 007_add_urban_collection.sql

-- 1. JOGGERS URBAN FIT
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-PANT-JOGGER-001', 'Joggers Urban Fit', 'Urban Fit Joggers', 'urban-fit-joggers', 
'Nuestros Joggers Urban Fit son la base perfecta para cualquier outfit urbano. Diseñados con un corte impecable que estiliza la silueta sin perder comodidad, se adaptan a tu ritmo diario. Combínalos fácilmente con polos clásicos o texturizados.', 
'Our Urban Fit Joggers are the perfect foundation for any urban outfit. Designed with an impeccable cut that stylizes the silhouette without losing comfort, they adapt to your daily rhythm. Easily combine them with classic or textured polos.',
'clothing', 'pants', 189.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'Black', 'MS-JOG-BLK-S', 15, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-JOG-BLK-M', 20, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001' UNION ALL
SELECT id, 'L', 'Black', 'MS-JOG-BLK-L', 20, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001' UNION ALL
SELECT id, 'XL', 'Black', 'MS-JOG-BLK-XL', 10, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001' UNION ALL
SELECT id, 'M', 'Grey Melange', 'MS-JOG-GRY-M', 15, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001' UNION ALL
SELECT id, 'L', 'Grey Melange', 'MS-JOG-GRY-L', 15, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001' UNION ALL
SELECT id, 'M', 'Midnight Blue', 'MS-JOG-NVY-M', 15, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2849&auto=format&fit=crop', 'Joggers negros hombre', true, 0 FROM products WHERE sku = 'MS-PANT-JOGGER-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2849&auto=format&fit=crop');


-- 2. POLOS URBANOS
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-POLO-URBAN-001', 'Polo Urbano', 'Urban Polo', 'urban-polo', 
'Los Polos Urbanos Matteo Salvatore están diseñados para complementar cualquier outfit con actitud y estilo. Con cortes modernos y materiales cómodos, son ideales para crear combinaciones versátiles junto a joggers o cargos.', 
'Matteo Salvatore Urban Polos are designed to complement any outfit with attitude and style. With modern cuts and comfortable materials, they are ideal for creating versatile combinations alongside joggers or cargos.',
'clothing', 'polos', 89.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'White', 'MS-POL-WHT-S', 25, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001' UNION ALL
SELECT id, 'M', 'White', 'MS-POL-WHT-M', 30, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001' UNION ALL
SELECT id, 'L', 'White', 'MS-POL-WHT-L', 30, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-POL-BLK-M', 30, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001' UNION ALL
SELECT id, 'L', 'Black', 'MS-POL-BLK-L', 30, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001' UNION ALL
SELECT id, 'M', 'Beige', 'MS-POL-BGE-M', 20, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001' UNION ALL
SELECT id, 'M', 'Olive Green', 'MS-POL-OLV-M', 20, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2960&auto=format&fit=crop', 'Polo blanco urbano', true, 0 FROM products WHERE sku = 'MS-POLO-URBAN-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2960&auto=format&fit=crop');


-- 3. CONJUNTO RANGLA
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SET-RANGLA-001', 'Conjunto Rangla', 'Rangla Set', 'rangla-set', 
'El Conjunto Rangla redefine el streetwear con un diseño distintivo: mangas que se extienden hasta el cuello, creando una silueta moderna y original. Pensado para quienes buscan destacar sin perder comodidad.', 
'The Rangla Set redefines streetwear with a distinctive design: sleeves that extend to the neck, creating a modern and original silhouette. Designed for those who seek to stand out without losing comfort.',
'clothing', 'sets', 249.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'Midnight Blue', 'MS-RNG-NVY-S', 10, 0 FROM products WHERE sku = 'MS-SET-RANGLA-001' UNION ALL
SELECT id, 'M', 'Midnight Blue', 'MS-RNG-NVY-M', 15, 0 FROM products WHERE sku = 'MS-SET-RANGLA-001' UNION ALL
SELECT id, 'L', 'Midnight Blue', 'MS-RNG-NVY-L', 15, 0 FROM products WHERE sku = 'MS-SET-RANGLA-001' UNION ALL
SELECT id, 'M', 'Grey Melange', 'MS-RNG-GRY-M', 15, 0 FROM products WHERE sku = 'MS-SET-RANGLA-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?q=80&w=2960&auto=format&fit=crop', 'Conjunto urbano hombre', true, 0 FROM products WHERE sku = 'MS-SET-RANGLA-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?q=80&w=2960&auto=format&fit=crop');


-- 4. CONJUNTO CANGURO
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-SET-KANGAROO-001', 'Conjunto Canguro', 'Kangaroo Set', 'kangaroo-set', 
'El Conjunto Canguro Matteo Salvatore incorpora un corte moderno con manga estilo canguro desde el cuello, ofreciendo una estética fresca y contemporánea ideal para climas cálidos. Fabricado con material ligero y resistente.', 
'The Matteo Salvatore Kangaroo Set incorporates a modern cut with kangaroo-style sleeves from the neck, offering a fresh and contemporary aesthetic ideal for warm climates. Made with lightweight and resistant material.',
'clothing', 'sets', 259.00, false, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'Black', 'MS-KNG-BLK-S', 10, 0 FROM products WHERE sku = 'MS-SET-KANGAROO-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-KNG-BLK-M', 15, 0 FROM products WHERE sku = 'MS-SET-KANGAROO-001' UNION ALL
SELECT id, 'L', 'Black', 'MS-KNG-BLK-L', 15, 0 FROM products WHERE sku = 'MS-SET-KANGAROO-001' UNION ALL
SELECT id, 'M', 'Light Grey', 'MS-KNG-GRY-M', 12, 0 FROM products WHERE sku = 'MS-SET-KANGAROO-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2940&auto=format&fit=crop', 'Conjunto deportivo hombre negro', true, 0 FROM products WHERE sku = 'MS-SET-KANGAROO-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2940&auto=format&fit=crop');


-- 5. CARGO FIT
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price, is_featured, is_active)
VALUES 
('MS-PANT-CARGO-001', 'Pantalón Cargo Fit', 'Cargo Fit Pants', 'cargo-fit-pants', 
'El Cargo Fit Matteo Salvatore es la pieza central para un outfit con carácter. Su estructura firme y diseño urbano lo convierten en el pantalón ideal para quienes buscan presencia, resistencia y estilo.', 
'The Matteo Salvatore Cargo Fit is the centerpiece for an outfit with character. Its firm structure and urban design make it the ideal pant for those seeking presence, resistance, and style.',
'clothing', 'pants', 209.00, true, true)
ON CONFLICT (sku) DO NOTHING;

-- Variants
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, additional_price)
SELECT id, 'S', 'Black', 'MS-CRG-BLK-S', 15, 0 FROM products WHERE sku = 'MS-PANT-CARGO-001' UNION ALL
SELECT id, 'M', 'Black', 'MS-CRG-BLK-M', 20, 0 FROM products WHERE sku = 'MS-PANT-CARGO-001' UNION ALL
SELECT id, 'L', 'Black', 'MS-CRG-BLK-L', 20, 0 FROM products WHERE sku = 'MS-PANT-CARGO-001' UNION ALL
SELECT id, 'M', 'Military Green', 'MS-CRG-GRN-M', 20, 0 FROM products WHERE sku = 'MS-PANT-CARGO-001' UNION ALL
SELECT id, 'M', 'Beige', 'MS-CRG-BGE-M', 15, 0 FROM products WHERE sku = 'MS-PANT-CARGO-001'
ON CONFLICT (sku_variant) DO NOTHING;

-- Images
INSERT INTO product_images (product_id, image_url, alt_text_es, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2797&auto=format&fit=crop', 'Pantalón cargo hombre', true, 0 FROM products WHERE sku = 'MS-PANT-CARGO-001'
AND NOT EXISTS (SELECT 1 FROM product_images WHERE image_url = 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2797&auto=format&fit=crop');
