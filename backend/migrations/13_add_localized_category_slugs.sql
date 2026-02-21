-- Migration Name: 13_add_localized_category_slugs
-- Description: Replace the unified 'slug' column in product_categories with dedicated 'slug_es' and 'slug_en' inputs.

-- 1. Add new columns
ALTER TABLE public.product_categories
ADD COLUMN IF NOT EXISTS slug_es TEXT,
ADD COLUMN IF NOT EXISTS slug_en TEXT;

-- 2. Populate new columns with existing slug data to prevent nulls
UPDATE public.product_categories
SET slug_es = slug,
    slug_en = slug
WHERE slug_es IS NULL AND slug_en IS NULL;

-- 3. Add UNIQUE constraints to the new columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_slug_es_key') THEN
        ALTER TABLE public.product_categories ADD CONSTRAINT categories_slug_es_key UNIQUE (slug_es);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'categories_slug_en_key') THEN
        ALTER TABLE public.product_categories ADD CONSTRAINT categories_slug_en_key UNIQUE (slug_en);
    END IF;
END $$;

-- 4. Make them NOT NULL
ALTER TABLE public.product_categories
ALTER COLUMN slug_es SET NOT NULL,
ALTER COLUMN slug_en SET NOT NULL;

-- 5. Drop the old slug column
ALTER TABLE public.product_categories DROP COLUMN IF EXISTS slug;
