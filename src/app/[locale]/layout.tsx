import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: '--font-primary' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-heading' });

export const metadata: Metadata = {
  title: "Matteo Salvatore | Premium Menswear",
  description: "Exclusive menswear for the modern gentleman.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ai/Chatbot";
import { CartProvider } from "@/context/CartContext";

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfair.variable}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <Navbar />
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <Footer />
            <Chatbot />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
