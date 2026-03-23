require('dotenv').config();
const aiService = require('./src/services/aiService');

const productData = {
  name: 'Polo Pima Básico',
  color: 'Plomo Plata',
  material: '100% Pima Cotton',
  category: 'Polos',
  collection: 'Essential 2026',
  fit: 'Slim Fit',
  gender: 'Men',
  price: 99.90
};

async function test() {
  try {
    const res = await aiService.generateProductContent(productData);
    console.log("Success!");
    console.log("Title ES:", res["1_name_es"]);
    console.log("Title EN:", res["1_name_en"]);
    console.log("Has 8_keywords:", Array.isArray(res["8_keywords"]) && res["8_keywords"].length > 0);
    console.log("Has 9_hashtags:", Array.isArray(res["9_hashtags"]) && res["9_hashtags"].length > 0);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();

