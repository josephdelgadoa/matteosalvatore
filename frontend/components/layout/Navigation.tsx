import Link from 'next/link';

const links = [
    { href: '/category/clothing', label: 'Clothing' },
    { href: '/category/footwear', label: 'Footwear' },
    { href: '/search?q=new', label: 'New Arrivals' },
    { href: '/about', label: 'About' },
];

export const Navigation = () => {
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
