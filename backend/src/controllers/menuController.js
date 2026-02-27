
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const TABLE = 'menu_items';

exports.getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from(TABLE)
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Build Tree
        const buildTree = (items, parentId = null) => {
            return items
                .filter(item => item.parent_id === parentId)
                .map(item => ({
                    ...item,
                    children: buildTree(items, item.id)
                }));
        };

        const tree = buildTree(data || []);
        res.status(200).json(tree);
    } catch (err) {
        console.error('Error fetching menu:', err);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
};

exports.create = async (req, res) => {
    try {
        const { label_es, label_en, link_url, type, parent_id, display_order, is_active } = req.body;

        const { data, error } = await supabase
            .from(TABLE)
            .insert([{ label_es, label_en, link_url, type, parent_id, display_order, is_active }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        console.error('Error creating menu item:', err);
        res.status(500).json({ error: err.message || 'Failed to create menu item' });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id: _, created_at, updated_at, children, subcategories, ...updates } = req.body;

        // Ensure we are not sending empty strings for link_url if it's supposed to be null
        if (updates.link_url === '') updates.link_url = null;

        const { data, error } = await supabase
            .from(TABLE)
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Menu item not found or no changes made' });
        }

        res.status(200).json(data[0]);
    } catch (err) {
        console.error('Error updating menu item:', err);
        res.status(500).json({ error: err.message || 'Failed to update menu item' });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from(TABLE)
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

exports.reorder = async (req, res) => {
    try {
        const { items } = req.body; // Expects flat list or handled recursively?
        // Simplest strategy: Client sends updates for specific items that changed order

        for (const item of items) {
            await supabase
                .from(TABLE)
                .update({
                    display_order: item.display_order,
                    parent_id: item.parent_id
                })
                .eq('id', item.id);
        }

        res.status(200).json({ message: 'Reorder successful' });
    } catch (err) {
        console.error('Error reordering menu:', err);
        res.status(500).json({ error: 'Failed to reorder' });
    }
};
