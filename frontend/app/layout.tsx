import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: {
        template: '%s | Matteo Salvatore',
        default: 'Matteo Salvatore | Minimal Luxury Menswear',
    },
    description: 'Discover the essence of minimal luxury. Handcrafted menswear from Peru using the finest Pima cotton and Alpaca fibers.',
    keywords: ['menswear', 'luxury', 'minimalist', 'peru', 'pima cotton', 'alpaca', 'matteo salvatore'],
    openGraph: {
        type: 'website',
        locale: 'es_PE',
        url: 'https://matteosalvatore.pe',
        siteName: 'Matteo Salvatore',
        title: 'Matteo Salvatore | Minimal Luxury Menswear',
        description: 'Elegancia sin esfuerzo. Ropa masculina premium diseñada en Perú.',
        images: [
            {
                url: '/images/og-image.jpg', // We should ensure this exists or use a generic one
                width: 1200,
                height: 630,
                alt: 'Matteo Salvatore Collection',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className="font-sans antialiased bg-ms-ivory text-ms-black flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-20">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
