
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkTable() {
    console.log('Checking for product_categories table...');
    try {
        const { data, error } = await supabase
            .from('product_categories')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error selecting from product_categories:', error);
        } else {
            console.log('Success! Table exists. Row count:', data.length);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkTable();
