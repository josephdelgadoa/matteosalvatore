const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');

const crypto = require('crypto'); // For order number gen

exports.createOrder = async (req, res, next) => {
    try {
        const { items, shipping_address, customer_email, total_amount, customer_id } = req.body;

        // 1. Generate Order Number
        const orderNumber = `MS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // 2. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_id: customer_id || 'guest', // Handle guest vs user
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
            product_id: item.product_id, // backend should assume item has product_id
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
            variant_info: { size: item.size, color: item.color }
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
        const { orderNumber } = req.params;

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (*),
                payments (*)
            `)
            .eq('order_number', orderNumber)
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

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

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
            .select('*, profiles(first_name, last_name, email)') // Fetch basic customer info if relation exists
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
