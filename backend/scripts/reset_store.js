require('dotenv').config();
const supabase = require('../src/config/database');
const { logger } = require('../src/utils/logger');

async function resetStore() {
    console.log('🚀 Starting Full Store Reset...');
    
    const tables = [
        'pos_sale_items',
        'pos_sales',
        'order_items',
        'orders',
        'cart',
        'inventory',
        'product_variants',
        'product_images',
        'reviews',
        'products'
    ];

    for (const table of tables) {
        process.stdout.write(`Cleaning table: ${table}... `);
        try {
            const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
            if (error) {
                console.log('❌ Error');
                console.error(`Error cleaning ${table}:`, error.message);
            } else {
                console.log('✅ Done');
            }
        } catch (err) {
            console.log('❌ Exception');
            console.error(`Exception cleaning ${table}:`, err.message);
        }
    }

    console.log('\n✨ Store reset complete. You now have a clean start.');
}

resetStore().catch(err => {
    console.error('Fatal error during reset:', err);
    process.exit(1);
});
