require('dotenv').config({ path: '.env' });
const chatbotService = require('./src/services/aiChatbotService');

async function testChatbot() {
    console.log('--- Testing Chatbot Logic ---');
    const key = process.env.GEMINI_API_KEY;
    if (key) {
        console.log(`Key found. Length: ${key.length}, Starts with: ${key.substring(0, 5)}, Ends with: ${key.substring(key.length - 3)}`);
    } else {
        console.log('Key NOT found in process.env');
    }
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
