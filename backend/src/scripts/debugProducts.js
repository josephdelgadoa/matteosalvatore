const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugProducts() {
    const skus = ['MS-HOM-2026-5396', 'MS-HOM-2026-6391'];
    console.log('🔍 Debugging SKUs:', skus);
    
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .in('sku', skus);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(JSON.stringify(products, null, 2));
}

debugProducts();
