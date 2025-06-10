import { type NextRequest, NextResponse } from "next/server"
import { createWebScraper, type ScrapeOptions } from "@/lib/web-search"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, urls, options = {} } = body

    // Validate input
    if (!url && !urls) {
      return NextResponse.json(
        { error: 'Either url or urls array is required' },
        { status: 400 }
      )
    }

    if (url && typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL must be a string' },
        { status: 400 }
      )
    }

    if (urls && (!Array.isArray(urls) || urls.some(u => typeof u !== 'string'))) {
      return NextResponse.json(
        { error: 'URLs must be an array of strings' },
        { status: 400 }
      )
    }

    // Validate and sanitize URLs
    const urlsToScrape = urls || [url]
    const validUrls: string[] = []

    for (const targetUrl of urlsToScrape) {
      try {
        const urlObj = new URL(targetUrl)
        if (['http:', 'https:'].includes(urlObj.protocol)) {
          validUrls.push(targetUrl)
        } else {
          console.warn(`Invalid protocol for URL: ${targetUrl}`)
        }
      } catch {
        console.warn(`Invalid URL format: ${targetUrl}`)
      }
    }

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs provided' },
        { status: 400 }
      )
    }

    // Limit URLs for safety
    if (validUrls.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 URLs allowed per request' },
        { status: 400 }
      )
    }

    // Configure scraper options
    const scrapeOptions: ScrapeOptions = {
      timeout: Math.min(parseInt(options.timeout) || 30000, 60000), // Max 60 seconds
      userAgent: options.userAgent || 'Mozilla/5.0 (compatible; ProwriterAI/1.0; +https://prowriter.miniai.online)',
      followRedirects: Boolean(options.followRedirects !== false),
      maxContentLength: Math.min(parseInt(options.maxContentLength) || 1024 * 1024, 5 * 1024 * 1024) // Max 5MB
    }

    const scraper = createWebScraper()

    if (validUrls.length === 1) {
      // Single URL scraping
      try {
        const result = await scraper.scrapeUrl(validUrls[0], scrapeOptions)
        return NextResponse.json({
          success: true,
          data: {
            url: validUrls[0],
            result,
            scrapedAt: new Date().toISOString()
          }
        })
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Scraping failed',
          message: error instanceof Error ? error.message : String(error),
          url: validUrls[0]
        }, { status: 500 })
      }
    } else {
      // Multiple URLs scraping
      const results = await scraper.scrapeMultipleUrls(validUrls, scrapeOptions)
      
    const successfulScrapes: Array<{
      url: string;
      result: any;
    }> = []
    const failedScrapes: Array<{
      url: string;
      error: string;
    }> = []

      results.forEach((result, index) => {
        if (result instanceof Error) {
          failedScrapes.push({
            url: validUrls[index],
            error: result.message
          })
        } else {
          successfulScrapes.push({
            url: validUrls[index],
            result
          })
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          successful: successfulScrapes,
          failed: failedScrapes,
          summary: {
            total: validUrls.length,
            successful: successfulScrapes.length,
            failed: failedScrapes.length
          },
          scrapedAt: new Date().toISOString()
        }
      })
    }

  } catch (error) {
    console.error('Scrape API error:', error)
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
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    )
  }

  try {
    // Validate URL
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are supported' },
        { status: 400 }
      )
    }

    const options: ScrapeOptions = {
      timeout: Math.min(parseInt(searchParams.get('timeout') || '30000'), 60000),
      followRedirects: searchParams.get('followRedirects') !== 'false',
      maxContentLength: Math.min(parseInt(searchParams.get('maxContentLength') || '1048576'), 5242880)
    }

    const scraper = createWebScraper()
    const result = await scraper.scrapeUrl(url, options)

    return NextResponse.json({
      success: true,
      data: {
        url,
        result,
        scrapedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Scrape API error:', error)
    return NextResponse.json(
      { 
        error: 'Scraping failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
