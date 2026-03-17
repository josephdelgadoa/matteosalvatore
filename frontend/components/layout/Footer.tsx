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
                            <li><Link href={getLocalizedPath('/help/returns', lang)} className="text-sm text-ms-stone hover:text-ms-black transition-colors">{dict.returns || 'Cambios y Devoluciones'}</Link></li>
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

                <div className="pt-8 border-t border-ms-fog flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-xs text-ms-silver uppercase tracking-wide flex flex-col gap-1 text-center md:text-left">
                        <p>© {new Date().getFullYear()} Matteo Salvatore</p>
                        <p>Powered by <a href="https://nexa-sphere.com" target="_blank" rel="noopener noreferrer" className="hover:text-ms-stone transition-colors">Nexa-Sphere</a></p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] text-ms-silver uppercase tracking-widest">{dict.weAccept}</p>
                        <div className="flex gap-3 items-center opacity-80 hover:opacity-100 transition-opacity">
                            {/* Visa */}
                            <svg viewBox="0 0 32 20" width="32" height="20" className="fill-ms-stone hover:fill-ms-black transition-colors" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.9 14.1l1.6-9.8h2.6l-1.6 9.8h-2.6zm6.6-9.6c-.4-.1-1.2-.3-2.3-.3-2.5 0-4.3 1.3-4.3 3.3 0 1.4 1.3 2.2 2.3 2.7 1 .5 1.3.8 1.3 1.3 0 .7-.9 1-1.7 1-1.1 0-1.8-.1-2.6-.4l-.4-.1-.4 2.2c.6.3 1.8.6 3.1.6 2.7 0 4.4-1.3 4.4-3.4 0-1.1-.7-2-2.3-2.8-1-.5-1.5-.8-1.5-1.3 0-.4.5-1 1.6-1 .9 0 1.6.2 2.1.4l.3.1.4-2.3zm8.9 9.6h2.4l-4.1-9.8h-2c-.5 0-.9.2-1.1.8l-3.8 9h2.7l.5-1.4h3.3l.3 1.4zm-3.2-3.4l.8-2.3.5-1.3.3.9.5 2.7h-2.1zm-18-6.2l-2.6 6.7-.3-1.4-1.1-4c-.2-.7-.8-1.2-1.6-1.3H1v.3c.4 0 1 .1 1.4.3.4.2.6.4.7.7l2.2 8.6h2.8l4.1-9.9h-2.8z" />
                            </svg>
                            {/* Mastercard */}
                            <svg viewBox="0 0 32 20" width="32" height="20" className="fill-ms-stone hover:fill-ms-black transition-colors" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 9.9c0-2.3 1-4.3 2.5-5.6C12 3.1 10.1 2.3 8.1 2.3 3.6 2.3 0 5.8 0 10.2s3.6 7.9 8.1 7.9c2 .0 3.9-.8 5.4-2-1.5-1.3-2.5-3.3-2.5-5.6l0 -.6zm12.9-7.6c-2 0-3.9.8-5.4 2.1 1.5 1.3 2.5 3.3 2.5 5.6 0 2.3-1 4.3-2.5 5.6 1.4 1.3 3.4 2.1 5.4 2.1 4.5 0 8.1-3.5 8.1-7.9s-3.6-7.8-8.1-7.8z" />
                                <path d="M19 10c0-2.2-1-4.2-2.5-5.5-1.4 1.3-2.5 3.3-2.5 5.5 0 2.2 1 4.2 2.5 5.5 1.5-1.3 2.5-3.3 2.5-5.5z" />
                            </svg>
                            {/* American Express */}
                            <svg viewBox="0 0 32 20" width="32" height="20" className="fill-ms-stone hover:fill-ms-black transition-colors" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.7 13.9L4 10H1.5L0 14h2.7l.8-2 .9 1.9 .5 0zM3.4 11.2l-.5 1.4H2.4l.6-1.4s.2-.4.4 0zM12 10.4v2s0 .2-.2.2l-.7-.1c-.4-.1-.7-.2-.9-.1-.2 0-.2.2 0 .4.4.2.6.7.7 1l-.8 0c-.2-.4-.3-.7-.6-.8-.3 -.1-.6 0-.8.2-.1.2-.1.3-.1.5 0 .3.2.3.4.4.3.1.6 0 .9-.1.2-.1.4 0 .5.1.1.2 0 .4-.2.4-.4.1-.7.2-1.1.2-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8c.4 0 .8.1 1.1.2.2.1.2.3.2.4-.1.1-.3 0-.5-.1-.2-.1-.5-.1-.8-.1-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1.2 0 .4-.1.6-.2.1-.1.3-.2.4-.1.2 0 .3.3.4.4l-.2 0c-.2.1-.4.2-.6.2-.2 0-.3-.1-.3-.2-.1-.2 0-.4.2-.4.2 0 .5-.1.8 0 .2.1.3.3.4.6l.8 0c0-.3-.1-.8-.4-1 .2-.1.4-.2.5-.4.1-.1.1-.3.1-.3zm4.5-.4h-2.3v3.9h2.3v-.6H13v-1h.9v-.6h-.9v-1h1.2v-.7h0zM20 10l-1 .7c-.1-.1-.1-.1-.1-.2-.2-.2-.6-.3-.9-.3-.5 0-.9.2-1.2.4-.1.1-.1.2-.1.4 0 .2.3.3.5.3h.8c.4 0 .7.1.9.4s.2.5.2.8c0 .2 0 .4-.2.6l-1.3 1c-.1.1-.1.1-.2 0-.1-.1.2-.4.4-.6.2-.2.3-.4.3-.6s-.2-.3-.5-.3h-.8c-.3 0-.5-.1-.6-.2-.2-.1-.2-.4 0-.5.4-.3 1-.5 1.7-.5.2 0 .5 0 .6.1.1 0 .1.1.2.1zm-.5 3.9l.9-.7V10h1v3.9h-.8v-.7l-1.1.7hnpM24.7 10h-2.1v3.9h2.1v-.6h-1.3v-1h.9v-.6h-.9v-1l1.3 0c.2 0 .2.1.2.1l0-.1c-.1-.1-.1-.1-.2-.1h0zm2.2 1.6l1 2.3h-1l-.5-1.1c-.2-.5-.4-1.1-.7-1.6l-.3 1v1.7h-1v-4h1v1.8l.6-1.5c.2-.5.5-1.1.7-1.7l1.3 0z"/>
                                <path d="M31.2 10.1l.8 1.7v1.1l0 0-.2-.2s0-.1 0-.1c0-.1.1-.2.2-.2s0-.1.2-.1-.1-.1-.1-.1c0 0-.1.1-.2.1h-.2v0-.1.2h-.1v-.3l-.3.6v.1h.7v.1h-1l0 .5h0l0-.1-.2.1h-.2l.1-.3s.1-.2 0-.3l-.4.3h-.2s0 .1 0 .2l-.1.4s-.2.4-.2.4l-.4-.4-.3-.2.3 0s.1 0 .1.1c.1 0 .1-.1.1-.2l-.2-.3-.2.3s-.1 0-.2.1c-.1.1-.2 0-.2-.1s0-.1.1-.1h.1l-.1-.2-.2-.2-.2 0v0-.1-.1-.1h-.1v0h.2v.3h0v-.3l-.1 0s-.1 0 0-.1c0 0 0 0 0-.1l.1 0v-.1 0-.1h0v.2s0 .1-.1.1c-.1 0-.1 0-.1.1s.1 0 .1.1c.1.1.2 0 .3 0v.1.1l.5.5s.1.1.1.1c0 .1.1.1.2 0l.2-.2s0 0 0 0v-2.1h-.5v0h.3zm-1.8 1.9h-.1c0-.1 0-.1-.1 0 0 .1 0 .1-.1.2 0 0-.1.1-.1.2s0 .1.1.1.1.1.1.1c0 0 .1 0 .1-.1 0-.1.1-.1.1-.1.1 0 .1-.1 0-.1 0-.1-.1-.1-.1-.2h0z"/>
                                <path d="M5.4 11.2l-.7-.6-.2-.3h-.3v1h.3v-.3l.6.5h.5l-.2-.3c.1 0 .2-.1.2-.3s-.1-.2-.2-.3v0h.3z"/>
                                <path d="M9.4 11.1h-.5v.5h.4v.3h-.4v.6H10v-1.3h-.5l0 .1 0-.1h0zm-.3-.2c0-.1-.1-.2-.2-.2h-1v1.3h.2v-.6h.4v.6h.2l.1 0c.2-.2.3-.4.3-.6l-.1-.4h.1zm-.2.5h-.4v-.3h.4c.1 0 .2.1.2.1 0 .1 0 .2-.2.2zm13 0h-.3v-.3h.3c0 0 .1 0 .1 0 0 .1.1.2-.1.3zm.2.6v0-.5l-.8 0-.1 0h-.3v1h.2v-.4h.3l0 0c0 .1.1.2.2.3h.3v0l-.3-.5c0 0 .1-.1.1-.2l.4.1z"/>
                                <rect x="0" y="0" width="32" height="20" rx="3.5" ry="3.5" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                            {/* Diners Club */}
                            <svg viewBox="0 0 32 20" width="32" height="20" className="fill-ms-stone hover:fill-ms-black transition-colors" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <circle cx="16" cy="10" r="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <text x="13" y="11" fontSize="14" fontWeight="900" textAnchor="middle" fill="currentColor">D</text>
                            </svg>
                            {/* Yape Logo */}
                            <svg viewBox="0 0 32 20" width="32" height="20" className="fill-ms-stone hover:fill-ms-black hover:text-[#742284] transition-colors" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="32" height="20" rx="4" fill="currentColor" opacity="0.1" />
                                <text x="16" y="14" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="currentColor">YAPE</text>
                            </svg>
                        </div>
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
