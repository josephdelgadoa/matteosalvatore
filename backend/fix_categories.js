
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function fixCategories() {
    console.log('Breaking circular dependencies...');

    // Set Tops and Bottom to be roots (parent_id = null)
    try {
        const { data, error } = await supabase
            .from('product_categories')
            .update({ parent_id: null })
            .in('slug', ['tops', 'bottom', 'accessories']) // Reset likely roots
            .select();

        if (error) {
            console.error('Error updating:', error);
        } else {
            console.log('Updated categories to be roots:', data.map(c => c.name_en));
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

fixCategories();
