import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Locale } from '../../i18n-config';
import { getLocalizedPath } from '@/lib/routes';

interface FooterProps {
    lang: Locale;
    dict: any;
}

export const Footer = ({ lang, dict }: FooterProps) => {
    return (
        <footer className="bg-ms-ivory pt-20 pb-10 border-t border-ms-fog">
            <div className="ms-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
                    <div className="space-y-6 lg:col-span-3">
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

                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-lg mb-6">{dict.shop}</h4>
                        <ul className="space-y-4">
                            <li><Link href={getLocalizedPath('/products/clothing', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.clothing}</Link></li>
                            <li><Link href={getLocalizedPath('/products/footwear', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.footwear}</Link></li>
                            <li><Link href={getLocalizedPath('/collections/new', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.newArrivals}</Link></li>
                            <li><Link href={getLocalizedPath('/collections/best-sellers', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.bestSellers}</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-lg mb-6">{dict.support}</h4>
                        <ul className="space-y-4">
                            <li><Link href={getLocalizedPath('/help/shipping', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.shipping}</Link></li>
                            <li><Link href={getLocalizedPath('/help/size-guide', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.sizeGuide}</Link></li>
                            <li><Link href={getLocalizedPath('/help/faq', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.faq}</Link></li>
                            <li><Link href={getLocalizedPath('/contact', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.contact}</Link></li>
                            <li><Link href={getLocalizedPath('/libro-de-reclamaciones', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.complaintsBook || 'Libro de Reclamaciones'}</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-serif text-lg mb-6">{dict.ourStores}</h4>
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-sm font-medium text-ms-black">{dict.storeSanBorja}</h5>
                                <p className="text-sm text-ms-stone mt-1">{dict.addressSanBorja1}<br />{dict.addressSanBorja2}</p>
                            </div>
                            <div>
                                <h5 className="text-sm font-medium text-ms-black">{dict.storeGamarra}</h5>
                                <p className="text-sm text-ms-stone mt-1">{dict.addressGamarra1}<br />{dict.addressGamarra2}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="font-serif text-lg mb-6">{dict.followUs}</h4>
                        <p className="text-sm text-ms-stone mb-4">{dict.subscribeText}</p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder={dict.emailPlaceholder}
                                className="flex-1 bg-transparent border-b border-ms-stone py-2 text-sm focus:outline-none focus:border-ms-black"
                            />
                            <button type="submit" className="text-sm uppercase tracking-wide font-medium hover:text-ms-stone transition-colors whitespace-nowrap">
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
                    <div className="flex gap-6 flex-wrap justify-center md:justify-end">
                        <Link href={getLocalizedPath('/policy/privacy', lang)} className="text-xs text-ms-silver hover:text-ms-stone transition-colors">{dict.privacy}</Link>
                        <Link href={getLocalizedPath('/policy/cookies', lang)} className="text-xs text-ms-silver hover:text-ms-stone transition-colors">{dict.cookiePolicy}</Link>
                        <Link href={getLocalizedPath('/policy/terms', lang)} className="text-xs text-ms-silver hover:text-ms-stone transition-colors">{dict.terms}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
