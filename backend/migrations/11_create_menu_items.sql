-- Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label_es TEXT NOT NULL,
    label_en TEXT NOT NULL,
    link_url TEXT,
    type TEXT NOT NULL CHECK (type IN ('link', 'dropdown')),
    parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public menu items are viewable by everyone" ON public.menu_items
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage menu items" ON public.menu_items
    FOR ALL USING (
        auth.jwt() ->> 'role' = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
        )
    );

-- Indexes
CREATE INDEX custom_menu_items_parent_id_idx ON public.menu_items(parent_id);
CREATE INDEX custom_menu_items_display_order_idx ON public.menu_items(display_order);
