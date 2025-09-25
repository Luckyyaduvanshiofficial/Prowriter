import { NextRequest, NextResponse } from 'next/server'
import { signInUser, isValidEmail } from '@/lib/appwrite-auth'

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

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Attempt to sign in user
    const result = await signInUser(email, password)

    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Create response with session in cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Signed in successfully'
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
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}