const express = require('express');
const supabase = require('../config/database');
const router = express.Router();

// Get content block by key
router.get('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { data, error } = await supabase
            .from('content_blocks')
            .select('value')
            .eq('key', key)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ status: 'fail', message: 'Content not found' });
            }
            throw error;
        }

        res.status(200).json({
            status: 'success',
            data: data.value
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Update content block (Admin only)
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        // Verify Admin Role
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ status: 'fail', message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ status: 'fail', message: 'Invalid token' });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
            return res.status(403).json({ status: 'fail', message: 'Not authorized' });
        }

        // Update content
        const { data, error } = await supabase
            .from('content_blocks')
            .upsert({ key, value, updated_at: new Date() })
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: data.value
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
