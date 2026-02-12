import './globals.css';
import { Playfair_Display, Outfit } from 'next/font/google';
import { cn } from '@/lib/utils';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={cn(playfair.variable, outfit.variable)}>
            <body className="font-sans antialiased">{children}</body>
        </html>
    );
}

export const metadata = {
    title: 'Matteo Salvatore | Timeless Elegance',
    description: 'Luxury clothing and footwear for the modern gentleman.',
    icons: {
        icon: '/favicon.ico',
    },
};
