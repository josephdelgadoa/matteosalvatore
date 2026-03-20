const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkPoloVariants() {
    try {
        // Find Polo Basico products
        const { data: products } = await supabase
            .from('products')
            .select('id, name_es, sku')
            .ilike('name_es', '%Polo Básico%');
            
        console.log('Polo Basico Products:', products?.length);
        
        if (products && products.length > 0) {
            // Check variants for the first one (e.g. Blanco)
            const blancoId = products.find(p => p.name_es.includes('Blanco'))?.id;
            if (blancoId) {
                const { data: variants } = await supabase
                    .from('product_variants')
                    .select('sku_variant, size, color')
                    .eq('product_id', blancoId);
                console.log('Variants for Blanco:', variants);
            }
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

checkPoloVariants();
