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
 * Generates product content using Gemini AI
 * @param {Object} productData - { name, color, material, category, collection, fit, gender, brand, price }
 * @returns {Promise<Object>} - Structured AI generated content
 */
exports.generateProductContent = async (productData) => {
  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are the Global Creative Director and Lead SEO Strategist for "Matteo Salvatore", a world-class luxury minimalist fashion house based in Peru, specializing in the world's finest Pima Cotton.
Your goal is to transform basic product data into elite, high-conversion, and SEO-dominant museum-grade product listings that will rank #1 globally in the "Quiet Luxury" and "Premium Essentials" categories.

INSTRUCTIONS FOR TITLE POLISHING (Elite Structure):
- Take the simple user-provided "Name" and transform it into a powerful, uniform SEO Title.
- Formula ES: [Product Type] [Style/Quality] [Color] [Gender] [Year] – [Material] | Matteo Salvatore
- Formula EN: [Style/Quality] [Color] [Product Type] [Gender] [Year] – [Material] | Matteo Salvatore
- ES Example: "Polo Básico Premium Negro Hombre 2026 – Algodón Peruano | Matteo Salvatore"
- EN Example: "Premium Basic Black Polo Men 2026 – Peruvian Cotton | Matteo Salvatore"
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
  "1_name_es": "Polished Elite Title ES (Formula: Brand + Type + Material + Fit + Color + Season/Year - Gender)",
  "1_name_en": "Polished Elite Title EN (Formula: Brand + Type + Material + Fit + Color + Season/Year - Gender)",
  "2_slug_es": "seo-geo-optimized-slug-spanish",
  "2_slug_en": "seo-geo-optimized-slug-english",
  "3_short_description_es": "Sophisticated short description (2 sentences) ES",
  "3_short_description_en": "Sophisticated short description (2 sentences) EN",
  "4_full_description_es": "Full HTML description ES (Introduction, Benefits, Styling, Positioning).",
  "4_full_description_en": "Full HTML description EN (Introduction, Benefits, Styling, Positioning).",
  "5_features_es": ["Feature 1", "Feature 2", ...],
  "5_features_en": ["Feature 1", "Feature 2", ...],
  "6_specifications_es": { "Material": "...", "Fit": "...", "Sleeve": "...", "Collar": "...", "Season": "...", "Gender": "Men", "Origin": "Peru" },
  "6_specifications_en": { "Material": "...", "Fit": "...", "Sleeve": "...", "Collar": "...", "Season": "...", "Gender": "Men", "Origin": "Peru" },
  "7_tags": ["polo-premium", "algodon-peruano", "minimalist", ...],
  "8_keywords": ["polo blanco hombre", "best pima cotton polo", ...],
  "9_hashtags": ["#MatteoSalvatore", "#QuietLuxury", ...],
  "10_seo_title_es": "Optimized Meta Title ES (max 60 chars)",
  "10_seo_title_en": "Optimized Meta Title EN (max 60 chars)",
  "11_seo_description_es": "Compelling Meta Description ES (max 160 chars)",
  "11_seo_description_en": "Compelling Meta Description EN (max 160 chars)",
  "12_image_prompts": {
    "catalog": "Ultra realistic lighting, studio background, sharp details.",
    "lifestyle": "Location in Miraflores or Barranco, natural light, aspirational aesthetic."
  },
  "13_alt_text_es": "SEO-rich Alt Text ES",
  "13_alt_text_en": "SEO-rich Alt Text EN",
  "14_cross_sell": ["Product name 1", "Product name 2"],
  "15_product_schema": "JSON-LD Object (Product, Brand, Price, Availability, Color, Material)",
  "16_ai_optimization": {
    "semantic_description": "Contextual meaning for AI search agents.",
    "graph_signals": "Knowledge graph data points."
  },
  "17_social_captions": {
    "instagram": "Post caption with emojis",
    "tiktok": "Engaging short caption"
  },
  "18_video_prompts": {
    "reel": "Cinematic sequence prompt (e.g. Walking in Barranco, golden hour).",
    "ad_video": "Product focus video script/prompt."
  },
  "19_ad_copy": {
    "meta": "Headline and Primary Text for Facebook/IG Ads.",
    "tiktok": "Hook and text for TikTok ads."
  },
  "20_collection_placement": ["Essential Collection", "Summer 2026", "Minimal Collection"]
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

/**
 * Generates blog content using Gemini AI
 * @param {Object} blogData - { topic, keywords, targetAudience, location }
 * @returns {Promise<Object>} - Structured AI generated blog post
 */
exports.generateBlogContent = async (blogData) => {
  try {
    const model = getGenAI().getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are the Executive Editor and Chief SEO Orchestrator for "Matteo Salvatore". 
Your mission: Create a world-class, museum-grade blog article that establishes Matteo Salvatore as the global authority in Pima Cotton luxury and "Quiet Luxury" aesthetic.

ARTICLE FOCUS:
- Topic: ${blogData.topic}
- Core Keywords: ${blogData.keywords}
- Target Audience: ${blogData.targetAudience || 'Luxury fashion enthusiasts, high-net-worth individuals'}
- Location focus (GEO): ${blogData.location || 'Global/Peruvian Excellence'}

STRUCTURE REQUIREMENTS (ES & EN):
- Elite Title: Magnetic, SEO-optimized, sophisticated.
- Excerpt: Compelling 2-sentence hook for lists.
- Full Article Content (HTML): 
    - Well-structured with <h2>, <h3> tags.
    - Expert storytelling around Peruvian craftsmanship and heritage.
    - Natural keyword integration (no stuffing).
    - Clear Calls to Action (CTA) pointing to Matteo Salvatore collections.
    - GEO-friendly mentions (e.g., Lima fashion scene, Barranco workshops, Global Luxury standards).

JSON OUTPUT FORMAT (Return ONLY this):
{
  "title_es": "...",
  "title_en": "...",
  "slug_es": "url-friendly-slug-with-dashes-es",
  "slug_en": "url-friendly-slug-with-dashes-en",
  "excerpt_es": "...",
  "excerpt_en": "...",
  "content_es": "HTML content...",
  "content_en": "HTML content...",
  "seo_title_es": "...",
  "seo_title_en": "...",
  "seo_description_es": "...",
  "seo_description_en": "...",
  "tags": ["...", "..."],
  "image_prompts": {
    "featured": "High-end fashion editorial photography prompt, minimalist, professional lighting.",
    "contextual_1": "Atmospheric detail shot prompt (e.g., fabric texture close-up).",
    "social": "Lifestyle shot prompt for Facebook/IG promotion."
  }
}

TONE: Sophisticated, intellectual, exclusive, authoritative yet inviting.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    logger.error('Error in generateBlogContent:', error);
    throw new Error('Failed to generate blog content: ' + error.message);
  }
};
