const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const aiService = require('./src/services/aiService');
const { generateMatrixBarcode, COLOR_MAPPING, normalize } = require('./src/utils/matrix');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const styleCode = '00501000';
// Removed duplicates and added more variety to reach 14 unique colors
const colorsToSeed = [
    "Rosado Bebé", "Turquesa", "Negro", "Sky", "Celeste Bebé", 
    "Rojo", "Vino", "Cemento", "Gris", "Beige", 
    "Blanco", "Azul Noche", "Melange", "Palo Rosa"
];

const sizes = ["S", "M", "L", "XL"];
const stockPerVariant = 10;
const targetPrice = 39.90;

// Helper to get Color ID
function getColorId(colorName) {
    const norm = normalize(colorName);
    for (const [name, id] of Object.entries(COLOR_MAPPING)) {
        if (norm === normalize(name) || norm.includes(normalize(name))) {
            return id;
        }
    }
    return "00";
}

async function seedProducts() {
    console.log(`--- Starting RE-SEED for ${colorsToSeed.length} Products ---`);

    // CLEANUP existing Polo Pima Básico products to ensure uniqueness and fix previous AI errors
    console.log("Cleaning up existing Polo Pima Básico products (00501000)...");
    const { data: existing } = await supabase.from('products').select('id').ilike('sku', '00501000%');
    if (existing && existing.length > 0) {
        const ids = existing.map(p => p.id);
        await supabase.from('product_variants').delete().in('product_id', ids);
        await supabase.from('product_images').delete().in('product_id', ids);
        await supabase.from('products').delete().in('id', ids);
        console.log(`Removed ${existing.length} existing products.`);
    }

    for (const color of colorsToSeed) {
        const colorId = getColorId(color);
        const productSku = `${styleCode}${colorId}`;

        console.log(`\nGenerating content for: Polo Pima Básico - ${color} (SKU: ${productSku})...`);
        
        try {
            const aiResult = await aiService.generateProductContent({
                name: "Polo Pima Básico",
                color: color,
                material: "100% Algodón Pima Peruano",
                category: "Hombre / Men",
                collection: "Essential 2026",
                gender: "Hombre",
                price: targetPrice.toString()
            });

            const productData = {
                sku: productSku,
                name_es: aiResult["1_name_es"],
                name_en: aiResult["1_name_en"],
                slug_es: aiResult["2_slug_es"],
                slug_en: aiResult["2_slug_en"],
                short_description_es: aiResult["3_short_description_es"],
                short_description_en: aiResult["3_short_description_en"],
                description_es: aiResult["4_full_description_es"],
                description_en: aiResult["4_full_description_en"],
                base_price: targetPrice,
                category: "hombre",
                subcategory: "polos-hombre",
                is_active: true,
                is_featured: false,
                seo_title_es: aiResult["10_seo_title_es"],
                seo_title_en: aiResult["10_seo_title_en"],
                seo_description_es: aiResult["11_seo_description_es"],
                seo_description_en: aiResult["11_seo_description_en"]
            };

            // 1. Insert Product
            const { data: product, error: pError } = await supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (pError) {
                console.error(`Error inserting product (${color}):`, pError.message);
                continue;
            }

            const productId = product.id;
            console.log(`Product created: ${product.name_es} (ID: ${productId})`);

            // 2. Insert Variants
            const variantInserts = sizes.map(size => {
                const barcode = generateMatrixBarcode(styleCode, color, size);
                return {
                    product_id: productId,
                    size: size,
                    color: color,
                    stock_quantity: stockPerVariant,
                    sku_variant: barcode,
                    barcode: barcode,
                    is_available: true
                };
            });

            const { error: vError } = await supabase
                .from('product_variants')
                .insert(variantInserts);

            if (vError) {
                console.error(`Error inserting variants (${color}):`, vError.message);
            } else {
                console.log(`Successfully added ${sizes.length} variants for ${color}.`);
            }

        } catch (error) {
            console.error(`Failed to process ${color}:`, error.message);
        }
    }

    console.log("\n--- Batch Re-Seeding Completed ---");
}

seedProducts();
