-- Seed Products
INSERT INTO public.products (slug, name_en, name_es, description_en, description_es, price, category, images) VALUES
('mens-skinny-stretchy-pants', 'Men''s Skinny Stretchy Pants', 'Pantalones Skinny Stretchy para Hombre', 'Premium stretchy pants designed for comfort and style.', 'Pantalones elásticos premium diseñados para comodidad y estilo.', 120.00, 'pants', '{}'),
('premium-pima-cotton-polo', 'Premium Pima Cotton Polo', 'Polo de Algodón Pima Premium', 'The best cotton in the world. Superior softness and durability.', 'El mejor algodón del mundo. Suavidad y durabilidad superior.', 80.00, 'polos', '{}'),
('ms-hoodie', 'Signature MS Hoodie', 'Hoodie Signature MS', 'Cozy and stylish hoodie for everyday wear.', 'Hoodie cómodo y con estilo para uso diario.', 150.00, 'hoodies', '{}'),
('peruvian-leather-sneakers-classic', 'Peruvian Leather Sneakers - Classic', 'Zapatillas de Cuero Peruano - Clásicas', 'Handcrafted Peruvian leather sneakers.', 'Zapatillas de cuero peruano hechas a mano.', 250.00, 'shoes', '{}')
ON CONFLICT (slug) DO NOTHING;

-- Seed Stock (using a temporary function or just generating rows)
-- We'll use a CTE to generate combinations
WITH product_ids AS (
    SELECT id, slug FROM public.products
),
colors AS (
    SELECT unnest(ARRAY['White', 'Black', 'Blue', 'Beige', 'Red']) as color
),
sizes AS (
    SELECT unnest(ARRAY['S', 'M', 'L', 'XL']) as size
)
INSERT INTO public.stock (product_id, size, color, quantity)
SELECT p.id, s.size, c.color, 100
FROM product_ids p
CROSS JOIN colors c
CROSS JOIN sizes s
WHERE p.slug IN ('mens-skinny-stretchy-pants', 'premium-pima-cotton-polo', 'ms-hoodie')
ON CONFLICT (product_id, size, color) DO NOTHING;

-- Seed Stock for Shoes (Specific sizes/colors)
WITH shoe_ids AS (
    SELECT id FROM public.products WHERE slug = 'peruvian-leather-sneakers-classic'
),
shoe_sizes AS (
    SELECT unnest(ARRAY['40', '41', '42', '43']) as size
)
INSERT INTO public.stock (product_id, size, color, quantity)
SELECT p.id, s.size, 'Brown', 50
FROM shoe_ids p
CROSS JOIN shoe_sizes s
ON CONFLICT (product_id, size, color) DO NOTHING;
