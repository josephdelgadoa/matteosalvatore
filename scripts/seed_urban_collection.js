
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Official Matrix Mappings from Matriz_Codigos_Barras.md (Consolidated March 2026)
const styleCodes = {
    'POLO PIMA BASICO': '00501000',
    'POLO OVERSIZE': '00502000',
    'POLO BOXI': '00503000',
    'POLO HENLEY MANGA CORTA': '00504000',
    'POLO HENLEY MANGA LARGA': '00505000',
    'CONJUNTO CANGURO': '00506000',
    'CONJUNTO RAGLAN': '00507000',
    'PANTALON CARGO FIT': '00508000',
    'PANTALON JOGGUER': '00509000',
    'PANTALON SKINNY': '00510000',
    'CONJUNTO TULUM': '00511000',
    'CAMISA TULUM': '00512000',
    'POLERA HOODIE CLASSIC': '00513000'
};

const colorCodes = {
    'Arena': { id: '01', hex: '#E1D9C1' },
    'Azul': { id: '02', hex: '#0000FF' },
    'Azul Marino': { id: '03', hex: '#000080' },
    'Azul Noche': { id: '04', hex: '#191970' },
    'Beige': { id: '05', hex: '#F5F5DC' },
    'Blanco': { id: '06', hex: '#FFFFFF' },
    'Camell': { id: '07', hex: '#C19A6B' },
    'Celeste Bebé': { id: '08', hex: '#89CFF0' },
    'Cemento': { id: '09', hex: '#A9A9A9' },
    'Crema': { id: '10', hex: '#FFFDD0' },
    'Hueso': { id: '11', hex: '#F5F5F5' },
    'Melange': { id: '12', hex: '#BEBEBE' },
    'Negro': { id: '13', hex: '#000000' },
    'Palo Rosa': { id: '14', hex: '#D891EF' },
    'Plomo': { id: '15', hex: '#7D7D7D' },
    'Plomo Plata': { id: '16', hex: '#C0C0C0' },
    'Plomo Rata': { id: '17', hex: '#4B4B4B' },
    'Rojo': { id: '18', hex: '#FF0000' },
    'Rosado Bebé': { id: '19', hex: '#F4C2C2' },
    'Sky': { id: '20', hex: '#87CEEB' },
    'Turquesa': { id: '21', hex: '#40E0D0' },
    'Verde': { id: '22', hex: '#008000' },
    'Verde Botella': { id: '23', hex: '#006A4E' },
    'Vino': { id: '24', hex: '#722F37' }
};

const sizeCodes = {
    'XS': '0', '28': '0',
    'S': '1', '30': '1',
    'M': '2', '32': '2',
    'L': '3', '34': '3',
    'XL': '4', '36': '4',
    'XXL': '5', '38': '5',
    '40': '6'
};

