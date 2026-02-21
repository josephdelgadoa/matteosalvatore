const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
    },
    body: JSON.stringify({ query: fs.readFileSync('./migrations/12_add_localized_product_slugs.sql', 'utf8') })
}).then(async res => {
    const text = await res.text();
    if (res.ok) console.log("Success:", text || "OK");
    else console.log("Error:", text);
}).catch(console.error);
