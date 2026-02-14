const dotenv = require('dotenv');
dotenv.config();
const supabase = require('./src/config/database');

async function debugVariants() {
    const slug = 'jogger-cargo-fit-hombre-2026-slim-urbano';

    console.log(`Fetching product with slug: ${slug}`);

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            id,
            name_es,
            slug,
            product_variants(*)
        `)
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return;
    }

    if (!product) {
        console.log('Product not found!');
        return;
    }

    console.log('Product found:', product.name_es);
    console.log('Variants count:', product.product_variants ? product.product_variants.length : 0);
    console.log('Variants data:', JSON.stringify(product.product_variants, null, 2));
}

debugVariants();
