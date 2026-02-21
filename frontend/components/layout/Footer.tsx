import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Locale } from '../../i18n-config';

interface FooterProps {
    lang: Locale;
    dict: any;
}

export const Footer = ({ lang, dict }: FooterProps) => {
    return (
        <footer className="bg-ms-ivory pt-20 pb-10 border-t border-ms-fog">
            <div className="ms-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href={`/${lang}`} className="block">
                            <img
                                src="/images/logo-matteo-salvatore-v-web.png"
                                alt="Matteo Salvatore"
                                className="w-[120px] h-auto object-contain"
                            />
                        </Link>
                        <p className="text-ms-stone text-sm leading-relaxed max-w-xs">
                            {dict.description}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6">{dict.shop}</h4>
                        <ul className="space-y-4">
                            <li><Link href={`/${lang}/${lang === 'es' ? 'productos' : 'products'}/clothing`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.clothing}</Link></li>
                            <li><Link href={`/${lang}/${lang === 'es' ? 'productos' : 'products'}/footwear`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.footwear}</Link></li>
                            <li><Link href={`/${lang}/collections/new`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.newArrivals}</Link></li>
                            <li><Link href={`/${lang}/collections/best-sellers`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.bestSellers}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6">{dict.support}</h4>
                        <ul className="space-y-4">
                            <li><Link href={`/${lang}/help/shipping`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.shipping}</Link></li>
                            <li><Link href={`/${lang}/help/size-guide`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.sizeGuide}</Link></li>
                            <li><Link href={`/${lang}/help/faq`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.faq}</Link></li>
                            <li><Link href={`/${lang}/contact`} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.contact}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif text-lg mb-6">{dict.followUs}</h4>
                        <p className="text-sm text-ms-stone mb-4">{dict.subscribeText}</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder={dict.emailPlaceholder}
                                className="flex-1 bg-transparent border-b border-ms-stone py-2 text-sm focus:outline-none focus:border-ms-black"
                            />
                            <button type="submit" className="text-sm uppercase tracking-wide font-medium hover:text-ms-stone transition-colors">
                                {dict.join}
                            </button>
                        </form>

                        <div className="flex gap-6 mt-8">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-ms-black hover:text-ms-stone transition-all transform hover:scale-110" aria-label="Facebook">
                                <Facebook className="w-6 h-6" strokeWidth={1.5} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-ms-black hover:text-ms-stone transition-all transform hover:scale-110" aria-label="Instagram">
                                <Instagram className="w-6 h-6" strokeWidth={1.5} />
                            </a>
                            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-ms-black hover:text-ms-stone transition-all transform hover:scale-110" aria-label="TikTok">
                                {/* Custom TikTok Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-6 h-6"
                                >
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-ms-black hover:text-ms-stone transition-all transform hover:scale-110" aria-label="YouTube">
                                <Youtube className="w-6 h-6" strokeWidth={1.5} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-ms-fog flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs text-ms-silver uppercase tracking-wide flex flex-col gap-1 text-center md:text-left">
                        <p>© {new Date().getFullYear()} Matteo Salvatore</p>
                        <p>Powered by <a href="https://nexa-sphere.com" target="_blank" rel="noopener noreferrer" className="hover:text-ms-stone transition-colors">Nexa-Sphere</a></p>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-ms-silver hover:text-ms-stone transition-colors">{dict.privacy}</a>
                        <a href="#" className="text-xs text-ms-silver hover:text-ms-stone transition-colors">{dict.terms}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
