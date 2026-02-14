require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error('Error: DATABASE_URL is required in .env');
    process.exit(1);
}

const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false } // Required for some Supabase connections
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Connected to database.');

        const migrationFile = path.join(__dirname, '../migrations/11_seed_new_products.sql');
        const sql = fs.readFileSync(migrationFile, 'utf8');

        console.log('Running migration...');
        await client.query(sql);
        console.log('Migration executed successfully.');

    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
