"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings, 
  Copy, 
  Download,
  FileText,
  Sparkles,
  Type,
  Eye,
  Loader2,
  Wand2
} from "lucide-react"

interface CanvasWriterProps {
  content: string
  title?: string
  isGenerating?: boolean
  onContentUpdate?: (content: string) => void
  className?: string
}

export function CanvasWriter({ 
  content, 
  title = "Article Canvas", 
  isGenerating = false,
  onContentUpdate,
  className = ""
}: CanvasWriterProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(50) // milliseconds between characters
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<"canvas" | "preview">("canvas")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Auto-start typing when new content arrives
  useEffect(() => {
    if (content && content !== displayedContent && !isPlaying) {
      startTyping()
    }
  }, [content])

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setIsPlaying(true)
    setIsPaused(false)

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        
        if (nextIndex > content.length) {
          // Typing complete
          setIsPlaying(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          return prevIndex
        }

        const newDisplayedContent = content.slice(0, nextIndex)
        setDisplayedContent(newDisplayedContent)
        
        // Auto-scroll to bottom
        if (canvasRef.current) {
          canvasRef.current.scrollTop = canvasRef.current.scrollHeight
        }

        return nextIndex
      })
    }, typingSpeed)
  }

  const pauseTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPlaying(false)
    setIsPaused(true)
  }

  const stopTyping = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentIndex(0)
    setDisplayedContent("")
  }

  const resetTyping = () => {
    stopTyping()
    setCurrentIndex(0)
    setDisplayedContent("")
  }

  const skipToEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentIndex(content.length)
    setDisplayedContent(content)
  }

  const copyContent = () => {
    navigator.clipboard.writeText(displayedContent || content)
    // You might want to add a toast notification here
  }

  const downloadContent = () => {
    const element = document.createElement("a")
    const file = new Blob([displayedContent || content], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const progress = content ? (currentIndex / content.length) * 100 : 0
  const wordCount = displayedContent.split(/\s+/).filter(word => word.length > 0).length
  const estimatedReadTime = Math.ceil(wordCount / 200)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Canvas Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <Type className="h-6 w-6 mr-3 text-blue-600" />
              {title}
              {isGenerating && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin text-blue-600" />
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={viewMode === "canvas" ? "default" : "outline"}>
                Canvas
              </Badge>
              <Badge variant={viewMode === "preview" ? "default" : "outline"}>
                Preview
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isPlaying && !isPaused ? (
                <Button
                  onClick={startTyping}
                  disabled={!content || isGenerating}
                  className="h-10"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Writing
                </Button>
              ) : isPlaying ? (
                <Button
                  onClick={pauseTyping}
                  variant="outline"
                  className="h-10"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={startTyping}
                  className="h-10"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
              )}
              
              <Button
                onClick={stopTyping}
                variant="outline"
                disabled={!isPlaying && !isPaused}
                className="h-10"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
              
              <Button
                onClick={resetTyping}
                variant="outline"
                disabled={isPlaying}
                className="h-10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <Button
                onClick={skipToEnd}
                variant="outline"
                disabled={!content || currentIndex >= content.length}
                className="h-10"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Skip to End
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={copyContent}
                variant="outline"
                disabled={!displayedContent && !content}
                size="sm"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                onClick={downloadContent}
                variant="outline"
                disabled={!displayedContent && !content}
                size="sm"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setShowSettings(!showSettings)}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          {content && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress: {Math.round(progress)}%</span>
                <span>{currentIndex} / {content.length} characters</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{wordCount}</div>
              <div className="text-xs text-blue-700">Words</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{estimatedReadTime}</div>
              <div className="text-xs text-green-700">Min Read</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {Math.round(typingSpeed)}
              </div>
              <div className="text-xs text-purple-700">Speed (ms)</div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Typing Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Typing Speed: {typingSpeed}ms per character
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={typingSpeed}
                    onChange={(e) => setTypingSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Fast (10ms)</span>
                    <span>Slow (200ms)</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setViewMode(viewMode === "canvas" ? "preview" : "canvas")}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Toggle View
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Canvas Content */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <FileText className="h-5 w-5 mr-2" />
            {viewMode === "canvas" ? "Writing Canvas" : "Article Preview"}
            {isPlaying && (
              <div className="ml-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="ml-2 text-sm text-green-600">Writing...</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "canvas" ? (
            <div
              ref={canvasRef}
              className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg font-mono text-sm leading-relaxed"
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {displayedContent}
              {isPlaying && (
                <span className="animate-pulse text-blue-600">|</span>
              )}
            </div>
          ) : (
            <div
              className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-white border border-gray-200 rounded-lg prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{ __html: displayedContent || content }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}