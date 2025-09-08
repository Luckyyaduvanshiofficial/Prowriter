import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { DatabaseQueries } from '@/lib/neon'

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

    // Save article to database
    const articleId = await DatabaseQueries.createArticle({
      user_id: userId,
      title: title,
      content: content,
      meta_description: metaDescription || null,
      topic: topic || title,
      model_a: modelA || '',
      model_b: modelB || '',
      use_case: articleType || 'informative',
      article_length: contentLength || 'medium',
      ai_engine: aiEngine || 'qwen',
      seo_keywords: seoKeywords || null,
      target_audience: targetAudience || null,
      brand_voice: brandVoice || 'friendly',
      used_web_search: false,
      used_serp_analysis: false,
      word_count: wordCount,
      estimated_reading_time: estimatedReadingTime,
      status: 'draft'
    })

    // Update usage tracking
    await DatabaseQueries.incrementUsage(userId, 'articles')

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
