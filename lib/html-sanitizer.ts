/**
 * HTML Sanitizer for AI-Generated Content
 * Removes markdown artifacts and ensures clean HTML output ready for publishing
 */

export class HTMLSanitizer {
  /**
   * Main sanitization function - removes all markdown and ensures clean HTML
   */
  static sanitize(content: string): string {
    if (!content || typeof content !== 'string') {
      return ''
    }

    let sanitized = content

    // Step 1: Remove markdown bold (**text**)
    sanitized = sanitized.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Step 2: Remove markdown italic (*text* or _text_)
    sanitized = sanitized.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    sanitized = sanitized.replace(/_([^_]+)_/g, '<em>$1</em>')
    
    // Step 3: Remove markdown headings (# ## ### etc)
    sanitized = sanitized.replace(/^#{1,6}\s+(.+)$/gm, '$1')
    
    // Step 4: Remove markdown list markers (- or * at start of line)
    sanitized = sanitized.replace(/^[\*\-]\s+/gm, '')
    
    // Step 5: Remove markdown numbered lists (1. 2. 3. etc)
    sanitized = sanitized.replace(/^\d+\.\s+/gm, '')
    
    // Step 6: Remove orphaned asterisks and underscores
    sanitized = sanitized.replace(/\s\*\s/g, ' ')
    sanitized = sanitized.replace(/\s_\s/g, ' ')
    
    // Step 7: Clean up code blocks (```language or ```)
    sanitized = sanitized.replace(/```[\w]*\n/g, '<pre><code>')
    sanitized = sanitized.replace(/```/g, '</code></pre>')
    
    // Step 8: Convert markdown links [text](url) to HTML
    sanitized = sanitized.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Step 9: Ensure proper spacing around headings
    sanitized = sanitized.replace(/(<\/h[1-6]>)/g, '$1\n\n')
    sanitized = sanitized.replace(/(<h[1-6][^>]*>)/g, '\n\n$1')
    
    // Step 10: Ensure proper spacing around paragraphs
    sanitized = sanitized.replace(/(<\/p>)(<p>)/g, '$1\n\n$2')
    sanitized = sanitized.replace(/(<\/p>)(<h[1-6])/g, '$1\n\n$2')
    sanitized = sanitized.replace(/(<\/h[1-6]>)(<p>)/g, '$1\n\n$2')
    
    // Step 11: Clean up multiple consecutive line breaks
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n')
    
    // Step 12: Fix table styling (add if missing)
    sanitized = sanitized.replace(
      /<table(?![^>]*style=)/g,
      '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb;"'
    )
    
    // Step 13: Fix table headers (th styling)
    sanitized = sanitized.replace(
      /<th(?![^>]*style=)/g,
      '<th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; background-color: #f8f9fa; font-weight: 600;"'
    )
    
    // Step 14: Fix table cells (td styling)
    sanitized = sanitized.replace(
      /<td(?![^>]*style=)/g,
      '<td style="border: 1px solid #dee2e6; padding: 12px;"'
    )
    
    // Step 15: Enhance blockquotes (add if missing style)
    sanitized = sanitized.replace(
      /<blockquote(?![^>]*style=)/g,
      '<blockquote style="border-left: 4px solid #3b82f6; padding: 16px 20px; margin: 20px 0; background-color: #f8fafc; font-style: italic; color: #334155;"'
    )
    
    // Step 16: Add proper div styling for content blocks
    sanitized = sanitized.replace(
      /<div style="[^"]*background-color[^"]*">/g,
      (match) => {
        if (!match.includes('margin:')) {
          return match.replace('background-color:', 'margin: 24px 0; background-color:')
        }
        return match
      }
    )
    
    // Step 17: Ensure lists have proper structure
    sanitized = sanitized.replace(/<ul>\s+/g, '<ul>\n  ')
    sanitized = sanitized.replace(/<ol>\s+/g, '<ol>\n  ')
    sanitized = sanitized.replace(/<\/li>\s+<li>/g, '</li>\n  <li>')
    sanitized = sanitized.replace(/\s+<\/ul>/g, '\n</ul>')
    sanitized = sanitized.replace(/\s+<\/ol>/g, '\n</ol>')
    
    // Step 18: Add proper line breaks in lists
    sanitized = sanitized.replace(/(<li[^>]*>)/g, '\n  $1')
    sanitized = sanitized.replace(/(<\/li>)/g, '$1\n')
    
    // Step 19: Clean up pre/code blocks
    sanitized = sanitized.replace(/<pre>\s+/g, '<pre>\n')
    sanitized = sanitized.replace(/\s+<\/pre>/g, '\n</pre>')
    sanitized = sanitized.replace(/<code>\s+/g, '<code>')
    sanitized = sanitized.replace(/\s+<\/code>/g, '</code>')
    
    // Step 20: Add code block styling if missing
    sanitized = sanitized.replace(
      /<pre(?![^>]*style=)/g,
      '<pre style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; overflow-x: auto; border: 1px solid #e5e7eb; margin: 20px 0;"'
    )
    
    // Step 21: Fix spacing around images
    sanitized = sanitized.replace(/(<img[^>]*>)/g, '\n\n$1\n\n')
    
    // Step 22: Remove empty paragraphs
    sanitized = sanitized.replace(/<p>\s*<\/p>/g, '')
    
    // Step 23: Remove empty headings
    sanitized = sanitized.replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/g, '')
    
    // Step 24: Trim whitespace at start/end
    sanitized = sanitized.trim()
    
    // Step 25: Final cleanup - normalize whitespace
    sanitized = sanitized.replace(/[ \t]+/g, ' ')
    sanitized = sanitized.replace(/\n\s+\n/g, '\n\n')
    
    return sanitized
  }

