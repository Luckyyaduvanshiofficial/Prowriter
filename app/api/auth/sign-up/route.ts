import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, firstName, lastName } = body

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

    // Basic password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Combine name fields if provided
    const fullName = name || [firstName, lastName].filter(Boolean).join(' ').trim() || undefined

    // Attempt to register user with Appwrite
    const result = await signUp(email, password, fullName)

    if (!result.success) {
      // Handle rate limit specifically
      if (result.error?.includes('Too many requests') || result.error?.includes('Rate limit')) {
        return NextResponse.json(
          { error: 'Too many sign-up attempts. Please wait a few minutes and try again.' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: result.error || 'Failed to create account' },
        { status: 400 }
      )
    }

    // Return success response
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Account created successfully'
    })

    return response
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}