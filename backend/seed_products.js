require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    {
        sku: 'TSHIRT-PIMA-001',
        slug: 'pima-cotton-tshirt',
        name_es: 'Camiseta de Algodón Pima',
        name_en: 'Pima Cotton T-Shirt',
        description_es: 'Camiseta clásica hecha del mejor algodón Pima peruano.',
        description_en: 'Classic t-shirt made from the finest Peruvian Pima cotton.',
        base_price: 120.00,
        category: 'clothing',
        subcategory: 't-shirts'
    },
    {
        sku: 'SWEATER-ALPACA-001',
        slug: 'alpaca-wool-sweater',
        name_es: 'Chompa de Alpaca',
        name_en: 'Alpaca Wool Sweater',
        description_es: 'Suave y cálida chompa de fibra de alpaca.',
        description_en: 'Soft and warm sweater made from alpaca fiber.',
        base_price: 350.00,
        category: 'clothing',
        subcategory: 'sweaters'
    },
    {
        sku: 'PANT-CHINO-001',
        slug: 'urban-fit-chinos',
        name_es: 'Pantalones Urban Fit',
        name_en: 'Urban Fit Chinos',
        description_es: 'Pantalones versátiles para el día a día.',
        description_en: 'Versatile chinos for everyday wear.',
        base_price: 240.00,
        category: 'clothing',
        subcategory: 'pants'
    },
    {
        sku: 'SNEAKER-LEATHER-001',
        slug: 'leather-sneakers',
        name_es: 'Zapatillas de Cuero',
        name_en: 'Leather Sneakers',
        description_es: 'Zapatillas de cuero premium hechas a mano.',
        description_en: 'Premium handmade leather sneakers.',
        base_price: 450.00,
        category: 'footwear',
        subcategory: 'sneakers'
    }
];

const variants = [
    { product_slug: 'pima-cotton-tshirt', size: 'M', color: 'White', stock_quantity: 50, sku_variant: 'TSHIRT-PIMA-001-M-WHT' },
    { product_slug: 'pima-cotton-tshirt', size: 'L', color: 'White', stock_quantity: 50, sku_variant: 'TSHIRT-PIMA-001-L-WHT' },
    { product_slug: 'pima-cotton-tshirt', size: 'M', color: 'Black', stock_quantity: 50, sku_variant: 'TSHIRT-PIMA-001-M-BLK' },
    { product_slug: 'alpaca-wool-sweater', size: 'M', color: 'Grey', stock_quantity: 30, sku_variant: 'SWEATER-ALPACA-001-M-GRY' },
    { product_slug: 'alpaca-wool-sweater', size: 'L', color: 'Navy', stock_quantity: 20, sku_variant: 'SWEATER-ALPACA-001-L-NVY' },
    { product_slug: 'urban-fit-chinos', size: '32', color: 'Beige', stock_quantity: 40, sku_variant: 'PANT-CHINO-001-32-BEI' },
    { product_slug: 'urban-fit-chinos', size: '34', color: 'Navy', stock_quantity: 35, sku_variant: 'PANT-CHINO-001-34-NVY' },
    { product_slug: 'leather-sneakers', size: '42', color: 'White', stock_quantity: 15, sku_variant: 'SNEAKER-LEATHER-001-42-WHT' },
    { product_slug: 'leather-sneakers', size: '43', color: 'Brown', stock_quantity: 10, sku_variant: 'SNEAKER-LEATHER-001-43-BRN' }
];

async function seed() {
    console.log('🌱 Seeding products...');

    for (const product of products) {
        const { data, error } = await supabase
            .from('products')
            .upsert(product, { onConflict: 'slug' })
            .select()
            .single();

        if (error) {
            console.error(`Error inserting product ${product.slug}:`, error.message);
        } else {
            console.log(`✅ Inserted product: ${product.slug}`);

            // Insert variants for this product
            const productVariants = variants.filter(v => v.product_slug === product.slug);
            for (const v of productVariants) {
                const { error: variantError } = await supabase
                    .from('product_variants')
                    .insert({
                        product_id: data.id,
                        size: v.size,
                        color: v.color,
                        stock_quantity: v.stock_quantity,
                        sku_variant: v.sku_variant,
                        is_available: true
                    });

                if (variantError) {
                    console.error(`Error inserting variant for ${product.slug}:`, variantError.message);
                } else {
                    console.log(`  -> Added variant: ${v.size} / ${v.color}`);
                }
            }
        }
    }

    console.log('✨ Seeding complete!');
}

seed();
