// Web Search and Scraping Library for Kutumbhcraft
// Supports Google Search, SERP API, and web content extraction

import axios from 'axios'
import * as cheerio from 'cheerio'
import { parse } from 'node-html-parser'

export interface SearchResult {
  title: string
  url: string
  snippet: string
  position: number
  domain: string
}

export interface ScrapeResult {
  title: string
  content: string
  text: string
  meta: {
    description?: string
    keywords?: string
    author?: string
    publishedDate?: string
  }
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  links: string[]
  images: string[]
  wordCount: number
}

export interface WebSearchOptions {
  query: string
  limit?: number
  country?: string
  language?: string
  safeSearch?: boolean
  timeRange?: 'day' | 'week' | 'month' | 'year'
}

export interface ScrapeOptions {
  timeout?: number
  userAgent?: string
  followRedirects?: boolean
  maxContentLength?: number
}

// Google Search API using SerpAPI
export class GoogleSearchAPI {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.SERPAPI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('SERPAPI_API_KEY not found. Google Search functionality will be limited.')
    }
  }

  async search(options: WebSearchOptions): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error('SerpAPI key is required for Google Search. Please set SERPAPI_API_KEY environment variable.')
    }

    try {
      const params = new URLSearchParams({
        q: options.query,
        engine: 'google',
        api_key: this.apiKey,
        num: String(options.limit || 10),
        gl: options.country || 'us',
        hl: options.language || 'en',
        safe: options.safeSearch ? 'active' : 'off'
      })

      if (options.timeRange) {
        const timeMap = {
          day: 'd',
          week: 'w', 
          month: 'm',
          year: 'y'
        }
        params.append('tbs', `qdr:${timeMap[options.timeRange]}`)
      }

      const response = await axios.get(`https://serpapi.com/search.json?${params.toString()}`, {
        timeout: 10000
      })

      const results = response.data.organic_results || []
      
      return results.map((result: any, index: number): SearchResult => ({
        title: result.title || '',
        url: result.link || '',
        snippet: result.snippet || '',
        position: result.position || index + 1,
        domain: this.extractDomain(result.link || '')
      }))

    } catch (error) {
      console.error('Google Search API error:', error)
      throw new Error(`Search failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  }
}

// Custom Google Search API (alternative)
export class CustomGoogleSearch {
  private apiKey: string
  private searchEngineId: string

  constructor() {
    this.apiKey = process.env.GOOGLE_SEARCH_API_KEY || ''
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || ''
  }

  async search(options: WebSearchOptions): Promise<SearchResult[]> {
    if (!this.apiKey || !this.searchEngineId) {
      throw new Error('Google Custom Search requires GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID')
    }

    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        cx: this.searchEngineId,
        q: options.query,
        num: String(Math.min(options.limit || 10, 10)), // Max 10 for free tier
        gl: options.country || 'us',
        hl: options.language || 'en',
        safe: options.safeSearch ? 'active' : 'off'
      })

      const response = await axios.get(`https://www.googleapis.com/customsearch/v1?${params.toString()}`, {
        timeout: 10000
      })

      const results = response.data.items || []
      
      return results.map((result: any, index: number): SearchResult => ({
        title: result.title || '',
        url: result.link || '',
        snippet: result.snippet || '',
        position: index + 1,
        domain: this.extractDomain(result.link || '')
      }))

    } catch (error) {
      console.error('Custom Google Search error:', error)
      throw new Error(`Search failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return ''
    }
  }
}

// Web Content Scraper
export class WebScraper {
  private defaultOptions: ScrapeOptions = {
    timeout: 30000,
    userAgent: 'Mozilla/5.0 (compatible; Kutumbhcraft/1.0; +https://prowriter.miniai.online)',
    followRedirects: true,
    maxContentLength: 1024 * 1024 // 1MB
  }

  async scrapeUrl(url: string, options: ScrapeOptions = {}): Promise<ScrapeResult> {
    const opts = { ...this.defaultOptions, ...options }

    try {
      // Validate URL
      const urlObj = new URL(url)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS URLs are supported')
      }

      const response = await axios.get(url, {
        timeout: opts.timeout,
        headers: {
          'User-Agent': opts.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        },
        maxContentLength: opts.maxContentLength,
        maxRedirects: opts.followRedirects ? 5 : 0
      })

      return this.parseContent(response.data, url)

    } catch (error) {
      console.error(`Error scraping ${url}:`, error)
      throw new Error(`Failed to scrape content: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async scrapeMultipleUrls(urls: string[], options: ScrapeOptions = {}): Promise<(ScrapeResult | Error)[]> {
    const promises = urls.map(async url => {
      try {
        return await this.scrapeUrl(url, options)
      } catch (error) {
        return error instanceof Error ? error : new Error(String(error))
      }
    })

    return Promise.all(promises)
  }

  private parseContent(html: string, url: string): ScrapeResult {
    const $ = cheerio.load(html)
    const root = parse(html)

    // Remove script and style elements
    $('script, style, nav, footer, aside, .ad, .advertisement, .social-share').remove()

    // Extract metadata
    const meta = {
      description: $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      author: $('meta[name="author"]').attr('content') || 
             $('meta[property="article:author"]').attr('content') || '',
      publishedDate: $('meta[property="article:published_time"]').attr('content') ||
                    $('meta[name="publish-date"]').attr('content') || ''
    }

    // Extract title
    const title = $('title').text().trim() || 
                 $('h1').first().text().trim() || 
                 $('meta[property="og:title"]').attr('content') || 
                 'Untitled'

    // Extract headings
    const headings = {
      h1: $('h1').map((_, el) => $(el).text().trim()).get(),
      h2: $('h2').map((_, el) => $(el).text().trim()).get(),
      h3: $('h3').map((_, el) => $(el).text().trim()).get()
    }

    // Extract main content
    let content = ''
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.main-content',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      'main'
    ]

    for (const selector of contentSelectors) {
      const element = $(selector).first()
      if (element.length && element.text().trim().length > 200) {
        content = element.html() || ''
        break
      }
    }

    // Fallback to body if no content found
    if (!content) {
      content = $('body').html() || html
    }

    // Extract plain text
    const text = this.extractPlainText(content)

    // Extract links
    const links = $('a[href]').map((_, el) => {
      const href = $(el).attr('href')
      return href ? this.resolveUrl(href, url) : ''
    }).get().filter(Boolean)

    // Extract images
    const images = $('img[src]').map((_, el) => {
      const src = $(el).attr('src')
      return src ? this.resolveUrl(src, url) : ''
    }).get().filter(Boolean)

    return {
      title,
      content,
      text,
      meta,
      headings,
      links: [...new Set(links)], // Remove duplicates
      images: [...new Set(images)], // Remove duplicates
      wordCount: text.split(/\s+/).filter(word => word.length > 0).length
    }
  }

  private extractPlainText(html: string): string {
    const $ = cheerio.load(html)
    
    // Remove unwanted elements
    $('script, style, nav, footer, aside, .ad, .advertisement, .social-share').remove()
    
    // Get text content
    return $('body').text()
      .replace(/\s+/g, ' ')
      .trim()
  }

  private resolveUrl(href: string, baseUrl: string): string {
    try {
      return new URL(href, baseUrl).href
    } catch {
      return href
    }
  }
}

