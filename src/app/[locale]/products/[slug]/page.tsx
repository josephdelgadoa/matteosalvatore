import { supabase } from "@/lib/supabaseClient";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ProductActions from "@/components/products/ProductActions";
import { getRecommendations } from "@/lib/personalization";
import Link from "next/link";

export default async function ProductPage({
    params
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const t = await getTranslations("Navigation"); // Fallback for now

    // Fetch product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !product) {
        notFound();
    }

    const name = locale === 'es' ? product.name_es : product.name_en;
    const description = locale === 'es' ? product.description_es : product.description_en;

    // Simple placeholder for Stock logic (would fetch distinct sizes/colors here)

    // Recommendations logic
    const recommendations = await getRecommendations(slug);

    return (
        <main className="container section">
            {/* ... Existing Product Grid ... */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-2xl)' }}>
                {/* Image Placeholder */}
                <div style={{
                    backgroundColor: '#f5f5f5',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--border-radius-md)'
                }}>
                    No Image Available
                </div>

                {/* Product Details */}
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>{name}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--spacing-md)' }}>
                        S/ {product.price.toFixed(2)}
                    </p>

                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <p>{description}</p>
                    </div>

                    <ProductActions product={{
                        id: product.id,
                        slug: product.slug,
                        name: name,
                        price: product.price,
                        image: product.images?.[0]
                    }} />
                </div>
            </div>

            {/* Recommendations Section */}
            <div style={{ marginTop: 'var(--spacing-2xl)', paddingTop: 'var(--spacing-xl)', borderTop: '1px solid #eee' }}>
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>{locale === 'es' ? 'También te podría gustar' : 'You Might Also Like'}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                    {recommendations.map(rec => (
                        <Link key={rec.slug} href={`/${locale}/products/${rec.slug}`} style={{ textDecoration: 'none' }}>
                            <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ height: '200px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#aaa', fontSize: '0.8rem' }}>AI Pick</span>
                                </div>
                                <div style={{ padding: '1rem' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                                        {locale === 'es' ? rec.name_es : rec.name_en}
                                    </h4>
                                    <p style={{ fontWeight: 'bold' }}>S/ {rec.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
