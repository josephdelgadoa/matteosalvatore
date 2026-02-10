import Link from 'next/link';
import { Locale } from '../../i18n-config';

interface NavigationProps {
    lang: Locale;
    dict: any;
}

export const Navigation = ({ lang, dict }: NavigationProps) => {
    const links = [
        { href: `/${lang}/category/clothing`, label: dict.clothing },
        { href: `/${lang}/category/footwear`, label: dict.footwear },
        { href: `/${lang}/search?q=new`, label: dict.newArrivals },
        { href: `/${lang}/about`, label: dict.about },
    ];

    return (
        <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium uppercase tracking-wider text-ms-stone hover:text-ms-black transition-colors"
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};
