const CulqiService = require('../services/culqi');
const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');

exports.processPayment = async (req, res) => {
    try {
        const { token, amount, email, currency = 'PEN', orderId, description, authentication_3DS } = req.body;

        if (!token || !amount || !email) {
            return res.status(400).json({ success: false, message: 'Missing required payment details' });
        }

        // 1. Create Charge - strictly following apidocs.culqi.com/#tag/Cargos/operation/crear-cargo
        const charge = await CulqiService.createCharge({
            amount: Math.round(amount * 100), // Convert to cents
            currency_code: currency,
            email: email,
            source_id: token,
            description: description || `Order #${orderId} - Matteo Salvatore`,
            capture: true,
            metadata: {
                order_id: orderId
            },
            ...(authentication_3DS ? { authentication_3DS } : {})
        });

        // 2. Update Order Status
        if (orderId && !orderId.startsWith('ORD-')) {
            const ordersService = new SupabaseService('orders');
            await ordersService.update(orderId, {
                status: 'paid',
                payment_status: 'paid',
                payment_id: charge.id
            });
        }

        res.json({ success: true, data: { charge } });

    } catch (error) {
        logger.error(`Payment Controller Error: ${error.message}`);
        res.status(400).json({ success: false, message: error.message });
    }
};
