import './globals.css';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    variable: '--font-cormorant',
    weight: ['300', '400', '500', '600', '700'],
    display: 'swap',
});

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    weight: ['400', '500', '700'],
    display: 'swap',
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn(cormorant.variable, dmSans.variable)}>
            <body className="font-sans antialiased">{children}</body>
        </html>
    );
}

export const metadata = {
    title: 'Matteo Salvatore | Timeless Elegance',
    description: 'Luxury clothing and footwear for the modern gentleman.',
};
