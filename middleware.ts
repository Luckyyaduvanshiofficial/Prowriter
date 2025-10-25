import { NextRequest, NextResponse } from 'next/server'

// MIDDLEWARE TEMPORARILY DISABLED
// The auth-context.tsx handles client-side authentication
// This middleware was causing 401 errors on every request
// 
// To re-enable server-side auth, you'll need to:
// 1. Use cookies to check auth state (Appwrite session cookies)
// 2. Avoid calling account.get() in middleware (causes 401s)

export async function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Client-side auth-context.tsx handles authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}