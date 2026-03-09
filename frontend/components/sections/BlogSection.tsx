'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/api/blog';
import { Locale } from '@/i18n-config';
import { getLocalizedPath } from '@/lib/routes';
import { ArrowRight, Calendar } from 'lucide-react';

interface BlogSectionProps {
    posts: BlogPost[];
    lang: Locale;
    dict: {
        title: string;
        viewAll: string;
        readMore: string;
    };
}

export const BlogSection = ({ posts, lang, dict }: BlogSectionProps) => {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="bg-ms-white pt-16 pb-8 border-t border-ms-fog">
            <div className="ms-container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="ms-heading-2 text-ms-black mb-2">{dict.title}</h2>
                        <div className="w-20 h-1 bg-ms-brand-primary/20"></div>
                    </div>
                    <Link
                        href={`/${lang}/blog`}
                        className="group flex items-center gap-2 text-ms-stone hover:text-ms-brand-primary transition-colors font-serif italic text-lg"
                    >
                        {dict.viewAll}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.slice(0, 3).map((post) => {
                        const title = lang === 'es' ? (post.title_es || post.title_en) : (post.title_en || post.title_es);
                        const excerpt = lang === 'es' ? (post.excerpt_es || post.excerpt_en) : (post.excerpt_en || post.excerpt_es);
                        const slug = lang === 'es' ? (post.slug_es || post.slug_en) : (post.slug_en || post.slug_es);
                        const date = new Date(post.published_at || post.created_at).toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        });

                        return (
                            <Link
                                key={post.id}
                                href={getLocalizedPath(`/blog/${slug}`, lang)}
                                className="group flex flex-col h-full bg-ms-pearl/30 rounded-lg overflow-hidden border border-ms-fog/50 hover:border-ms-brand-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-ms-brand-primary/5"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${post.featured_image_url || '/images/blog-hero-luxury.png'}')` }}
                                    />
                                    <div className="absolute inset-0 bg-ms-black/10 group-hover:bg-ms-black/0 transition-colors duration-500" />
                                </div>

                                <div className="flex flex-col flex-grow p-8">
                                    <div className="flex items-center gap-2 text-ms-stone/60 text-sm mb-4">
                                        <Calendar className="w-4 h-4" />
                                        <time>{date}</time>
                                    </div>

                                    <h3 className="font-serif text-2xl text-ms-black mb-4 line-clamp-2 group-hover:text-ms-brand-primary transition-colors">
                                        {title}
                                    </h3>

                                    <p className="text-ms-stone/80 leading-relaxed mb-6 line-clamp-3 text-base">
                                        {excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 text-ms-brand-primary font-serif italic text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                        {dict.readMore}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
