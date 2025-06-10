import { type NextRequest, NextResponse } from "next/server"
import { createWebResearcher, type WebSearchOptions } from "@/lib/web-search"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic, options = {} } = body

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate and set research options
    const researchOptions = {
      maxResults: Math.min(Math.max(parseInt(options.maxResults) || 10, 1), 20),
      maxScrapes: Math.min(Math.max(parseInt(options.maxScrapes) || 5, 1), 10),
      includeContent: Boolean(options.includeContent !== false),
      searchOptions: {
        country: options.country || 'us',
        language: options.language || 'en',
        safeSearch: Boolean(options.safeSearch),
        timeRange: ['day', 'week', 'month', 'year'].includes(options.timeRange) 
          ? options.timeRange 
          : undefined
      }
    }

    const researcher = createWebResearcher()
    
    console.log(`Starting research for topic: ${topic}`)
    const startTime = Date.now()
    
    const results = await researcher.researchTopic(topic.trim(), researchOptions)
    
    const endTime = Date.now()
    const duration = endTime - startTime

    return NextResponse.json({
      success: true,
      data: {
        topic: topic.trim(),
        ...results,
        metadata: {
          researchedAt: new Date().toISOString(),
          duration: `${duration}ms`,
          options: researchOptions
        }
      }
    })

  } catch (error) {
    console.error('Research API error:', error)
    return NextResponse.json(
      { 
        error: 'Research failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic') || searchParams.get('q')

  if (!topic) {
    return NextResponse.json(
      { error: 'Topic parameter is required' },
      { status: 400 }
    )
  }

  try {
    const options = {
      maxResults: Math.min(Math.max(parseInt(searchParams.get('maxResults') || '10'), 1), 20),
      maxScrapes: Math.min(Math.max(parseInt(searchParams.get('maxScrapes') || '5'), 1), 10),
      includeContent: searchParams.get('includeContent') !== 'false',
      searchOptions: {
        country: searchParams.get('country') || 'us',
        language: searchParams.get('language') || 'en',
        safeSearch: searchParams.get('safe') === 'true',
        timeRange: ['day', 'week', 'month', 'year'].includes(searchParams.get('time') || '') 
          ? searchParams.get('time') as any
          : undefined
      }
    }

    const researcher = createWebResearcher()
    const results = await researcher.researchTopic(topic, options)

    return NextResponse.json({
      success: true,
      data: {
        topic,
        ...results,
        metadata: {
          researchedAt: new Date().toISOString(),
          options
        }
      }
    })

  } catch (error) {
    console.error('Research API error:', error)
    return NextResponse.json(
      { 
        error: 'Research failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
