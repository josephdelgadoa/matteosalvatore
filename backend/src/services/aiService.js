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
    const model = getGenAI().getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
You are the Global Creative Director and Lead SEO Strategist for "Matteo Salvatore", a world-class luxury minimalist fashion house based in Peru, specializing in the world's finest Pima Cotton.
Your goal is to transform basic product data into elite, high-conversion, and SEO-dominant museum-grade product listings that will rank #1 globally in the "Quiet Luxury" and "Premium Essentials" categories.

---
INPUT PRODUCT DATA:
- Name: ${productData.name}
- Color: ${productData.color}
- Material: ${productData.material}
- Category: ${productData.category}
- Collection: ${productData.collection || 'N/A'}
- Fit: ${productData.fit || 'N/A'}
- Gender: ${productData.gender || 'N/A'}
- Base Price: ${productData.price || 'N/A'}
---

STRICT TECHNICAL REQUIREMENTS (MANDATORY INCLUSION):
- For all "Pima" items (Polos, T-shirts, etc.), you MUST mention these technical details in both ES and EN descriptions:
    1. Gramaje/Weight: 180g - 190g (The "Ideal Weight").
    2. Cuello/Collar: Rib 1x1 con elastano (To prevent deformation).
    3. Acabado/Finish: Tapete o Cinta Interior de cuello (Brand reinforced neck tape).
    4. Material: 100% Algodón Pima Peruano.

OFFICIAL STYLE CODES (INTERNAL KNOWLEDGE):
- If the product belongs to any of these families, you MUST return the corresponding 8-digit Style Code in the "style_code" field.
- Check the Name, Category, and Fit to determine the style:
    - Polo Pima Básico / Polo Clásico Slim Fit / Polo Esencial: 00501000
    - Polo Pima Oversize / Polo Boxy Oversize: 00502000
    - Polo Boxi: 00503000
    - Polo Henley Manga Corta / Henley MC: 00504000
    - Polo Henley Manga Largo / Henley ML: 00505000
    - Conjunto Canguro / Hoodie Set: 00506000
    - Conjunto Raglan / Urban Set: 00507000
    - Pantalón Cargo Fit / Cargo Pants: 00508000
    - Pantalón Jogguer / Joggers: 00509000
    - Pantalón Skinny: 00510000
    - Conjunto Tulum: 00511000
    - Camisa Tulum: 00512000
    - Polera Hoodie Classic / Capucha: 00513000

INSTRUCTIONS FOR TITLE POLISHING:
- Create magnetic, sophisticated titles.
- EXTREMELY IMPORTANT: You MUST explicitly include the EXACT Color in the generated title. DO NOT hallucinate, change, or add descriptive words to the color (e.g. if the user color is "Verde", use EXACTLY "Verde", DO NOT output "Verde Bosque"). For English, translate it literally (e.g., "Green"). DO NOT output a title without the exact color.
- If the original Name has words like "copia", "copy", "draft", REMOVE THEM.
- Formula ES: [Product Type] [Style/Quality] [Clean Name] - [Translated Color] | Matteo Salvatore
- Formula EN: [Style/Quality] [Clean Name] - [Translated Color] [Product Type] | Matteo Salvatore

