import { NextResponse, type NextRequest } from 'next/server';

// ============================================================
// Proxy — Route Protection (JWT-based)
// Next.js 16+ uses proxy.ts instead of middleware.ts
// Runs on every matching route to enforce auth boundaries
// ============================================================

// Routes accessible without authentication
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/courses', '/certificates'];

// Routes prefixed with these paths are always public (e.g. API, static)
const publicPrefixes = ['/api', '/_next', '/favicon.ico'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public prefixes (API routes, Next.js internals, static files)
  if (publicPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check for JWT token in cookies
  const token = request.cookies.get('staffup-auth-token')?.value;

  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect unauthenticated users trying to access protected routes
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files & images
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
