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

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        // e.g. incoming request is /products
        // The new URL is now /es/products
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }

    // --- Path Localization Rewrites ---
    // Rewrite Spanish frontend URLs to the English internal routing
    let response: NextResponse;

    if (pathname.startsWith('/es/productos')) {
        response = NextResponse.rewrite(new URL(pathname.replace('/es/productos', '/es/products'), request.url));
    } else if (pathname.startsWith('/es/categoria')) {
        response = NextResponse.rewrite(new URL(pathname.replace('/es/categoria', '/es/category'), request.url));
    } else {
        response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }

    // --- Supabase Auth Middleware Logic (Preserved) ---
    // Note: We might need to adjust this if auth routes move under [lang]

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
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                }
            },
        }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Protect Admin Routes
    // Note: This now checks for /es/admin or /en/admin due to redirection
    // Protect Admin Routes
    // Exclude /admin/login from protection to avoid loops
    if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
        if (!session) {
            const locale = getLocale(request);
            return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
        }
    }

    return response;
}

export const config = {
    // Matcher ignoring `/_next/`, `/api/`, `/_static/`, `_vercel`, `.*\\..*`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)'],
};
