import { NextRequest, NextResponse } from 'next/server'
import { signOutUser } from '@/lib/appwrite-auth'

export async function POST(request: NextRequest) {
  try {
    // Sign out from Appwrite
    try {
      await signOutUser()
    } catch (error) {
      // If there's an error signing out from Appwrite, we'll still clear the cookie
      console.warn('Error signing out from Appwrite:', error)
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully'
    })

    // Clear session cookie
    response.cookies.set('session', '', {
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