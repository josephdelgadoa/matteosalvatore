const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function dumpAll() {
    try {
        const { data: cats } = await supabase.from('categories').select('*');
        console.log('Categories:', cats?.map(c => c.name_es));
        
        const { data: variants } = await supabase.from('product_variants').select('sku_variant, product_id, size, color').limit(10);
        console.log('Sample Variants:', variants);
    } catch (err) {
        console.error('Exception:', err);
    }
}

dumpAll();
