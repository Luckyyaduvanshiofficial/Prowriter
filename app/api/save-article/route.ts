import { NextRequest, NextResponse } from 'next/server'
import { serverDatabases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite'
import { ID } from 'node-appwrite'

export async function POST(request: NextRequest) {
  let requestBody: any = null
  
  try {
    const body = await request.json()
    requestBody = body // Store for error logging
    
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

    console.log('💾 Saving article to database...', { 
      userId, 
      title: title.substring(0, 50),
      wordCount,
      databaseId: DATABASE_ID,
      collectionId: COLLECTIONS.ARTICLES
    })

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

    console.log('✅ Article saved successfully:', { id: article.$id, title })

    return NextResponse.json({
      success: true,
      articleId: article.$id,
      message: 'Article saved successfully'
    })

  } catch (error: any) {
    console.error('❌ Save article error:', error)
    
    // Provide more detailed error information
    const errorMessage = error?.message || 'Unknown error'
    const errorCode = error?.code
    const errorType = error?.type
    
    const errorDetails = {
      message: errorMessage,
      code: errorCode,
      type: errorType,
      userId: requestBody?.userId,
      hasTitle: !!requestBody?.title,
      hasContent: !!requestBody?.content,
      timestamp: new Date().toISOString()
    }
    
    console.error('Detailed error:', errorDetails)
    
    // Check if it's an Appwrite-specific error
    if (errorMessage.includes('Collection') || errorMessage.includes('Database') || errorCode === 404) {
      return NextResponse.json(
        { 
          error: 'Database not configured properly. Please run: npm run setup:appwrite',
          details: errorMessage,
          help: 'Run "npm run setup:appwrite" to create the required database and collections.'
        },
        { status: 500 }
      )
    }
    
    if (errorMessage.includes('Attribute') || errorCode === 400) {
      return NextResponse.json(
        { 
          error: 'Database schema mismatch. Please update your database schema.',
          details: errorMessage,
          help: 'The Articles collection is missing required attributes. Run "npm run setup:appwrite" to fix.'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to save article. Please try again.',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}
