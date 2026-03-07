const supabase = require('../config/database');
const { logger } = require('../utils/logger');

// Store Controller
exports.getAllStores = async (req, res, next) => {
    try {
        const { data: stores, error } = await supabase
            .from('stores')
            .select('*')
            .order('name');

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { stores }
        });
    } catch (error) {
        next(error);
    }
};

exports.createStore = async (req, res, next) => {
    try {
        const { data: store, error } = await supabase
            .from('stores')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            status: 'success',
            data: { store }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateStore = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data: store, error } = await supabase
            .from('stores')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { store }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteStore = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('stores')
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