// Web Research Utility
export class WebResearcher {
  private googleSearch: GoogleSearchAPI
  private customSearch: CustomGoogleSearch
  private scraper: WebScraper

  constructor() {
    this.googleSearch = new GoogleSearchAPI()
    this.customSearch = new CustomGoogleSearch()
    this.scraper = new WebScraper()
  }

  async researchTopic(topic: string, options: {
    maxResults?: number
    maxScrapes?: number
    includeContent?: boolean
    searchOptions?: Partial<WebSearchOptions>
  } = {}): Promise<{
    searchResults: SearchResult[]
    scrapedContent: ScrapeResult[]
    summary: {
      totalResults: number
      totalWordCount: number
      uniqueDomains: string[]
      keyTopics: string[]
    }
  }> {
    const {
      maxResults = 10,
      maxScrapes = 5,
      includeContent = true,
      searchOptions = {}
    } = options

    try {
      // Perform search
      const searchQuery = {
        query: topic,
        limit: maxResults,
        ...searchOptions
      }

      let searchResults: SearchResult[] = []
      
      try {
        // Try SerpAPI first
        searchResults = await this.googleSearch.search(searchQuery)
      } catch (serpError) {
        console.warn('SerpAPI failed, trying Custom Search:', serpError)
        try {
          // Fallback to Custom Google Search
          searchResults = await this.customSearch.search(searchQuery)
        } catch (customError) {
          console.warn('Custom Search also failed:', customError)
          throw new Error('All search methods failed. Please check your API keys.')
        }
      }

      let scrapedContent: ScrapeResult[] = []
      
      if (includeContent && searchResults.length > 0) {
        // Scrape top results
        const urlsToScrape = searchResults
          .slice(0, Math.min(maxScrapes, searchResults.length))
          .map(result => result.url)

        const scrapeResults = await this.scraper.scrapeMultipleUrls(urlsToScrape)
        scrapedContent = scrapeResults.filter(result => !(result instanceof Error)) as ScrapeResult[]
      }

      // Generate summary
      const uniqueDomains = [...new Set(searchResults.map(r => r.domain))]
      const totalWordCount = scrapedContent.reduce((sum, content) => sum + content.wordCount, 0)
      
      // Extract key topics from headings and content
      const keyTopics = this.extractKeyTopics(scrapedContent)

      return {
        searchResults,
        scrapedContent,
        summary: {
          totalResults: searchResults.length,
          totalWordCount,
          uniqueDomains,
          keyTopics
        }
      }

    } catch (error) {
      console.error('Research error:', error)
      throw new Error(`Research failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private extractKeyTopics(content: ScrapeResult[]): string[] {
    const topics = new Set<string>()
    
    content.forEach(item => {
      // Extract from headings
      [...item.headings.h1, ...item.headings.h2, ...item.headings.h3]
        .forEach(heading => {
          const words = heading.toLowerCase().split(/\s+/).filter(word => word.length > 3)
          words.forEach(word => topics.add(word))
        })
      
      // Extract from keywords meta
      if (item.meta.keywords) {
        item.meta.keywords.split(',').forEach(keyword => {
          const trimmed = keyword.trim().toLowerCase()
          if (trimmed.length > 3) topics.add(trimmed)
        })
      }
    })

    return Array.from(topics).slice(0, 20) // Top 20 topics
  }
}

// Factory functions
export function createWebSearcher(type: 'serpapi' | 'custom' = 'serpapi') {
  return type === 'serpapi' ? new GoogleSearchAPI() : new CustomGoogleSearch()
}

export function createWebScraper(options?: ScrapeOptions) {
  return new WebScraper()
}

export function createWebResearcher() {
  return new WebResearcher()
}
