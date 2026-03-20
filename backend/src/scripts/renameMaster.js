const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function renameMaster() {
    console.log('📝 Renaming master product...');

    const { error } = await supabase
        .from('products')
        .update({ 
            name_es: 'Polo Pima Básico',
            name_en: 'Basic Pima Polo'
        })
        .eq('sku', '00501000');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('✅ Renamed successfully.');
    }
}

renameMaster().catch(console.error);
