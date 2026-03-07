-- 14 Create Stores Table
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Policies for Stores
CREATE POLICY "Stores are viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Only admins can modify stores" ON public.stores 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
    )
  );

-- 15 Create Inventory Table (Multi-store stock)
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, variant_id)
);

-- Enable RLS
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Policies for Inventory
CREATE POLICY "Inventory is viewable by everyone" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Only admins can modify inventory" ON public.inventory 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
    )
  );

-- 16 Create POS Sales Tables
CREATE TABLE IF NOT EXISTS public.pos_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id),
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT, -- 'cash', 'card', 'transfer'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pos_sale_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID REFERENCES public.pos_sales(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL
);

-- Enable RLS for POS Sales
ALTER TABLE public.pos_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pos_sale_items ENABLE ROW LEVEL SECURITY;

-- Policies for POS Sales
CREATE POLICY "Admins can view POS sales" ON public.pos_sales FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Staff can create POS sales" ON public.pos_sales FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view POS sale items" ON public.pos_sale_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (role = 'admin' OR role = 'super_admin')));
CREATE POLICY "Staff can create POS sale items" ON public.pos_sale_items FOR INSERT WITH CHECK (true);

-- Seed Initial Stores
INSERT INTO public.stores (name, address) VALUES 
('San Borja Store', 'Av. Aviacion Nº 2410 San Borja Galeria La Ganadora Stand 81'),
('Gamarra Store', 'Jr. Agustin Gamarra N°860 La Victoria Galeria Azul Stand N° 129')
ON CONFLICT DO NOTHING;
