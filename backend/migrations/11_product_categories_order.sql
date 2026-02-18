-- Add display_order column to product_categories
ALTER TABLE public.product_categories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for faster sorting
CREATE INDEX IF NOT EXISTS idx_product_categories_display_order ON public.product_categories(display_order);
