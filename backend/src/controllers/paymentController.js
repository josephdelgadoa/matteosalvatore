const CulqiService = require('../services/culqi');
const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');
const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxxxx' 
    ? new Resend(process.env.RESEND_API_KEY) 
    : null;

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
                status: 'paid'
            });

            // Post-payment actions
            try {
                // 1. Fetch order items to deduct inventory
                const { data: orderItems } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', orderId);

                if (orderItems && orderItems.length > 0) {
                    // Fetch a default store if not specified
                    const { data: stores } = await supabase.from('stores').select('id').eq('is_active', true).limit(1);
                    const storeId = stores && stores.length > 0 ? stores[0].id : null;

                    if (storeId) {
                        for (const item of orderItems) {
                            if (item.variant_id) {
                                const { error: invError } = await supabase.rpc('adjust_inventory', {
                                    p_store_id: storeId,
                                    p_variant_id: item.variant_id,
                                    p_amount: -item.quantity
                                });
                                if (invError) logger.error(`Error deducting inventory for variant ${item.variant_id}:`, invError);
                            }
                        }
                    }
                }

                // 2. Send Emails
                if (resend) {
                    const { data: orderDetails } = await supabase.from('orders').select('*').eq('id', orderId).single();
                    const orderNum = orderDetails ? orderDetails.order_number : orderId;
                    const customerEmail = orderDetails ? orderDetails.email : email;

                    // Receipt to Customer
                    const res1 = await resend.emails.send({
                        from: process.env.FROM_EMAIL || 'pedidos@matteosalvatore.com',
                        to: customerEmail,
                        subject: `Recibo de Compra - Pedido ${orderNum}`,
                        html: `<h1>¡Gracias por tu compra!</h1><p>Hemos recibido el pago de ${amount} ${currency} para el pedido <strong>${orderNum}</strong>.</p><p>Pronto procesaremos tu envío.</p>`
                    });
                    if (res1.error) logger.error('Resend Error [Customer]:', res1.error);

                    // Notification to Admin
                    const res2 = await resend.emails.send({
                        from: process.env.FROM_EMAIL || 'pedidos@matteosalvatore.com',
                        to: process.env.ADMIN_EMAIL || 'admin@matteosalvatore.pe',
                        subject: `Nuevo pedido pagado: ${orderNum}`,
                        html: `<h1>Nuevo Pedido Registrado</h1><p>El cliente (${customerEmail}) ha pagado ${amount} ${currency} por el pedido <strong>${orderNum}</strong>.</p>`
                    });
                    if (res2.error) logger.error('Resend Error [Admin]:', res2.error);
                }
            } catch (postPaymentErr) {
                logger.error('Error in post-payment processes (inventory/email):', postPaymentErr);
            }
        }

        res.json({ success: true, data: { charge } });

    } catch (error) {
        logger.error(`Payment Controller Error: ${error.message}`);
        res.status(400).json({ success: false, message: error.message });
    }
};
