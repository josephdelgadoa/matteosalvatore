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

                {/* NEW PAYMENT LOGOS ROW */}
                <div className="py-10 border-t border-ms-fog flex flex-col items-center justify-center gap-5">
                    <p className="text-[11px] font-semibold text-ms-stone uppercase tracking-[0.2em]">{dict.weAccept}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {/* Visa */}
                        <div className="w-[64px] h-[40px] bg-white border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-[4px] flex items-center justify-center p-2.5 hover:shadow-md transition-shadow">
                            <svg viewBox="0 0 38 12" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.9868 11.5137L15.115 0.93589H18.5136L16.3813 11.5137H12.9868ZM26.345 11.5137H29.6206L24.1627 0.93589H21.5037C20.803 0.93589 20.2505 1.20721 19.9537 1.82535L14.7779 11.5137H18.3496L19.0628 9.50676H23.4144L23.8242 11.5137H26.345ZM20.0274 6.86219L21.6067 2.47653L22.5186 6.86219H20.0274ZM34.4449 6.56152C34.4608 5.24233 33.6499 4.19741 33.0245 3.65437C33.0245 2.33818 31.0601 2.26607 31.0858 1.59577C31.0963 1.28137 31.42 0.948639 32.1009 0.849282C32.4419 0.798198 33.1519 0.767458 33.993 1.16611L34.5501 0.869939C34.0954 0.690675 33.2081 0.574875 32.2275 0.574875C28.9839 0.574875 26.68 2.32215 26.6661 4.63767C26.6521 6.3464 28.1751 7.29817 29.3516 7.87271C30.5621 8.46033 30.9669 8.83501 30.9631 9.34388C30.9585 10.1272 30.0166 10.4721 29.07 10.4721C27.756 10.4721 26.9638 10.1059 26.348 9.8145L25.8018 10.0967C26.435 10.3951 27.5305 10.6563 28.6756 10.6716C32.1472 10.6716 34.426 8.94541 34.4449 6.56152ZM9.6828 0.93589L6.89973 8.21371L6.6027 6.7351C5.83422 3.83188 2.76633 1.68854 0 0.93589L0.640652 0.93589C1.34327 0.93589 1.95478 1.33559 2.14856 2.12672L4.01815 11.5137H7.55832L13.1166 0.93589H9.6828Z" fill="#1434CB"/>
                            </svg>
                        </div>
                        {/* Mastercard */}
                        <div className="w-[64px] h-[40px] bg-white border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-[4px] flex items-center justify-center p-2 hover:shadow-md transition-shadow">
                            <svg viewBox="0 0 34 21" className="w-[85%] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10.5" cy="10.5" r="10.5" fill="#EB001B"/>
                                <circle cx="23.5" cy="10.5" r="10.5" fill="#F79E1B"/>
                                <path d="M17 18.7303C18.8471 16.8924 20 13.8443 20 10.5C20 7.1557 18.8471 4.10756 17 2.26965C15.1529 4.10756 14 7.1557 14 10.5C14 13.8443 15.1529 16.8924 17 18.7303Z" fill="#FF5F00"/>
                            </svg>
                        </div>
                        {/* American Express */}
                        <div className="w-[64px] h-[40px] bg-white border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-[4px] flex items-center justify-center hover:shadow-md transition-shadow overflow-hidden">
                            <svg viewBox="0 0 34 34" className="w-[85%] h-auto relative top-[2px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.6667 22H14L10.5 12H7.66667L4.16667 22H6.5L7.33333 19.5H10.8333L11.6667 22ZM8.16667 17L9.08333 14H9.08333L10 17H8.16667ZM24.5 12H20.1667V22H24.5V19.8333H22.5V17.8333H24.1667V15.6667H22.5V14.1667H24.5V12ZM29.8333 22H26.8333L25.3333 19.5V22H23.5V12H25.3333V14.5L26.8333 12H29.8333L27.1667 16L30 22H29.8333ZM19 22H16.6667L15.3333 16H15.3333V22H13.5V12H16.5L18 18H18L19.5 12H22.5V22H20.6667V16H20.6667L19 22Z" fill="#006FCF"/>
                            </svg>
                        </div>
                        {/* Diners Club */}
                        <div className="w-[64px] h-[40px] bg-white border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-[4px] flex items-center justify-center hover:shadow-md transition-shadow">
                            <span className="text-[#00529B] font-[900] tracking-[-0.05em] text-[10.5px] leading-none text-center flex flex-col items-center">
                                <span>Diners Club</span>
                                <span className="text-[7px] font-medium tracking-normal mt-[1px]">INTERNATIONAL</span>
                            </span>
                        </div>
                        {/* Yape */}
                        <div className="w-[64px] h-[40px] bg-[#742284] border border-[#742284] shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-[4px] flex items-center justify-center hover:shadow-md transition-shadow overflow-hidden group">
                           <span className="text-white font-sans font-black text-[14px] leading-none tracking-tight">YAPE</span>
                        </div>
                    </div>
                </div>

                {/* BOTTOM COPYRIGHT ROW */}
                <div className="pt-6 pb-2 border-t border-ms-fog flex flex-col md:flex-row justify-between items-center gap-6">
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
