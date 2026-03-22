const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const aiService = require('./src/services/aiService');
const { generateMatrixBarcode, COLOR_MAPPING, normalize } = require('./src/utils/matrix');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const PANT_COLLECTIONS = [
    {
        name: "Pantalón Cargo Fit",
        styleCode: "00508000",
        sizes: ["30", "32", "34", "36"],
        colors: ["Azul Marino", "Verde", "Camell", "Beige", "Negro", "Hueso"],
        price: 49.90
    },
    {
        name: "Pantalón Jogger",
        styleCode: "00509000",
        sizes: ["30", "32", "34", "36"],
        colors: ["Camell", "Beige", "Plomo Plata", "Verde", "Azul Marino", "Negro", "Plomo Rata", "Blanco", "Vino"],
        price: 49.90
    },
    {
        name: "Pantalón Skinny",
        styleCode: "00510000",
        sizes: ["28", "30", "32", "34"],
        colors: ["Vino", "Plomo Plata", "Plomo Rata", "Verde", "Beige", "Blanco", "Azul", "Negro"],
        price: 49.90
    }
];

const stockPerVariant = 10;

// Helper to get Color ID
function getColorId(colorName) {
    const norm = normalize(colorName);
    for (const [name, id] of Object.entries(COLOR_MAPPING)) {
        if (norm === normalize(name)) {
            return id;
        }
    }
    for (const [name, id] of Object.entries(COLOR_MAPPING)) {
        if (norm.includes(normalize(name))) {
            return id;
        }
    }
    return "00";
}

async function seedPants() {
    console.log(`--- Starting BATCH SEEDING for Pants ---`);

    for (const collection of PANT_COLLECTIONS) {
        console.log(`\n\n=== Processing Collection: ${collection.name} ===`);
        
        // Optional Cleanup: Remove existing products with this style code to avoid duplicates
        console.log(`Cleaning up existing ${collection.name} products (${collection.styleCode})...`);
        const { data: existing } = await supabase.from('products').select('id').ilike('sku', `${collection.styleCode}%`);
        if (existing && existing.length > 0) {
            const ids = existing.map(p => p.id);
            await supabase.from('product_variants').delete().in('product_id', ids);
            await supabase.from('product_images').delete().in('product_id', ids);
            await supabase.from('products').delete().in('id', ids);
            console.log(`Removed ${existing.length} existing products.`);
        }

        for (const color of collection.colors) {
            const colorId = getColorId(color);
            const productSku = `${collection.styleCode}${colorId}`;

            console.log(`\nGenerating content for: ${collection.name} - ${color} (SKU: ${productSku})...`);
            
            try {
                // Call Gemini AI for description generation
                const aiResult = await aiService.generateProductContent({
                    name: collection.name,
                    color: color,
                    material: "Algodón Premium con Elastano",
                    category: "Hombre / Men",
                    collection: "Urban 2026",
                    gender: "Hombre",
                    price: collection.price.toString()
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
                    base_price: collection.price,
                    category: "hombre",
                    subcategory: "pantalones",
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
                const variantInserts = collection.sizes.map(size => {
                    const barcode = generateMatrixBarcode(collection.styleCode, color, size);
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
                    console.log(`Successfully added ${collection.sizes.length} variants for ${color}.`);
                }

            } catch (error) {
                console.error(`Failed to process ${color}:`, error.message);
            }
        }
    }

    console.log("\n--- Batch Seeding Completed ---");
}

seedPants();
