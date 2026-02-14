-- Add SEO fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seo_title_es TEXT,
ADD COLUMN IF NOT EXISTS seo_title_en TEXT,
ADD COLUMN IF NOT EXISTS seo_description_es TEXT,
ADD COLUMN IF NOT EXISTS seo_description_en TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords_es TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords_en TEXT;
