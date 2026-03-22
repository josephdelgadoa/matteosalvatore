const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../production.env') });
const { createClient } = require('@supabase/supabase-js');
const { STYLE_MAPPING, COLOR_MAPPING, generateMatrixBarcode, normalize } = require('../utils/matrix');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function prodSweep() {
    console.log('🚀 Starting PRODUCTION SWEEP...');
    console.log('Connected to:', supabaseUrl);

    // 1. Process Products
    const { data: products, error: pError } = await supabase
        .from('products')
        .select('id, name_es, sku');

    if (pError) throw pError;

    for (const product of products) {
        const normalizedName = normalize(product.name_es);
        
        // Find Style Base
        let styleBase = null;
        for (const [styleName, code] of Object.entries(STYLE_MAPPING)) {
            if (normalizedName.includes(normalize(styleName))) {
                styleBase = code;
                break;
            }
        }

        // Find Color 
        let colorId = "00";
        for (const [colorName, id] of Object.entries(COLOR_MAPPING)) {
            if (normalizedName.includes(normalize(colorName))) {
                colorId = id;
                break;
            }
        }

        if (styleBase) {
            const targetSku = `${styleBase}${colorId}`;
            if (product.sku !== targetSku || product.sku.startsWith('MS-HOM-')) {
                console.log(`[Product] Updating "${product.name_es}": ${product.sku} -> ${targetSku}`);
                await supabase.from('products').update({ sku: targetSku }).eq('id', product.id);
            }
        }
    }

    // 2. Process Variants
    const { data: variants, error: vError } = await supabase
        .from('product_variants')
        .select('*, products(sku, name_es)');

    if (vError) throw vError;

    for (const variant of variants) {
        const stylePrefix = variant.products.sku.substring(0, 8);
        const newBarcode = generateMatrixBarcode(stylePrefix, variant.color, variant.size);

        if (variant.sku_variant !== newBarcode || variant.sku_variant.includes('MS-HOM-')) {
            console.log(`[Variant] Updating variant for "${variant.products.name_es}": ${variant.sku_variant} -> ${newBarcode}`);
            await supabase.from('product_variants').update({ 
                sku_variant: newBarcode,
                barcode: newBarcode
            }).eq('id', variant.id);
        }
    }

    console.log('✅ Production sweep completed.');
}

prodSweep().catch(console.error);
