import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId, getCurrentUserWithProfile } from '@/lib/appwrite-auth'
import { AppwriteQueries } from '@/lib/appwrite'

export async function GET(req: NextRequest) {
  try {
    const userWithProfile = await getCurrentUserWithProfile(req)
    
    if (!userWithProfile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get usage statistics from Appwrite
    const usageStats = await AppwriteQueries.getUserUsageStats(userWithProfile.$id)
    
    const profile = {
      id: userWithProfile.$id,
      plan: userWithProfile.profile.plan,
      articles_generated_today: usageStats.articles_today,
      articles_limit: usageStats.daily_limit,
      total_articles: usageStats.articles_total,
      articles_this_month: usageStats.articles_this_month,
      created_at: userWithProfile.$createdAt,
      last_article_generated: userWithProfile.profile.lastGenerationDate
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId(req)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { plan, articles_generated_today } = await req.json()
    
    // Get current profile
    const profile = await AppwriteQueries.getProfileByUserId(userId)
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Update profile with new data
    const updates: any = {}
    if (plan) updates.plan = plan
    if (articles_generated_today !== undefined) updates.articlesGeneratedToday = articles_generated_today

    await AppwriteQueries.updateProfile(profile.$id!, updates)
    
    // Return updated usage stats
    const usageStats = await AppwriteQueries.getUserUsageStats(userId)
    
    const updatedProfile = {
      id: userId,
      plan: usageStats.plan,
      articles_generated_today: usageStats.articles_today,
      articles_limit: usageStats.daily_limit,
      total_articles: usageStats.articles_total,
      updated_at: new Date().toISOString()
    }
    
    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
