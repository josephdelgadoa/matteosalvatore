const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function verify() {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .select(`
                barcode, 
                sku_variant,
                color,
                size,
                products (name_es, sku)
            `)
            .not('barcode', 'is', null)
            .limit(20);

        if (error) console.error(error);
        else console.log('Verification Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

verify();
