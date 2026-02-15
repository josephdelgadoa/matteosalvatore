
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const fs = require('fs');
const supabase = require('./src/config/database');

async function runMigration() {
    console.log('Running Migration 08...');

    const migrationPath = path.resolve(__dirname, 'migrations/08_add_avatar_to_profiles.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split SQL by statement if needed, or run as a block if Supabase supports it via rpc
    // Since we don't have direct SQL access via client without RPC usually,
    // we might need to use a service key with a specific query function or use the dashboard.
    // However, if we assume we have a way to run SQL:

    // NOTE: The supabase-js client doesn't support running raw SQL directly unless an RPC function is set up.
    // Assuming the user has a way to run this or we have a `exec_sql` RPC function.

    // For now, I will try to use the `postgres` library if available or just log that it needs to be run.
    // Checking package.json... 'pg' is listed. I'll use 'pg' directly.

    const { Client } = require('pg');
    // Need to parse connection string from SUPABASE_URL? 
    // Usually Supabase provides a separate DB connection string.
    // If not available in env, I'll print instructions.

    if (process.env.DATABASE_URL) {
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        try {
            await client.connect();
            await client.query(sql);
            console.log('Migration 08 applied successfully!');
            await client.end();
        } catch (err) {
            console.error('Migration failed:', err);
        }
    } else {
        console.warn('DATABASE_URL not found in .env. Cannot run migration automatically.');
        console.log('Please run the SQL in `backend/migrations/08_add_avatar_to_profiles.sql` manually in Supabase SQL Editor.');

        // Fallback: Use supabase client if we have an `exec_sql` function (custom)
        // Or mostly likely, I'll stick to prompting the user or assuming they have a helper.
    }
}

// Check if we have postgres installed, if not, skip
try {
    require('pg');
    runMigration();
} catch (e) {
    console.log('pg module not found. Please install it or run SQL manually.');
}
