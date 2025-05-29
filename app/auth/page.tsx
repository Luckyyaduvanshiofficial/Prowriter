"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Mail, Chrome, ArrowLeft, Brain, Shield, Zap, Star, Sparkles, Crown, CheckCircle, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error
      setMessage("Check your email for the confirmation link!")
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/10 to-blue-600/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/5 to-purple-600/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Features showcase */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-center min-h-[40vh] lg:min-h-screen relative overflow-hidden">
          {/* Background pattern for better visual depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          
          <div className="max-w-md mx-auto lg:mx-0 relative z-10">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center mr-3 shadow-2xl border border-white/20">
                <Brain className="w-7 h-7 text-white drop-shadow-lg" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">RankLLMs</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-center lg:text-left">
              <span className="text-white drop-shadow-lg">Generate Expert-Level</span>
              <span className="block text-yellow-300 drop-shadow-lg bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 bg-clip-text text-transparent font-extrabold">
                AI Comparison Articles
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-100 mb-8 text-center lg:text-left leading-relaxed drop-shadow-md font-medium">
              Join 2,500+ content creators using our platform to generate professional AI model comparison articles in minutes.
            </p>

            {/* Feature list */}
            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-center lg:justify-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-green-500/90 flex items-center justify-center mr-4 shadow-md">
                  <Shield className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <span className="text-white font-bold text-lg drop-shadow-md">Expert-grade content quality</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-yellow-500/90 flex items-center justify-center mr-4 shadow-md">
                  <Zap className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <span className="text-white font-bold text-lg drop-shadow-md">Generate 1500+ word articles in 2 minutes</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-orange-500/90 flex items-center justify-center mr-4 shadow-md">
                  <Star className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <span className="text-white font-bold text-lg drop-shadow-md">85+ AI models supported</span>
              </div>
            </div>

            {/* Social proof card */}
            <div className="p-6 bg-white/25 backdrop-blur-lg rounded-2xl border border-white/40 shadow-2xl hover:bg-white/30 transition-all duration-300">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="flex mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                  ))}
                </div>
                <span className="text-base font-bold text-white drop-shadow-md">4.9/5 rating</span>
              </div>
              <p className="text-base text-white mb-4 text-center lg:text-left font-medium drop-shadow-md leading-relaxed">
                "RankLLMs helped me create 50+ comparison articles for my AI blog. The quality is incredible!"
              </p>
              <p className="text-sm text-yellow-200 text-center lg:text-left font-bold drop-shadow-md">— Sarah Chen, AI Content Creator</p>
            </div>

            {/* Stats */}
            <div className="hidden lg:flex items-center justify-between mt-8 pt-6 border-t border-white/30">
              <div className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="text-3xl font-bold text-white drop-shadow-lg">2,500+</div>
                <div className="text-sm text-yellow-200 font-semibold drop-shadow-md">Creators</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="text-3xl font-bold text-white drop-shadow-lg">15K+</div>
                <div className="text-sm text-yellow-200 font-semibold drop-shadow-md">Articles</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="text-3xl font-bold text-white drop-shadow-lg">4.9★</div>
                <div className="text-sm text-yellow-200 font-semibold drop-shadow-md">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
          <div className="w-full max-w-md">
            {/* Back to home link */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex items-center text-gray-800 hover:text-blue-700 transition-colors font-semibold group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-700 text-lg">
                Start generating expert AI comparison content
              </p>
            </div>

            {/* Auth card */}
            <Card className="shadow-xl border border-gray-200/75 bg-white rounded-2xl">
              <CardHeader className="pb-6 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Get Started</CardTitle> {/* Increased size */}
                <CardDescription className="text-gray-600 mt-1"> {/* Added margin top */}
                  Create your account or sign in to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-200 p-1 rounded-lg">
                    <TabsTrigger 
                      value="signin" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 font-semibold transition-all text-gray-700"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-700 font-semibold transition-all text-gray-700"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-6 mt-6">
                    {/* Google Sign In */}
                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full h-12 bg-gray-50 hover:bg-gray-100 border-2 border-gray-400 hover:border-blue-500 transition-all duration-200 font-semibold text-gray-900 hover:text-blue-700 shadow-md"
                      type="button"
                    >
                      <Chrome className="w-5 h-5 mr-3 text-blue-600" />
                      Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-white px-4 text-gray-700 font-semibold tracking-wide">Or continue with email</span>
                      </div>
                    </div>

                    {/* Email Sign In Form */}
                    <form onSubmit={handleEmailSignIn} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-base font-semibold text-gray-800"> {/* text-base */}
                          Email Address
                        </Label>
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com" /* More specific placeholder */
                          required
                          className="h-12 border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 text-gray-900 bg-white rounded-lg font-medium placeholder-gray-500" /* Darker placeholder */
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-base font-semibold text-gray-800"> {/* text-base */}
                          Password
                        </Label>
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="h-12 border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 text-gray-900 bg-white rounded-lg font-medium placeholder-gray-500" /* Darker placeholder */
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-white shadow-lg" 
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Signing In...' : 'Sign In to Dashboard'}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-6 mt-6">
                    {/* Google Sign Up */}
                    <Button
                      onClick={handleGoogleSignIn}
                      variant="outline"
                      className="w-full h-12 bg-gray-50 hover:bg-gray-100 border-2 border-gray-400 hover:border-blue-500 transition-all duration-200 font-semibold text-gray-900 hover:text-blue-700 shadow-md"
                      type="button"
                    >
                      <Chrome className="w-5 h-5 mr-3 text-blue-600" />
                      Continue with Google
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-white px-4 text-gray-700 font-semibold tracking-wide">Or create account with email</span>
                      </div>
                    </div>

                    {/* Email Sign Up Form */}
                    <form onSubmit={handleEmailSignUp} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-base font-semibold text-gray-800"> {/* text-base */}
                          Email Address
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com" /* More specific placeholder */
                          required
                          className="h-12 border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 text-gray-900 bg-white rounded-lg font-medium placeholder-gray-500" /* Darker placeholder */
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-base font-semibold text-gray-800"> {/* text-base */}
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password (8+ characters)"
                          required
                          className="h-12 border-2 border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all duration-200 text-gray-900 bg-white rounded-lg font-medium placeholder-gray-500" /* Darker placeholder */
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-white shadow-lg" 
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Creating Account...' : 'Create Free Account'}
                      </Button>
                    </form>

                    {/* Free plan benefits */}
                    <div className="bg-gradient-to-r from-green-100 via-teal-50 to-blue-100 border-2 border-green-300/80 rounded-xl p-5">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-gray-900 mb-2.5">Free Plan Includes:</h4> {/* text-base, more margin */}
                          <ul className="text-sm text-gray-800 space-y-2 font-semibold"> {/* font-semibold, more spacing */}
                            <li className="flex items-center">
                              <Sparkles className="w-4 h-4 mr-2.5 text-green-600" /> {/* Larger icon, more margin */}
                              5 articles per day
                            </li>
                            <li className="flex items-center">
                              <Star className="w-4 h-4 mr-2.5 text-blue-600" /> {/* Larger icon, more margin */}
                              All AI models & comparison types
                            </li>
                            <li className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2.5 text-purple-600" /> {/* Larger icon, more margin */}
                              Export to HTML/Markdown
                            </li>
                            <li className="flex items-center">
                              <Shield className="w-4 h-4 mr-2.5 text-orange-600" /> {/* Larger icon, more margin */}
                              No credit card required
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-700 text-center leading-relaxed">
                      By creating an account, you agree to our{" "}
                      <a href="#" className="text-blue-700 hover:underline font-semibold">Terms of Service</a> and{" "}
                      <a href="#" className="text-blue-700 hover:underline font-semibold">Privacy Policy</a>.
                    </p>
                  </TabsContent>
                </Tabs>

                {/* Message Display */}
                {message && (
                  <div className={`p-4 rounded-xl text-sm border-2 transition-all duration-200 font-semibold ${
                    message.includes('Check your email') 
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-900 border-green-400'
                      : 'bg-gradient-to-r from-red-100 to-orange-100 text-red-900 border-red-400'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{message}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom info */}
            <div className="text-center mt-8">
              <div className="inline-flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm bg-white rounded-2xl px-6 py-5 border border-gray-300 shadow-lg"> {/* More padding */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center mr-3 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">5 free articles daily</span>
                </div>
                <div className="hidden sm:block w-px h-5 bg-gray-400"></div> {/* Taller divider */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mr-3 shadow-sm">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Pro: $4/month</span>
                </div>
              </div>
            </div>

            {/* Mobile stats */}
            <div className="lg:hidden flex items-center justify-around space-x-4 mt-8 pt-6 border-t border-gray-300 text-center">
              <div>
                <div className="text-xl font-bold text-gray-900">2,500+</div>
                <div className="text-xs text-gray-800 font-semibold">Creators</div> {/* font-semibold */}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">15K+</div>
                <div className="text-xs text-gray-800 font-semibold">Articles</div> {/* font-semibold */}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">4.9★</div>
                <div className="text-xs text-gray-800 font-semibold">Rating</div> {/* font-semibold */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
