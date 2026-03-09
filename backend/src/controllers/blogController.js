const { createClient } = require('@supabase/supabase-js');
const { logger } = require('../utils/logger');
const aiService = require('../services/aiService');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.getAllPosts = async (req, res) => {
    try {
        const { lang = 'es', publishedOnly = false } = req.query;

        let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });

        if (publishedOnly === 'true') {
            query = query.eq('is_published', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { posts: data }
        });
    } catch (error) {
        logger.error('Error in getAllPosts:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { lang = 'es' } = req.query;

        const slugField = lang === 'en' ? 'slug_en' : 'slug_es';

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq(slugField, slug)
            .single();

        if (error || !data) {
            return res.status(404).json({ status: 'fail', message: 'Post not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { post: data }
        });
    } catch (error) {
        logger.error('Error in getPostBySlug:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ status: 'fail', message: 'Post not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { post: data }
        });
    } catch (error) {
        logger.error('Error in getPostById:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            status: 'success',
            data: { post: data }
        });
    } catch (error) {
        logger.error('Error in createPost:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('blog_posts')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            status: 'success',
            data: { post: data }
        });
    } catch (error) {
        logger.error('Error in updatePost:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);

        if (error) throw error;

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        logger.error('Error in deletePost:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.generateContent = async (req, res) => {
    try {
        const { topic, keywords, targetAudience, location } = req.body;

        if (!topic || !keywords) {
            return res.status(400).json({ status: 'fail', message: 'Topic and keywords are required' });
        }

        const content = await aiService.generateBlogContent({ topic, keywords, targetAudience, location });

        res.status(200).json({
            status: 'success',
            data: { content }
        });
    } catch (error) {
        logger.error('Error in generateContent:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
