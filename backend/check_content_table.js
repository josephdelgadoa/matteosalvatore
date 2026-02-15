
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const supabase = require('./src/config/database');

async function checkContentTable() {
    console.log('Checking content_blocks table...');

    const { data, error, count } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact' });

    if (error) {
        console.error('Error fetching content_blocks:', error);
        return;
    }

    console.log(`Found ${count} rows in content_blocks.`);
    if (data && data.length > 0) {
        console.log('Keys:', data.map(row => row.key));
        console.log('Sample Value (first row):', JSON.stringify(data[0].value, null, 2));
    } else {
        console.log('Table exists but is empty.');
    }
}

checkContentTable();
