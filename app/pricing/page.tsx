"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Crown, ArrowLeft, Zap, Star } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="page-background">
      {/* Header */}
      <header className="glass border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold">Pricing</h1>
            </div>
            <Link href="/auth">
              <Button className="gradient-primary text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="border-2 relative">
            <CardHeader className="text-center">
              <Badge variant="secondary" className="w-fit mx-auto mb-4">
                Perfect for Testing
              </Badge>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <CardDescription>Forever free to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>5 articles per day</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>All AI models (Qwen, LLaMA, etc.)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>SEO-optimized content</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Article storage & download</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Basic templates</span>
                </li>
              </ul>
              <Link href="/auth" className="w-full block">
                <Button className="w-full" variant="outline">
                  Start Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-blue-200 relative scale-105 shadow-lg">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-blue-600 text-white px-4 py-1">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pt-8">
              <Badge variant="default" className="w-fit mx-auto mb-4 bg-blue-600">
                Best Value
              </Badge>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                $4<span className="text-lg text-gray-600">/month</span>
              </div>
              <CardDescription>For serious content creators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span><strong>25 articles per day</strong> (5x more)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority AI access (faster generation)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced article templates</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Email support (24h response)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Article analytics & insights</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Bulk export & API access</span>
                </li>
              </ul>
              <Link href="/auth" className="w-full block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border-2 relative">
            <CardHeader className="text-center">
              <Badge variant="outline" className="w-fit mx-auto mb-4">
                Coming Soon
              </Badge>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <div className="text-4xl font-bold text-gray-900 mb-2">Custom</div>
              <CardDescription>For teams and agencies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited articles</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>White-label solution</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Custom AI models</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority support & training</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" disabled>
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Features</th>
                  <th className="text-center py-4 px-4">Free</th>
                  <th className="text-center py-4 px-4 bg-blue-50 rounded-t-lg">Pro</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Articles per day</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4 bg-blue-50">25</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">AI Models</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4 bg-blue-50">✅</td>
                  <td className="text-center py-4 px-4">✅ + Custom</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">SEO Optimization</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4 bg-blue-50">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Priority Generation</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-blue-50">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Advanced Templates</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-blue-50">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Email Support</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-blue-50">24h</td>
                  <td className="text-center py-4 px-4">Priority</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Team Features</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4 bg-blue-50">❌</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What AI models do you support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We support Qwen 2.5, LLaMA 3.1, DeepSeek V2.5, Gemini Pro, and more. Different models excel at different use cases.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial for Pro?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The free plan is essentially a permanent trial. You can test our quality before upgrading to Pro for more articles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does billing work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pro plans are billed monthly. No setup fees, no contracts. Cancel anytime with one click.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of content creators using Prowriter AI
          </p>
          <Link href="/auth">
            <Button size="lg" className="px-8 py-6 text-lg">
              <Zap className="w-5 h-5 mr-2" />
              Start Creating Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
