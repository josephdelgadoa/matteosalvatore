const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_KEY missing in .env');
    process.exit(1);
}

const migrationFile = process.argv[2];
if (!migrationFile) {
    console.error('Please provide a migration file name as an argument');
    process.exit(1);
}

const migrationPath = path.join(__dirname, 'migrations', migrationFile);

if (!fs.existsSync(migrationPath)) {
    console.error(`Migration file not found: ${migrationPath}`);
    process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');

async function runMigration() {
    console.log(`Running migration: ${migrationFile}...`);
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ query: sql })
        });

        const text = await response.text();
        if (response.ok) {
            console.log('Success:', text || 'OK');
        } else {
            console.error('Error:', text);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

runMigration();
