require('dotenv').config(); // Automatically looks for .env in current directory (backend)
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newProducts = [
    {
        slug: 'pantalones-cargo-fit',
        sku: 'MS-PANT-CARGO',
        name_es: 'Pantalones Cargo Fit',
        name_en: 'Cargo Fit Pants',
        description_es: 'Material: Drill 100% algodón. Pantalones cargo cómodos y resistentes, ideales para un look urbano.',
        description_en: 'Material: 100% Cotton Drill. Comfortable and durable cargo pants, ideal for an urban look.',
        base_price: 119.00,
        category: 'bottoms',
        subcategory: 'cargo-fit',
        is_active: true,
        is_featured: true,
        variants: [
            { size: '30', color: 'Beige', sku_variant: 'MS-PANT-CARGO-30-BEIGE', stock_quantity: 15, is_available: true },
            { size: '32', color: 'Beige', sku_variant: 'MS-PANT-CARGO-32-BEIGE', stock_quantity: 15, is_available: true },
            { size: '34', color: 'Beige', sku_variant: 'MS-PANT-CARGO-34-BEIGE', stock_quantity: 15, is_available: true },
            { size: '30', color: 'Black', sku_variant: 'MS-PANT-CARGO-30-BLACK', stock_quantity: 15, is_available: true },
            { size: '32', color: 'Black', sku_variant: 'MS-PANT-CARGO-32-BLACK', stock_quantity: 15, is_available: true },
            { size: '34', color: 'Black', sku_variant: 'MS-PANT-CARGO-34-BLACK', stock_quantity: 15, is_available: true }
        ]
    },
    {
        slug: 'pantalones-skinny-ms',
        sku: 'MS-PANT-SKINNY',
        name_es: 'Pantalones Skinny MS',
        name_en: 'Skinny Fit Pants MS',
        description_es: 'Material: Drill Strech. Ajuste perfecto y máxima comodidad con nuestro drill stretch premium.',
        description_en: 'Material: Stretch Drill. Perfect fit and maximum comfort with our premium stretch drill.',
        base_price: 89.00,
        category: 'bottoms',
        subcategory: 'joggers',
        is_active: true,
        is_featured: true,
        variants: [
            { size: '30', color: 'Black', sku_variant: 'MS-PANT-SKINNY-30-BLACK', stock_quantity: 20, is_available: true },
            { size: '32', color: 'Black', sku_variant: 'MS-PANT-SKINNY-32-BLACK', stock_quantity: 20, is_available: true },
            { size: '34', color: 'Black', sku_variant: 'MS-PANT-SKINNY-34-BLACK', stock_quantity: 20, is_available: true }
        ]
    },
    {
        slug: 'conjunto-rangla-ms',
        sku: 'MS-SET-RANGLA',
        name_es: 'Conjunto Rangla MS',
        name_en: 'Rangla Set MS',
        description_es: 'Material del producto: Polo algodón pima y Short french terry 100% algodón. Un conjunto fresco y de alta calidad.',
        description_en: 'Product material: Pima cotton polo and French terry 100% cotton shorts. A fresh and high-quality set.',
        base_price: 89.00,
        category: 'matching-sets',
        subcategory: 'conjunto-rangla',
        is_active: true,
        is_featured: true,
        variants: [
            { size: 'S', color: 'Black/Grey', sku_variant: 'MS-SET-RANGLA-S-BLKGRY', stock_quantity: 10, is_available: true },
            { size: 'M', color: 'Black/Grey', sku_variant: 'MS-SET-RANGLA-M-BLKGRY', stock_quantity: 10, is_available: true },
            { size: 'L', color: 'Black/Grey', sku_variant: 'MS-SET-RANGLA-L-BLKGRY', stock_quantity: 10, is_available: true }
        ]
    },
    {
        slug: 'polos-basicos-ms',
        sku: 'MS-POLO-BASIC',
        name_es: 'Polos Básicos MS',
        name_en: 'Basic Polos MS',
        description_es: 'Material: Polo algodón pima. El básico esencial con la suavidad del algodón pima.',
        description_en: 'Material: Pima cotton polo. The essential basic with the softness of pima cotton.',
        base_price: 39.90,
        category: 'tops',
        subcategory: 'basics',
        is_active: true,
        is_featured: true,
        variants: [
            { size: 'S', color: 'Red', sku_variant: 'MS-POLO-BASIC-S-RED', stock_quantity: 25, is_available: true },
            { size: 'M', color: 'Red', sku_variant: 'MS-POLO-BASIC-M-RED', stock_quantity: 25, is_available: true },
            { size: 'L', color: 'Red', sku_variant: 'MS-POLO-BASIC-L-RED', stock_quantity: 25, is_available: true },
            { size: 'S', color: 'White', sku_variant: 'MS-POLO-BASIC-S-WHT', stock_quantity: 25, is_available: true },
            { size: 'M', color: 'White', sku_variant: 'MS-POLO-BASIC-M-WHT', stock_quantity: 25, is_available: true },
            { size: 'L', color: 'White', sku_variant: 'MS-POLO-BASIC-L-WHT', stock_quantity: 25, is_available: true }
        ]
    },
    {
        slug: 'conjunto-tulum-ms',
        sku: 'MS-SET-TULUM',
        name_es: 'Conjunto Tulum MS',
        name_en: 'Tulum Set MS',
        description_es: 'Material: Lino. Elegancia y frescura para tus días de verano.',
        description_en: 'Material: Linen. Elegance and freshness for your summer days.',
        base_price: 129.00,
        category: 'matching-sets',
        subcategory: 'conjunto-canguro',
        is_active: true,
        is_featured: true,
        variants: [
            { size: 'S', color: 'Beige', sku_variant: 'MS-SET-TULUM-S-BEIGE', stock_quantity: 8, is_available: true },
            { size: 'M', color: 'Beige', sku_variant: 'MS-SET-TULUM-M-BEIGE', stock_quantity: 8, is_available: true },
            { size: 'L', color: 'Beige', sku_variant: 'MS-SET-TULUM-L-BEIGE', stock_quantity: 8, is_available: true }
        ]
    }
];

async function seedProducts() {
    console.log('🌱 Seeding New Products...');

    for (const product of newProducts) {
        try {
            const { variants, ...productData } = product;

            // 1. Insert/Update Product
            console.log(`🔹 Processing ${product.slug}...`);
            const { data: insertedProduct, error: productError } = await supabase
                .from('products')
                .upsert(productData, { onConflict: 'slug' })
                .select()
                .single();

            if (productError) throw productError;

            const productId = insertedProduct.id;
            console.log(`   ✅ Product saved. ID: ${productId}`);

            // 2. Insert Variants
            if (variants && variants.length > 0) {
                const variantsWithId = variants.map(v => ({ ...v, product_id: productId }));

                // Note: We are not handling upsert for variants strictly here (no unique key on size/color/product_id combo in basic schema usually, mostly ID)
                // But for seeding, we can just insert. If we run this multiple times, we might duplicate variants if we don't clean up.
                // Ideally, we'd delete existing variants for this product first, or check existence.
                // For now, let's delete existing variants for this product to prevent duplication on re-runs.

                await supabase.from('product_variants').delete().eq('product_id', productId);

                const { error: variantError } = await supabase
                    .from('product_variants')
                    .insert(variantsWithId);

                if (variantError) throw variantError;
                console.log(`   ✅ Variants inserted.`);
            }

        } catch (err) {
            console.error(`❌ Error processing ${product.slug}:`, err.message);
        }
    }
    console.log('✨ Seeding complete.');
}

seedProducts();
