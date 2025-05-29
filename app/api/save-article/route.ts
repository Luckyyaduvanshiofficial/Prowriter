import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
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

    if (!userId || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, or content' },
        { status: 400 }
      )
    }

    // Calculate word count
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter((word: string) => word.length > 0).length
    const estimatedReadingTime = Math.ceil(wordCount / 200) // Average reading speed

    // Save the article to the database
    const { data, error } = await supabase
      .from('articles')
      .insert({
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
        status: 'draft'
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save article to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      article: data[0],
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
