import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware is now simplified.
// Its only job is to protect routes for users who are NOT logged in.
// Redirection for already-logged-in users is handled in AuthContext.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // This is a placeholder for a real auth token.
  // In a real app, this would be a secure, HTTP-only cookie.
  const hasAuthCookie = request.cookies.has('firebase-auth-token');

  // Define paths that require authentication
  const protectedPaths = ['/profile', '/wallet', '/orders', '/top-up', '/games'];

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  // If user is trying to access a protected path without an auth cookie, redirect to login
  if (isProtectedPath && !hasAuthCookie) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(url);
  }

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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
