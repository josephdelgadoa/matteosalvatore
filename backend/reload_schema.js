
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function reloadSchema() {
    console.log('Reloading Supabase schema cache...');

    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing in .env');
        return;
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query("NOTIFY pgrst, 'reload config';");
        console.log('Schema cache reload notified.');
    } catch (err) {
        console.error('Failed to reload schema:', err);
    } finally {
        await client.end();
    }
}

reloadSchema();
