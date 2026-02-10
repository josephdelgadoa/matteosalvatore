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
app.use(express.json({ limit: '10kb' }));

// Data compression
app.use(compression());

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Routes
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const paymentRouter = require('./routes/payment');

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentRouter);

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

module.exports = app;
