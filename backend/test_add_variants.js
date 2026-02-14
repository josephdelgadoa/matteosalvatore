const dotenv = require('dotenv');
dotenv.config();
const supabase = require('./src/config/database');

async function addVariant() {
    // Slug: jogger-cargo-fit-hombre-2026-slim-urbano
    // First get the ID
    const { data: product } = await supabase.from('products').select('id').eq('slug', 'jogger-cargo-fit-hombre-2026-slim-urbano').single();

    if (!product) {
        console.error('Product not found');
        return;
    }

    console.log('Adding variant to product:', product.id);

    const variant = {
        product_id: product.id,
        size: 'L',
        color: 'Navy',
        stock_quantity: 50,
        is_available: true,
        sku_variant: 'TEST-SKU-L-NAVY'
    };

    const { data, error } = await supabase
        .from('product_variants')
        .insert([variant])
        .select();

    if (error) {
        console.error('Error adding variant:', error);
    } else {
        console.log('Variant added successfully:', data);
    }
}

addVariant();
