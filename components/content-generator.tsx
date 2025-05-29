"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles } from "lucide-react"

interface ContentGeneratorProps {
  onGenerate: (params: any) => void
  isGenerating: boolean
}

export function ContentGenerator({ onGenerate, isGenerating }: ContentGeneratorProps) {
  const [contentType, setContentType] = useState("comparison")
  const [topic, setTopic] = useState("")
  const [modelA, setModelA] = useState("")
  const [modelB, setModelB] = useState("")
  const [tone, setTone] = useState("friendly")
  const [temperature, setTemperature] = useState([0.7])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({
      topic,
      modelA: contentType === "comparison" ? modelA : undefined,
      modelB: contentType === "comparison" ? modelB : undefined,
      tone,
      temperature: temperature[0],
      contentType,
    })
  }

  const presetTopics = [
    "GPT-4o vs Claude 3.5 Sonnet: Which AI Model Reigns Supreme?",
    "Llama 3.1 vs Gemini Pro: Open Source vs Google AI",
    "Best AI Models for Coding in 2025",
    "How to Choose the Right LLM for Your Business",
    "The Future of AI: Trends and Predictions for 2025",
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={contentType} onValueChange={setContentType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
          <TabsTrigger value="technical">Technical Blog</TabsTrigger>
          <TabsTrigger value="general">General Article</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Model Comparison
              </CardTitle>
              <CardDescription>Generate detailed comparisons between AI models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modelA">First Model</Label>
                  <Input
                    id="modelA"
                    placeholder="e.g., GPT-4o"
                    value={modelA}
                    onChange={(e) => setModelA(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="modelB">Second Model</Label>
                  <Input
                    id="modelB"
                    placeholder="e.g., Claude 3.5 Sonnet"
                    value={modelB}
                    onChange={(e) => setModelB(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Blog Article</CardTitle>
              <CardDescription>Create in-depth technical content about AI and LLMs</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Article</CardTitle>
              <CardDescription>Generate comprehensive articles on any AI-related topic</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>

      <div>
        <Label htmlFor="topic">Article Topic / Focus</Label>
        <Textarea
          id="topic"
          placeholder="Describe what you want the article to focus on..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          className="min-h-[100px]"
        />
        <div className="mt-2">
          <Label className="text-sm text-gray-600">Quick presets:</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {presetTopics.map((preset, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTopic(preset)}
                className="text-xs"
              >
                {preset.split(":")[0]}...
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tone">Writing Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly & Conversational</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="journalistic">Journalistic</SelectItem>
              <SelectItem value="technical">Technical & Detailed</SelectItem>
              <SelectItem value="casual">Casual & Approachable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="temperature">Creativity Level: {temperature[0]}</Label>
          <Slider
            id="temperature"
            min={0.1}
            max={1.0}
            step={0.1}
            value={temperature}
            onValueChange={setTemperature}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isGenerating || !topic}>
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Article...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Article
          </>
        )}
      </Button>
    </form>
  )
}
