/**
 * AI Image Fetcher for Blog Posts
 * Integrates with Unsplash and Pexels APIs to fetch relevant images
 */

export interface ImageResult {
  url: string
  downloadUrl: string
  thumbnailUrl: string
  alt: string
  photographer: string
  photographerUrl: string
  source: 'unsplash' | 'pexels'
  width: number
  height: number
  averageColor?: string
}

export interface ImageFetchOptions {
  query: string
  count?: number
  orientation?: 'landscape' | 'portrait' | 'squarish'
  size?: 'small' | 'medium' | 'large'
  color?: string
}

class ImageFetcher {
  private unsplashAccessKey: string
  private pexelsApiKey: string

  constructor() {
    this.unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || ''
    this.pexelsApiKey = process.env.PEXELS_API_KEY || ''
  }

  /**
   * Fetch images from Unsplash API
   */
  private async fetchFromUnsplash(options: ImageFetchOptions): Promise<ImageResult[]> {
    if (!this.unsplashAccessKey) {
      console.warn('Unsplash API key not configured')
      return []
    }

    try {
      const params = new URLSearchParams({
        query: options.query,
        per_page: String(options.count || 3),
        orientation: options.orientation || 'landscape'
      })

      if (options.color) {
        params.append('color', options.color)
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?${params}`,
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`,
            'Accept-Version': 'v1'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`)
      }

      const data = await response.json()

      return data.results.map((photo: any) => ({
        url: photo.urls.regular,
        downloadUrl: photo.links.download,
        thumbnailUrl: photo.urls.thumb,
        alt: photo.alt_description || photo.description || options.query,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        source: 'unsplash' as const,
        width: photo.width,
        height: photo.height,
        averageColor: photo.color
      }))
    } catch (error) {
      console.error('Unsplash fetch error:', error)
      return []
    }
  }

  /**
   * Fetch images from Pexels API
   */
  private async fetchFromPexels(options: ImageFetchOptions): Promise<ImageResult[]> {
    if (!this.pexelsApiKey) {
      console.warn('Pexels API key not configured')
      return []
    }

    try {
      const params = new URLSearchParams({
        query: options.query,
        per_page: String(options.count || 3),
        orientation: options.orientation || 'landscape'
      })

      if (options.color) {
        params.append('color', options.color)
      }

      const response = await fetch(
        `https://api.pexels.com/v1/search?${params}`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.statusText}`)
      }

      const data = await response.json()

      const sizeMap: { [key: string]: string } = {
        small: 'medium',
        medium: 'large',
        large: 'large2x'
      }
      const sizeKey = sizeMap[options.size || 'medium']

      return data.photos.map((photo: any) => ({
        url: photo.src[sizeKey] || photo.src.large,
        downloadUrl: photo.src.original,
        thumbnailUrl: photo.src.tiny,
        alt: photo.alt || options.query,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: 'pexels' as const,
        width: photo.width,
        height: photo.height,
        averageColor: photo.avg_color
      }))
    } catch (error) {
      console.error('Pexels fetch error:', error)
      return []
    }
  }

  /**
   * Fetch images from both sources and combine results
   */
  async fetchImages(options: ImageFetchOptions): Promise<ImageResult[]> {
    const count = options.count || 3
    const halfCount = Math.ceil(count / 2)

    // Fetch from both sources in parallel
    const [unsplashResults, pexelsResults] = await Promise.all([
      this.fetchFromUnsplash({ ...options, count: halfCount }),
      this.fetchFromPexels({ ...options, count: count - halfCount })
    ])

    // Combine and shuffle results
    const allResults = [...unsplashResults, ...pexelsResults]
    return this.shuffleArray(allResults).slice(0, count)
  }

  /**
   * Extract relevant keywords from article content
   */
  extractKeywords(content: string, topic: string): string[] {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, ' ')
    
