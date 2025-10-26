"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Loader2, 
  FileText, 
  Calendar, 
  Eye, 
  Download,
  Trash2,
  Copy,
  ExternalLink,
  AlertTriangle,
  RotateCw
} from "lucide-react"
import Link from "next/link"

interface Article {
  $id: string
  id?: string
  userId: string
  title: string
  content: string
  metaDescription?: string
  topic?: string
  modelA?: string
  modelB?: string
  useCase?: string
  articleLength?: string
  aiEngine?: string
  seoKeywords?: string
  targetAudience?: string
  brandVoice?: string
  usedWebSearch?: boolean
  usedSerpAnalysis?: boolean
  wordCount: number
  estimatedReadingTime?: number
  status?: string
  createdAt: string
  updatedAt?: string
  $createdAt?: string
  $updatedAt?: string
}

export default function ArticleHistoryPage() {
  const { user: authUser, isLoaded } = useUser()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      checkUserAndLoadArticles()
    }
  }, [page, isLoaded])

  const checkUserAndLoadArticles = async () => {
    try {
      setError(null) // Clear previous errors
      
      if (!authUser) {
        router.push('/sign-in')
        return
      }
      
      await loadArticles(authUser.id)
    } catch (err) {
      console.error("Error checking user:", err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load articles'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const loadArticles = async (userId: string) => {
    try {
      const response = await fetch(`/api/articles?userId=${userId}&page=${page}&limit=10`).catch(err => {
        console.error('Network error:', err)
        throw new Error('Network error. Please check your connection.')
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setArticles(data.articles || [])
      setTotalPages(data.pagination?.totalPages || 0)
      setError(null) // Clear errors on success
    } catch (err) {
      console.error("Error loading articles:", err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load articles'
      setError(errorMessage)
      // For demo purposes, show empty state instead of crashing
      setArticles([])
    }
  }

  const handleDelete = async (articleId: string) => {
    if (!authUser || !confirm("Are you sure you want to delete this article?")) return
    
    setDeleting(articleId)
    setError(null) // Clear previous errors
    
    try {
      const response = await fetch(`/api/articles?id=${articleId}&userId=${authUser.id}`, {
        method: 'DELETE'
      }).catch(err => {
        console.error('Network error:', err)
        throw new Error('Network error. Please check your connection.')
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Remove from local state
      setArticles(articles.filter(a => (a.$id || a.id) !== articleId))
      alert("Article deleted successfully!")
    } catch (err) {
      console.error("Error deleting article:", err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article'
      setError(errorMessage)
      alert(`Failed to delete article: ${errorMessage}`)
    } finally {
      setDeleting(null)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    alert("Article content copied to clipboard!")
  }

  const downloadArticle = (article: Article) => {
    const element = document.createElement("a")
    const file = new Blob([article.content], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getArticleTypeColor = (useCase?: string) => {
    if (!useCase) return 'bg-gray-100 text-gray-800'
    
    switch (useCase.toLowerCase()) {
      case 'comparison': return 'bg-blue-100 text-blue-800'
      case 'how-to': return 'bg-green-100 text-green-800'
      case 'guide': return 'bg-purple-100 text-purple-800'
      case 'news': return 'bg-orange-100 text-orange-800'
      case 'informative': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getWordCount = (content: string) => {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length
  }

  if (loading) {
    return (
      <div className="page-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-background">
      {/* Header */}
      <div className="border-b glass sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Article History</h1>
                <p className="text-sm text-gray-600">Manage your generated articles</p>
              </div>
            </div>
            <Link href="/blog-writer">
              <Button className="gradient-primary text-white">
                <FileText className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="icon-container-md bg-yellow-100 flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900">Error Loading Articles</h3>
                      <p className="text-sm text-yellow-700 mt-1">{error}</p>
                      <div className="flex gap-3 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setError(null)
                            if (authUser) loadArticles(authUser.id)
                          }}
                          className="border-yellow-300 hover:bg-yellow-100"
                        >
                          <RotateCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setError(null)}
                          className="hover:bg-yellow-100"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {articles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
              <p className="text-gray-600 mb-6">
                Start creating amazing content with our AI Blog Writer
              </p>
              <Link href="/blog-writer">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Your First Article
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6">
              {articles.map((article) => (
                <Card key={article.$id || article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                        <CardDescription className="mb-3">
                          {article.metaDescription || article.topic || 'No description available'}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getArticleTypeColor(article.useCase)}>
                            {article.useCase?.replace('-', ' ') || 'Article'}
                          </Badge>
                          {article.aiEngine && (
                            <Badge variant="outline">
                              {article.aiEngine.toUpperCase()}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {article.wordCount || getWordCount(article.content)} words
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(article.createdAt || article.$createdAt || '')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedArticle(article)
                            setShowPreview(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(article.content)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadArticle(article)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(article.$id || article.id || '')}
                        disabled={deleting === (article.$id || article.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deleting === (article.$id || article.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Article Preview</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
            <div className="border-t p-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(selectedArticle.content)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </Button>
              <Button
                variant="outline"
                onClick={() => downloadArticle(selectedArticle)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