OUTPUT REQUIREMENTS:
Return exactly one JSON object. Do not include markdown or anything outside the JSON.
CRITICAL: ALL KEYS SPECIFIED BELOW ARE MANDATORY. DO NOT OMIT, RENAME, OR SKIP ANY KEY.
DO NOT LEAVE ANY FIELD EMPTY. You MUST provide real, full, and comprehensive generated content for EVERY single key. "N/A", null, or empty strings are strictly forbidden. The admin form relies on every single field being populated.
Replace the placeholder values with your generated content according to the type shown. Do NOT use "..." - you must provide complete generated data for every field.
CRITICAL JSON RULE: You must escape all newlines (\\n) and quotes (\\") inside strings. DO NOT use raw newlines inside the JSON strings.


{
  "style_code": "8-digit numeric code or null",
  "1_name_es": "Polished Elite Title ES",
  "1_name_en": "Polished Elite Title EN",
  "1_short_name_es": "A clean, short 2-3 word name for list views ES (e.g. 'Polo Pima Básico')",
  "1_short_name_en": "A clean, short 2-3 word name for list views EN (e.g. 'Pima Basic Polo')",
  "2_slug_es": "seo-optimized-slug-es",
  "2_slug_en": "seo-optimized-slug-en",
  "3_short_description_es": "Sophisticated short description (2 sentences) ES",
  "3_short_description_en": "Sophisticated short description (2 sentences) EN",
  "4_full_description_es": "Full HTML description ES. Sections: <p>Introducción</p>, <h3>Beneficios</h3>, <h3>Características Técnicas</h3> (Include 180g, Rib 1x1, Tapete), <h3>Estilismo</h3>.",
  "4_full_description_en": "Full HTML description EN. Sections: <p>Introduction</p>, <h3>Benefits</h3>, <h3>Technical Features</h3> (Include 180g, Rib 1x1, Neck Tape), <h3>Styling</h3>.",
  "5_features_es": ["100% Algodón Pima", "Gramaje 180g-190g", "Cuello Rib 1x1", "Alta durabilidad"],
  "5_features_en": ["100% Pima Cotton", "Weight 180g-190g", "Rib 1x1 Collar", "High durability"],
  "6_specifications_es": { "Material": "100% Algodón Pima Peruano", "Peso": "180g - 190g", "Cuello": "Rib 1x1 con Elastano", "Fit": "Fit detail", "Gender": "Gender detail", "Origin": "Perú" },
  "6_specifications_en": { "Material": "100% Peruvian Pima Cotton", "Weight": "180g - 190g", "Collar": "Rib 1x1 with Elastane", "Fit": "Fit detail", "Gender": "Gender detail", "Origin": "Peru" },
  "7_tags": ["polo-premium", "algodon-peruano", "luxury", "essential"],
  "8_keywords": ["best pima cotton polo", "luxury t-shirt", "premium essentials", "quiet luxury"],
  "9_hashtags": ["#MatteoSalvatore", "#PimaCotton", "#QuietLuxury", "#Menswear"],
  "10_seo_title_es": "Meta Title ES (MAX 60 chars)",
  "10_seo_title_en": "Meta Title EN (MAX 60 chars)",
  "11_seo_description_es": "Meta Description ES (MAX 160 chars)",
  "11_seo_description_en": "Meta Description EN (MAX 160 chars)",
  "12_image_prompts": { "catalog": "catalog prompt description", "lifestyle": "lifestyle prompt description" },
  "13_alt_text_es": "Alt Text ES",
  "13_alt_text_en": "Alt Text EN",
  "14_cross_sell": ["Product Name 1", "Product Name 2"],
  "15_product_schema": "JSON string for LD+JSON",
  "16_ai_optimization": { "semantic_description": "Semantic description text", "graph_signals": "Graph signals text" },
  "17_social_captions": { "instagram": "Instagram caption", "tiktok": "TikTok caption" },
  "18_video_prompts": { "reel": "Reel prompt", "ad_video": "Ad video prompt" },
  "19_ad_copy": { "meta": { "headline_es": "Headline ES", "primary_text_es": "Text ES", "headline_en": "Headline EN", "primary_text_en": "Text EN" }, "tiktok": "TikTok ad copy" },
  "20_collection_placement": ["Placement 1", "Placement 2"]
}

TONE: Exclusive, whisper-quiet luxury, Peruvian Pima Excellence.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    logger.info(`[AIService] Raw text from Gemini length: ${text.length}`);

    // Clean up JSON if AI includes markdown code blocks or extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI failed to return a valid JSON object');
    }
    text = jsonMatch[0];

    const parsed = JSON.parse(text);

    // Programmatic Enforcement of SEO Limits
    if (parsed["10_seo_title_es"]) parsed["10_seo_title_es"] = parsed["10_seo_title_es"].substring(0, 60);
    if (parsed["10_seo_title_en"]) parsed["10_seo_title_en"] = parsed["10_seo_title_en"].substring(0, 60);
    if (parsed["11_seo_description_es"]) parsed["11_seo_description_es"] = parsed["11_seo_description_es"].substring(0, 160);
    if (parsed["11_seo_description_en"]) parsed["11_seo_description_en"] = parsed["11_seo_description_en"].substring(0, 160);

    return parsed;
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
    const model = getGenAI().getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

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

STRICT SEO CONSTRAINTS:
- SEO Title (seo_title_es/en): MAXIMUM 60 characters.
- SEO Description (seo_description_es/en): MAXIMUM 160 characters.

JSON OUTPUT FORMAT (Return ONLY this JSON object, no markdown):
CRITICAL: ALL KEYS SPECIFIED BELOW ARE MANDATORY. DO NOT OMIT, RENAME, OR SKIP ANY KEY.
{
  "title_es": "Title text ES",
  "title_en": "Title text EN",
  "slug_es": "url-friendly-slug-with-dashes-es",
  "slug_en": "url-friendly-slug-with-dashes-en",
  "excerpt_es": "Excerpt text ES",
  "excerpt_en": "Excerpt text EN",
  "content_es": "HTML content ES",
  "content_en": "HTML content EN",
  "seo_title_es": "SEO Title ES",
  "seo_title_en": "SEO Title EN",
  "seo_description_es": "SEO Description ES",
  "seo_description_en": "SEO Description EN",
  "tags": ["tag1", "tag2"],
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
    const parsed = JSON.parse(text);

    // Programmatic Enforcement of SEO Limits
    if (parsed.seo_title_es) parsed.seo_title_es = parsed.seo_title_es.substring(0, 60);
    if (parsed.seo_title_en) parsed.seo_title_en = parsed.seo_title_en.substring(0, 60);
    if (parsed.seo_description_es) parsed.seo_description_es = parsed.seo_description_es.substring(0, 160);
    if (parsed.seo_description_en) parsed.seo_description_en = parsed.seo_description_en.substring(0, 160);

    return parsed;
  } catch (error) {
    logger.error('Error in generateBlogContent:', error);
    throw new Error('Failed to generate blog content: ' + error.message);
  }
};
