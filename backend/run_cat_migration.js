const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function runMigration() {
    const sql = fs.readFileSync('./migrations/13_add_localized_category_slugs.sql', 'utf8');

    // We execute via the 'exec_sql' RPC function if available
    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
        console.error('Migration failed:', error);
    } else {
        console.log('Migration successful:', data);
    }
}

runMigration();
