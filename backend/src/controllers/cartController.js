const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');

// For Cart, we might need a mix of direct Supabase calls and Redis, but MVP uses DB table 'cart'
const cartService = new SupabaseService('cart');

exports.getCart = async (req, res, next) => {
    try {
        const { sessionId, customerId } = req.query; // Or from auth middleware

        if (!sessionId && !customerId) {
            return res.status(400).json({ status: 'fail', message: 'Session ID or Customer ID required' });
        }

        let query = supabase
            .from('cart')
            .select(`
        *,
        product_variants (
            *,
            products (name_es, name_en, slug_es, slug_en, base_price, product_images(image_url))
        )
      `);

        if (customerId) {
            query = query.eq('customer_id', customerId);
        } else {
            query = query.eq('session_id', sessionId);
        }

        const { data: cartItems, error } = await query;

        if (error) throw error;

        // Calculate totals on the fly for MVP
        let subtotal = 0;
        const items = cartItems.map(item => {
            const variant = item.product_variants;
            const product = variant.products;
            const price = product.base_price + (variant.additional_price || 0);
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            return {
                id: item.id,
                product_id: variant.product_id,
                variant_id: item.variant_id,
                name: product.name_es, // Default to ES for logic
                slug_es: product.slug_es,
                slug_en: product.slug_en,
                image: product.product_images?.[0]?.image_url,
                size: variant.size,
                color: variant.color,
                price: price,
                quantity: item.quantity,
                total: itemTotal
            };
        });

        res.status(200).json({
            status: 'success',
            data: {
                items,
                subtotal: parseFloat(subtotal.toFixed(2)),
                itemCount: items.reduce((acc, item) => acc + item.quantity, 0)
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { sessionId, customerId, variantId, quantity } = req.body;

        // Check if item exists
        let query = supabase.from('cart').select('*').eq('variant_id', variantId);

        if (customerId) query = query.eq('customer_id', customerId);
        else query = query.eq('session_id', sessionId);

        const { data: existingItem, error: fetchError } = await query.single();

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            const { error } = await supabase
                .from('cart')
                .update({ quantity: newQuantity })
                .eq('id', existingItem.id);

            if (error) throw error;
        } else {
            // Insert new
            const { error } = await supabase
                .from('cart')
                .insert({
                    session_id: sessionId,
                    customer_id: customerId || null,
                    variant_id: variantId,
                    quantity: quantity
                });

            if (error) throw error;
        }

        res.status(200).json({ status: 'success', message: 'Item added to cart' });

    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('cart').delete().eq('id', id);
        if (error) throw error;
        res.status(200).json({ status: 'success', message: 'Item removed' });
    } catch (error) {
        next(error);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ status: 'fail', message: 'Quantity must be at least 1' });
        }

        const { error } = await supabase
            .from('cart')
            .update({ quantity })
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ status: 'success', message: 'Cart updated' });
    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const { sessionId, customerId } = req.body;

        let query = supabase.from('cart').delete();
        if (customerId) query = query.eq('customer_id', customerId);
        else query = query.eq('session_id', sessionId);

        const { error } = await query;
        if (error) throw error;

        res.status(200).json({ status: 'success', message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};
