const supabase = require('../config/database');
const { logger } = require('../utils/logger');

exports.getDashboardStats = async (req, res, next) => {
    try {
        // 1. Total Online Revenue
        const { data: onlineSales, error: onlineError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'completed');

        // 2. Total POS Revenue
        const { data: posSales, error: posError } = await supabase
            .from('pos_sales')
            .select('total_amount, store_id, stores(name)');

        if (onlineError || posError) throw (onlineError || posError);

        const totalOnline = onlineSales.reduce((sum, item) => sum + Number(item.total_amount), 0);
        const totalPos = posSales.reduce((sum, item) => sum + Number(item.total_amount), 0);

        // 3. Stats by Store
        const statsByStore = {};
        posSales.forEach(sale => {
            const storeName = sale.stores?.name || 'Unknown';
            statsByStore[storeName] = (statsByStore[storeName] || 0) + Number(sale.total_amount);
        });

        res.status(200).json({
            status: 'success',
            data: {
                totalRevenue: totalOnline + totalPos,
                onlineRevenue: totalOnline,
                posRevenue: totalPos,
                statsByStore
            }
        });
    } catch (error) {
        next(error);
    }
};
