"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/auth-context"
import Link from "next/link"
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
  Crown,
  Code,
  Palette,
  Workflow,
  MousePointer2
} from "lucide-react"

export default function Home() {
  const { user, isSignedIn } = useUser()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transition-all duration-1000"
          style={{ 
            left: mousePosition.x - 192, 
            top: mousePosition.y - 192,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      {/* Navigation */}
      <nav className="border-b bg-white/70 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                    Prowriter AI
                  </span>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/blog-writer" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative group">
                AI Writer
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/articles" className="text-gray-700 hover:text-purple-600 transition-colors font-medium relative group">
                Articles
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/analytics" className="text-gray-700 hover:text-pink-600 transition-colors font-medium relative group">
                Analytics
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-green-600 transition-colors font-medium relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Zap className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Rocket className="w-4 h-4 mr-2" />
                      Get Started Free
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
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Floating Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200/50 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Next-Gen AI Content Creation Platform</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            
            {/* Main Heading with Gradient */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block text-gray-900 mb-2">Create Content That</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Captivates & Converts
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your ideas into professional articles in minutes with our{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                advanced AI technology
              </span>
              . Generate high-quality blog posts, marketing copy, and more.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/blog-writer">
                <Button 
                  size="lg" 
                  className="px-12 py-7 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Rocket className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Start Creating Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link href="/articles">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-12 py-7 text-lg border-2 border-gray-300 hover:border-purple-400 hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 group"
                >
                  <MousePointer2 className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View Examples
                  <Globe className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { number: "10K+", label: "Articles Generated", delay: "0ms" },
                { number: "50+", label: "AI Models", delay: "100ms" },
                { number: "99.9%", label: "Uptime", delay: "200ms" },
                { number: "< 2min", label: "Avg. Generation", delay: "300ms" }
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer group"
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white/50 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 border-purple-200 text-purple-700 bg-purple-50 px-4 py-1">
              <Palette className="w-3 h-3 mr-1" />
              Platform Features
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Everything you need to
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                dominate content creation
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful AI technology combined with intuitive design to help you create content that ranks and converts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Advanced AI Engine",
                badge: "GPT-4 & Gemini",
                color: "from-blue-500 to-cyan-500",
                desc: "Powered by multiple state-of-the-art AI models including GPT-4, Gemini, and Claude for unmatched content quality."
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                badge: "Live Data",
                color: "from-purple-500 to-pink-500",
                desc: "Track performance, engagement, and ROI with comprehensive analytics dashboard and insights."
              },
              {
                icon: Target,
                title: "SEO Optimization",
                badge: "95+ Score",
                color: "from-green-500 to-emerald-500",
                desc: "Built-in SEO tools, keyword research, and optimization ensuring your content ranks on page one."
              },
              {
                icon: Clock,
                title: "Lightning Fast",
                badge: "< 2 minutes",
                color: "from-orange-500 to-red-500",
                desc: "Generate comprehensive 3,000+ word articles in under 2 minutes. Save hours of research and writing."
              },
              {
                icon: Layers,
                title: "Multiple Formats",
                badge: "Export Anywhere",
                color: "from-pink-500 to-rose-500",
                desc: "Export to HTML, Markdown, PDF, or directly publish to your CMS. Perfect for any platform."
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                badge: "SOC 2",
                color: "from-indigo-500 to-purple-500",
                desc: "Bank-level encryption, team collaboration, API access, and priority support for scaling teams."
              }
            ].map((feature, idx) => (
              <Card 
                key={idx}
                className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden bg-white/80 backdrop-blur-sm hover:scale-105 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="pb-4 relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <Badge variant="secondary" className={`bg-gradient-to-r ${feature.color} text-white border-0`}>
                      {feature.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  Professional AI-powered content creation platform for marketers, bloggers, and agencies. 
                  Create high-quality articles in minutes.
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
                  <li><Link href="/blog-writer" className="text-gray-400 hover:text-white transition-colors">AI Writer</Link></li>
                  <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors">Articles</Link></li>
                  <li><Link href="/analytics" className="text-gray-400 hover:text-white transition-colors">Analytics</Link></li>
                  <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>
              
              {/* Resources Links */}
              <div>
                <h4 className="font-semibold text-white mb-6">Resources</h4>
                <ul className="space-y-3">
                  <li><Link href="/articles" className="text-gray-400 hover:text-white transition-colors">Examples</Link></li>
                  <li><Link href="/settings" className="text-gray-400 hover:text-white transition-colors">Settings</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
                </ul>
              </div>
              
              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-white mb-6">Company</h4>
                <ul className="space-y-3">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
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
