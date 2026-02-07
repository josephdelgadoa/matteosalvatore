const supabase = require('../config/database');
const { logger } = require('../utils/logger');

class SupabaseService {
    constructor(table) {
        this.table = table;
    }

    async getAll(select = '*', filters = {}) {
        try {
            let query = supabase.from(this.table).select(select);

            // Apply filters
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    query = query.eq(key, filters[key]);
                }
            });

            const { data, error } = await query;

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Supabase GetAll Error [${this.table}]: ${error.message}`);
            throw error;
        }
    }

    async getById(id, select = '*') {
        try {
            const { data, error } = await supabase
                .from(this.table)
                .select(select)
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`Supabase GetById Error [${this.table}]: ${error.message}`);
            throw error;
        }
    }

    async getByField(field, value, select = '*') {
        try {
            const { data, error } = await supabase
                .from(this.table)
                .select(select)
                .eq(field, value)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore 'not found' error for this helper
            return data;
        } catch (error) {
            logger.error(`Supabase GetByField Error [${this.table}]: ${error.message}`);
            throw error;
        }
    }

    async create(data) {
        try {
            const { data: created, error } = await supabase
                .from(this.table)
                .insert(data)
                .select()
                .single();

            if (error) throw error;
            return created;
        } catch (error) {
            logger.error(`Supabase Create Error [${this.table}]: ${error.message}`);
            throw error;
        }
    }

    async update(id, updates) {
        try {
            const { data: updated, error } = await supabase
                .from(this.table)
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return updated;
        } catch (error) {
            logger.error(`Supabase Update Error [${this.table}]: ${error.message}`);
            throw error;
        }
    }

    async delete(id) {
        try {
            const { error } = await supabase
                .from(this.table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            logger.error(`Supabase Delete Error [${this.table}]: ${error.message}`);
            throw error;
        }
    }
}

module.exports = SupabaseService;
