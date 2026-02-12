const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { logger } = require('../utils/logger');

router.get('/', async (req, res) => {
    const health = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
        environment: {
            node_env: process.env.NODE_ENV,
            supabase_url_set: !!process.env.SUPABASE_URL,
            supabase_key_set: !!process.env.SUPABASE_SERVICE_KEY,
            port: process.env.PORT
        },
        database: {
            status: 'unknown',
            latency: null
        }
    };

    try {
        const start = Date.now();
        const { error, count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        const duration = Date.now() - start;

        if (error) {
            health.database.status = 'error';
            health.database.error = error.message;
            res.status(503);
        } else {
            health.database.status = 'connected';
            health.database.latency = `${duration}ms`;
            health.database.product_count = count;
        }

    } catch (error) {
        health.database.status = 'error';
        health.database.error = error.message;
        res.status(503);
    }

    res.json(health);
});

module.exports = router;
