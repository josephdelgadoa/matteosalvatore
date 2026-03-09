const chatbotService = require('./src/services/aiChatbotService');
require('dotenv').config({ path: '.env' });

async function testChatbot() {
    console.log('--- Testing Chatbot Logic ---');
    try {
        const message = "Hola, estoy buscando un polo de algodón pima.";
        console.log('User:', message);

        const response = await chatbotService.getChatbotResponse(message, [], 'es', {
            cart: [],
            isAuthenticated: false,
            currentPage: 'Homepage'
        });

        console.log('AI Response:', response);
        console.log('\n--- Test Complete ---');
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testChatbot();
