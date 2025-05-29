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
    return text.split(/\s+/).filter((word) => word.length > 0).length
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
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(article.content)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadAsFile(article.content, "article.html")}>
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
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                HTML Source Code
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(article.content)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{article.content}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
