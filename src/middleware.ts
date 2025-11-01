import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The cookie name for the Firebase auth token
const AUTH_COOKIE_NAME = 'firebase-auth-token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  // Define paths that require authentication
  const protectedPaths = ['/profile', '/wallet', '/orders', '/top-up', '/games'];

  // Define authentication pages (login/register)
  const authPages = ['/login', '/register'];

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
  const isAuthPage = authPages.includes(pathname);

  // If user is logged in (has cookie)
  if (hasAuthCookie) {
    // and tries to access login/register page, redirect to profile
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  } 
  // If user is not logged in (no cookie)
  else {
    // and tries to access a protected page, redirect to login
    if (isProtectedPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
