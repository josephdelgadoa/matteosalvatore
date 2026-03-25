require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Need service key to bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetOrders() {
    console.log('🔄 Starting Orders Database Reset...');

    try {
        // 1. Delete order items first (due to foreign key dependencies)
        console.log('Clearing order_items table...');
        const { error: itemsError } = await supabase
            .from('order_items')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
        
        if (itemsError) throw itemsError;
        console.log('✅ order_items cleared');

        // 2. Delete payments
        console.log('Clearing payments table...');
        const { error: paymentsError } = await supabase
            .from('payments')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (paymentsError) throw paymentsError;
        console.log('✅ payments cleared');

        // 3. Delete orders
        console.log('Clearing orders table...');
        const { error: ordersError } = await supabase
            .from('orders')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
        
        if (ordersError) throw ordersError;
        console.log('✅ orders cleared');

        console.log('🎉 Reset complete! All orders have been wiped.');
    } catch (err) {
        console.error('❌ Error resetting orders:', err);
    }
}

resetOrders();
