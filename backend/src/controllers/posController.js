const supabase = require('../config/database');
const { logger } = require('../utils/logger');

// POS Controller
exports.createSale = async (req, res, next) => {
    try {
        const { store_id, items, total_amount, payment_method } = req.body;
        const seller_id = req.user?.id; // Assuming auth middleware

        // 1. Create Sale Record
        const { data: sale, error: saleError } = await supabase
            .from('pos_sales')
            .insert({
                store_id,
                seller_id,
                total_amount,
                payment_method
            })
            .select()
            .single();

        if (saleError) throw saleError;

        // 2. Create Sale Items and Adjust Inventory
        const saleItems = items.map(item => ({
            sale_id: sale.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.unit_price * item.quantity
        }));

        const { error: itemsError } = await supabase
            .from('pos_sale_items')
            .insert(saleItems);

        if (itemsError) throw itemsError;

        // 3. Deduct Inventory (Simplified loop, RPC preferred for consistency)
        for (const item of items) {
            await supabase.rpc('adjust_inventory', {
                p_store_id: store_id,
                p_variant_id: item.variant_id,
                p_amount: -item.quantity
            });
        }

        res.status(201).json({
            status: 'success',
            data: { sale }
        });
    } catch (error) {
        next(error);
    }
};

exports.getSalesByStore = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const { data: sales, error } = await supabase
            .from('pos_sales')
            .select('*, pos_sale_items(*, product_variants(size, color, products(name_es)))')
            .eq('store_id', storeId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { sales }
        });
    } catch (error) {
        next(error);
    }
};
