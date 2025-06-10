"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Globe, 
  FileText, 
  Loader2, 
  ExternalLink, 
  Copy, 
  Download,
  RefreshCw,
  BookOpen,
  BarChart3,
  Clock,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SearchResult {
  title: string
  url: string
  snippet: string
  position: number
  domain: string
}

interface ScrapeResult {
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

interface ResearchResult {
  searchResults: SearchResult[]
  scrapedContent: ScrapeResult[]
  summary: {
    totalSources: number
    averageWordCount: number
    keyTopics: string[]
    timeGenerated: string
  }
}

export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [scrapeResults, setScrapeResults] = useState<ScrapeResult[]>([])
  const [researchData, setResearchData] = useState<ResearchResult | null>(null)
  const [activeTab, setActiveTab] = useState("search")
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit: 10 })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data.results || [])
      
      toast({
        title: "Search Complete",
        description: `Found ${data.results?.length || 0} results`,
      })
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScrape = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to scrape",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        throw new Error('Scraping failed')
      }

      const data = await response.json()
      setScrapeResults([data.result])
      
      toast({
        title: "Scraping Complete",
        description: "Content extracted successfully",
      })
    } catch (error) {
      toast({
        title: "Scraping Error",
        description: "Failed to scrape content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research topic",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query, 
          maxSources: 5,
          includeFullContent: true 
        })
      })

      if (!response.ok) {
        throw new Error('Research failed')
      }

      const data = await response.json()
      setResearchData(data)
      
      toast({
        title: "Research Complete",
        description: `Analyzed ${data.summary?.totalSources || 0} sources`,
      })
    } catch (error) {
      toast({
        title: "Research Error",
        description: "Failed to complete research. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  const downloadResults = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Prowriter Research Tool
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive web research, search, and content scraping platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Web Search
          </TabsTrigger>
          <TabsTrigger value="scrape" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            URL Scraper
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Full Research
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Web Search
              </CardTitle>
              <CardDescription>
                Search across multiple search engines (Google, Bing, DuckDuckGo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your search query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Search
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadResults(searchResults, 'search-results.json')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {searchResults.map((result, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{result.position}</Badge>
                                <span className="text-sm text-muted-foreground">{result.domain}</span>
                              </div>
                              <h4 className="font-semibold text-blue-600 hover:text-blue-800 mb-2">
                                <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                  {result.title}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </h4>
                              <p className="text-sm text-muted-foreground">{result.snippet}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(result.url)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scrape" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                URL Content Scraper
              </CardTitle>
              <CardDescription>
                Extract clean content from any web page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL to scrape..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
                  className="flex-1"
                />
                <Button onClick={handleScrape} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                  Scrape
                </Button>
              </div>

              {scrapeResults.length > 0 && (
                <div className="space-y-4">
                  {scrapeResults.map((result, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{result.title}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              {result.wordCount} words
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadResults(result, 'scraped-content.json')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {result.meta.description && (
                          <CardDescription>{result.meta.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {result.meta.author && (
                            <div>
                              <span className="font-medium">Author:</span>
                              <p className="text-muted-foreground">{result.meta.author}</p>
                            </div>
                          )}
                          {result.meta.publishedDate && (
                            <div>
                              <span className="font-medium">Published:</span>
                              <p className="text-muted-foreground">{result.meta.publishedDate}</p>
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Links:</span>
                            <p className="text-muted-foreground">{result.links.length}</p>
                          </div>
                          <div>
                            <span className="font-medium">Images:</span>
                            <p className="text-muted-foreground">{result.images.length}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-semibold">Content Preview</h4>
                          <div className="bg-muted/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                            <p className="text-sm whitespace-pre-wrap">{result.text.substring(0, 1000)}...</p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => copyToClipboard(result.text)}
                            className="w-full"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Full Content
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Comprehensive Research
              </CardTitle>
              <CardDescription>
                Perform complete research by searching and analyzing multiple sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter research topic..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
                  className="flex-1"
                />
                <Button onClick={handleResearch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
                  Research
                </Button>
              </div>

              {researchData && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Research Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{researchData.summary.totalSources}</div>
                          <div className="text-sm text-muted-foreground">Sources Analyzed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{researchData.summary.averageWordCount}</div>
                          <div className="text-sm text-muted-foreground">Avg Words/Source</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{researchData.searchResults.length}</div>
                          <div className="text-sm text-muted-foreground">Search Results</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{researchData.scrapedContent.length}</div>
                          <div className="text-sm text-muted-foreground">Pages Scraped</div>
                        </div>
                      </div>
                      
                      {researchData.summary.keyTopics.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Key Topics</h4>
                          <div className="flex flex-wrap gap-2">
                            {researchData.summary.keyTopics.map((topic, index) => (
                              <Badge key={index} variant="secondary">{topic}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {researchData.searchResults.slice(0, 5).map((result, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h5 className="font-medium text-sm">{result.title}</h5>
                            <p className="text-xs text-muted-foreground">{result.domain}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Scraped Content</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {researchData.scrapedContent.slice(0, 5).map((content, index) => (
                          <div key={index} className="border-l-4 border-green-500 pl-4">
                            <h5 className="font-medium text-sm">{content.title}</h5>
                            <p className="text-xs text-muted-foreground">{content.wordCount} words</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadResults(researchData, 'research-data.json')}
                      className="flex-1"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Research Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(researchData, null, 2))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
