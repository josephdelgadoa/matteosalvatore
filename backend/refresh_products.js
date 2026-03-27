const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const supabase = require('./src/config/database');

const PRODUCT_FAMILIES = [
    {
        pattern: /Polo.*Pima.*Básico|Polo.*Pima.*Basico|Polo.*Esencial.*Pima|Polo.*Clásico.*Pima|Polo.*Clasico.*Pima|Polo.*Pima.*Esencial/i,
        short_name_es: 'Polo Pima Básico',
        short_name_en: 'Pima Basic Polo',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Polo.*Oversize/i,
        short_name_es: 'Polo Oversize',
        short_name_en: 'Oversize Polo',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Polo.*Boxy/i,
        short_name_es: 'Polo Boxy',
        short_name_en: 'Boxy Polo',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Polo.*Henley.*Manga.*Corta|Henley.*MC/i,
        short_name_es: 'Polo Henley MC',
        short_name_en: 'Henley Polo SS',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Polo.*Henley.*Manga.*Larga|Henley.*ML/i,
        short_name_es: 'Polo Henley ML',
        short_name_en: 'Henley Polo LS',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Conjunto.*Canguro/i,
        short_name_es: 'Conjunto Canguro',
        short_name_en: 'Kangaroo Set',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Conjunto.*Raglan/i,
        short_name_es: 'Conjunto Raglan',
        short_name_en: 'Raglan Set',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Pantalón.*Cargo|Pantalon.*Cargo/i,
        short_name_es: 'Pantalón Cargo',
        short_name_en: 'Cargo Pants',
        sizes: ['30', '32', '34', '36']
    },
    {
        pattern: /Pantalón.*Jogguer|Pantalon.*Jogguer|Jogger/i,
        short_name_es: 'Pantalón Jogguer',
        short_name_en: 'Joggers',
        sizes: ['30', '32', '34', '36']
    },
    {
        pattern: /Pantalón.*Skinny|Pantalon.*Skinny/i,
        short_name_es: 'Pantalón Skinny',
        short_name_en: 'Skinny Pants',
        sizes: ['28', '30', '32', '34']
    },
    {
        pattern: /Conjunto.*Tulum/i,
        short_name_es: 'Conjunto Tulum',
        short_name_en: 'Tulum Set',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Camisa.*Tulum/i,
        short_name_es: 'Camisa Tulum',
        short_name_en: 'Tulum Shirt',
        sizes: ['S', 'M', 'L', 'XL']
    },
    {
        pattern: /Polera.*Hoodie.*Classic|Polera.*Capucha.*Classic/i,
        short_name_es: 'Polera Hoodie',
        short_name_en: 'Hoodie',
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
];

// Utility to generate barcode same as productController.js
function generateMatrixBarcode(baseSku, color, size) {
    const colorCode = (color || 'NA').substring(0, 2).toUpperCase();
    const sizeCode = (size || 'N').substring(0, 1).toUpperCase();
    return `${baseSku}${colorCode}${sizeCode}`;
}

async function updateProductsAndVariants() {
    console.log('Fetching products and variants...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name_es, sku, slug_es, product_variants(id, size, color)');
    
    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Processing ${products.length} products...`);
    let updatedCount = 0;
    let variantsAdded = 0;

    for (const product of products) {
        const family = PRODUCT_FAMILIES.find(f => f.pattern.test(product.name_es) || f.pattern.test(product.slug_es));
        
        if (family) {
            process.stdout.write(`Updating ${product.name_es} -> ${family.short_name_es}... `);
            
            // 1. Update Short Names
            const { error: updateError } = await supabase.from('products').update({
                short_name_es: family.short_name_es,
                short_name_en: family.short_name_en
            }).eq('id', product.id);

            if (updateError) {
                console.error(`Error updating short names for ${product.id}:`, updateError);
                continue;
            }

            // 2. Sync Sizes
            // We assume the color is consistent for all variants of this physical product in DB
            const firstVariant = product.product_variants && product.product_variants.length > 0 
                ? product.product_variants[0] 
                : { color: 'N/A' };
            const productColor = firstVariant.color;

            const existingSizes = product.product_variants ? product.product_variants.map(v => v.size) : [];
            const missingSizes = family.sizes.filter(s => !existingSizes.includes(s));

            if (missingSizes.length > 0) {
                const newVariants = missingSizes.map(size => {
                    const skuV = generateMatrixBarcode(product.sku || '99999999', productColor, size);
                    return {
                        product_id: product.id,
                        size: size,
                        color: productColor,
                        sku_variant: skuV,
                        barcode: skuV,
                        is_available: true,
                        stock_quantity: 50 // Reset to 50 as previously requested for all
                    };
                });
                
                const { error: insertError } = await supabase.from('product_variants').insert(newVariants);
                if (insertError) {
                    console.error(`Error inserting variants for ${product.id}:`, insertError);
                } else {
                    variantsAdded += newVariants.length;
                }
            }
            console.log('Done.');
            updatedCount++;
        }
    }

    console.log('\n--- SUMMARY ---');
    console.log(`Products updated with short names: ${updatedCount}`);
    console.log(`New variants added: ${variantsAdded}`);
    console.log('✅ Update completed.');
}

updateProductsAndVariants();
