-- Seed Data for Products
-- Categories: clothing, footwear, accessories

INSERT INTO products (slug, name_es, name_en, description_es, description_en, base_price, category, subcategory)
VALUES
('pima-cotton-tshirt', 'Camiseta de Algodón Pima', 'Pima Cotton T-Shirt', 'Camiseta clásica hecha del mejor algodón Pima peruano.', 'Classic t-shirt made from the finest Peruvian Pima cotton.', 120.00, 'clothing', 't-shirts'),
('alpaca-wool-sweater', 'Chompa de Alpaca', 'Alpaca Wool Sweater', 'Suave y cálida chompa de fibra de alpaca.', 'Soft and warm sweater made from alpaca fiber.', 350.00, 'clothing', 'sweaters'),
('urban-fit-chinos', 'Pantalones Urban Fit', 'Urban Fit Chinos', 'Pantalones versátiles para el día a día.', 'Versatile chinos for everyday wear.', 240.00, 'clothing', 'pants'),
('leather-sneakers', 'Zapatillas de Cuero', 'Leather Sneakers', 'Zapatillas de cuero premium hechas a mano.', 'Premium handmade leather sneakers.', 450.00, 'footwear', 'sneakers')
ON CONFLICT (slug) DO NOTHING;

-- Variants for T-Shirt
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, 'M', 'White', 50, true FROM products WHERE slug = 'pima-cotton-tshirt'
UNION ALL
SELECT id, 'L', 'White', 50, true FROM products WHERE slug = 'pima-cotton-tshirt'
UNION ALL
SELECT id, 'M', 'Black', 50, true FROM products WHERE slug = 'pima-cotton-tshirt';

-- Variants for Sweater
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, 'M', 'Grey', 30, true FROM products WHERE slug = 'alpaca-wool-sweater'
UNION ALL
SELECT id, 'L', 'Navy', 20, true FROM products WHERE slug = 'alpaca-wool-sweater';

-- Variants for Chinos
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, '32', 'Beige', 40, true FROM products WHERE slug = 'urban-fit-chinos'
UNION ALL
SELECT id, '34', 'Navy', 35, true FROM products WHERE slug = 'urban-fit-chinos';

-- Variants for Sneakers
INSERT INTO product_variants (product_id, size, color, stock_quantity, is_available)
SELECT id, '42', 'White', 15, true FROM products WHERE slug = 'leather-sneakers'
UNION ALL
SELECT id, '43', 'Brown', 10, true FROM products WHERE slug = 'leather-sneakers';
