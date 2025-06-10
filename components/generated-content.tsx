"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Eye, Code } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface GeneratedContentProps {
  article: {
    content: string
    metadata: {
      topic: string
      modelA?: string
      modelB?: string
      tone: string
      temperature: number
      contentType: string
      generatedAt: string
    }
  }
}

export function GeneratedContent({ article }: GeneratedContentProps) {
  const [activeTab, setActiveTab] = useState("preview")

  // Function to sanitize and enhance content display
  const sanitizeContent = (content: string): string => {
    let sanitized = content
    
    // Remove AI-style star symbols and artifacts
    sanitized = sanitized.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>
    sanitized = sanitized.replace(/\*([^*]+)\*/g, '<em>$1</em>') // Convert *text* to <em>
    sanitized = sanitized.replace(/^\*\s*/gm, '') // Remove bullet point stars at line start
    sanitized = sanitized.replace(/\s\*\s/g, ' ') // Remove orphaned stars
    
    // Remove markdown-style headings if any leaked through
    sanitized = sanitized.replace(/^#{1,6}\s+/gm, '') // Remove ### heading markers
    
    // Improve spacing around headings
    sanitized = sanitized.replace(/(<\/h[1-6]>)/g, '$1\n')
    sanitized = sanitized.replace(/(<h[1-6][^>]*>)/g, '\n$1')
    
    // Ensure proper spacing around paragraphs
    sanitized = sanitized.replace(/(<\/p>)(<p>)/g, '$1\n$2')
    
    // Clean up multiple consecutive line breaks
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n')
    
    // Ensure tables have proper styling if not already present
    sanitized = sanitized.replace(
      /<table(?![^>]*style=)/g, 
      '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb;"'
    )
    
    // Enhance blockquotes if not already styled
    sanitized = sanitized.replace(
      /<blockquote(?![^>]*style=)/g,
      '<blockquote style="border-left: 4px solid #3b82f6; padding: 16px; margin: 20px 0; background-color: #f8fafc; font-style: italic;"'
    )
    
    // Add proper spacing around divs with background
    sanitized = sanitized.replace(
      /<div style="[^"]*background-color[^"]*">/g,
      (match) => match.replace('margin: 20px 0;', 'margin: 24px 0;')
    )
    
    return sanitized.trim()
  }

  // Function to extract summary or key points from content
  const extractSummary = (content: string): string | null => {
    const sanitized = sanitizeContent(content)
    
    // Look for summary sections (using compatible regex flags)
    const summaryMatch = sanitized.match(/<h[2-4][^>]*>.*?summary.*?<\/h[2-4]>([\s\S]*?)(?=<h[1-4]|$)/i)
    if (summaryMatch) {
      return summaryMatch[1].trim()
    }
    
    // Look for key points or takeaways
    const keyPointsMatch = sanitized.match(/<h[2-4][^>]*>.*?(key points|takeaways|highlights).*?<\/h[2-4]>([\s\S]*?)(?=<h[1-4]|$)/i)
    if (keyPointsMatch) {
      return keyPointsMatch[1].trim()
    }
    
    // Extract first paragraph as fallback
    const firstParagraph = sanitized.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
    if (firstParagraph && firstParagraph[1].length > 100) {
      return firstParagraph[1].trim()
    }
    
    return null
  }

  const summary = extractSummary(article.content)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getWordCount = (text: string) => {
    // Remove HTML tags for accurate word count
    const plainText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return plainText.split(/\s+/).filter((word) => word.length > 0).length
  }

  return (
    <div className="space-y-6">
      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Generated Article</CardTitle>
              <CardDescription>Created on {formatDate(article.metadata.generatedAt)}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(sanitizeContent(article.content))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadAsFile(sanitizeContent(article.content), "article.html")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{article.metadata.contentType}</Badge>
            <Badge variant="outline">Tone: {article.metadata.tone}</Badge>
            <Badge variant="outline">Temperature: {article.metadata.temperature}</Badge>
            <Badge variant="outline">~{getWordCount(article.content)} words</Badge>
          </div>

          {article.metadata.modelA && article.metadata.modelB && (
            <div className="text-sm text-gray-600">
              <strong>Comparison:</strong> {article.metadata.modelA} vs {article.metadata.modelB}
            </div>
          )}

          <div className="text-sm text-gray-600 mt-2">
            <strong>Topic:</strong> {article.metadata.topic}
          </div>

          {summary && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-gray-900 mb-2">Content Summary</h4>
              <div 
                className="text-sm text-gray-700 prose prose-sm"
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            HTML Source
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-0">
              <div 
                className="
                  prose prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
                  prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4
                  prose-p:mb-4 prose-p:leading-relaxed
                  prose-strong:font-semibold prose-strong:text-gray-900
                  prose-table:w-full prose-table:border-collapse prose-table:my-6
                  prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                  prose-td:border prose-td:border-gray-300 prose-td:p-3
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6
                  prose-ul:my-4 prose-ol:my-4
                  prose-li:mb-2
                  p-8
                "
                dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content) }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HTML Source Code
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(sanitizeContent(article.content))}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm border">
                <code className="language-html">{sanitizeContent(article.content)}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
