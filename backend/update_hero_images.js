const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const supabase = require('./src/config/database');

const newSlides = [
    {
        id: 1,
        image: '/images/hero-jogger.jpeg',
        title: 'Comodidad en Movimiento',
        subtitle: 'NUEVA COLECCIÓN JOGGERS',
        description: 'Diseñados para el hombre moderno que valora el estilo sin sacrificar la comodidad.',
        cta: 'COMPRAR AHORA',
        link: '/products?category=pants'
    },
    {
        id: 2,
        image: '/images/hero-hoddie.jpeg',
        title: 'Esenciales de Invierno',
        subtitle: 'HOODIES PREMIUM',
        description: 'La combinación perfecta de calidez y estilo minimalista para esta temporada.',
        cta: 'VER HOODIES',
        link: '/products?category=hoodies'
    },
    {
        id: 3,
        image: '/images/hero-cargo-pants.jpeg',
        title: 'Funcionalidad y Estilo',
        subtitle: 'PANTALONES CARGO',
        description: 'Versatilidad urbana con un corte impecable y materiales de alta calidad.',
        cta: 'EXPLORAR',
        link: '/products?category=pants'
    }
];

async function updateHeroImages() {
    console.log('Updating Hero Images...');

    // Update Spanish
    const { error: errorEs } = await supabase
        .from('content_blocks')
        .upsert({
            key: 'hero_slides_es',
            value: newSlides,
            updated_at: new Date()
        });

    if (errorEs) {
        console.error('Error updating ES slides:', errorEs);
    } else {
        console.log('✅ Successfully updated hero_slides_es');
    }

    // Update English (using same images, maybe translate text if needed but keeping same for now as requested)
    const newSlidesEn = newSlides.map(s => ({
        ...s,
        title: s.title === 'Comodidad en Movimiento' ? 'Comfort in Motion' :
            s.title === 'Esenciales de Invierno' ? 'Winter Essentials' : 'Functionality & Style',
        subtitle: s.subtitle === 'NUEVA COLECCIÓN JOGGERS' ? 'NEW JOGGER COLLECTION' :
            s.subtitle === 'HOODIES PREMIUM' ? 'PREMIUM HOODIES' : 'CARGO PANTS',
        description: s.description === 'Diseñados para el hombre moderno que valora el estilo sin sacrificar la comodidad.' ? 'Designed for the modern man who values style without sacrificing comfort.' :
            s.description === 'La combinación perfecta de calidez y estilo minimalista para esta temporada.' ? 'The perfect blend of warmth and minimalist style for this season.' : 'Urban versatility with an impeccable cut and high-quality materials.',
        cta: s.cta === 'COMPRAR AHORA' ? 'SHOP NOW' :
            s.cta === 'VER HOODIES' ? 'VIEW HOODIES' : 'EXPLORE'
    }));

    const { error: errorEn } = await supabase
        .from('content_blocks')
        .upsert({
            key: 'hero_slides_en',
            value: newSlidesEn,
            updated_at: new Date()
        });

    if (errorEn) {
        console.error('Error updating EN slides:', errorEn);
    } else {
        console.log('✅ Successfully updated hero_slides_en');
    }
}

updateHeroImages();
