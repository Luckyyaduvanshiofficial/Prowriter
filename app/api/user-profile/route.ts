import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserProfile, updateUserProfile } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user profile from database
    const profile = await getUserProfile(user.id)
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    
    // Return profile data
    return NextResponse.json({ 
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
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
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const data = await req.json()
    
    // Update user profile in database
    const result = await updateUserProfile(user.id, data)
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    // Get updated profile
    const profile = await getUserProfile(user.id)
    
    return NextResponse.json({ 
      profile: {
        id: user.id,
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
