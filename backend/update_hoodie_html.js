const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'backend/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function updateDescription() {
    const slug = 'hoodie-premium-hombre-2026-slim-urbano';

    const htmlDescriptionEs = `
<p>Descubre el nuevo <strong>Hoodie Premium Hombre 2026</strong> de Matteo Salvatore, diseñado para hombres modernos entre 18 y 60 años que buscan estilo urbano, comodidad y presencia atlética.</p>

<p>Inspirado en las tendencias streetwear 2025–2026, este hoodie combina corte slim fit, tela premium de alta resistencia y un diseño minimalista que eleva cualquier outfit.</p>

<h3>Disponible en colores tendencia:</h3>
<ul>
    <li>Negro clásico</li>
    <li>Blanco limpio</li>
    <li>Azul Eléctrico impactante</li>
    <li>Rojo Vibrante</li>
    <li>Light Gray moderno</li>
    <li>Beige elegante</li>
    <li>Camel sofisticado</li>
</ul>

<h3>Perfecto para:</h3>
<ul>
    <li>Outfit urbano diario</li>
    <li>Gimnasio y lifestyle activo</li>
    <li>Looks casual premium</li>
    <li>Climas frescos</li>
</ul>

<p>
    🔥 Corte atlético que estiliza la figura<br>
    🔥 Tela suave y resistente<br>
    🔥 Diseño minimalista de lujo<br>
    🔥 Edición limitada
</p>

<p><strong>Stock limitado:</strong> 50 unidades disponibles.</p>

<p>Si buscas el mejor hoodie urbano slim fit hombre 2026 en Perú, esta es la prenda que define tu estilo.</p>
    `;

    const { error } = await supabase
        .from('products')
        .update({ description_es: htmlDescriptionEs })
        .eq('slug', slug);

    if (error) {
        console.error('Error updating:', error);
    } else {
        console.log('Successfully updated hoodie description to HTML');
    }
}

updateDescription();
