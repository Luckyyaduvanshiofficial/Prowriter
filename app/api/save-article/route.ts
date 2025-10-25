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

    // Check if Appwrite is properly configured
    if (!DATABASE_ID || DATABASE_ID === 'prowriter_db') {
      console.warn('⚠️ Appwrite database not configured properly.')
      console.warn('Current DATABASE_ID:', DATABASE_ID)
      console.warn('To enable article saving:')
      console.warn('1. Create a database in Appwrite Console')
      console.warn('2. Create an "articles" collection')
      console.warn('3. Update NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env')
      
      return NextResponse.json({
        success: true,
        warning: 'Database not configured. Article not saved.',
        articleId: null,
        message: 'Article generated successfully',
        help: {
          instructions: [
            '1. Go to Appwrite Console (https://cloud.appwrite.io)',
            '2. Create a new Database',
            '3. Create a collection named "articles"',
            '4. Add the following attributes to the collection:',
            '   - userId (string, required)',
            '   - title (string, required)',
            '   - content (string, required, size: 65535)',
            '   - metaDescription (string)',
            '   - topic (string)',
            '   - modelA (string)',
            '   - modelB (string)',
            '   - useCase (string)',
            '   - articleLength (string)',
            '   - aiEngine (string)',
            '   - seoKeywords (string)',
            '   - targetAudience (string)',
            '   - brandVoice (string)',
            '   - usedWebSearch (boolean)',
            '   - usedSerpAnalysis (boolean)',
            '   - wordCount (integer)',
            '   - estimatedReadingTime (integer)',
            '   - status (string)',
            '   - createdAt (datetime)',
            '   - updatedAt (datetime)',
            '5. Update .env with your actual database ID'
          ]
        }
      })
    }

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

    console.log('✅ Article saved successfully:', title)

    return NextResponse.json({
      success: true,
      articleId: article.$id,
      message: 'Article saved successfully'
    })

  } catch (error) {
    console.error('Save article error:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = {
      message: errorMessage,
      userId: requestBody?.userId,
      hasTitle: !!requestBody?.title,
      hasContent: !!requestBody?.content,
      timestamp: new Date().toISOString()
    }
    
    console.error('Detailed error:', errorDetails)
    
    // Check if it's an Appwrite-specific error
    if (errorMessage.includes('Collection') || errorMessage.includes('Database')) {
      return NextResponse.json(
        { 
          error: 'Database configuration error. Please ensure Appwrite database and collections are set up.',
          details: errorMessage
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
