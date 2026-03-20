const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');
const { STYLE_MAPPING, COLOR_MAPPING, generateMatrixBarcode, normalize } = require('../utils/matrix');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateStyleCodes() {
    console.log('🔍 Searching for products to update styles with [Style][Color] format...');

    const { data: products, error } = await supabase
        .from('products')
        .select('id, name_es, sku');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    for (const product of products) {
        const normalizedName = normalize(product.name_es);
        
        // 1. Find Style Base (8 digits)
        let styleBase = null;
        for (const [styleName, code] of Object.entries(STYLE_MAPPING)) {
            if (normalizedName.includes(normalize(styleName))) {
                styleBase = code;
                break;
            }
        }

        // 2. Find Color (2 digits)
        let colorId = "00";
        for (const [colorName, id] of Object.entries(COLOR_MAPPING)) {
            if (normalizedName.includes(normalize(colorName))) {
                colorId = id;
                break;
            }
        }

        if (styleBase) {
            const targetSku = `${styleBase}${colorId}`;
            
            if (product.sku !== targetSku) {
                console.log(`Updating product "${product.name_es}": ${product.sku} -> ${targetSku}`);
                
                // Update Product SKU
                const { error: productError } = await supabase
                    .from('products')
                    .update({ sku: targetSku })
                    .eq('id', product.id);

                if (productError) {
                    // If duplicate, maybe they should be merged? 
                    // But if they have different colors, they shouldn't have same targetSku.
                    console.error(`  Error updating product SKU ${product.id}:`, productError.message);
                    continue;
                }

                // 3. Update Variants
                const { data: variants, error: varError } = await supabase
                    .from('product_variants')
                    .select('id, size, color, sku_variant')
                    .eq('product_id', product.id);

                if (varError) {
                    console.error(`  Error fetching variants:`, varError);
                    continue;
                }

                for (const variant of variants) {
                    const newBarcode = generateMatrixBarcode(styleBase, variant.color, variant.size);
                    console.log(`    Updating variant ${variant.sku_variant} -> ${newBarcode}`);
                    
                    const { error: varUpdateError } = await supabase
                        .from('product_variants')
                        .update({ 
                            sku_variant: newBarcode,
                            barcode: newBarcode
                        })
                        .eq('id', variant.id);

                    if (varUpdateError) {
                        console.error(`    Error updating variant ${variant.id}:`, varUpdateError.message);
                    }
                }
            }
        }
    }

    console.log('✅ Style update completed.');
}

updateStyleCodes().catch(console.error);
