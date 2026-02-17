
const { createClient } = require('@supabase/supabase-js');
const slugify = require('slugify');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const TABLE = 'product_categories';

exports.getAll = async (req, res) => {
    try {
        console.log(`[ProductCategories] Fetching all from ${TABLE}`);
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('name_es', { ascending: true });

        if (error) throw error;

        // Build tree structure if needed, or return flat list
        // For now, flat list is easier for the admin table
        res.status(200).json(data);
    } catch (err) {
        console.error('[ProductCategories] Error fetching:', err);
        res.status(500).json({ error: 'Failed to fetch product categories', details: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json(data);
    } catch (err) {
        console.error('[ProductCategories] Error fetching by ID:', err);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

exports.create = async (req, res) => {
    try {
        const { name_es, name_en, description_es, description_en, image_url, parent_id, is_active } = req.body;

        // Generate slug from Spanish name
        const slug = slugify(name_es, { lower: true, strict: true });

        const payload = {
            name_es,
            name_en,
            slug,
            description_es,
            description_en,
            image_url,
            parent_id: parent_id || null,
            is_active
        };

        const { data, error } = await supabase
            .from(TABLE)
            .insert([payload])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('[ProductCategories] Error creating:', err);
        res.status(500).json({ error: 'Failed to create category', details: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: _, created_at, updated_at, slug, ...updates } = req.body;

        // Optionally regenerate slug if name_es changes (skipped for simplicity/stability)

        const { data, error } = await supabase
            .from(TABLE)
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('[ProductCategories] Error updating:', err);
        res.status(500).json({ error: 'Failed to update category', details: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Check for children first? (For now, rely on DB constraints or allow deletion)

        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        console.error('[ProductCategories] Error deleting:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
