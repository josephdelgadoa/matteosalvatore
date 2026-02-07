const SupabaseService = require('../services/supabase');
const { logger } = require('../utils/logger');
const supabase = require('../config/database');

const productService = new SupabaseService('products');

exports.getAllProducts = async (req, res, next) => {
    try {
        const { category, subcategory, featured, sort, limit } = req.query;

        let query = supabase
            .from('products')
            .select('*, product_variants(*), product_images(*)');

        // Filters
        if (category) query = query.eq('category', category);
        if (subcategory) query = query.eq('subcategory', subcategory);
        if (featured === 'true') query = query.eq('is_featured', true);

        // Default active only
        query = query.eq('is_active', true);

        // Sorting
        if (sort === 'price-asc') query = query.order('base_price', { ascending: true });
        if (sort === 'price-desc') query = query.order('base_price', { ascending: false });
        if (sort === 'newest') query = query.order('created_at', { ascending: false });

        // Limit
        if (limit) query = query.limit(parseInt(limit));

        const { data: products, error } = await query;

        if (error) {
            logger.error('Error fetching products:', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const { data: product, error } = await supabase
            .from('products')
            .select(`
        *,
        product_variants(*),
        product_images(*),
        reviews(*)
      `)
            .eq('slug', slug)
            .single();

        if (error || !product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // Sort images by display_order
        if (product.product_images) {
            product.product_images.sort((a, b) => a.display_order - b.display_order);
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductVariants = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data: variants, error } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', id)
            .eq('is_available', true);

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { variants }
        });
    } catch (error) {
        next(error);
    }
};
