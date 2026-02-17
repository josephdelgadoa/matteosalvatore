-- Create Product Categories Table (Taxonomy)
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_es TEXT,
    description_en TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.product_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public product categories are viewable by everyone" ON public.product_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage product categories" ON public.product_categories
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
        )
    );
