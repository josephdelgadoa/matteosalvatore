-- Create Featured Categories Table
CREATE TABLE IF NOT EXISTS public.featured_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_es TEXT,
    title_en TEXT,
    subtitle_es TEXT,
    subtitle_en TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.featured_categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public categories are viewable by everyone" ON public.featured_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.featured_categories
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
        )
    );
