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
    'faq': 'faq',
    'information': 'informacion',
    'payment': 'metodo-de-pago',
    'success': 'exito'
};

// Create inverse mapping for normalization
export const INVERSE_MAPPING: Record<string, string> = Object.entries(URL_MAPPING).reduce((acc, [en, es]) => {
    acc[es] = en;
    return acc;
}, {} as Record<string, string>);

export const getLocalizedPath = (path: string, lang: Locale): string => {
    if (!path || path === '#' || path.startsWith('http')) return path;

    // 1. Strip existing locale prefix if present
    let internalPath = path;
    if (path.startsWith('/en/') || path === '/en') {
        internalPath = path.replace(/^\/en/, '') || '/';
    } else if (path.startsWith('/es/') || path === '/es') {
        internalPath = path.replace(/^\/es/, '') || '/';
    }

    // 2. Separate path from query string
    const [pathname, ...queryParts] = internalPath.split('?');
    const queryString = queryParts.length > 0 ? `?${queryParts.join('?')}` : '';

    // 3. Normalize segments: Convert any Spanish localized keys back to English internal keys
    const segments = pathname.split('/').filter(Boolean);
    const normalizedSegments = segments.map(segment => INVERSE_MAPPING[segment] || segment);

    // 4. Re-localize for the target language
    let localizedPath = '';
    if (lang === 'en') {
        localizedPath = `/en/${normalizedSegments.join('/')}`.replace(/\/+$/, '') || '/en';
    } else {
        // lang === 'es'
        const localizedSegments = normalizedSegments.map(segment => URL_MAPPING[segment] || segment);
        localizedPath = `/es/${localizedSegments.join('/')}`.replace(/\/+$/, '') || '/es';
    }

    return `${localizedPath}${queryString}`;
};
