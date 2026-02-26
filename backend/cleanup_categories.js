
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function cleanup() {
    console.log('Fetching all categories...');
    const { data: allCategories, error } = await supabase
        .from('featured_categories')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    const seenSlots = new Set();
    const toDeactivate = [];

    allCategories.forEach(cat => {
        if (!cat.is_active) return;

        if (seenSlots.has(cat.display_order) || cat.display_order >= 5 || cat.display_order < 0) {
            toDeactivate.push(cat.id);
        } else {
            seenSlots.add(cat.display_order);
            console.log(`Keeping Slot ${cat.display_order}: ID=${cat.id}, Updated=${cat.updated_at}`);
        }
    });

    if (toDeactivate.length > 0) {
        console.log(`Deactivating ${toDeactivate.length} stray/duplicate categories...`);
        for (const id of toDeactivate) {
            const { error: updateError } = await supabase
                .from('featured_categories')
                .update({ is_active: false })
                .eq('id', id);

            if (updateError) {
                console.error(`Error deactivating ${id}:`, updateError);
            } else {
                console.log(`Deactivated ID=${id}`);
            }
        }
    } else {
        console.log('No duplicates found.');
    }
}

cleanup();
