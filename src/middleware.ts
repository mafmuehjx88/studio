
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/firebase-admin'; // Using admin SDK for verification

// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const idToken = request.cookies.get('firebase-auth-token')?.value;

  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(pathname);
  
  const protectedPaths = ['/profile', '/wallet', '/orders', '/top-up', '/games'];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
  
  let user = null;
  if (idToken) {
    try {
        // We don't use the result, we just want to know if it's valid.
        // If it's invalid, it will throw.
        await auth.verifyIdToken(idToken);
        user = { idToken }; // represents a logged-in user
    } catch (error) {
        // Token is invalid or expired
        user = null;
    }
  }
  
  // Scenario 1: User is logged in
  if (user) {
    if (isAuthPage) {
        // Logged-in user trying to access login/register, redirect to profile
        return NextResponse.redirect(new URL('/profile', request.url));
    }
    // Otherwise, allow access to any other page
    return NextResponse.next();
  }

  // Scenario 2: User is NOT logged in
  if (!user) {
    if (isProtectedPath) {
        // Not-logged-in user trying to access a protected page, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('redirectedFrom', pathname);
        return NextResponse.redirect(url);
    }
    // Otherwise, allow access to public pages (like login, register, home)
    return NextResponse.next();
  }
  
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
     * - admin (admin pages, if any)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
  runtime: 'nodejs', // Use Node.js runtime instead of edge
}
