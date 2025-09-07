import { NextRequest, NextResponse } from 'next/server'
import { registerUser, isValidEmail, isValidPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      )
    }

    // Attempt to register user
    const result = await registerUser(email, password, firstName, lastName)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Account created successfully'
    })

    // Set session cookie
    response.cookies.set('session-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
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