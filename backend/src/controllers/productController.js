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

// Admin Methods
exports.createProduct = async (req, res, next) => {
    try {
        const { product_images, product_variants, images, variants, ...productData } = req.body;

        // Normalize keys (frontend sends product_images, but we might want to support both)
        const imagesToInsert = product_images || images || [];
        const variantsToInsert = product_variants || variants || [];

        // 1. Insert Product
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (productError) throw productError;

        const productId = product.id;

        // 2. Insert Images (if any)
        if (imagesToInsert.length > 0) {
            const imageInserts = imagesToInsert.map((img, index) => ({
                product_id: productId,
                image_url: img.image_url || img.url || img, // Handle object or string
                display_order: img.display_order || index,
                is_primary: index === 0
            }));

            const { error: imagesError } = await supabase
                .from('product_images')
                .insert(imageInserts);

            if (imagesError) {
                logger.error('Error inserting images:', imagesError);
            }
        }

        // 3. Insert Variants (if any)
        if (variantsToInsert.length > 0) {
            const variantInserts = variantsToInsert.map(variant => ({
                product_id: productId,
                ...variant
            }));

            const { error: variantsError } = await supabase
                .from('product_variants')
                .insert(variantInserts);

            if (variantsError) {
                logger.error('Error inserting variants:', variantsError);
            }
        }

        res.status(201).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { product_images, product_variants, images, variants, reviews, created_at, updated_at, ...updates } = req.body;

        // Strip ID from updates if present (it's in params, and body might have it)
        delete updates.id;

        const imagesToUpdate = product_images || images;
        // variants logic is complex for updates, usually handled separately or replaced. 
        // For now we just strip product_variants to avoid error on product update.

        // 1. Update Product Fields
        const { data: product, error: productError } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (productError) throw productError;

        if (!product) {
            return res.status(404).json({ status: 'fail', message: 'Product not found' });
        }

        // 2. Update Images
        if (imagesToUpdate) {
            // Delete existing
            await supabase.from('product_images').delete().eq('product_id', id);

            // Insert new
            if (imagesToUpdate.length > 0) {
                const imageInserts = imagesToUpdate.map((img, index) => ({
                    product_id: id,
                    image_url: img.image_url || img.url || img,
                    display_order: img.display_order || index,
                    is_primary: index === 0
                }));
                await supabase.from('product_images').insert(imageInserts);
            }
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
