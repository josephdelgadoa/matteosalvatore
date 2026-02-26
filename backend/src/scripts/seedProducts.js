const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing SUPABASE_URL or SUPABASE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    {
        sku: 'MS-SHIRT-LINEN-001',
        name_es: 'Camisa de Lino Premium',
        name_en: 'Premium Linen Shirt',
        slug: 'premium-linen-shirt-white',
        description_es: 'Confeccionada con 100% lino europeo, esta camisa es la definición de frescura y elegancia relajada. Su corte moderno y transpirabilidad la hacen ideal para el verano o climas cálidos. Botones de madreperla genuina.',
        description_en: 'Crafted from 100% European linen, this shirt is the definition of freshness and relaxed elegance. Its modern cut and breathability make it ideal for summer or warm climates. Genuine mother-of-pearl buttons.',
        category: 'clothing',
        subcategory: 'shirts',
        base_price: 289.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'White', sku_variant: 'MS-SHIRT-LIN-WHT-S', stock_quantity: 12 },
            { size: 'M', color: 'White', sku_variant: 'MS-SHIRT-LIN-WHT-M', stock_quantity: 18 },
            { size: 'L', color: 'White', sku_variant: 'MS-SHIRT-LIN-WHT-L', stock_quantity: 20 },
            { size: 'XL', color: 'White', sku_variant: 'MS-SHIRT-LIN-WHT-XL', stock_quantity: 10 },
            { size: 'M', color: 'Sand', sku_variant: 'MS-SHIRT-LIN-SND-M', stock_quantity: 15 },
            { size: 'L', color: 'Sand', sku_variant: 'MS-SHIRT-LIN-SND-L', stock_quantity: 15 },
            { size: 'M', color: 'Sky Blue', sku_variant: 'MS-SHIRT-LIN-SKY-M', stock_quantity: 12 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1598032446167-d1d73a87163c?q=80&w=2787&auto=format&fit=crop', alt_text_es: 'Camisa de lino blanca', is_primary: true },
            { image_url: 'https://images.unsplash.com/photo-1589465885857-44edb59ef526?q=80&w=2787&auto=format&fit=crop', alt_text_es: 'Detalle camisa lino', is_primary: false }
        ]
    },
    {
        sku: 'MS-POLO-PIMA-001',
        name_es: 'Polo Pima Deluxe',
        name_en: 'Deluxe Pima Polo',
        slug: 'deluxe-pima-polo-navy',
        description_es: 'El básico perfecto elevado a la perfección. Hecho con el algodón Pima peruano más fino del mundo, conocido por su suavidad excepcional y durabilidad. Corte regular fit que favorece sin apretar.',
        description_en: 'The perfect basic elevated to perfection. Made with the world\'s finest Peruvian Pima cotton, known for its exceptional softness and durability. Regular fit cut that flatters without tightening.',
        category: 'clothing',
        subcategory: 'polos',
        base_price: 129.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'Navy', sku_variant: 'MS-POLO-PIMA-NVY-S', stock_quantity: 20 },
            { size: 'M', color: 'Navy', sku_variant: 'MS-POLO-PIMA-NVY-M', stock_quantity: 30 },
            { size: 'L', color: 'Navy', sku_variant: 'MS-POLO-PIMA-NVY-L', stock_quantity: 25 },
            { size: 'M', color: 'Black', sku_variant: 'MS-POLO-PIMA-BLK-M', stock_quantity: 25 },
            { size: 'L', color: 'Black', sku_variant: 'MS-POLO-PIMA-BLK-L', stock_quantity: 20 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=2942&auto=format&fit=crop', alt_text_es: 'Polo azul marino hombre', is_primary: true },
            { image_url: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=3072&auto=format&fit=crop', alt_text_es: 'Polo negro textura', is_primary: false }
        ]
    },
    {
        sku: 'MS-SWTR-MERINO-001',
        name_es: 'Chompa Merino Essential',
        name_en: 'Essential Merino Sweater',
        slug: 'merino-sweater-grey',
        description_es: 'Tejida con lana merino extrafina, esta chompa ligera regula la temperatura corporal, manteniéndote cálido en invierno y fresco en transición. Su diseño minimalista la hace perfecta para usar sobre camisa o polo.',
        description_en: 'Knitted with extra-fine merino wool, this lightweight sweater regulates body temperature, keeping you warm in winter and cool in transition. Its minimalist design makes it perfect for layering over a shirt or polo.',
        category: 'clothing',
        subcategory: 'sweaters',
        base_price: 349.00,
        is_featured: false,
        is_active: true,
        variants: [
            { size: 'M', color: 'Grey', sku_variant: 'MS-SWTR-MER-GRY-M', stock_quantity: 10 },
            { size: 'L', color: 'Grey', sku_variant: 'MS-SWTR-MER-GRY-L', stock_quantity: 12 },
            { size: 'M', color: 'Charcoal', sku_variant: 'MS-SWTR-MER-CHR-M', stock_quantity: 8 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2872&auto=format&fit=crop', alt_text_es: 'Chompa gris hombre', is_primary: true }
        ]
    },
    {
        sku: 'MS-JKT-BOMBER-001',
        name_es: 'Casaca Bomber Técnica',
        name_en: 'Technical Bomber Jacket',
        slug: 'tech-bomber-jacket-olive',
        description_es: 'La clásica silueta bomber reinterpretada con tejido técnico repelente al agua. Interior forrado en viscosa suave. Detalles metálicos en acabado gunmetal y puños acanalados de alta resistencia.',
        description_en: 'The classic bomber silhouette reinterpreted with water-repellent technical fabric. Interior lined in soft viscose. Gunmetal finish metal details and high-resistance ribbed cuffs.',
        category: 'clothing',
        subcategory: 'jackets',
        base_price: 459.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'M', color: 'Olive', sku_variant: 'MS-JKT-BOMB-OLV-M', stock_quantity: 8 },
            { size: 'L', color: 'Olive', sku_variant: 'MS-JKT-BOMB-OLV-L', stock_quantity: 10 },
            { size: 'M', color: 'Black', sku_variant: 'MS-JKT-BOMB-BLK-M', stock_quantity: 12 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2836&auto=format&fit=crop', alt_text_es: 'Casaca bomber verde oliva', is_primary: true }
        ]
    },
    {
        sku: 'MS-SHOE-LOAFER-001',
        name_es: 'Mocasines Penny Cuero',
        name_en: 'Penny Leather Loafers',
        slug: 'penny-leather-loafers-brown',
        description_es: 'Hechos a mano por artesanos expertos. Cuero de grano completo que envejece maravillosamente. Suela de cuero con inserto de goma para mayor tracción. El zapato versátil definitivo.',
        description_en: 'Handmade by expert artisans. Full-grain leather that ages beautifully. Leather sole with rubber insert for added traction. The ultimate versatile shoe.',
        category: 'footwear',
        subcategory: 'shoes',
        base_price: 589.00,
        is_featured: false,
        is_active: true,
        variants: [
            { size: '40', color: 'Dark Brown', sku_variant: 'MS-LOAFER-BRN-40', stock_quantity: 5 },
            { size: '41', color: 'Dark Brown', sku_variant: 'MS-LOAFER-BRN-41', stock_quantity: 6 },
            { size: '42', color: 'Dark Brown', sku_variant: 'MS-LOAFER-BRN-42', stock_quantity: 8 },
            { size: '43', color: 'Dark Brown', sku_variant: 'MS-LOAFER-BRN-43', stock_quantity: 5 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=2852&auto=format&fit=crop', alt_text_es: 'Mocasines cuero marrón', is_primary: true }
        ]
    }
];

