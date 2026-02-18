
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' }); // Adjust path as needed

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function checkTable() {
    try {
        console.log('Checking for table: featured_categories');
        const { data, error } = await supabase
            .from('featured_categories')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Error checking table:', error);
        } else {
            console.log('Table exists. Row count:', data); // data is null for head: true with count? No, usually count is returned in count property
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

checkTable();
