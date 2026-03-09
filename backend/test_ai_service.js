const aiService = require('./src/services/aiService');
require('dotenv').config({ path: '.env' });

async function testAI() {
    console.log('--- Testing AI Service ---');
    try {
        const result = await aiService.generateProductContent({
            name: 'Polo Pima',
            color: 'Blanco',
            material: 'Algodón Pima',
            category: 'Polos',
            price: 150
        });
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testAI();
