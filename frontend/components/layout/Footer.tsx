import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="bg-ms-ivory pt-20 pb-10 border-t border-ms-fog">
            <div className="ms-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <span className="font-serif text-2xl font-medium">Matteo Salvatore</span>
                        <p className="text-ms-stone text-sm leading-relaxed max-w-xs">
                            Minimalist luxury menswear designed in Lima. Crafted with the finest Peruvian materials for the modern gentleman.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="/products/clothing" className="text-sm text-ms-stone hover:text-ms-black transition-colors">Clothing</Link></li>
                            <li><Link href="/products/footwear" className="text-sm text-ms-stone hover:text-ms-black transition-colors">Footwear</Link></li>
                            <li><Link href="/collections/new" className="text-sm text-ms-stone hover:text-ms-black transition-colors">New Arrivals</Link></li>
                            <li><Link href="/collections/best-sellers" className="text-sm text-ms-stone hover:text-ms-black transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="/help/shipping" className="text-sm text-ms-stone hover:text-ms-black transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/help/size-guide" className="text-sm text-ms-stone hover:text-ms-black transition-colors">Size Guide</Link></li>
                            <li><Link href="/help/faq" className="text-sm text-ms-stone hover:text-ms-black transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="text-sm text-ms-stone hover:text-ms-black transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6">Stay Connected</h4>
                        <p className="text-sm text-ms-stone mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent border-b border-ms-stone py-2 text-sm focus:outline-none focus:border-ms-black"
                            />
                            <button type="submit" className="text-sm uppercase tracking-wide font-medium hover:text-ms-stone transition-colors">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-ms-fog flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-ms-silver uppercase tracking-wide">
                        © {new Date().getFullYear()} Matteo Salvatore. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-ms-silver hover:text-ms-stone transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-ms-silver hover:text-ms-stone transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
