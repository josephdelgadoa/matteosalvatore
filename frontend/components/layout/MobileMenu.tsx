import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Locale } from '../../i18n-config';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    lang: Locale;
    dict: any;
    commonDict: any;
}

export const MobileMenu = ({ isOpen, onClose, lang, dict, commonDict }: MobileMenuProps) => {
    const links = [
        { href: `/${lang}/category/clothing`, label: dict.clothing },
        { href: `/${lang}/category/footwear`, label: dict.footwear },
        { href: `/${lang}/search?q=new`, label: dict.newArrivals },
        { href: `/${lang}/about`, label: dict.about },
        { href: `/${lang}/account`, label: commonDict.account },
    ];

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 bg-ms-white transform transition-transform duration-300 ease-in-out md:hidden",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-ms-fog">
                    <span className="font-serif text-lg font-medium">{commonDict.menu}</span>
                    <button onClick={onClose} className="p-2 -mr-2 text-ms-stone hover:text-ms-black">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-8">
                    <ul className="flex flex-col space-y-6 px-8">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="text-xl font-light text-ms-black block py-2 border-b border-ms-fog"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-8 bg-ms-ivory">
                    <p className="text-sm text-ms-stone mb-4">{dict.contact}</p>
                    <a href="mailto:support@matteosalvatore.pe" className="text-ms-black underline">support@matteosalvatore.pe</a>
                </div>
            </div>
        </div>
    );
};
