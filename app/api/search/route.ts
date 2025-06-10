import { type NextRequest, NextResponse } from "next/server"
import { createWebSearcher, createWebResearcher, type WebSearchOptions } from "@/lib/web-search"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, options = {} } = body

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    // Validate options
    const searchOptions: WebSearchOptions = {
      query: query.trim(),
      limit: Math.min(Math.max(parseInt(options.limit) || 10, 1), 20),
      country: options.country || 'us',
      language: options.language || 'en',
      safeSearch: Boolean(options.safeSearch),
      timeRange: ['day', 'week', 'month', 'year'].includes(options.timeRange) 
        ? options.timeRange 
        : undefined
    }

    // Try different search providers
    let searchResults = []
    let provider = 'unknown'
    let error = null

    try {
      // Try SerpAPI first
      const serpSearcher = createWebSearcher('serpapi')
      searchResults = await serpSearcher.search(searchOptions)
      provider = 'serpapi'
    } catch (serpError) {
      console.warn('SerpAPI failed:', serpError)
      error = serpError

      try {
        // Fallback to Custom Google Search
        const customSearcher = createWebSearcher('custom')
        searchResults = await customSearcher.search(searchOptions)
        provider = 'google-custom'
        error = null
      } catch (customError) {
        console.error('All search methods failed:', customError)
        return NextResponse.json(
          { 
            error: 'Search services unavailable. Please check your API configuration.',
            details: {
              serpapi: serpError instanceof Error ? serpError.message : String(serpError),
              custom: customError instanceof Error ? customError.message : String(customError)
            }
          },
          { status: 503 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        query: searchOptions.query,
        results: searchResults,
        count: searchResults.length,
        provider,
        options: searchOptions
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || searchParams.get('query')

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter (q or query) is required' },
      { status: 400 }
    )
  }

  try {
    const options: WebSearchOptions = {
      query,
      limit: Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 20),
      country: searchParams.get('country') || 'us',
      language: searchParams.get('language') || 'en',
      safeSearch: searchParams.get('safe') === 'true',
      timeRange: ['day', 'week', 'month', 'year'].includes(searchParams.get('time') || '') 
        ? searchParams.get('time') as any
        : undefined
    }

    const searcher = createWebSearcher('serpapi')
    const results = await searcher.search(options)

    return NextResponse.json({
      success: true,
      data: {
        query: options.query,
        results,
        count: results.length,
        options
      }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
