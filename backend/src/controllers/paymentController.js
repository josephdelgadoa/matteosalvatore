const CulqiService = require('../services/culqi');
const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');

exports.processPayment = async (req, res) => {
    try {
        const { token, amount, email, currency = 'PEN', orderId } = req.body;

        if (!token || !amount || !email) {
            return res.status(400).json({ success: false, message: 'Missing required payment details' });
        }

        // 1. Create Charge
        const charge = await CulqiService.createCharge({
            amount: Math.round(amount * 100), // Convert to cents
            currency_code: currency,
            email: email,
            source_id: token,
            description: `Order #${orderId}`,
            capture: true
        });

        // 2. Update Order Status if orderId is provided
        if (orderId && !orderId.startsWith('ORD-')) { // Ignore temp IDs checks
            // Assume orderId is UUID or we find by order number. 
            // If we passed UUID from createOrder result:
            await SupabaseService.update('orders', orderId, {
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
