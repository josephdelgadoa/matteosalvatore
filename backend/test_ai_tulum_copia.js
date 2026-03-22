const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const aiService = require('./src/services/aiService');

async function testAI() {
    try {
        console.log("Testing AI Generation for 'conjunto tulum copia' with color 'white'...");
        const result = await aiService.generateProductContent({
            name: "conjunto tulum copia",
            color: "white",
            material: "Algodón Pima",
            category: "hombre",
            collection: "Urban",
            gender: "Hombre",
            price: "89.90"
        });

        console.log("\n--- RESULT ---");
        console.log("Title ES:", result["1_name_es"]);
        console.log("Title EN:", result["1_name_en"]);
        console.log("Style Code:", result.style_code);

    } catch (e) {
        console.error(e);
    }
}

testAI();
