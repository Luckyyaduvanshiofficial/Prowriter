import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { ID } from 'node-appwrite'

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
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - userId required' },
        { status: 401 }
      )
    }

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
    const article = await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      ID.unique(),
      {
        userId: userId,
        title: title,
        content: content,
        metaDescription: metaDescription || '',
        topic: topic || title,
        modelA: modelA || '',
        modelB: modelB || '',
        useCase: articleType || 'informative',
        articleLength: contentLength || 'medium',
        aiEngine: aiEngine || 'gemini',
        seoKeywords: seoKeywords || '',
        targetAudience: targetAudience || '',
        brandVoice: brandVoice || 'friendly',
        usedWebSearch: false,
        usedSerpAnalysis: false,
        wordCount: wordCount,
        estimatedReadingTime: estimatedReadingTime,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    )

    console.log('Article saved successfully:', title)

    return NextResponse.json({
      success: true,
      articleId: article.$id,
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
