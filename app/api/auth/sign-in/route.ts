import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Attempt to sign in user with Appwrite
    const result = await signIn(email, password)

    if (!result.success) {
      // Handle rate limit specifically
      if (result.error?.includes('Too many') || result.error?.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'Too many login attempts. Please wait a few minutes and try again.' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: result.error || 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return success response
    const response = NextResponse.json({
      success: true,
      session: result.session,
      message: 'Signed in successfully'
    })

    return response
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}