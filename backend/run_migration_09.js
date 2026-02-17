
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function runMigration() {
    console.log('Running migration: 09_create_featured_categories.sql');

    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing in .env');
        console.log('Please run this SQL manually in Supabase SQL Editor:');
        console.log(fs.readFileSync(path.join(__dirname, 'migrations/09_create_featured_categories.sql'), 'utf8'));
        return;
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const sql = fs.readFileSync(path.join(__dirname, 'migrations/09_create_featured_categories.sql'), 'utf8');
        await client.query(sql);
        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
