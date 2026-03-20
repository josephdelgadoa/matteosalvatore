const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const { STYLE_MAPPING, generateMatrixBarcode, normalize } = require('../utils/matrix');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function mergeProducts() {
    console.log('🔄 Starting product merge process...');

    // 1. Get all products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name_es, sku, description_es, description_en, category, subcategory, base_price');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const groups = {}; // Map styleCode -> [productIds]

    for (const product of products) {
        const normalizedName = normalize(product.name_es);
        let styleCode = null;

        for (const [styleName, code] of Object.entries(STYLE_MAPPING)) {
            if (normalizedName.includes(normalize(styleName))) {
                styleCode = code;
                break;
            }
        }

        if (styleCode) {
            if (!groups[styleCode]) groups[styleCode] = [];
            groups[styleCode].push(product);
        }
    }

    for (const [styleCode, productList] of Object.entries(groups)) {
        if (productList.length === 0) continue;

        console.log(`Processing Style ${styleCode}... found ${productList.length} products.`);

        // Find if one already has the correct SKU
        let master = productList.find(p => p.sku === styleCode);
        if (!master) {
            // Pick the first one as master and update its SKU
            master = productList[0];
            console.log(`Setting master for ${styleCode}: "${master.name_es}"`);
            const { error: masterUpdateError } = await supabase
                .from('products')
                .update({ sku: styleCode })
                .eq('id', master.id);
            
            if (masterUpdateError) {
                console.error(`Error updating master SKU for ${master.id}:`, masterUpdateError);
                continue;
            }
        } else {
            console.log(`Using existing master for ${styleCode}: "${master.name_es}" (SKU already ${styleCode})`);
        }

        // Move variants and images from others to master
        const others = productList.filter(p => p.id !== master.id);

        for (const other of others) {
            console.log(`  Merging "${other.name_es}" into Master...`);

            // Move variants
            const { data: variants, error: varError } = await supabase
                .from('product_variants')
                .select('*')
                .eq('product_id', other.id);

            if (varError) {
                console.error(`  Error fetching variants for ${other.id}:`, varError);
                continue;
            }

            for (const variant of variants) {
                const newBarcode = generateMatrixBarcode(styleCode, variant.color, variant.size);
                console.log(`    Moving variant ${variant.sku_variant} -> ${newBarcode}`);
                
                const { error: moveVarError } = await supabase
                    .from('product_variants')
                    .update({ 
                        product_id: master.id,
                        sku_variant: newBarcode,
                        barcode: newBarcode
                    })
                    .eq('id', variant.id);
                
                if (moveVarError) {
                    console.error(`    Error moving variant ${variant.id}:`, moveVarError);
                }
            }

            // Move images
            const { error: moveImgError } = await supabase
                .from('product_images')
                .update({ product_id: master.id })
                .eq('product_id', other.id);
            
            if (moveImgError) {
                console.error(`    Error moving images from ${other.id}:`, moveImgError);
            }

            // Finally delete the other product
            const { error: deleteError } = await supabase
                .from('products')
                .delete()
                .eq('id', other.id);
            
            if (deleteError) {
                console.log(`    Note: Could not delete product ${other.id} (maybe it has orders?):`, deleteError.message);
                // We deactivate it instead if delete fails
                await supabase.from('products').update({ is_active: false }).eq('id', other.id);
            } else {
                console.log(`    Deleted product ${other.id}`);
            }
        }
    }

    console.log('✅ Merge process completed.');
}

mergeProducts().catch(console.error);
