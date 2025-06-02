import {NextRequest, NextResponse} from 'next/server';
import {i18n} from '@/lib/i18n-config';
import {match as matchLocale} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;
  const languages = new Negotiator({headers: negotiatorHeaders}).languages(locales);
  const defaultLocale = i18n.defaultLocale;

  let matchedLocale = matchLocale(languages, locales, defaultLocale);

  if (!matchedLocale || !locales.includes(matchedLocale)) {
    matchedLocale = defaultLocale;
  }
  return matchedLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for specific Next.js internal paths, API routes, and common static file extensions
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') || // Covers /_next/static, /_next/image, etc.
    /\.(ico|png|jpg|jpeg|gif|svg|js|css|webmanifest|xml|txt|json|map)$/i.test(pathname) // More explicit static file check
  ) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    let newPath;
    if (pathname === '/') {
      newPath = `/${locale}/`; 
    } else {
      // Ensure pathname always starts with a slash if it's not root
      const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
      newPath = `/${locale}${normalizedPathname}`;
    }
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for specific prefixes often used for static assets or internal Next.js paths.
    // The in-middleware checks will handle more granular skipping of static files.
    '/((?!api|_next/static|_next/image|assets|public|static|favicon.ico|sw.js).*)'
  ],
};
