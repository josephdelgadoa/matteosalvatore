
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkCount() {
    console.log('Checking product_categories count...');
    try {
        const { count, error } = await supabase
            .from('product_categories')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error counting:', error);
        } else {
            console.log('Total categories in DB:', count);
        }

        // Also fetch a few to see their structure
        const { data } = await supabase.from('product_categories').select('*').limit(3);
        console.log('Sample data:', data);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkCount();