async function seed() {
    console.log('🌱 Starting seed...');

    for (const product of products) {
        // 1. Check if product exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('sku', product.sku)
            .single();

        let productId;

        if (existing) {
            console.log(`Product ${product.sku} already exists. Updating...`);
            const { data, error } = await supabase
                .from('products')
                .update({
                    name_es: product.name_es,
                    name_en: product.name_en,
                    description_es: product.description_es,
                    description_en: product.description_en,
                    base_price: product.base_price,
                    is_featured: product.is_featured,
                    is_active: product.is_active
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                console.error(`Error updating product ${product.sku}:`, error);
                continue;
            }
            productId = existing.id;
        } else {
            console.log(`Creating product ${product.sku}...`);
            const { data, error } = await supabase
                .from('products')
                .insert({
                    sku: product.sku,
                    name_es: product.name_es,
                    name_en: product.name_en,
                    slug_es: product.slug,
                    slug_en: product.slug,
                    description_es: product.description_es,
                    description_en: product.description_en,
                    category: product.category,
                    subcategory: product.subcategory,
                    base_price: product.base_price,
                    is_featured: product.is_featured,
                    is_active: product.is_active
                })
                .select()
                .single();

            if (error) {
                console.error(`Error creating product ${product.sku}:`, error);
                continue;
            }
            productId = data.id;
        }

        // 2. Variants
        if (product.variants && product.variants.length > 0) {
            console.log(`  Processing ${product.variants.length} variants...`);
            for (const variant of product.variants) {
                const { error: varError } = await supabase
                    .from('product_variants')
                    .upsert({
                        product_id: productId,
                        sku_variant: variant.sku_variant,
                        size: variant.size,
                        color: variant.color,
                        stock_quantity: variant.stock_quantity,
                        // handle potential color_hex mapping if needed, omitting for now
                    }, { onConflict: 'sku_variant' });

                if (varError) console.error(`  Error upserting variant ${variant.sku_variant}:`, varError);
            }
        }

        // 3. Images
        if (product.images && product.images.length > 0) {
            console.log(`  Processing ${product.images.length} images...`);
            // First clear existing images for this product to avoid duplicates easily? 
            // Or just insert avoiding dupes?
            // Simplest for seed: Delete all and re-insert (if safe), or just insert.
            // Let's just insert and ignore if unique constraint fails (there isn't one on URL usually).
            // Actually, best to check if exists or just append.

            // For cleanliness in this seed script, let's just insert.
            let order = 0;
            for (const img of product.images) {
                // Check duplicate
                const { data: existingImg } = await supabase
                    .from('product_images')
                    .select('id')
                    .eq('product_id', productId)
                    .eq('image_url', img.image_url)
                    .single();

                if (!existingImg) {
                    const { error: imgError } = await supabase
                        .from('product_images')
                        .insert({
                            product_id: productId,
                            image_url: img.image_url,
                            alt_text_es: img.alt_text_es,
                            is_primary: img.is_primary,
                            display_order: order++
                        });
                    if (imgError) console.error(`  Error inserting image:`, imgError);
                }
            }
        }
    }

    console.log('✅ Seed completed successfully.');
}

seed().catch(console.error);
