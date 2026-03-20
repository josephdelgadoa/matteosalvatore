const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function getPoloPimaTable() {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .select(`
                barcode, 
                sku_variant,
                color,
                size,
                products!inner (name_es, sku)
            `)
            .eq('products.sku', '00501000')
            .order('color', { ascending: true })
            .order('size', { ascending: true });

        if (error) console.error(error);
        else console.log('Polo Matrix:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

getPoloPimaTable();
