
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    {
        sku: 'MS-PANT-JOGGER-001',
        name_es: 'Joggers Urban Fit',
        name_en: 'Urban Fit Joggers',
        slug: 'urban-fit-joggers',
        description_es: 'Nuestros Joggers Urban Fit son la base perfecta para cualquier outfit urbano. Diseñados con un corte impecable que estiliza la silueta sin perder comodidad, se adaptan a tu ritmo diario. Combínalos fácilmente con polos clásicos o texturizados.',
        description_en: 'Our Urban Fit Joggers are the perfect foundation for any urban outfit. Designed with an impeccable cut that stylizes the silhouette without losing comfort, they adapt to your daily rhythm. Easily combine them with classic or textured polos.',
        category: 'clothing',
        subcategory: 'pants',
        base_price: 189.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'Black', sku_variant: 'MS-JOG-BLK-S', stock_quantity: 15 },
            { size: 'M', color: 'Black', sku_variant: 'MS-JOG-BLK-M', stock_quantity: 20 },
            { size: 'L', color: 'Black', sku_variant: 'MS-JOG-BLK-L', stock_quantity: 20 },
            { size: 'XL', color: 'Black', sku_variant: 'MS-JOG-BLK-XL', stock_quantity: 10 },
            { size: 'M', color: 'Grey Melange', sku_variant: 'MS-JOG-GRY-M', stock_quantity: 15 },
            { size: 'L', color: 'Grey Melange', sku_variant: 'MS-JOG-GRY-L', stock_quantity: 15 },
            { size: 'M', color: 'Midnight Blue', sku_variant: 'MS-JOG-NVY-M', stock_quantity: 15 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2849&auto=format&fit=crop', alt_text_es: 'Joggers negros hombre', is_primary: true, display_order: 0 }
        ]
    },
    {
        sku: 'MS-POLO-URBAN-001',
        name_es: 'Polo Urbano',
        name_en: 'Urban Polo',
        slug: 'urban-polo',
        description_es: 'Los Polos Urbanos Matteo Salvatore están diseñados para complementar cualquier outfit con actitud y estilo. Con cortes modernos y materiales cómodos, son ideales para crear combinaciones versátiles junto a joggers o cargos.',
        description_en: 'Matteo Salvatore Urban Polos are designed to complement any outfit with attitude and style. With modern cuts and comfortable materials, they are ideal for creating versatile combinations alongside joggers or cargos.',
        category: 'clothing',
        subcategory: 'polos',
        base_price: 89.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'White', sku_variant: 'MS-POL-WHT-S', stock_quantity: 25 },
            { size: 'M', color: 'White', sku_variant: 'MS-POL-WHT-M', stock_quantity: 30 },
            { size: 'L', color: 'White', sku_variant: 'MS-POL-WHT-L', stock_quantity: 30 },
            { size: 'M', color: 'Black', sku_variant: 'MS-POL-BLK-M', stock_quantity: 30 },
            { size: 'L', color: 'Black', sku_variant: 'MS-POL-BLK-L', stock_quantity: 30 },
            { size: 'M', color: 'Beige', sku_variant: 'MS-POL-BGE-M', stock_quantity: 20 },
            { size: 'M', color: 'Olive Green', sku_variant: 'MS-POL-OLV-M', stock_quantity: 20 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2960&auto=format&fit=crop', alt_text_es: 'Polo blanco urbano', is_primary: true, display_order: 0 }
        ]
    },
    {
        sku: 'MS-SET-RANGLA-001',
        name_es: 'Conjunto Rangla',
        name_en: 'Rangla Set',
        slug: 'rangla-set',
        description_es: 'El Conjunto Rangla redefine el streetwear con un diseño distintivo: mangas que se extienden hasta el cuello, creando una silueta moderna y original. Pensado para quienes buscan destacar sin perder comodidad.',
        description_en: 'The Rangla Set redefines streetwear with a distinctive design: sleeves that extend to the neck, creating a modern and original silhouette. Designed for those who seek to stand out without losing comfort.',
        category: 'clothing',
        subcategory: 'sets',
        base_price: 249.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'Midnight Blue', sku_variant: 'MS-RNG-NVY-S', stock_quantity: 10 },
            { size: 'M', color: 'Midnight Blue', sku_variant: 'MS-RNG-NVY-M', stock_quantity: 15 },
            { size: 'L', color: 'Midnight Blue', sku_variant: 'MS-RNG-NVY-L', stock_quantity: 15 },
            { size: 'M', color: 'Grey Melange', sku_variant: 'MS-RNG-GRY-M', stock_quantity: 15 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?q=80&w=2960&auto=format&fit=crop', alt_text_es: 'Conjunto urbano hombre', is_primary: true, display_order: 0 }
        ]
    },
    {
        sku: 'MS-SET-KANGAROO-001',
        name_es: 'Conjunto Canguro',
        name_en: 'Kangaroo Set',
        slug: 'kangaroo-set',
        description_es: 'El Conjunto Canguro Matteo Salvatore incorpora un corte moderno con manga estilo canguro desde el cuello, ofreciendo una estética fresca y contemporánea ideal para climas cálidos. Fabricado con material ligero y resistente.',
        description_en: 'The Matteo Salvatore Kangaroo Set incorporates a modern cut with kangaroo-style sleeves from the neck, offering a fresh and contemporary aesthetic ideal for warm climates. Made with lightweight and resistant material.',
        category: 'clothing',
        subcategory: 'sets',
        base_price: 259.00,
        is_featured: false,
        is_active: true,
        variants: [
            { size: 'S', color: 'Black', sku_variant: 'MS-KNG-BLK-S', stock_quantity: 10 },
            { size: 'M', color: 'Black', sku_variant: 'MS-KNG-BLK-M', stock_quantity: 15 },
            { size: 'L', color: 'Black', sku_variant: 'MS-KNG-BLK-L', stock_quantity: 15 },
            { size: 'M', color: 'Light Grey', sku_variant: 'MS-KNG-GRY-M', stock_quantity: 12 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2940&auto=format&fit=crop', alt_text_es: 'Conjunto deportivo hombre negro', is_primary: true, display_order: 0 }
        ]
    },
    {
        sku: 'MS-PANT-CARGO-001',
        name_es: 'Pantalón Cargo Fit',
        name_en: 'Cargo Fit Pants',
        slug: 'cargo-fit-pants',
        description_es: 'El Cargo Fit Matteo Salvatore es la pieza central para un outfit con carácter. Su estructura firme y diseño urbano lo convierten en el pantalón ideal para quienes buscan presencia, resistencia y estilo.',
        description_en: 'The Matteo Salvatore Cargo Fit is the centerpiece for an outfit with character. Its firm structure and urban design make it the ideal pant for those seeking presence, resistance, and style.',
        category: 'clothing',
        subcategory: 'pants',
        base_price: 209.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'Black', sku_variant: 'MS-CRG-BLK-S', stock_quantity: 15 },
            { size: 'M', color: 'Black', sku_variant: 'MS-CRG-BLK-M', stock_quantity: 20 },
            { size: 'L', color: 'Black', sku_variant: 'MS-CRG-BLK-L', stock_quantity: 20 },
            { size: 'M', color: 'Military Green', sku_variant: 'MS-CRG-GRN-M', stock_quantity: 20 },
            { size: 'M', color: 'Beige', sku_variant: 'MS-CRG-BGE-M', stock_quantity: 15 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2797&auto=format&fit=crop', alt_text_es: 'Pantalón cargo hombre', is_primary: true, display_order: 0 }
        ]
    }
];

