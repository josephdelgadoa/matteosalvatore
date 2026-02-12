-- Create content_blocks table for dynamic site content
CREATE TABLE IF NOT EXISTS content_blocks (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read content (it's for the public site)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_blocks' 
        AND policyname = 'Public content is viewable by everyone'
    ) THEN
        CREATE POLICY "Public content is viewable by everyone" ON content_blocks
            FOR SELECT USING (true);
    END IF;
END
$$;

-- Policy: Only admins can update content
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'content_blocks' 
        AND policyname = 'Admins can update content'
    ) THEN
        CREATE POLICY "Admins can update content" ON content_blocks
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND (profiles.role = 'admin' OR profiles.role = 'super_admin')
                )
            );
    END IF;
END
$$;

-- Seed Default Hero Slides
-- Seed customized ES content
INSERT INTO content_blocks (key, value) VALUES 
('hero_slides_es', '[
    {
        "id": 1,
        "image": "/images/hero-image-ruso-1.jpeg",
        "subtitle": "NUEVA COLECCIÓN 2024",
        "title": "Esenciales de Lujo",
        "description": "Descubre la sofisticación del minimalismo con nuestras prendas de algodón Pima y baby alpaca.",
        "cta": "COMPRAR AHORA",
        "link": "/products?category=clothing"
    },
    {
        "id": 2,
        "image": "/images/matteo-salvatore-hoddies.jpeg",
        "subtitle": "COMFORT & STYLE",
        "title": "Hoodies Premium",
        "description": "La combinación perfecta entre comodidad extrema y diseño contemporáneo. Hecho en Perú.",
        "cta": "VER HOODIES",
        "link": "/products?category=hoodies"
    },
    {
        "id": 3,
        "image": "/images/matteo-salvatore-joggers.jpeg",
        "subtitle": "FIT PERFECTO",
        "title": "Joggers Signature",
        "description": "Corte preciso y materiales de primera calidad para un look casual elevado.",
        "cta": "VER JOGGERS",
        "link": "/products?category=joggers"
    }
]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed customized EN content
INSERT INTO content_blocks (key, value) VALUES 
('hero_slides_en', '[
    {
        "id": 1,
        "image": "/images/hero-image-ruso-1.jpeg",
        "subtitle": "NEW COLLECTION 2024",
        "title": "Luxury Essentials",
        "description": "Discover the sophistication of minimalism with our Pima cotton and baby alpaca garments.",
        "cta": "SHOP NOW",
        "link": "/products?category=clothing"
    },
    {
        "id": 2,
        "image": "/images/matteo-salvatore-hoddies.jpeg",
        "subtitle": "COMFORT & STYLE",
        "title": "Premium Hoodies",
        "description": "The perfect combination of extreme comfort and contemporary design. Made in Peru.",
        "cta": "VIEW HOODIES",
        "link": "/products?category=hoodies"
    },
    {
        "id": 3,
        "image": "/images/matteo-salvatore-joggers.jpeg",
        "subtitle": "PERFECT FIT",
        "title": "Signature Joggers",
        "description": "Precise cut and premium materials for an elevated casual look.",
        "cta": "VIEW JOGGERS",
        "link": "/products?category=joggers"
    }
]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