const products = [
    {
        name_es: 'PANTALON JOGGUER',
        name_en: 'Urban Fit Joggers',
        slug_es: 'urban-fit-joggers',
        slug_en: 'urban-fit-joggers',
        description_es: 'Nuestros Joggers Urban Fit son la base perfecta para cualquier outfit urbano. Diseñados con un corte impecable que estiliza la silueta sin perder comodidad, se adaptan a tu ritmo diario. Combínalos fácilmente con polos clásicos o texturizados.',
        description_en: 'Our Urban Fit Joggers are the perfect foundation for any urban outfit. Designed with an impeccable cut that stylizes the silhouette without losing comfort, they adapt to your daily rhythm. Easily combine them with classic or textured polos.',
        category: 'clothing',
        subcategory: 'pants',
        base_price: 189.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: '30', color: 'Negro', stock_quantity: 15 },
            { size: '32', color: 'Negro', stock_quantity: 20 },
            { size: '34', color: 'Negro', stock_quantity: 20 },
            { size: '36', color: 'Negro', stock_quantity: 10 },
            { size: '32', color: 'Melange', stock_quantity: 15 },
            { size: '34', color: 'Melange', stock_quantity: 15 },
            { size: '32', color: 'Azul Noche', stock_quantity: 15 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=2849&auto=format&fit=crop', alt_text_es: 'Joggers negros hombre', is_primary: true, display_order: 0 }
        ]
    },
    {
        name_es: 'POLO PIMA BASICO',
        name_en: 'Urban Polo',
        slug_es: 'urban-polo',
        slug_en: 'urban-polo',
        description_es: 'Los Polos Urbanos Matteo Salvatore están diseñados para complementar cualquier outfit con actitud y estilo. Con cortes modernos y materiales cómodos, son ideales para crear combinaciones versátiles junto a joggers o cargos.',
        description_en: 'Matteo Salvatore Urban Polos are designed to complement any outfit with attitude and style. With modern cuts and comfortable materials, they are ideal for creating versatile combinations alongside joggers or cargos.',
        category: 'clothing',
        subcategory: 'polos',
        base_price: 89.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'Blanco', stock_quantity: 25 },
            { size: 'M', color: 'Blanco', stock_quantity: 30 },
            { size: 'L', color: 'Blanco', stock_quantity: 30 },
            { size: 'M', color: 'Negro', stock_quantity: 30 },
            { size: 'L', color: 'Negro', stock_quantity: 30 },
            { size: 'M', color: 'Beige', stock_quantity: 20 },
            { size: 'M', color: 'Verde', stock_quantity: 20 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2960&auto=format&fit=crop', alt_text_es: 'Polo blanco urbano', is_primary: true, display_order: 0 }
        ]
    },
    {
        name_es: 'CONJUNTO RAGLAN',
        name_en: 'Rangla Set',
        slug_es: 'rangla-set',
        slug_en: 'rangla-set',
        description_es: 'El Conjunto Rangla redefine el streetwear con un diseño distintivo: mangas que se extienden hasta el cuello, creando una silueta moderna y original. Pensado para quienes buscan destacar sin perder comodidad.',
        description_en: 'The Rangla Set redefines streetwear with a distinctive design: sleeves that extend to the neck, creating a modern and original silhouette. Designed for those who seek to stand out without losing comfort.',
        category: 'clothing',
        subcategory: 'sets',
        base_price: 249.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: 'S', color: 'Azul Marino', stock_quantity: 10 },
            { size: 'M', color: 'Azul Marino', stock_quantity: 15 },
            { size: 'L', color: 'Azul Marino', stock_quantity: 15 },
            { size: 'M', color: 'Melange', stock_quantity: 15 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?q=80&w=2960&auto=format&fit=crop', alt_text_es: 'Conjunto urbano hombre', is_primary: true, display_order: 0 }
        ]
    },
    {
        name_es: 'CONJUNTO CANGURO',
        name_en: 'Kangaroo Set',
        slug_es: 'kangaroo-set',
        slug_en: 'kangaroo-set',
        description_es: 'El Conjunto Canguro Matteo Salvatore incorpora un corte moderno con manga estilo canguro desde el cuello, ofreciendo una estética fresca y contemporánea ideal para climas cálidos. Fabricado con material ligero y resistente.',
        description_en: 'The Matteo Salvatore Kangaroo Set incorporates a modern cut with kangaroo-style sleeves from the neck, offering a fresh and contemporary aesthetic ideal for warm climates. Made with lightweight and resistant material.',
        category: 'clothing',
        subcategory: 'sets',
        base_price: 259.00,
        is_featured: false,
        is_active: true,
        variants: [
            { size: 'S', color: 'Negro', stock_quantity: 10 },
            { size: 'M', color: 'Negro', stock_quantity: 15 },
            { size: 'L', color: 'Negro', stock_quantity: 15 },
            { size: 'M', color: 'Sky', stock_quantity: 12 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2940&auto=format&fit=crop', alt_text_es: 'Conjunto deportivo hombre negro', is_primary: true, display_order: 0 }
        ]
    },
    {
        name_es: 'PANTALON CARGO FIT',
        name_en: 'Cargo Fit Pants',
        slug_es: 'cargo-fit-pants',
        slug_en: 'cargo-fit-pants',
        description_es: 'El Cargo Fit Matteo Salvatore es la pieza central para un outfit con carácter. Su estructura firme y diseño urbano lo convierten en el pantalón ideal para quienes buscan presencia, resistencia y estilo.',
        description_en: 'The Matteo Salvatore Cargo Fit is the centerpiece for an outfit with character. Its firm structure and urban design make it the ideal pant for those seeking presence, resistance, and style.',
        category: 'clothing',
        subcategory: 'pants',
        base_price: 209.00,
        is_featured: true,
        is_active: true,
        variants: [
            { size: '30', color: 'Negro', stock_quantity: 15 },
            { size: '32', color: 'Negro', stock_quantity: 20 },
            { size: '34', color: 'Negro', stock_quantity: 20 },
            { size: '32', color: 'Verde', stock_quantity: 20 },
            { size: '32', color: 'Beige', stock_quantity: 15 }
        ],
        images: [
            { image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=2797&auto=format&fit=crop', alt_text_es: 'Pantalón cargo hombre', is_primary: true, display_order: 0 }
        ]
    }
];

async function seed() {
    console.log('Starting matrix-based seed (Consolidated Matrix)...');

    // Optional: Clean up existing data for a fresh start
    console.log('Cleaning up existing products and variants...');
    await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('product_variants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const product of products) {
        const styleCode = styleCodes[product.name_es];
        if (!styleCode) {
            console.error(`Missing style code for ${product.name_es}`);
            continue;
        }

        console.log(`Processing ${product.name_en} (Style: ${styleCode})...`);

        // 1. Insert/Update Product
        const { data: productData, error: productError } = await supabase
            .from('products')
            .upsert({
                sku: styleCode,
                name_es: product.name_es,
                name_en: product.name_en,
                slug_es: product.slug_es,
                slug_en: product.slug_en,
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

        // 2. Insert Variants
        for (const variant of product.variants) {
            const colorData = colorCodes[variant.color];
            const sizeId = sizeCodes[variant.size];

            if (!colorData || sizeId === undefined) {
                console.error(`Missing color/size mapping for: ${variant.color} ${variant.size}`);
                continue;
            }

            const barcode = `${styleCode}${colorData.id}${sizeId}`;
            const sku_variant = barcode; // Unify SKU with Barcode as per user request

            const { error: variantError } = await supabase
                .from('product_variants')
                .upsert({
                    product_id: productId,
                    size: variant.size,
                    color: variant.color,
                    color_hex: colorData.hex,
                    sku_variant: sku_variant,
                    barcode: barcode,
                    stock_quantity: variant.stock_quantity,
                    additional_price: 0
                }, { onConflict: 'barcode' }); 

            if (variantError) {
                console.error(`Error inserting variant ${barcode}:`, variantError);
            }
        }

        // 3. Insert Images
        for (const image of product.images) {
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
