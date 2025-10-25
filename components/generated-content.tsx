"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Eye, Code } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { sanitizeHTML, getWordCount, getReadingTime, extractMetaDescription } from "@/lib/html-sanitizer"

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

  // Use the robust HTML sanitizer
  const sanitizeContent = (content: string): string => {
    return sanitizeHTML(content)
  }

  // Extract summary using meta description
  const summary = extractMetaDescription(sanitizeContent(article.content))

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

  // Use sanitizer functions for accurate counts
  const wordCount = getWordCount(article.content)
  const readingTime = getReadingTime(article.content)

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
            <Badge variant="outline">~{wordCount} words</Badge>
            <Badge variant="outline">{readingTime} min read</Badge>
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
