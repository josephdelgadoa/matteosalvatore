const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name_es, sku');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Current Products in DB:');
    products.forEach(p => console.log(`- "${p.name_es}" (SKU: ${p.sku})`));
}

checkProducts().catch(console.error);
