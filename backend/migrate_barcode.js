const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.SUPABASE_URL.replace('https://', 'postgres://postgres:PASSWORD@').replace('.supabase.co', ':5432/postgres'), // we might need the actual connection string. Let's look for DATABASE_URL in .env
});

async function migrate() {
    try {
        console.log('Adding barcode column to product_variants...');
        const res = await pool.query('ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS barcode VARCHAR(255) UNIQUE;');
        console.log('Migration successful', res);
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

// Check if we have DATABASE_URL, otherwise just use supabase-js if possible. Wait, we can't alter table with supabase-js easily. Let's just create this file and check if .env has DATABASE_URL.
migrate();
