
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env from backend/.env
const envPath = path.resolve(__dirname, 'backend/.env');
console.log('Loading env from:', envPath);
dotenv.config({ path: envPath });

async function reloadSchema() {
    console.log('Reloading Supabase schema cache...');

    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is missing. Available keys:', Object.keys(process.env));
        return;
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query("NOTIFY pgrst, 'reload config';");
        console.log('Schema cache reload notified successfully.');
    } catch (err) {
        console.error('Failed to reload schema:', err);
    } finally {
        await client.end();
    }
}

reloadSchema();
