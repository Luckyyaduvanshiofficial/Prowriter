import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Mock articles for demo purposes
    // In a real implementation, you would fetch these from your database
    const mockArticles = [
      {
        id: '1',
        user_id: userId,
        title: 'Getting Started with AI Content Generation',
        content: '<h1>Getting Started with AI Content Generation</h1><p>This is a sample article...</p>',
        meta_description: 'Learn how to get started with AI-powered content generation.',
        topic: 'AI Content',
        status: 'published',
        word_count: 1250,
        estimated_reading_time: 7,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: userId,
        title: 'Advanced SEO Techniques for 2024',
        content: '<h1>Advanced SEO Techniques for 2024</h1><p>SEO is constantly evolving...</p>',
        meta_description: 'Discover the latest SEO techniques to boost your rankings in 2024.',
        topic: 'SEO',
        status: 'draft',
        word_count: 2100,
        estimated_reading_time: 11,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]

    // Simple pagination for mock data
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = mockArticles.slice(startIndex, endIndex)

    return NextResponse.json({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total: mockArticles.length,
        totalPages: Math.ceil(mockArticles.length / limit)
      }
    })

  } catch (error) {
    console.error('Get articles error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!articleId || !userId) {
      return NextResponse.json(
        { error: 'Missing articleId or userId parameter' },
        { status: 400 }
      )
    }

    // Delete the article (only if it belongs to the user)
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId)
      .eq('user_id', userId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete article' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })

  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
