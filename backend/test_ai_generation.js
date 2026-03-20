const aiService = require('./src/services/aiService');
require('dotenv').config();

async function testGeneration() {
  const productData = {
    name: "Polo Pima Básico",
    color: "Blanco",
    material: "100% Algodón Pima",
    category: "Polos",
    collection: "Essentials 2026",
    fit: "Regular Fit",
    gender: "Hombre",
    brand: "Matteo Salvatore",
    price: "129"
  };

  console.log("--- Testing AI Generation for Polo Pima Básico ---");
  try {
    const content = await aiService.generateProductContent(productData);
    console.log("\n--- Generated Product Names ---");
    console.log("ES:", content['1_name_es']);
    console.log("EN:", content['1_name_en']);
    
    console.log("\n--- Features (ES) ---");
    console.log(content['5_features_es']);
    
    console.log("\n--- Specifications (ES) ---");
    console.log(content['6_specifications_es']);

    const fullDesc = content['4_full_description_es'];
    const hasGramaje = fullDesc.includes('180') || fullDesc.includes('190');
    const hasTapete = fullDesc.includes('tapete') || fullDesc.includes('cinta interior');
    const hasRib = fullDesc.includes('rib') || fullDesc.includes('cuello');

    console.log("\n--- Technical Validation ---");
    console.log(`Includes Gramaje (180-190g): ${hasGramaje ? '✅' : '❌'}`);
    console.log(`Includes Tapete/Neck Tape: ${hasTapete ? '✅' : '❌'}`);
    console.log(`Includes Rib/Neck Reinforcement: ${hasRib ? '✅' : '❌'}`);

    if (!hasGramaje || !hasTapete || !hasRib) {
        console.log("\nWARNING: Some technical details might be missing from the full description.");
    }

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testGeneration();
