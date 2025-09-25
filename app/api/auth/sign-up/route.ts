import { NextRequest, NextResponse } from 'next/server'
import { registerUser, isValidEmail, isValidPassword } from '@/lib/appwrite-auth'

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

    // Build full name from firstName and lastName
    const fullName = [firstName, lastName].filter(Boolean).join(' ')

    // Attempt to register user
    const result = await registerUser(email, password, fullName)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create response with session in cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Account created successfully'
    })

    // Set Appwrite session cookie
    response.cookies.set('session', result.session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(result.session.expire)
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