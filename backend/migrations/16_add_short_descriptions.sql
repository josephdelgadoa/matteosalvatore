-- Migration 16: Add short_description columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS short_description_es TEXT,
ADD COLUMN IF NOT EXISTS short_description_en TEXT;

-- Update comments for documentation
COMMENT ON COLUMN products.short_description_es IS 'Short SEO-optimized description in Spanish';
COMMENT ON COLUMN products.short_description_en IS 'Short SEO-optimized description in English';
