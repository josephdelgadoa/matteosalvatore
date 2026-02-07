-- 004_seed_data.sql

-- Insert Categories (if we had a categories table, but we use string enums in products. Adjusting to insert example products)

-- Example Product: Classic T-Shirt
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price)
VALUES 
('MS-TEE-001', 'Camiseta Clásica de Algodón Pima', 'Classic Pima Cotton T-Shirt', 'classic-pima-tee', 'Camiseta básica de lujo hecha con el mejor algodón Pima peruano.', 'Luxury basic t-shirt crafted from the finest Peruvian Pima cotton.', 'clothing', 'polos', 120.00);

-- Example Product: Slim Fit Chino
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price)
VALUES 
('MS-PANT-001', 'Pantalón Chino Slim Fit', 'Slim Fit Chino', 'slim-fit-chino', 'Pantalón chino de corte ajustado, ideal para oficina o salidas casuales.', 'Slim fit chino trousers, perfect for office or casual outings.', 'clothing', 'pants', 250.00);

-- Example Product: Leather Sneakers
INSERT INTO products (sku, name_es, name_en, slug, description_es, description_en, category, subcategory, base_price)
VALUES 
('MS-SHOE-001', 'Zapatillas de Cuero Minimalistas', 'Minimalist Leather Sneakers', 'minimalist-leather-sneakers', 'Zapatillas urbanas de cuero genuino hechas a mano.', 'Handcrafted genuine leather urban sneakers.', 'footwear', 'sneakers', 380.00);
