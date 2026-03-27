const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');

const crypto = require('crypto'); // For order number gen

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
            .select(`
                *,
                order_items (
                    *,
                    product_variants (
                        sku_variant,
                        products (
                            sku,
                            product_images (image_url, is_primary)
                        )
                    ),
                    products (
                        sku,
                        product_images (image_url, is_primary)
                    )
                )
            `)
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
