import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile, updateUserProfile } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    // Get userId from query parameters instead of session
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    // Get user profile from database
    const profile = await getUserProfile(userId)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    // Return profile data
    return NextResponse.json({ 
      profile: {
        id: userId,
        email: profile.email,
        name: profile.name,
        plan: profile.plan,
        articles_generated_today: profile.articlesGeneratedToday,
        articles_limit: profile.plan === 'pro' ? 25 : profile.plan === 'admin' ? 999 : 5,
        subscription_status: profile.subscriptionStatus,
        created_at: profile.createdAt,
        updated_at: profile.updatedAt,
        last_generation_date: profile.lastGenerationDate
      }
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { userId, ...updateData } = data
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }
    
    // Update user profile in database
    const result = await updateUserProfile(userId, updateData)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    // Get updated profile
    const profile = await getUserProfile(userId)
    
    return NextResponse.json({ 
      profile: {
        id: userId,
        plan: profile?.plan,
        articles_generated_today: profile?.articlesGeneratedToday,
        articles_limit: profile?.plan === 'pro' ? 25 : 5,
        subscription_status: profile?.subscriptionStatus,
        updated_at: profile?.updatedAt
      }
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
