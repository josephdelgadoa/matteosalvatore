require('dotenv').config();
const app = require('./app');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});
