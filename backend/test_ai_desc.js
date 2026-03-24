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
    console.log("ES Description key present?", !!res["4_full_description_es"]);
    console.log("ES Description length:", res["4_full_description_es"] ? res["4_full_description_es"].length : 0);
    console.log("EN Description key present?", !!res["4_full_description_en"]);
    console.log(JSON.stringify({es: res["4_full_description_es"], en: res["4_full_description_en"]}, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();
