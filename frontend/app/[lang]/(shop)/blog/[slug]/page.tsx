import React from 'react';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { blogApi, BlogPost } from '@/lib/api/blog';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { ChevronLeft, Calendar, Tag, User, Facebook, Instagram, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/Button';

export async function generateMetadata({ params }: { params: { lang: Locale, slug: string } }): Promise<Metadata> {
    try {
        const post = await blogApi.getPostBySlug(params.slug, params.lang);
        const title = params.lang === 'es' ? (post.seo_title_es || post.title_es) : (post.seo_title_en || post.title_en);
        const description = params.lang === 'es' ? (post.seo_description_es || post.excerpt_es) : (post.seo_description_en || post.excerpt_en);

        return {
            title: `${title} | Matteo Salvatore`,
            description: description,
            openGraph: {
                title: title,
                description: description,
                images: post.featured_image_url ? [post.featured_image_url] : [],
                type: 'article',
            }
        };
    } catch (e) {
        return { title: 'Blog Post | Matteo Salvatore' };
    }
}

export default async function BlogPostDetailPage({ params }: { params: { lang: Locale, slug: string } }) {
    const dict = await getDictionary(params.lang);
    let post: BlogPost | null = null;

    try {
        post = await blogApi.getPostBySlug(params.slug, params.lang);
    } catch (error) {
        console.error('Error fetching blog post:', error);
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-40 text-center">
                <h1 className="ms-heading-2 mb-4">Post Not Found</h1>
                <Link href={`/${params.lang}/blog`} className="text-ms-stone hover:text-ms-black transition-colors">
                    Back to Blog
                </Link>
            </div>
        );
    }

    const title = params.lang === 'es' ? post.title_es : post.title_en;
    const content = params.lang === 'es' ? post.content_es : post.content_en;
    const date = new Date(post.published_at || post.created_at);

    return (
        <article className="animate-fade-in pb-32">
            {/* Post Hero */}
            <div className="relative w-full h-[60vh] md:h-[70vh] min-h-[400px] overflow-hidden bg-ms-pearl">
                {post.featured_image_url ? (
                    <img
                        src={post.featured_image_url}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-ms-stone/10 font-serif text-6xl">
                        Matteo Salvatore
                    </div>
                )}
                <div className="absolute inset-0 bg-ms-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    <div className="container max-w-4xl mx-auto">
                        <Link
                            href={`/${params.lang}/blog`}
                            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-ms-white mb-8 hover:text-ms-white/70 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            {dict.nav.blog}
                        </Link>

                        <div className="bg-ms-white/10 backdrop-blur-md border border-ms-white/20 px-6 py-2 rounded-full inline-block mb-6">
                            <span className="text-[10px] uppercase tracking-widest text-ms-white font-bold">
                                {post.category || 'Editorial'}
                            </span>
                        </div>

                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ms-white leading-[1.1] mb-8">
                            {title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-ms-white/80 text-[11px] uppercase tracking-widest font-medium">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(date, 'MMMM dd, yyyy', {
                                    locale: params.lang === 'es' ? es : enUS
                                })}
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Matteo Salvatore Editor
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-ms-white p-8 md:p-16 lg:p-24 shadow-2xl max-w-5xl mx-auto border border-ms-fog">
                    <div
                        className="prose prose-ms max-w-none 
                        prose-headings:font-serif prose-headings:font-medium 
                        prose-p:text-ms-stone prose-p:leading-relaxed prose-p:text-lg
                        prose-a:text-ms-brand-primary prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-sm lg:prose-img:my-16"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Tags & Share */}
                    <div className="mt-20 pt-10 border-t border-ms-fog flex flex-col md:flex-row md:items-center justify-between gap-8">
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="bg-ms-ivory px-3 py-1 text-[10px] uppercase tracking-widest text-ms-stone border border-ms-fog rounded-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-6">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-ms-stone">Share Article:</span>
                            <div className="flex items-center gap-4">
                                <a href="#" className="text-ms-stone hover:text-ms-black transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-ms-stone hover:text-ms-black transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <button className="text-ms-stone hover:text-ms-black transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related/CTA Section */}
            <div className="container mx-auto px-4 py-32 text-center">
                <div className="max-w-3xl mx-auto">
                    <h3 className="ms-heading-2 mb-6">Discover the Collection</h3>
                    <p className="text-ms-stone mb-10 text-lg">
                        Explore our latest essentials crafted with the world's finest Pima Cotton.
                    </p>
                    <Link href={`/${params.lang}/category/clothing`}>
                        <Button size="lg" className="px-12 uppercase tracking-[0.3em] font-bold">
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    );
}
