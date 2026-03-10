const { GoogleGenerativeAI } = require("@google/generative-ai");
const { logger } = require('../utils/logger');

let genAI;
function getGenAI() {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
}

/**
 * Handles AI Chatbot conversations focused on conversion
 * @param {string} message - User input message
 * @param {Array} history - Previous conversation messages
 * @param {string} lang - 'es' or 'en'
 * @param {Object} context - Optional context like current cart, user data, or product being viewed
 * @returns {Promise<string>} - AI response
 */
exports.getChatbotResponse = async (message, history = [], lang = 'es', context = {}) => {
    try {
        const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build specialized system prompt for sales and luxury brand alignment
        const systemPrompt = `
You are "Matteo", the AI Shopping Assistant for "Matteo Salvatore", an exclusive luxury fashion house specializing in Peruvian Pima Cotton.
Your primary goal is to provide a premium concierge experience, answer questions about products, and drive users to add items to their CART, REGISTER, and complete PAYMENTS online.

TONE & STYLE:
- Sophisticated, helpful, and exclusive "Quiet Luxury" whisper-quiet tone.
- Bilingual: Respond in ${lang === 'es' ? 'Spanish' : 'English'}.
- Personal: Use a polite, professional, yet warm approach.

CONVERSION STRATEGY:
- If a user asks about a product, highlight its quality (Pima Cotton heritage) and suggest adding it to the cart.
- If a user seems hesitant, mention the exclusive nature of the collection and the ease of online payment.
- If a user asks about shipping or returns, emphasize the premium service and drive them back to the shop.
- Always include subtle calls to action: "Would you like to see this in your cart?", "I can help you finalize your selection now."

BRAND VALUES:
- Peruvian Craftsmanship, Timeless Minimalism, The World's Finest Pima Cotton.

CONTEXT (Use this to provide better answers):
- User Cart: ${JSON.stringify(context.cart || [])}
- Authenticated: ${context.isAuthenticated ? 'Yes' : 'No'}
- Current Page: ${context.currentPage || 'Homepage'}

LIMITS:
- Do not make up prices if not provided. Use general luxury terms if specific data is missing.
- Provide thorough, elegant, and descriptive answers that capture the luxury essence.
- Focus strictly on Matteo Salvatore products and services.

(Conversation starts now)
`;

        // Process history into Gemini format
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }],
            })),
            generationConfig: {
                maxOutputTokens: 1500,
            },
        });

        // We prepend the system prompt only for the first message or as a continuous instruction implicitly
        const fullMessage = history.length === 0
            ? `${systemPrompt}\n\nUser: ${message}`
            : message;

        const result = await chat.sendMessage(fullMessage);
        const response = await result.response;
        const textResponse = response.text();

        logger.info(`Chatbot response generated successfully for language: ${lang}`);
        return textResponse;
    } catch (error) {
        logger.error('Error in getChatbotResponse:', {
            message: error.message,
            stack: error.stack,
            lang,
            context: !!context
        });
        throw new Error('Chatbot service unavailable: ' + error.message);
    }
};
