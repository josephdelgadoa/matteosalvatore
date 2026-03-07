const supabase = require('../config/database');
const { logger } = require('../utils/logger');

// Inventory Controller
exports.getInventoryByStore = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const { data: inventory, error } = await supabase
            .from('inventory')
            .select(`
                *,
                product_variants (
                    *,
                    products (name_es, name_en, sku)
                )
            `)
            .eq('store_id', storeId);

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { inventory }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateStock = async (req, res, next) => {
    try {
        const { store_id, variant_id, quantity } = req.body;

        const { data: inventory, error } = await supabase
            .from('inventory')
            .upsert({ store_id, variant_id, quantity, updated_at: new Date() }, { onConflict: 'store_id,variant_id' })
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { inventory }
        });
    } catch (error) {
        next(error);
    }
};

exports.transferStock = async (req, res, next) => {
    try {
        const { from_store_id, to_store_id, variant_id, quantity } = req.body;

        // Perform in a transaction logic via RPC or multiple calls (Supabase doesn't support complex transactions easily from JS without RPC)
        // For simplicity, we'll do two updates. In production, an RPC is preferred.

        // 1. Deduct from source
        const { data: fromInventory, error: fromError } = await supabase.rpc('adjust_inventory', {
            p_store_id: from_store_id,
            p_variant_id: variant_id,
            p_amount: -quantity
        });
        if (fromError) throw fromError;

        // 2. Add to destination
        const { data: toInventory, error: toError } = await supabase.rpc('adjust_inventory', {
            p_store_id: to_store_id,
            p_variant_id: variant_id,
            p_amount: quantity
        });
        if (toError) throw toError;

        res.status(200).json({
            status: 'success',
            message: 'Stock transferred successfully'
        });
    } catch (error) {
        next(error);
    }
};
