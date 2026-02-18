
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
            .order('display_order', { ascending: true })
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

exports.reorder = async (req, res) => {
    try {
        const { items } = req.body; // Array of { id, parent_id, display_order }

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items array' });
        }

        // 1. Fetch ALL categories to get existing data (satisfies NOT NULL) and for cycle checks
        const { data: allCategories, error: fetchError } = await supabase.from(TABLE).select('*');
        if (fetchError) throw fetchError;

        const categoryMap = new Map(allCategories.map(c => [c.id, c]));

        // 2. Prepare the "Next State" for cycle detection
        const nextState = new Map(allCategories.map(c => [c.id, c.parent_id]));
        // Overlay proposed changes
        items.forEach(item => {
            nextState.set(item.id, item.parent_id || null);
        });

        // 3. Cycle Detection
        for (const [id, parentId] of nextState.entries()) {
            let current = parentId;
            const visited = new Set([id]);
            let depth = 0;

            while (current && depth < 20) {
                if (visited.has(current)) {
                    return res.status(400).json({ error: `Circular dependency detected involving category ID ${id}` });
                }
                visited.add(current);
                current = nextState.get(current);
                depth++;
            }
        }

        // 4. Prepare Updates (Merge with existing data)
        const updates = items.map(item => {
            const existing = categoryMap.get(item.id);
            if (!existing) return null; // Should not happen if ID is valid

            return {
                ...existing, // Keep name_es, name_en, etc.
                parent_id: item.parent_id === undefined ? null : item.parent_id,
                display_order: item.display_order,
                updated_at: new Date().toISOString()
            };
        }).filter(Boolean);

        if (updates.length === 0) {
            return res.status(200).json([]);
        }

        // 5. Perform Upsert
        const { data, error } = await supabase
            .from(TABLE)
            .upsert(updates)
            .select();

        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        console.error('[ProductCategories] Error reordering:', err);
        res.status(500).json({ error: 'Failed to reorder categories', details: err.message });
    }
};