    // Extract common nouns and important words (simple approach)
    const words = plainText
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 4)
      .filter(word => !this.isCommonWord(word))

    // Count word frequency
    const wordFreq = new Map<string, number>()
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    })

    // Sort by frequency and get top keywords
    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    // Always include the main topic
    return [topic, ...sortedWords].slice(0, 5)
  }

  /**
   * Generate image queries from article sections
   */
  generateImageQueries(content: string, topic: string, count: number = 3): string[] {
    // Extract headings
    const h2Matches = content.match(/<h2[^>]*>(.*?)<\/h2>/gi) || []
    const headings = h2Matches
      .map(h => h.replace(/<[^>]*>/g, ''))
      .filter(h => h.length > 5)
      .slice(0, count)

    const keywords = this.extractKeywords(content, topic)

    const queries: string[] = []

    // Add topic as primary query
    queries.push(topic)

    // Add queries based on headings
    headings.forEach(heading => {
      queries.push(heading.substring(0, 50)) // Limit query length
    })

    // Add queries based on keywords
    keywords.forEach(keyword => {
      if (queries.length < count) {
        queries.push(keyword)
      }
    })

    // Deduplicate and return
    return Array.from(new Set(queries)).slice(0, count)
  }

  /**
   * Fetch images for an entire article
   */
  async fetchImagesForArticle(
    content: string,
    topic: string,
    options: { 
      imagesPerSection?: number
      orientation?: 'landscape' | 'portrait' | 'squarish'
    } = {}
  ): Promise<ImageResult[]> {
    const imagesPerSection = options.imagesPerSection || 1
    const queries = this.generateImageQueries(content, topic, 5)

    const imagePromises = queries.map(query =>
      this.fetchImages({
        query,
        count: imagesPerSection,
        orientation: options.orientation || 'landscape'
      })
    )

    const results = await Promise.all(imagePromises)
    return results.flat()
  }

  /**
   * Insert images into article HTML at strategic positions
   */
  insertImagesIntoArticle(content: string, images: ImageResult[]): string {
    if (images.length === 0) return content

    let imageIndex = 0
    let modifiedContent = content

    // Insert featured image after H1
    const h1Match = modifiedContent.match(/<h1[^>]*>.*?<\/h1>/i)
    if (h1Match && images[imageIndex]) {
      const featuredImage = this.generateImageHTML(images[imageIndex], true)
      modifiedContent = modifiedContent.replace(
        h1Match[0],
        `${h1Match[0]}\n\n${featuredImage}`
      )
      imageIndex++
    }

    // Insert images after every 2-3 H2 sections
    const h2Matches = modifiedContent.match(/<h2[^>]*>.*?<\/h2>/gi) || []
    h2Matches.forEach((h2, index) => {
      if (index % 2 === 0 && index > 0 && imageIndex < images.length) {
        const image = images[imageIndex]
        const imageHTML = this.generateImageHTML(image, false)
        
        modifiedContent = modifiedContent.replace(
          h2,
          `${imageHTML}\n\n${h2}`
        )
        imageIndex++
      }
    })

    return modifiedContent
  }

  /**
   * Generate HTML for image with proper attribution
   */
  private generateImageHTML(image: ImageResult, isFeatured: boolean = false): string {
    const figureClass = isFeatured ? 'featured-image' : 'article-image'
    
    return `<figure class="${figureClass}" style="margin: 32px 0; text-align: center;">
  <img 
    src="${image.url}" 
    alt="${image.alt}"
    style="width: 100%; max-width: ${isFeatured ? '1200px' : '800px'}; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
    loading="lazy"
  />
  <figcaption style="margin-top: 12px; font-size: 14px; color: #666; font-style: italic;">
    Photo by <a href="${image.photographerUrl}" target="_blank" rel="noopener noreferrer" style="color: #007cba; text-decoration: none;">${image.photographer}</a> on <a href="${image.source === 'unsplash' ? 'https://unsplash.com' : 'https://pexels.com'}" target="_blank" rel="noopener noreferrer" style="color: #007cba; text-decoration: none;">${image.source === 'unsplash' ? 'Unsplash' : 'Pexels'}</a>
  </figcaption>
</figure>`
  }

  /**
   * Utility: Check if word is common/stop word
   */
  private isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'that', 'this', 'with', 'from', 'have', 'been', 'were', 'their',
      'there', 'what', 'which', 'when', 'where', 'about', 'would', 'could',
      'should', 'these', 'those', 'article', 'content', 'blog', 'post'
    ])
    return commonWords.has(word)
  }

  /**
   * Utility: Shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Get fallback placeholder image
   */
  getFallbackImage(topic: string): ImageResult {
    return {
      url: `https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=${encodeURIComponent(topic)}`,
      downloadUrl: '',
      thumbnailUrl: `https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=${encodeURIComponent(topic)}`,
      alt: topic,
      photographer: 'Placeholder',
      photographerUrl: '#',
      source: 'unsplash',
      width: 1200,
      height: 630
    }
  }
}

// Export singleton instance
export const imageFetcher = new ImageFetcher()

// Export helper functions
export async function getImagesForArticle(
  content: string,
  topic: string,
  options: {
    count?: number
    includeInContent?: boolean
    orientation?: 'landscape' | 'portrait' | 'squarish'
  } = {}
): Promise<{ images: ImageResult[], contentWithImages?: string }> {
  const images = await imageFetcher.fetchImagesForArticle(
    content,
    topic,
    { imagesPerSection: 1, orientation: options.orientation }
  )

  // If no images found, use fallback
  const finalImages = images.length > 0 
    ? images.slice(0, options.count || 3)
    : [imageFetcher.getFallbackImage(topic)]

  if (options.includeInContent) {
    const contentWithImages = imageFetcher.insertImagesIntoArticle(content, finalImages)
    return { images: finalImages, contentWithImages }
  }

  return { images: finalImages }
}

export async function getFeaturedImage(topic: string): Promise<ImageResult> {
  const images = await imageFetcher.fetchImages({
    query: topic,
    count: 1,
    orientation: 'landscape'
  })

  return images[0] || imageFetcher.getFallbackImage(topic)
}
