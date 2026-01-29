import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/products/ProductCard";
import { getTranslations } from "next-intl/server";

export default async function ShopPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("Navigation");

    // Fetch products
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return <div>Error loading products.</div>;
    }

    return (
        <main className="container section">
            <h1 style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>{t('shop')}</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)'
            }}>
                {products?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                {products?.length === 0 && (
                    <p>No products found.</p>
                )}
            </div>
        </main>
    );
}