  /**
   * Extract clean text from HTML (for word count, etc.)
   */
  static extractText(html: string): string {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  /**
   * Get word count from HTML content
   */
  static getWordCount(html: string): number {
    const text = this.extractText(html)
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Get estimated reading time (250 words per minute)
   */
  static getReadingTime(html: string): number {
    const wordCount = this.getWordCount(html)
    return Math.max(1, Math.ceil(wordCount / 250))
  }

  /**
   * Extract meta description from HTML or generate one
   */
  static extractMetaDescription(html: string): string {
    // Look for HTML comment with meta description
    const commentMatch = html.match(/<!--\s*Meta Description:\s*([^-]+)-->/i)
    if (commentMatch) {
      return commentMatch[1].trim()
    }

    // Extract first paragraph
    const paragraphMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
    if (paragraphMatch) {
      const text = this.extractText(paragraphMatch[1])
      if (text.length > 50) {
        return text.substring(0, 157) + '...'
      }
    }

    return ''
  }

  /**
   * Extract title from HTML
   */
  static extractTitle(html: string): string {
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    if (h1Match) {
      return this.extractText(h1Match[1])
    }
    return ''
  }

  /**
   * Add proper spacing for readability
   */
  static formatForDisplay(html: string): string {
    let formatted = this.sanitize(html)
    
    // Add extra spacing after major sections
    formatted = formatted.replace(/(<\/h2>)/g, '$1\n')
    formatted = formatted.replace(/(<\/h3>)/g, '$1\n')
    
    // Ensure paragraphs have breathing room
    formatted = formatted.replace(/(<p>)/g, '\n$1')
    formatted = formatted.replace(/(<\/p>)/g, '$1\n')
    
    return formatted
  }

  /**
   * Validate HTML structure
   */
  static isValidHTML(html: string): boolean {
    try {
      // Basic validation - check for matching tags
      const openTags = html.match(/<([a-z]+)(\s|>)/gi) || []
      const closeTags = html.match(/<\/([a-z]+)>/gi) || []
      
      // Self-closing tags don't need closing
      const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link']
      
      const openTagNames = openTags
        .map(tag => tag.match(/<([a-z]+)/i)?.[1])
        .filter((tag): tag is string => tag !== undefined && !selfClosing.includes(tag.toLowerCase()))
      
      const closeTagNames = closeTags
        .map(tag => tag.match(/<\/([a-z]+)/i)?.[1])
        .filter((tag): tag is string => tag !== undefined)
      
      // Check if counts match
      return openTagNames.length === closeTagNames.length
    } catch {
      return false
    }
  }

  /**
   * Remove all HTML tags (for plain text export)
   */
  static stripHTML(html: string): string {
    let text = html
    
    // Convert line breaks
    text = text.replace(/<br\s*\/?>/gi, '\n')
    text = text.replace(/<\/p>/gi, '\n\n')
    text = text.replace(/<\/h[1-6]>/gi, '\n\n')
    text = text.replace(/<\/li>/gi, '\n')
    text = text.replace(/<\/div>/gi, '\n')
    
    // Remove all tags
    text = text.replace(/<[^>]+>/g, '')
    
    // Clean up spacing
    text = text.replace(/\n{3,}/g, '\n\n')
    text = text.replace(/[ \t]+/g, ' ')
    
    return text.trim()
  }

  /**
   * Convert HTML to markdown (basic conversion)
   */
  static toMarkdown(html: string): string {
    let markdown = html
    
    // Convert headings
    markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    
    // Convert formatting
    markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    
    // Convert links
    markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    
    // Convert lists
    markdown = markdown.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    markdown = markdown.replace(/<\/?ul[^>]*>/gi, '\n')
    markdown = markdown.replace(/<\/?ol[^>]*>/gi, '\n')
    
    // Convert paragraphs
    markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    
    // Convert blockquotes
    markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    
    // Remove remaining HTML
    markdown = markdown.replace(/<[^>]+>/g, '')
    
    // Clean up
    markdown = markdown.replace(/\n{3,}/g, '\n\n')
    
    return markdown.trim()
  }
}

// Export convenience functions with proper binding to maintain 'this' context
export const sanitizeHTML = (html: string) => HTMLSanitizer.sanitize(html)
export const extractText = (html: string) => HTMLSanitizer.extractText(html)
export const getWordCount = (html: string) => HTMLSanitizer.getWordCount(html)
export const getReadingTime = (html: string) => HTMLSanitizer.getReadingTime(html)
export const extractMetaDescription = (html: string) => HTMLSanitizer.extractMetaDescription(html)
export const extractTitle = (html: string) => HTMLSanitizer.extractTitle(html)
export const formatForDisplay = (html: string) => HTMLSanitizer.formatForDisplay(html)
export const isValidHTML = (html: string) => HTMLSanitizer.isValidHTML(html)
export const stripHTML = (html: string) => HTMLSanitizer.stripHTML(html)
export const toMarkdown = (html: string) => HTMLSanitizer.toMarkdown(html)
