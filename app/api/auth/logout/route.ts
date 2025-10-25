import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Sign out from Appwrite
    const result = await signOut()

    // Create response
    const response = NextResponse.json({
      success: result.success,
      message: result.success ? 'Signed out successfully' : 'Failed to sign out'
    })

    // Clear any session cookies (for compatibility)
    response.cookies.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Immediately expire the cookie
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}