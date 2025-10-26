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
                  prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:leading-tight
                  prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:pb-3 prose-h2:leading-snug
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-snug
                  prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6
                  prose-p:mb-6 prose-p:leading-relaxed prose-p:text-gray-700 prose-p:text-lg
                  prose-strong:font-semibold prose-strong:text-gray-900
                  prose-a:text-blue-600 prose-a:no-underline prose-a:hover:underline prose-a:font-medium
                  prose-table:w-full prose-table:border-collapse prose-table:my-8 prose-table:shadow-sm
                  prose-th:border prose-th:border-gray-300 prose-th:bg-gradient-to-b prose-th:from-gray-50 prose-th:to-gray-100 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-800
                  prose-td:border prose-td:border-gray-300 prose-td:p-4 prose-td:text-gray-700
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:rounded-r prose-blockquote:text-gray-700
                  prose-ul:my-6 prose-ol:my-6 prose-ul:space-y-2 prose-ol:space-y-2
                  prose-li:mb-2 prose-li:text-gray-700 prose-li:leading-relaxed
                  prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
                  prose-hr:my-12 prose-hr:border-t-2 prose-hr:border-gray-200
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                  p-8 lg:p-12
                  bg-white
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
