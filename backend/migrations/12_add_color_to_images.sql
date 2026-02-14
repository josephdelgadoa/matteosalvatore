-- Add color column to product_images to support dynamic color filtering
ALTER TABLE product_images 
ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT NULL;

-- Optional: Index on color for faster filtering if table gets huge
CREATE INDEX IF NOT EXISTS idx_product_images_color ON product_images(color);
