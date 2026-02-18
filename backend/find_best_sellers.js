
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function findProducts() {
    try {
        console.log('Searching for products...');
        const { data, error } = await supabase
            .from('products')
            .select('id, name_es, name_en, slug, base_price');

        if (error) throw error;

        console.log('Found ' + data.length + ' products total.');

        console.log('\n--- ALL PRODUCTS ---');
        data.forEach(p => console.log(`- ${p.name_es} / ${p.name_en} (Slug: ${p.slug}) (ID: ${p.id})`));

        console.log('\n--- MATCHING REQUEST ---');
        // Simple client-side filter to help identify
        const targets = [
            'jogger',
            'polo',
            'cargo',
            'hoodie',
            'hoddie'
        ];

        const matches = data.filter(p => {
            const name = ((p.name_es || '') + ' ' + (p.name_en || '')).toLowerCase();
            return targets.some(t => name.includes(t));
        });
        matches.forEach(p => console.log(`MATCH: ${p.name_es} (${p.slug}) ID: ${p.id}`));

    } catch (err) {
        console.error('Error:', err);
    }
}

findProducts();
