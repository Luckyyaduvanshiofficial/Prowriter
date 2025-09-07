"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  SignedIn, 
  SignedOut,
  useUser 
} from "@clerk/nextjs"
import { 
  CheckCircle, 
  Zap, 
  Trophy, 
  Target, 
  ArrowRight, 
  Star, 
  Users, 
  TrendingUp, 
  Shield,
  Sparkles,
  Globe,
  BarChart3,
  Clock,
  Layers,
  Brain,
  Rocket,
  Crown
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { user, isSignedIn } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Prowriter AI</span>
              </div>
              <Badge variant="outline" className="hidden sm:block border-blue-200 text-blue-700">
                Beta
              </Badge>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                Analytics
              </Link>
              <Link href="/blog-writer" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                AI Writer
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Docs
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-24">
          <div className="text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 px-6 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>New: Baseten AI Integration - High-Performance Content Generation</span>
              <ArrowRight className="w-3 h-3" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 mb-8 leading-tight animate-slide-up">
              AI Content Creation
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Powered by Baseten
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              Create professional content with our advanced Baseten AI integration. 
              Generate high-quality articles, blog posts, and marketing copy that engages and converts.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
              <Link href="/blog-writer">
                <Button 
                  size="lg" 
                  className="px-10 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-premium group"
                >
                  Start Writing with AI 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 text-lg border-2 hover:bg-gray-50"
              >
                <span className="flex items-center">
                  View Live Examples
                  <Globe className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gray-900 mb-1">3,500+</div>
                <div className="text-gray-600 text-sm">Articles Generated</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gray-900 mb-1">120B</div>
                <div className="text-gray-600 text-sm">AI Parameters</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gray-900 mb-1">99.9%</div>
                <div className="text-gray-600 text-sm">Uptime Score</div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-4xl font-bold text-gray-900 mb-1">2min</div>
                <div className="text-gray-600 text-sm">Average Generation Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to create
              <br />
              <span className="text-blue-600">winning AI content</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with data-driven insights 
              to help you create content that ranks and converts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Baseten AI Integration</CardTitle>
                <Badge variant="secondary" className="w-fit mt-2">High Performance</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Powered by Baseten's GPT OSS 120B model for lightning-fast content generation. Advanced AI capabilities with enterprise-grade reliability and performance.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Advanced Analytics Engine</CardTitle>
                <Badge variant="secondary" className="w-fit mt-2">New</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive content performance tracking, competitive intelligence, and ROI analysis. Track traffic, rankings, and revenue impact in real-time.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Intelligent SEO Optimization</CardTitle>
                <Badge variant="secondary" className="w-fit mt-2">AI-Powered</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Advanced SEO engine with automated keyword research, competitor analysis, and content optimization. Achieve 95+ SEO scores consistently.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Generate comprehensive 3,000+ word articles in under 2 minutes. No more hours of research and writing.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Multiple Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Export to HTML, Markdown, or PDF. Perfect for blogs, documentation, reports, and publishing platforms.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-0 shadow-premium hover:shadow-premium-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Enterprise Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Team collaboration, API access, white-label options, and priority support for scaling content operations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              From idea to published article
              <br />
              <span className="text-blue-600">in under 3 minutes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures you get high-quality content 
              without the complexity of traditional content creation tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Configure</h3>
              <p className="text-gray-600 leading-relaxed">
                Select two AI models to compare, choose your target use case 
                (Coding, Chat, Reasoning, Writing), and set your preferred article length.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Generate</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI engines analyze performance data and create comprehensive 
                comparisons with benchmarks, real examples, and expert insights.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-premium group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Publish</h3>
              <p className="text-gray-600 leading-relaxed">
                Export to HTML, Markdown, or PDF. Copy-paste to your CMS, 
                or publish directly to your blog. SEO-optimized and ready to rank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">
              Trusted by Creators
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Content creators choose Prowriter AI
              <br />
              <span className="text-blue-600">over generic AI tools</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-gray-600">Tech Blogger</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "I was spending 4-5 hours researching and writing AI comparison articles. 
                Now I generate them in 10 minutes with better accuracy than I could achieve manually."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="border-0 shadow-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Marcus Rodriguez</div>
                  <div className="text-sm text-gray-600">Content Marketer</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "The SEO optimization is incredible. My Prowriter AI articles consistently 
                outrank content from bigger publications. It's like having an expert writer on my team."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="border-0 shadow-premium p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold">Alex Thompson</div>
                  <div className="text-sm text-gray-600">Agency Owner</div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                "We've scaled our content production 10x while maintaining quality. 
                Prowriter AI specializes in AI comparisons better than any general tool."
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 border-blue-200 text-blue-700">
              Pricing Plans
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose your perfect plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free and scale as you grow. No hidden fees, no contracts, cancel anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 shadow-premium hover:shadow-premium-lg transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-gray-600" />
                </div>
                <CardTitle className="text-2xl mb-2">Starter</CardTitle>
                <div className="text-5xl font-bold text-gray-900 mb-2">Free</div>
                <CardDescription className="text-lg">Perfect for trying out the platform</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700"><strong>5 articles</strong> per day</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Access to <strong>all AI models</strong></span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Built-in <strong>SEO optimization</strong></span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Secure <strong>article storage</strong></span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Export to <strong>HTML/Markdown</strong></span>
                  </li>
                </ul>
                <Link href="/sign-up" className="w-full block">
                  <Button size="lg" variant="outline" className="w-full border-2">
                    Start Free Today
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="border-2 border-blue-300 shadow-premium-lg hover:shadow-premium-lg transition-all duration-300 relative bg-gradient-to-br from-white to-blue-50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Professional</CardTitle>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  $4<span className="text-xl text-gray-600">/month</span>
                </div>
                <CardDescription className="text-lg">For serious content creators and agencies</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700"><strong>25 articles</strong> per day</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Priority AI access</strong> (faster generation)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Advanced templates</strong> & customization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700"><strong>PDF export</strong> & branding options</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Priority email support</strong></span>
                  </li>
                </ul>
                <Link href="/sign-up" className="w-full block">
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Looking for enterprise solutions? <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">Contact our sales team</Link>
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Cancel anytime
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                30-day money back
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                No setup fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        
        <div className="relative">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">Prowriter AI</span>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                  The only platform you need for creating expert-level AI model comparison content. 
                  Trusted by content creators, marketers, and agencies worldwide.
                </p>
                <div className="flex space-x-4">
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Globe className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Users className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
              
              {/* Product Links */}
              <div>
                <h4 className="font-semibold text-white mb-6">Product</h4>
                <ul className="space-y-3">
                  <li><Link href="/generate" className="text-gray-400 hover:text-white transition-colors">AI Generator</Link></li>
                  <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Examples</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Templates</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</Link></li>
                </ul>
              </div>
              
              {/* Resources Links */}
              <div>
                <h4 className="font-semibold text-white mb-6">Resources</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">AI Model Guide</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Best Practices</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</Link></li>
                </ul>
              </div>
              
              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-white mb-6">Company</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                  &copy; 2025 Prowriter AI. All rights reserved.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <span className="text-gray-400 text-sm flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    SOC 2 Compliant
                  </span>
                  <span className="text-gray-400 text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-1" />
                    99.9% Uptime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
