
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const supabase = require('./src/config/database');

const PRODUCT_ID = '08c57d73-cdf9-4e98-9e9d-7a37f82dd785';
const PRODUCT_SLUG = 'polo-basico-premium-hombre-algodon-peruano';

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['Azul Turquesa', 'Blanco', 'Negro', 'Rojo', 'Rosado', 'Rosado Bebe'];

async function cleanAndFixVariants() {
    console.log(`Fixing variants for product: ${PRODUCT_SLUG} (${PRODUCT_ID})`);

    // 1. Check if product exists (sanity check)
    const { data: product, error: pError } = await supabase
        .from('products')
        .select('sku')
        .eq('id', PRODUCT_ID)
        .single();

    if (pError || !product) {
        console.error('Product not found or error:', pError);
        return;
    }

    const baseSku = product.sku || 'MS-GEN-0000';
    console.log(`Base SKU: ${baseSku}`);

    // 2. Delete existing variants (if any)
    const { error: delError } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', PRODUCT_ID);

    if (delError) {
        console.error('Error deleting old variants:', delError);
        return;
    }
    console.log('Cleared existing variants.');

    // 3. Generate new variants
    const variants = [];
    for (const color of COLORS) {
        for (const size of SIZES) {
            const cleanSize = size.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const cleanColor = color.toUpperCase().substring(0, 3).replace(/[^A-Z0-9]/g, '');
            const skuVariant = `${baseSku}-${cleanSize}-${cleanColor}-${Math.floor(Math.random() * 1000)}`;

            variants.push({
                product_id: PRODUCT_ID,
                size: size,
                color: color,
                stock_quantity: 50, // Default stock
                is_available: true,
                sku_variant: skuVariant
            });
        }
    }

    // 4. Insert variants
    const { error: insError } = await supabase
        .from('product_variants')
        .insert(variants);

    if (insError) {
        console.error('Error inserting variants:', insError);
    } else {
        console.log(`Successfully inserted ${variants.length} variants!`);
    }
}

cleanAndFixVariants();
