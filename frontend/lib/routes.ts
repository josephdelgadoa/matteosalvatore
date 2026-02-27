import { Locale } from '@/i18n-config';

export const URL_MAPPING: Record<string, string> = {
    'products': 'productos',
    'about': 'nosotros',
    'contact': 'contacto',
    'cart': 'carrito',
    'account': 'mi-cuenta',
    'category': 'categoria',
    'checkout': 'pago',
    'search': 'busqueda',
    'register': 'registrarse',
    'login': 'iniciar-sesion',
    'help': 'ayuda',
    'shipping': 'envios',
    'size-guide': 'guia-de-tallas',
    'faq': 'faq'
};

export const getLocalizedPath = (path: string, lang: Locale): string => {
    if (lang === 'en') return `/${lang}${path}`;

    // Split path and replace segments if they exist in mapping
    const segments = path.split('/').filter(Boolean);
    const localizedSegments = segments.map(segment => URL_MAPPING[segment] || segment);

    return `/es/${localizedSegments.join('/')}`;
};
