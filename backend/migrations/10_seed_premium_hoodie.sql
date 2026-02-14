-- Insert Product: Sudadera Urbana Premium Hombre 2026 – Matteo Salvatore
INSERT INTO products (
    slug,
    sku,
    name_es,
    name_en,
    description_es,
    description_en,
    base_price,
    category,
    subcategory,
    seo_title_es,
    seo_title_en,
    seo_description_es,
    seo_description_en,
    seo_keywords_es,
    seo_keywords_en,
    is_active,
    is_featured
) VALUES (
    'sudadera-urbana-premium-hombre-2026-matteo-salvatore',
    'MS-SUD-PRM-2026', -- Generated SKU
    'Sudadera Urbana Premium Hombre 2026 – Matteo Salvatore',
    'Premium Urban Hoodie for Men 2026 – Matteo Salvatore',
    'La Sudadera Urbana Premium Hombre 2026 – Matteo Salvatore redefine la moda urbana masculina en Perú con un equilibrio perfecto entre estilo, comodidad y presencia.

Diseñada para el hombre moderno que busca destacar sin esfuerzo, esta sudadera presenta un fit contemporáneo que estiliza la silueta, confeccionada con materiales de alta calidad que ofrecen suavidad, resistencia y estructura premium.

Ideal para combinar con joggers, cargo fit o jeans urbanos, es la pieza esencial para lograr un look streetwear sofisticado en Lima y cualquier ciudad de Latinoamérica.

🔥 Diseño minimalista tendencia 2026
🔥 Tela premium suave y durable
🔥 Corte moderno que mejora la caída
🔥 Versátil para outfits casuales o urbanos elegantes
🔥 Edición limitada – solo 50 unidades

Si estás buscando una sudadera premium para hombre en Perú, esta es la prenda que eleva tu presencia y define tu estilo.

Disponible en tallas S, M, L, XL y XXL.',
    'The Premium Urban Hoodie for Men 2026 – Matteo Salvatore redefines modern streetwear with the perfect balance of structure, comfort, and elevated style.

Designed for the contemporary man who values presence and versatility, this hoodie features a modern tailored fit that enhances the silhouette while maintaining all-day comfort.

Crafted with premium-quality fabric, it pairs effortlessly with joggers, cargo pants, or urban denim for a refined streetwear aesthetic.

🔥 2026 minimalist streetwear design
🔥 Premium soft yet structured fabric
🔥 Modern fit for enhanced silhouette
🔥 Limited edition – only 50 units available

If you''re looking for a premium men’s hoodie with modern urban appeal, this is your statement piece.

Available in sizes S, M, L, XL, XXL.',
    189.00,
    'hoodies-sweats',
    '', -- No subcategory defined for these yet in constants, but fits 'Hoodies & Sweats' category
    'Sudadera Urbana Premium Hombre 2026 | Matteo Salvatore Perú',
    'Premium Urban Hoodie for Men 2026 – Matteo Salvatore',
    'Descubre la Sudadera Urbana Premium Hombre 2026 de Matteo Salvatore. Moda urbana masculina en Perú con fit moderno y calidad premium. Stock limitado.',
    'Shop the Premium Urban Hoodie for Men 2026 by Matteo Salvatore. Modern streetwear, premium quality, limited stock.',
    'sudadera urbana hombre Perú, sudadera premium hombre Lima, hoodie hombre streetwear Perú, ropa urbana masculina 2026, moda urbana premium Perú',
    'premium urban hoodie men, modern streetwear hoodie 2026, minimalist hoodie men, premium men hoodie limited edition',
    true,
    true
)
ON CONFLICT (slug) DO UPDATE SET 
    name_es = EXCLUDED.name_es,
    description_es = EXCLUDED.description_es,
    seo_keywords_es = EXCLUDED.seo_keywords_es,
    seo_title_es = EXCLUDED.seo_title_es,
    seo_description_es = EXCLUDED.seo_description_es,
    seo_keywords_en = EXCLUDED.seo_keywords_en,
    seo_title_en = EXCLUDED.seo_title_en,
    seo_description_en = EXCLUDED.seo_description_en,
    sku = EXCLUDED.sku;

-- Insert Variants (Total 50 units, distributed evenly)
-- Assuming 'Black' as the default color for this urban piece
WITH product_ref AS (
    SELECT id FROM products WHERE slug = 'sudadera-urbana-premium-hombre-2026-matteo-salvatore'
)
INSERT INTO product_variants (product_id, size, color, sku_variant, stock_quantity, is_available)
SELECT id, 'S', 'Black', 'MS-SUD-PRM-2026-S', 10, true FROM product_ref
UNION ALL
SELECT id, 'M', 'Black', 'MS-SUD-PRM-2026-M', 10, true FROM product_ref
UNION ALL
SELECT id, 'L', 'Black', 'MS-SUD-PRM-2026-L', 10, true FROM product_ref
UNION ALL
SELECT id, 'XL', 'Black', 'MS-SUD-PRM-2026-XL', 10, true FROM product_ref
UNION ALL
SELECT id, 'XXL', 'Black', 'MS-SUD-PRM-2026-XXL', 10, true FROM product_ref;
