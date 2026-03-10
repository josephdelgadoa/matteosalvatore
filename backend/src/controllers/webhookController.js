const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');

const ordersTable = new SupabaseService('orders');

exports.handleCulqiWebhook = async (req, res) => {
    try {
        const event = req.body;
        logger.info(`Webhook received: ${event.type}`);

        if (event.type === 'order.status.changed' || event.type === 'charge.creation.succeeded') {
            const data = event.data || event;
            const orderId = data.metadata?.order_id || data.order_number;

            if (orderId) {
                // If it's a successful charge or order expansion
                const isSuccess = event.type === 'charge.creation.succeeded' ||
                    (data.state === 'paid' || data.status === 'paid');

                if (isSuccess) {
                    await ordersTable.update(orderId, {
                        status: 'paid',
                        payment_status: 'paid',
                        updated_at: new Date()
                    });
                    logger.info(`Order ${orderId} marked as PAID via webhook`);
                }
            }
        }

        res.status(200).json({ received: true });
    } catch (error) {
        logger.error(`Webhook error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};
