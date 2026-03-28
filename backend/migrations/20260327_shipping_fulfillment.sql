-- Shipping and Fulfillment Module Migration
-- Run this in Supabase SQL Editor

-- 1. Add fulfillment and courier columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS fulfillment_store_id UUID REFERENCES public.stores(id),
ADD COLUMN IF NOT EXISTS courier_name TEXT,
ADD COLUMN IF NOT EXISTS courier_phone TEXT,
ADD COLUMN IF NOT EXISTS courier_address TEXT,
ADD COLUMN IF NOT EXISTS shipping_status TEXT DEFAULT 'pending';

-- 2. Create index for faster filtering if needed
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_store ON public.orders(fulfillment_store_id);

-- 3. Update existing orders to have 'pending' shipping_status if null
UPDATE public.orders SET shipping_status = 'pending' WHERE shipping_status IS NULL;
