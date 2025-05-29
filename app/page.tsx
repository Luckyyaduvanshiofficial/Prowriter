"use client"

import { useState } from "react"
import { ContentGenerator } from "@/components/content-generator"
import { GeneratedContent } from "@/components/generated-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GeneratedArticle {
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

export default function Home() {
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (params: any) => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedArticle(data)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Content Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate high-quality, SEO-optimized blog articles with AI. Perfect for content marketing, technical blogs,
            and comparison articles.
          </p>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generator">Content Generator</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedArticle}>
              Generated Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle>Generate Your Article</CardTitle>
                <CardDescription>
                  Configure your content parameters and generate professional blog articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentGenerator onGenerate={handleGenerate} isGenerating={isGenerating} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            {generatedArticle && <GeneratedContent article={generatedArticle} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
