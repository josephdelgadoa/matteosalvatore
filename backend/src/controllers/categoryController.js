
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const CATEGORIES_TABLE = 'featured_categories';

exports.getAll = async (req, res) => {
    try {
        console.log('Fetching categories from', CATEGORIES_TABLE);
        const { data, error } = await supabase
            .from(CATEGORIES_TABLE)
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from(CATEGORIES_TABLE)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Category not found' });

        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
};

exports.create = async (req, res) => {
    try {
        console.log('Creating category with body:', req.body);
        const { title_es, title_en, subtitle_es, subtitle_en, image_url, link_url, display_order, is_active } = req.body;

        const { data, error } = await supabase
            .from(CATEGORIES_TABLE)
            .insert([{ title_es, title_en, subtitle_es, subtitle_en, image_url, link_url, display_order, is_active }])
            .select()
            .single();

        if (error) {
            console.error('Supabase Create Error:', error);
            throw error;
        }
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Failed to create category', details: err.message, hint: err.hint });
    }
};

exports.update = async (req, res) => {
    try {
        console.log(`Updating category ${req.params.id} with:`, req.body);
        const { id } = req.params;
        const { id: _, created_at, updated_at, ...updates } = req.body;

        const { data, error } = await supabase
            .from(CATEGORIES_TABLE)
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase Update Error:', error);
            throw error;
        }
        res.status(200).json(data);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Failed to update category', details: err.message, hint: err.hint });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from(CATEGORIES_TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

exports.reorder = async (req, res) => {
    try {
        const { items } = req.body; // Expects [{ id, display_order }]

        for (const item of items) {
            await supabase
                .from(CATEGORIES_TABLE)
                .update({ display_order: item.display_order })
                .eq('id', item.id);
        }

        res.status(200).json({ message: 'Reorder successful' });
    } catch (err) {
        console.error('Error reordering categories:', err);
        res.status(500).json({ error: 'Failed to reorder' });
    }
};
