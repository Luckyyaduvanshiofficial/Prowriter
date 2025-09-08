import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/pricing',
  '/sign-in',
  '/sign-up',
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/logout'
]

// Define API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/logout'
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === pathname) return true
    if (route.endsWith('*') && pathname.startsWith(route.slice(0, -1))) return true
    return false
  })
}

function isPublicApiRoute(pathname: string): boolean {
  return publicApiRoutes.some(route => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for Next.js internal routes and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }
  
  // Check authentication for protected routes
  const user = await getCurrentUser(request)
  
  // If user is not authenticated and trying to access protected route
  if (!user) {
    // For API routes, return 401
    if (pathname.startsWith('/api') && !isPublicApiRoute(pathname)) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // For page routes, redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // User is authenticated, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}