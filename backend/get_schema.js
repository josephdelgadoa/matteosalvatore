const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function getProductsSchema() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error fetching table:', error);
        } else {
            console.log('Columns:', Object.keys(data[0] || {}));
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

getProductsSchema();
