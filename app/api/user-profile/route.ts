import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // In a real app, you'd fetch from your database
    // For now, we'll return dynamic data based on the user ID and time
    const today = new Date().toDateString()
    const userIdHash = userId.split('_')[1] || '0'
    const dailyUsage = Math.floor(Math.random() * 3) + 1 // Simulate realistic usage
    
    const profile = {
      id: userId,
      plan: 'free', // This could be fetched from user metadata or database
      articles_generated_today: dailyUsage,
      articles_limit: 5,
      total_articles: Math.floor(Math.random() * 15) + 5,
      articles_this_week: Math.floor(Math.random() * 10) + dailyUsage,
      articles_this_month: Math.floor(Math.random() * 30) + dailyUsage,
      created_at: new Date().toISOString(),
      last_article_generated: new Date(Date.now() - Math.random() * 86400000).toISOString()
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { plan, articles_generated_today } = await req.json()
    
    // In a real app, you'd update your database
    // For now, we'll just return the updated data
    const updatedProfile = {
      id: userId,
      plan: plan || 'free',
      articles_generated_today: articles_generated_today || 0,
      articles_limit: plan === 'pro' ? 25 : 5,
      total_articles: Math.floor(Math.random() * 20) + 5,
      updated_at: new Date().toISOString()
    }
    
    return NextResponse.json({ profile: updatedProfile })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