async function seed() {
    console.log('Starting seed...');

    for (const product of products) {
        console.log(`Processing ${product.name_en}...`);

        // 1. Insert Product
        const { data: productData, error: productError } = await supabase
            .from('products')
            .upsert({
                sku: product.sku,
                name_es: product.name_es,
                name_en: product.name_en,
                slug: product.slug,
                description_es: product.description_es,
                description_en: product.description_en,
                category: product.category,
                subcategory: product.subcategory,
                base_price: product.base_price,
                is_featured: product.is_featured,
                is_active: product.is_active
            }, { onConflict: 'sku' })
            .select()
            .single();

        if (productError) {
            console.error(`Error inserting product ${product.name_en}:`, productError);
            continue;
        }

        const productId = productData.id;
        console.log(`Product inserted/updated: ${productId}`);

        // 2. Insert Variants
        for (const variant of product.variants) {
            const { error: variantError } = await supabase
                .from('product_variants')
                .upsert({
                    product_id: productId,
                    size: variant.size,
                    color: variant.color,
                    sku_variant: variant.sku_variant,
                    stock_quantity: variant.stock_quantity,
                    additional_price: 0
                }, { onConflict: 'sku_variant' });

            if (variantError) {
                console.error(`Error inserting variant ${variant.sku_variant}:`, variantError);
            }
        }

        // 3. Insert Images
        for (const image of product.images) {
            // Check if image exists
            const { data: existingImages } = await supabase
                .from('product_images')
                .select('id')
                .eq('product_id', productId)
                .eq('image_url', image.image_url);

            if (existingImages && existingImages.length === 0) {
                const { error: imageError } = await supabase
                    .from('product_images')
                    .insert({
                        product_id: productId,
                        image_url: image.image_url,
                        alt_text_es: image.alt_text_es,
                        is_primary: image.is_primary,
                        display_order: image.display_order
                    });

                if (imageError) {
                    console.error(`Error inserting image for ${product.name_en}:`, imageError);
                }
            }
        }
    }

    console.log('Seed completed successfully.');
}

seed();
