import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user profile from database
    const profile = await getUserProfile(user.id)

    return NextResponse.json({
      user: {
        ...user,
        profile
      },
      success: true
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}