import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has('firebase-auth-token');

  // Define paths that require authentication
  const protectedPaths = ['/profile', '/wallet', '/orders', '/top-up', '/games'];

  // Define authentication pages (login/register)
  const authPages = ['/login', '/register'];

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
  const isAuthPage = authPages.includes(pathname);

  // If user is trying to access a protected path without an auth cookie, redirect to login
  if (isProtectedPath && !hasAuthCookie) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }
  
  // The logic to redirect logged-in users from auth pages is now handled in AuthContext
  // to avoid race conditions. Middleware can be simplified.

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the homepage, which should be public)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
