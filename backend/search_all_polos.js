const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function searchAllPolos() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, name_es, sku')
            .ilike('name_es', '%Polo%');

        if (error) console.error(error);
        else console.log('All Polos in DB:', data);
    } catch (e) {
        console.error(e);
    }
}

searchAllPolos();
