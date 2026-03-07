const { GoogleGenerativeAI } = require("@google/generative-ai");
const { logger } = require('../utils/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates product content using Gemini AI
 * @param {Object} productData - { name, color, material, category, collection, fit, gender, brand, price }
 * @returns {Promise<Object>} - Structured AI generated content
 */
exports.generateProductContent = async (productData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
You are the Global Creative Director and Lead SEO Strategist for "Matteo Salvatore", a world-class luxury minimalist fashion house based in Peru, specializing in the world's finest Pima Cotton.
Your goal is to transform basic product data into elite, high-conversion, and SEO-dominant museum-grade product listings that will rank #1 globally in the "Quiet Luxury" and "Premium Essentials" categories.

INSTRUCTIONS FOR TITLE POLISHING (Elite Structure):
- Take the simple user-provided "Name" and transform it into a powerful SEO Title.
- Formula: [Brand Name] + [Core Product Type] + [Premium Material/Fabric] + [Specific Attribute/Fit] + [Color] + [Season/Year] - [Gender/Category].
- Example: "Matteo Salvatore Polo Básico Premium - Algodón Pima Peruano - Slim Fit - Blanco Invierno 2026 - Hombre".
- Titles must be magnetic, sophisticated, and technically perfect for Google/AI discovery.

BASIC PRODUCT DATA (Input):
- User Provided Name: ${productData.name}
- Color: ${productData.color}
- Material: ${productData.material}
- Category: ${productData.category}
- Collection: ${productData.collection || 'N/A'}
- Fit: ${productData.fit || 'N/A'}
- Gender: ${productData.gender || 'Hombre'}
- Brand: Matteo Salvatore
- Base Price: ${productData.price} PEN

OUTPUT REQUIREMENTS:
You must return ONLY a JSON object. No markdown, no pre-amble. Ensure all HTML tags are standard and clean.
The JSON must follow this structure exactly:

{
  "name_es": "Polished Elite Title in Spanish (Using the Global Formula)",
  "name_en": "Polished Elite Title in English (Using the Global Formula)",
  "slug_es": "seo-geo-optimized-slug-spanish",
  "slug_en": "seo-geo-optimized-slug-english",
  "short_description_es": "Sophisticated, high-conversion short description (2 sentences) ES",
  "short_description_en": "Sophisticated, high-conversion short description (2 sentences) EN",
  "description_es": "Elite Storytelling Description ES. Structure: 1. Introduction to the piece 2. Craftsmanship and Material (Focus on Peruvian Pima) 3. Styling Suggestions 4. Brand Legacy. Use <p>, <strong>, <ul>, <li> tags.",
  "description_en": "Elite Storytelling Description EN. Structure: 1. Introduction to the piece 2. Craftsmanship and Material (Focus on Peruvian Pima) 3. Styling Suggestions 4. Brand Legacy. Use <p>, <strong>, <ul>, <li> tags.",
  "features_es": ["Premium Feature 1 (e.g. Tacto de seda)", "Premium Feature 2", ...],
  "features_en": ["Premium Feature 1 (e.g. Silk-like touch)", "Premium Feature 2", ...],
  "specifications_es": { "Material": "...", "Fit": "...", "Gender": "...", ... },
  "specifications_en": { "Material": "...", "Fit": "...", "Gender": "...", ... },
  "tags": ["luxury", "minimalist", "pima-cotton", "peruvian", "matteosalvatore", ...],
  "keywords": ["quiet luxury peru", "best pima cotton polo", "matteosalvatore essentials", ...],
  "hashtags": ["#MatteoSalvatore", "#QuietLuxury", "#PimaCotton", "#EliteMenswear", ...],
  "seo_title_es": "Elite Meta Title ES (Optimized for #1 Ranking)",
  "seo_title_en": "Elite Meta Title EN (Optimized for #1 Ranking)",
  "seo_description_es": "Compelling Meta Description ES that triggers high CTR (max 160 chars)",
  "seo_description_en": "Compelling Meta Description EN that triggers high CTR (max 160 chars)",
  "image_prompts": {
    "catalog": "Ultra-high resolution photography prompt for a luxury studio catalog (clean, minimalist, high contrast).",
    "lifestyle": "Global luxury lifestyle prompt (e.g., modern architecture in Milan or Lima, soft natural lighting, aspirational).",
    "ad": "Cinematic social media advertisement prompt (high engagement, premium aesthetics)."
  },
  "alt_text_es": "SEO-rich descriptive Alt Text ES",
  "cross_sell_suggestions": ["Suggested Item 1", "Suggested Item 2"],
  "semantic_description": "Global Knowledge Graph Semantic Description: Contextualize this product within the 2026 fashion trends, material heritage, and market positioning to maximize AI Search (SGE) discoverability.",
  "social_caption_es": "Instagram/TikTok caption ES (Premium, engaging, includes emojis)",
  "social_caption_en": "Instagram/TikTok caption EN (Premium, engaging, includes emojis)"
}

TONE: World-class, confident, exclusive, whisper-quiet luxury. 
Key values: Heritage, Craftsmanship, Peruvian Pima Excellence, Minimalist Timelessness.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up JSON if AI includes markdown code blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(text);
  } catch (error) {
    logger.error('Error in generateProductContent:', error);
    throw new Error('Failed to generate content with AI: ' + error.message);
  }
};
