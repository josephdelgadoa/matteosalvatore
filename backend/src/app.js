const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { logger } = require('./utils/logger');
// Routes imports will go here

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data compression
app.use(compression());

// Limit requests from same API
const limiter = rateLimit({
    max: process.env.NODE_ENV === 'development' ? 5000 : 1000,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const paymentRouter = require('./routes/payment');
const contentRouter = require('./routes/content');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const productCategoriesRouter = require('./routes/productCategories'); // Taxonomy (New)
const complaintsRouter = require('./routes/complaints');

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/content', contentRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/product-categories', productCategoriesRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/menu', require('./routes/menu'));
app.use('/api/health', require('./routes/health'));

app.get('/', (req, res) => {
    res.send('Matteo Salvatore API is running');
});

// Routes middleware will go here

// Errors
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error('ERROR 💥:', err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {},
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});


module.exports = app;
