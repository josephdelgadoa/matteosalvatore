const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');

const crypto = require('crypto'); // For order number gen

const ORDER_RICH_SELECT = `
    *,
    order_items (
        *,
        product_variants (
            sku_variant,
            products (
                sku,
                short_name_es,
                short_name_en,
                product_images (image_url, is_primary)
            )
        ),
        products (
            sku,
            short_name_es,
            short_name_en,
            product_images (image_url, is_primary)
        )
    )
`;

exports.createOrder = async (req, res, next) => {
    try {
        const { items, shipping_address, customer_email, total_amount, customer_id } = req.body;

        // 1. Generate Order Number
        const orderNumber = `MS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // 2. Calculate values and Create Order
        const itemsSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = total_amount - itemsSubtotal;

        // Assuming 18% IGV is included in the item price
        // Tax = Total * 0.18 / 1.18
        const taxAmount = Number(((itemsSubtotal * 0.18) / 1.18).toFixed(2));
        const subtotalBase = itemsSubtotal - taxAmount;

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_id: customer_id || null, // Handle guest vs user
                subtotal: subtotalBase,
                tax_amount: taxAmount,
                shipping_cost: shippingCost,
                total_amount: total_amount,
                status: 'pending',
                shipping_address: shipping_address,
                email: customer_email
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 3. Create Order Items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            variant_id: item.variant_id || null, // ADDED variant_id
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity,
            variant_details: `Talla: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}`
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        res.status(201).json({
            status: 'success',
            data: { order }
        });

    } catch (error) {
        next(error);
    }
};

exports.getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const column = id && id.startsWith('MS-') ? 'order_number' : 'id';

        const { data: order, error } = await supabase
            .from('orders')
            .select(ORDER_RICH_SELECT)
            .eq(column, id)
            .single();

        if (error || !order) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { order }
        });

    } catch (error) {
        next(error);
    }
};

exports.getOrdersByCustomer = async (req, res, next) => {
    try {
        const { customerId } = req.params;
        const { email } = req.query;

        let query = supabase.from('orders').select('*');

        if (email) {
            // Use .or to match either the UUID or the email address
            query = query.or(`customer_id.eq.${customerId},email.eq.${email}`);
        } else {
            query = query.eq('customer_id', customerId);
        }

        const { data: orders, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });

    } catch (error) {
        next(error);
    }
};

exports.getAllOrders = async (req, res, next) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*') // Removed profiles join due to missing foreign key relationship
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { orders }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateFulfillmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { store_id, status } = req.body; // status should be 'preparing' or 'ready'

        // 1. Get current order details to get items
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(ORDER_RICH_SELECT)
            .eq('id', id)
            .single();

        if (orderError || !order) return res.status(404).json({ status: 'fail', message: 'Order not found' });

        // 2. If it's first time selecting store ('preparing'), deduct inventory
        if (status === 'preparing' && !order.fulfillment_store_id) {
            for (const item of order.order_items) {
                if (item.variant_id) {
                    const { error: invError } = await supabase.rpc('adjust_inventory', {
                        p_store_id: store_id,
                        p_variant_id: item.variant_id,
                        p_amount: -item.quantity
                    });
                    if (invError) logger.error(`[OrderFulfillment] Failed to adjust inventory for item ${item.id}:`, invError);
                }
            }
        }

        // 3. Update Order Status
        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                fulfillment_store_id: store_id,
                shipping_status: status,
            })
            .eq('id', id)
            .select(ORDER_RICH_SELECT)
            .single();

        if (updateError) throw updateError;

        // 4. Send Email Notification
        if (status === 'preparing') {
            const emailService = require('../services/emailService');
            await emailService.sendEmail({
                to: order.email,
                subject: `Estamos preparando tu pedido ${order.order_number} - Matteo Salvatore`,
                html: `<div style="font-family: serif; padding: 20px;">
                    <h1>¡Hola!</h1>
                    <p>Estamos preparando las prendas de tu pedido <b>${order.order_number}</b> para ser enviadas lo antes posible.</p>
                    <p>Recibirás otro correo cuando el paquete esté en camino.</p>
                    <br/>
                    <p>Gracias por elegir Matteo Salvatore.</p>
                </div>`
            });
        }

        res.status(200).json({
            status: 'success',
            data: { order: updatedOrder }
        });

    } catch (error) {
        next(error);
    }
};

exports.updateShippingDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { courier_name, courier_phone, courier_address, tracking_code } = req.body;

        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (orderError || !order) return res.status(404).json({ status: 'fail', message: 'Order not found' });

        const { data: updatedOrder, error: updateError } = await supabase
            .from('orders')
            .update({
                courier_name,
                courier_phone,
                courier_address,
                tracking_number: tracking_code,
                shipping_status: 'shipped',
                shipped_at: new Date()
            })
            .eq('id', id)
            .select(ORDER_RICH_SELECT)
            .single();

        if (updateError) throw updateError;

        // Send Shipping Email
        const emailService = require('../services/emailService');
        await emailService.sendEmail({
            to: order.email,
            subject: `Tu pedido ${order.order_number} está en camino - Matteo Salvatore`,
            html: `<div style="font-family: serif; padding: 20px;">
                <h1>¡Tu pedido está en camino!</h1>
                <p>Tu pedido <b>${order.order_number}</b> ha sido entregado al courier <b>${courier_name}</b> y está en tránsito a su destino.</p>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><b>Código de Seguimiento:</b> ${tracking_code}</p>
                    <p><b>Courier:</b> ${courier_name}</p>
                </div>
                <p>Pronto disfrutarás de tu nueva prenda Matteo Salvatore.</p>
            </div>`
        });

        res.status(200).json({
            status: 'success',
            data: { order: updatedOrder }
        });

    } catch (error) {
        next(error);
    }
};
