-- Migration to add localized slugs to products table

-- 1. Add new columns
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS slug_es TEXT,
ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- 2. Populate new columns with existing slug data to prevent nulls
UPDATE public.products
SET slug_es = slug,
    slug_en = slug
WHERE slug_es IS NULL AND slug_en IS NULL;

-- 3. Add UNIQUE constraints to the new columns
-- Only add if they don't exist yet
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_es_key') THEN
        ALTER TABLE public.products ADD CONSTRAINT products_slug_es_key UNIQUE (slug_es);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_en_key') THEN
        ALTER TABLE public.products ADD CONSTRAINT products_slug_en_key UNIQUE (slug_en);
    END IF;
END $$;

-- 4. Make them NOT NULL 
ALTER TABLE public.products
ALTER COLUMN slug_es SET NOT NULL,
ALTER COLUMN slug_en SET NOT NULL;

-- 5. Drop the old slug column
ALTER TABLE public.products DROP COLUMN IF EXISTS slug;
