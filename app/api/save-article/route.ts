import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/appwrite-auth'
import { AppwriteQueries } from '@/lib/appwrite'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const userId = await getCurrentUserId(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      content,
      metaDescription,
      modelA,
      modelB,
      articleType,
      contentLength,
      aiEngine,
      seoKeywords,
      targetAudience,
      brandVoice,
      topic
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title or content' },
        { status: 400 }
      )
    }

    // Calculate word count
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length
    const estimatedReadingTime = Math.ceil(wordCount / 200) // Average reading speed

    // Save article to Appwrite database
    const articleId = await AppwriteQueries.createArticle({
      userId: userId,
      title: title,
      content: content,
      metaDescription: metaDescription || undefined,
      topic: topic || title,
      modelA: modelA || '',
      modelB: modelB || '',
      useCase: articleType || 'informative',
      articleLength: contentLength || 'medium',
      aiEngine: aiEngine || 'qwen',
      seoKeywords: seoKeywords || undefined,
      targetAudience: targetAudience || undefined,
      brandVoice: brandVoice || 'friendly',
      usedWebSearch: false,
      usedSerpAnalysis: false,
      wordCount: wordCount,
      estimatedReadingTime: estimatedReadingTime,
      status: 'draft'
    })

    // Update usage tracking
    await AppwriteQueries.incrementUsage(userId, 'articles')

    console.log('Article saved successfully:', title)

    return NextResponse.json({
      success: true,
      articleId: articleId,
      message: 'Article saved successfully'
    })

  } catch (error) {
    console.error('Save article error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
