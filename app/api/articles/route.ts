import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { Query } from 'node-appwrite'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get articles from Appwrite database
    const offset = (page - 1) * limit
    
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ]
    )

    return NextResponse.json({
      articles: response.documents,
      pagination: {
        page,
        limit,
        total: response.total,
        totalPages: Math.ceil(response.total / limit)
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
        { error: 'Missing articleId or userId' },
        { status: 400 }
      )
    }

    // Verify the article belongs to the user before deleting
    const article = await serverDatabases.getDocument(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      articleId
    )

    if (article.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the article
    await serverDatabases.deleteDocument(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      articleId
    )

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
