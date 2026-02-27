import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
    // 1. Check if user has explicitly set a language preference
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
        return cookieLocale;
    }

    // 2. Otherwise use Negotiator + intl-localematcher
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const locales: string[] = i18n.locales as unknown as string[];
    let languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

    try {
        const locale = matchLocale(languages, locales, i18n.defaultLocale);
        return locale;
    } catch (e) {
        return i18n.defaultLocale;
    }
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // --- Static File & API Bypass ---
    // Skip middleware for static files, images, favicon, and API routes
    // This MUST happen before any locale redirection or rewrites
    if (
        pathname.includes('.') ||
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/images/')
    ) {
        return NextResponse.next();
    }

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }

    // --- Path Localization Rewrites ---
    const urlMapping: Record<string, string> = {
        'productos': 'products',
        'nosotros': 'about',
        'contacto': 'contact',
        'carrito': 'cart',
        'mi-cuenta': 'account',
        'categoria': 'category',
        'pago': 'checkout',
        'busqueda': 'search',
        'registrarse': 'register',
        'iniciar-sesion': 'login'
    };

    let response: NextResponse | null = null;
    const segments = pathname.split('/').filter(Boolean); // e.g. ['es', 'nosotros']
    const lang = segments[0];
    const slug = segments[1];

    if (i18n.locales.includes(lang as any) && slug) {
        let internalPath: string | null = null;

        if (lang === 'es' && urlMapping[slug]) {
            internalPath = urlMapping[slug];
        } else if (lang === 'en' && Object.values(urlMapping).includes(slug)) {
            // Already internal English slug
            internalPath = slug;
        }

        if (internalPath) {
            const restOfPath = segments.slice(2).join('/');
            const newPath = `/${lang}/${internalPath}${restOfPath ? `/${restOfPath}` : ''}`;
            console.log(`[Middleware] Rewriting ${lang} path: ${pathname} -> ${newPath}`);
            response = NextResponse.rewrite(new URL(newPath, request.url));
        }
    }

    if (!response) {
        response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }

    // --- Supabase Auth Middleware Logic ---
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    if (!response) {
                        response = NextResponse.next({
                            request,
                        });
                    }
                    cookiesToSet.forEach(({ name, value, options }) => response!.cookies.set(name, value, options));
                }
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
        if (!session) {
            const locale = getLocale(request);
            return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
        }
    }

    // Locale Cookie Management
    if (i18n.locales.includes(lang as any)) {
        response.cookies.set('NEXT_LOCALE', lang, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
        });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
