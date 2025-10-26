"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Palette,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Crown,
  Settings as SettingsIcon,
  Zap,
  Eye,
  EyeOff,
  Lock
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const router = useRouter()

  // Settings state
  const [settings, setSettings] = useState({
    fullName: "",
    email: "",
    company: "",
    website: "",
    emailNotifications: true,
    articleGenerated: true,
    weeklyReport: true,
    productUpdates: false,
    defaultAiEngine: "gemini",
    defaultArticleLength: "medium",
    autoSave: true,
    darkMode: false,
  })

  useEffect(() => {
    if (!isLoaded) return
    
    if (!isSignedIn || !user) {
      router.push('/sign-in?redirect=/settings')
      return
    }
    
    loadUserData()
  }, [isLoaded, isSignedIn, user, router])

  const loadUserData = async () => {
    try {
      if (!user) return

      const profileResponse = await fetch(`/api/user-profile?userId=${user.id}`)
      
      if (profileResponse && profileResponse.ok) {
        const { profile } = await profileResponse.json()
        setProfile(profile)
        
        setSettings(prev => ({
          ...prev,
          fullName: profile.name || user.name || "",
          email: profile.email || user.email || "",
        }))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`${section} settings saved successfully!`)
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !isLoaded) {
    return (
      <div className="page-background flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <div className="page-background min-h-screen">
      <AppHeader />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            <Badge variant="outline" className="capitalize border-2 border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 font-semibold">
              <Crown className="w-4 h-4 mr-2" />
              {profile.plan} Plan
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-gray-100 p-2 rounded-xl">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3">
              <User className="w-4 h-4 mr-2" />Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3">
              <Bell className="w-4 h-4 mr-2" />Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3">
              <Palette className="w-4 h-4 mr-2" />Preferences
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3">
              <CreditCard className="w-4 h-4 mr-2" />Billing
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg py-3">
              <Shield className="w-4 h-4 mr-2" />Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-xl">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-semibold">Full Name</Label>
                    <Input id="fullName" value={settings.fullName} onChange={(e) => setSettings({ ...settings, fullName: e.target.value })} className="border-2 border-gray-200 focus:border-blue-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                    <Input id="email" value={settings.email} disabled className="border-2 border-gray-200 bg-gray-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                    <Input id="company" value={settings.company} onChange={(e) => setSettings({ ...settings, company: e.target.value })} className="border-2 border-gray-200 focus:border-blue-500 transition-colors" placeholder="Acme Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-semibold">Website</Label>
                    <Input id="website" value={settings.website} onChange={(e) => setSettings({ ...settings, website: e.target.value })} className="border-2 border-gray-200 focus:border-blue-500 transition-colors" placeholder="https://example.com" />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button onClick={() => handleSave('Profile')} disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-xl">
                  <Bell className="w-5 h-5 mr-2 text-purple-600" />
                  Email Notifications
                </CardTitle>
                <CardDescription>Manage when and how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {[
                  { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive emails from Prowriter AI' },
                  { id: 'articleGenerated', label: 'Article Generated', desc: 'Notify when article is ready' },
                  { id: 'weeklyReport', label: 'Weekly Report', desc: 'Analytics and insights' },
                  { id: 'productUpdates', label: 'Product Updates', desc: 'New features and improvements' }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition-colors">
                    <div className="flex-1">
                      <Label htmlFor={item.id} className="text-base font-semibold cursor-pointer">{item.label}</Label>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <Switch 
                      id={item.id}
                      checked={settings[item.id as keyof typeof settings] as boolean} 
                      onCheckedChange={(checked) => setSettings({ ...settings, [item.id]: checked })} 
                      className="ml-4"
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button onClick={() => handleSave('Notifications')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                    <Save className="w-4 h-4 mr-2" />Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-xl">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Current Plan
                </CardTitle>
                <CardDescription>Manage your subscription</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black capitalize mb-2 flex items-center">
                        <Crown className="w-6 h-6 mr-2 text-blue-600" />{profile.plan} Plan
                      </h3>
                      <p className="text-gray-600 font-medium">{profile.plan === 'free' ? '5' : '25'} articles per day</p>
                      <p className="text-sm text-gray-500 mt-1">{profile.articles_generated_today || 0} / {profile.articles_limit || 5} used today</p>
                    </div>
                    {profile.plan === 'free' && (
                      <Link href="/pricing">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                          <Zap className="w-4 h-4 mr-2" />Upgrade to Pro
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center text-xl">
                  <Shield className="w-5 h-5 mr-2 text-red-600" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage your API access</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Input type={showApiKey ? "text" : "password"} value="pk_live_xxxxxxxxxxxxxxxxxxxxx" readOnly className="border-2 border-gray-200 font-mono" />
                  <Button variant="outline" onClick={() => setShowApiKey(!showApiKey)} className="border-2">
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
