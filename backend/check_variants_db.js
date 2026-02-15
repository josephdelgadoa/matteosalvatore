
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const supabase = require('./src/config/database');

async function checkProductVariants() {
    const slug = 'polo-basico-premium-hombre-algodon-peruano';
    console.log(`Checking product: ${slug}`);

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            id, 
            name_es, 
            slug,
            product_variants (*)
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

    console.log('Product Found:', product.name_es);
    console.log('Product ID:', product.id);
    console.log('Variants Count:', product.product_variants ? product.product_variants.length : 0);

    if (product.product_variants && product.product_variants.length > 0) {
        console.log('Variants:', JSON.stringify(product.product_variants, null, 2));
    } else {
        console.log('No variants found in DB.');
    }
}

checkProductVariants();
