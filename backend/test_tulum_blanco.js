const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const aiService = require('./src/services/aiService');

async function testAI() {
    try {
        console.log("Testing AI Generation for 'Conjunto Tulum' with color 'Blanco'...");
        const result = await aiService.generateProductContent({
            name: "Conjunto Tulum",
            color: "Blanco",
            material: "Algodón Peruano",
            category: "hombre",
            collection: "Essential 2026",
            fit: "Slim Regular",
            gender: "Hombre",
            price: "89.90"
        });

        console.log("\n--- RAW JSON RESULT ---");
        console.log(JSON.stringify(result, null, 2));

    } catch (e) {
        console.error(e);
    }
}

testAI();
