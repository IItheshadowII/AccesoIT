import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import createMiddleware from 'next-intl/middleware';
import { i18n } from './lib/i18n-config';

const i18nMiddleware = createMiddleware({
  locales: i18n.locales,
  defaultLocale: i18n.defaultLocale,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  // First, run the internationalization middleware
  const intlResponse = await i18nMiddleware(request);
  
  if (intlResponse) {
    return intlResponse;
  }

  // Create a Supabase client configured from environment variables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // Get the URL path
  const url = new URL(request.url);
  const path = url.pathname;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/admin', '/client'];

  // If user is authenticated
  if (session) {
    // If trying to access login page, redirect to dashboard
    if (path === '/auth') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // If trying to access protected route, allow
    if (protectedRoutes.some(route => path.startsWith(route))) {
      return NextResponse.next();
    }
  }

  // If user is not authenticated and trying to access protected route
  if (!session && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
