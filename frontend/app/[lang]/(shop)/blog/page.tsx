import React from 'react';
import { Locale } from '@/i18n-config';
import { getDictionary } from '@/get-dictionary';
import { PageHero } from '@/components/ui/PageHero';
import { blogApi, BlogPost } from '@/lib/api/blog';
import Link from 'next/link';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

export default async function BlogListingPage({ params }: { params: { lang: Locale } }) {
    const dict = await getDictionary(params.lang);
    let posts: BlogPost[] = [];

    try {
        posts = await blogApi.getAllPosts({ lang: params.lang, publishedOnly: true });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
    }

    return (
        <div className="animate-fade-in pb-20">
            <PageHero
                title={dict.nav.blog}
                subtitle="Matteo Salvatore Editorial"
                image="/images/blog-hero-luxury.png"
            />

            <div className="container mx-auto px-4 py-20">
                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-ms-stone text-lg italic">Coming soon... Stay tuned for our latest fashion editorials.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {posts.map((post) => {
                            const title = params.lang === 'es' ? post.title_es : post.title_en;
                            const slug = params.lang === 'es' ? post.slug_es : post.slug_en;
                            const excerpt = params.lang === 'es' ? post.excerpt_es : post.excerpt_en;
                            const date = new Date(post.published_at || post.created_at);

                            return (
                                <article key={post.id} className="group flex flex-col h-full bg-ms-white border border-ms-fog hover:border-ms-stone transition-all duration-300">
                                    <Link href={`/${params.lang}/blog/${slug}`} className="block relative aspect-[16/10] overflow-hidden bg-ms-pearl">
                                        {post.featured_image_url ? (
                                            <img
                                                src={post.featured_image_url}
                                                alt={title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-ms-stone/20">
                                                Matteo Salvatore
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-ms-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                                                {post.category || 'Editorial'}
                                            </span>
                                        </div>
                                    </Link>

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-[11px] uppercase tracking-widest text-ms-stone font-medium">
                                                {format(date, 'MMMM dd, yyyy', {
                                                    locale: params.lang === 'es' ? es : enUS
                                                })}
                                            </span>
                                        </div>

                                        <h2 className="font-serif text-2xl mb-4 group-hover:text-ms-stone transition-colors leading-tight">
                                            <Link href={`/${params.lang}/blog/${slug}`}>
                                                {title}
                                            </Link>
                                        </h2>

                                        <p className="text-ms-stone text-sm leading-relaxed mb-8 line-clamp-3">
                                            {excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-ms-fog">
                                            <Link
                                                href={`/${params.lang}/blog/${slug}`}
                                                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] group/btn"
                                            >
                                                Read More
                                                <ChevronRight className="w-3 h-3 translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
