import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserWithProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUserWithProfile(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: user,
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