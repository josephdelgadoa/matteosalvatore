const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function checkUniqueColors() {
    try {
        const { data, error } = await supabase
            .from('product_variants')
            .select('color');

        if (error) console.error(error);
        else {
            const colors = [...new Set(data.map(d => d.color))];
            console.log('Unique Colors in Variants:', colors);
        }
    } catch (e) {
        console.error(e);
    }
}

checkUniqueColors();
