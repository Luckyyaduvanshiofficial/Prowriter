import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth()
    
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

    // Mock article save for demo purposes
    // In a real implementation, you would save this to your database
    const mockArticle = {
      id: Date.now().toString(),
      user_id: userId,
      title: title,
      content: content,
      meta_description: metaDescription || '',
      topic: topic || title,
      model_a: modelA || '',
      model_b: modelB || '',
      use_case: articleType || 'informative',
      article_length: contentLength || 'medium',
      ai_engine: aiEngine || 'qwen',
      seo_keywords: seoKeywords || '',
      target_audience: targetAudience || '',
      brand_voice: brandVoice || 'friendly',
      word_count: wordCount,
      estimated_reading_time: estimatedReadingTime,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('Article would be saved:', mockArticle.title)

    return NextResponse.json({
      success: true,
      article: mockArticle,
      message: 'Article saved successfully (demo mode)'
    })

  } catch (error) {
    console.error('Save article error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
