const chatbotService = require('../services/aiChatbotService');
const { logger } = require('../utils/logger');

/**
 * Handles incoming chatbot messages
 */
exports.handleMessage = async (req, res) => {
    try {
        const { message, history, lang, context } = req.body;

        if (!message) {
            return res.status(400).json({
                status: 'fail',
                message: 'Message is required'
            });
        }

        const response = await chatbotService.getChatbotResponse(
            message,
            history || [],
            lang || 'es',
            context || {}
        );

        res.status(200).json({
            status: 'success',
            data: {
                response
            }
        });
    } catch (error) {
        logger.error('Error in chatbotController:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to get chatbot response'
        });
    }
};
