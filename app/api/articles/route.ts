import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/appwrite-auth'
import { AppwriteQueries } from '@/lib/appwrite'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const userId = await getCurrentUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get articles from Appwrite database
    const articles = await AppwriteQueries.getArticlesByUser(userId, limit, offset)

    return NextResponse.json({
      articles: articles,
      pagination: {
        page,
        limit,
        total: articles.length,
        totalPages: Math.ceil(articles.length / limit)
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
    const userId = await getCurrentUserId(request)

    if (!articleId || !userId) {
      return NextResponse.json(
        { error: 'Missing articleId or unauthorized' },
        { status: 400 }
      )
    }

    // Delete the article (only if it belongs to the user)
    await AppwriteQueries.deleteArticle(articleId, userId)

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
