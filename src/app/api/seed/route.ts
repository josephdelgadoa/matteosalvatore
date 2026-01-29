import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    const products = [
        {
            slug: 'mens-skinny-stretchy-pants',
            name_en: "Men's Skinny Stretchy Pants",
            name_es: "Pantalones Skinny Stretchy para Hombre",
            description_en: "Premium stretchy pants designed for comfort and style.",
            description_es: "Pantalones elásticos premium diseñados para comodidad y estilo.",
            price: 120.00,
            category: 'pants',
            images: [],
            colors: ['White', 'Black', 'Blue', 'Beige', 'Red'],
            sizes: ['S', 'M', 'L', 'XL'] // Logic handling for stock table below
        },
        {
            slug: 'premium-pima-cotton-polo',
            name_en: "Premium Pima Cotton Polo",
            name_es: "Polo de Algodón Pima Premium",
            description_en: "The best cotton in the world. Superior softness and durability.",
            description_es: "El mejor algodón del mundo. Suavidad y durabilidad superior.",
            price: 80.00,
            category: 'polos',
            images: [],
            colors: ['White', 'Black', 'Blue', 'Beige', 'Red'],
            sizes: ['S', 'M', 'L', 'XL']
        },
        {
            slug: 'ms-hoodie',
            name_en: "Signature MS Hoodie",
            name_es: "Hoodie Signature MS",
            description_en: "Cozy and stylish hoodie for everyday wear.",
            description_es: "Hoodie cómodo y con estilo para uso diario.",
            price: 150.00,
            category: 'hoodies',
            images: [],
            colors: ['White', 'Black', 'Blue', 'Beige', 'Red'],
            sizes: ['S', 'M', 'L', 'XL']
        },
        {
            slug: 'peruvian-leather-sneakers-classic',
            name_en: "Peruvian Leather Sneakers - Classic",
            name_es: "Zapatillas de Cuero Peruano - Clásicas",
            description_en: "Handcrafted Peruvian leather sneakers.",
            description_es: "Zapatillas de cuero peruano hechas a mano.",
            price: 250.00,
            category: 'shoes',
            images: [],
            colors: ['Brown'], // Placeholder
            sizes: ['40', '41', '42', '43']
        }
    ];

    const results = [];

    for (const product of products) {
        // Insert Product
        const { data: prodData, error: prodError } = await supabase
            .from('products')
            .insert({
                slug: product.slug,
                name_en: product.name_en,
                name_es: product.name_es,
                description_en: product.description_en,
                description_es: product.description_es,
                price: product.price,
                category: product.category,
                images: product.images
            })
            .select()
            .single();

        if (prodError) {
            console.error('Error inserting product:', product.slug, prodError);
            results.push({ error: prodError, product: product.slug });
            continue;
        }

        // Insert Stock (Cartesian product of colors * sizes)
        const stockItems = [];
        for (const color of product.colors) {
            for (const size of product.sizes) {
                stockItems.push({
                    product_id: prodData.id,
                    color,
                    size,
                    quantity: 100 // Default stock
                });
            }
        }

        const { error: stockError } = await supabase
            .from('stock')
            .insert(stockItems);

        if (stockError) {
            console.error('Error inserting stock for:', product.slug, stockError);
            results.push({ error: stockError, product: product.slug, step: 'stock' });
        } else {
            results.push({ success: true, product: product.slug });
        }
    }

    return NextResponse.json({ message: 'Seeding complete', results });
}
