const aiService = require('../services/aiService');
const { logger } = require('../utils/logger');

exports.generateProduct = async (req, res, next) => {
    try {
        const productData = req.body;

        if (!productData.name || !productData.category) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide at least product name and category'
            });
        }

        logger.info(`Generating AI content for product: ${productData.name}`);
        const generatedContent = await aiService.generateProductContent(productData);

        res.status(200).json({
            status: 'success',
            data: generatedContent
        });
    } catch (error) {
        logger.error('Error in AI generateProduct controller:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
