-- Migration: Create blog_posts table
-- Description: Table for storing localized blog articles with SEO and AI support.

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug_es TEXT UNIQUE NOT NULL,
    slug_en TEXT UNIQUE NOT NULL,
    title_es TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_es TEXT NOT NULL,
    content_en TEXT NOT NULL,
    excerpt_es TEXT,
    excerpt_en TEXT,
    featured_image_url TEXT,
    image_prompts JSONB, -- For storing AI image prompts
    category TEXT,
    tags TEXT[],
    seo_title_es TEXT,
    seo_title_en TEXT,
    seo_description_es TEXT,
    seo_description_en TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_es ON public.blog_posts(slug_es);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug_en ON public.blog_posts(slug_en);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON public.blog_posts(is_published);

-- Comments for documentation
COMMENT ON TABLE public.blog_posts IS 'Stores localized blog articles for Matteo Salvatore.';
COMMENT ON COLUMN public.blog_posts.image_prompts IS 'Stores AI-generated prompts for article images.';
