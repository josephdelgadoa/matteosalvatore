const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function dumpProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, name_es, name_en, sku')
            .order('name_es');

        if (error) {
            console.error('Error fetching table:', error);
        } else {
            console.log('Products:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

dumpProducts();
