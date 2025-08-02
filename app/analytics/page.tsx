"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target, 
  BarChart3, 
  Lightbulb, 
  Trophy,
  Zap,
  Brain,
  Search,
  Users,
  Star,
  ArrowUp,
  ArrowDown,
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingDown
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Mock data for the advanced analytics dashboard
const mockAnalytics = {
  key_metrics: {
    total_articles: 47,
    time_saved: '188 hours',
    cost_savings: '$23,500',
    traffic_generated: '125,000',
    roi_percentage: '340%',
    productivity_multiplier: '8.5x'
  },
  performance_trends: {
    articles_per_day: [2, 3, 1, 4, 2, 5, 3, 4, 2, 6, 4, 5, 3, 7, 4, 6, 5, 8, 6, 7, 5, 9, 7, 8, 6, 10, 8, 9, 7, 11],
    seo_scores: [78, 82, 85, 88, 91, 87, 89, 92, 94, 90, 93, 95, 89, 91, 94, 96, 92, 94, 97, 95, 93, 96, 98, 94, 96, 99, 97, 95, 98, 100],
    traffic_estimates: [1200, 1500, 1800, 2200, 2500, 2800, 3200, 3500, 3800, 4200, 4500, 4800, 5200, 5500, 5800, 6200, 6500, 6800, 7200, 7500, 7800, 8200, 8500, 8800, 9200, 9500, 9800, 10200, 10500, 10800]
  },
  top_opportunities: [
    {
      type: 'content_update',
      title: 'Optimize "GPT-4 vs Claude 3.5 Sonnet" for Better SEO',
      description: 'High-traffic article with SEO improvement potential',
      potential_impact: { traffic_increase: 35, ranking_improvement: 15, conversion_uplift: 20 },
      priority_score: 95
    },
    {
      type: 'new_content',
      title: 'Create Multi-Modal AI Comparison Series',
      description: 'Trending topic with high search volume and low competition',
      potential_impact: { traffic_increase: 50, ranking_improvement: 25, conversion_uplift: 15 },
      priority_score: 89
    },
    {
      type: 'seo_improvement',
      title: 'Implement Schema Markup for Top Articles',
      description: 'Technical SEO improvement for better search visibility',
      potential_impact: { traffic_increase: 25, ranking_improvement: 30, conversion_uplift: 10 },
      priority_score: 82
    }
  ],
  trending_topics: [
    {
      topic: 'AI Model Safety and Alignment',
      trend_score: 94,
      search_volume: 25000,
      content_opportunity: 88,
      estimated_traffic_potential: 15000
    },
    {
      topic: 'Multimodal AI Capabilities',
      trend_score: 89,
      search_volume: 18000,
      content_opportunity: 92,
      estimated_traffic_potential: 12000
    },
    {
      topic: 'AI Model Efficiency and Optimization',
      trend_score: 85,
      search_volume: 14000,
      content_opportunity: 79,
      estimated_traffic_potential: 9500
    }
  ],
  content_performance: [
    {
      title: 'GPT-4 vs Claude 3.5 Sonnet: Complete Coding Comparison',
      seo_score: 92,
      traffic: 3500,
      grade: 'A+',
      growth: 23
    },
    {
      title: 'LLaMA 3.1 405B vs Qwen 2.5 72B: Reasoning Analysis',
      seo_score: 89,
      traffic: 2800,
      grade: 'A',
      growth: 18
    },
    {
      title: 'Gemini Pro 1.5 vs DeepSeek V2.5: Performance Benchmarks',
      seo_score: 94,
      traffic: 4200,
      grade: 'A+',
      growth: 31
    }
  ]
}

const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdvancedAnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const keyMetricsData = [
    {
      title: 'Total Articles Created',
      value: mockAnalytics.key_metrics.total_articles,
      icon: <Brain className="w-5 h-5" />,
      change: '+12%',
      positive: true
    },
    {
      title: 'Time Saved',
      value: mockAnalytics.key_metrics.time_saved,
      icon: <Clock className="w-5 h-5" />,
      change: '+8.5x',
      positive: true
    },
    {
      title: 'Cost Savings',
      value: mockAnalytics.key_metrics.cost_savings,
      icon: <DollarSign className="w-5 h-5" />,
      change: '+245%',
      positive: true
    },
    {
      title: 'Traffic Generated',
      value: mockAnalytics.key_metrics.traffic_generated,
      icon: <TrendingUp className="w-5 h-5" />,
      change: '+67%',
      positive: true
    },
    {
      title: 'ROI Percentage',
      value: mockAnalytics.key_metrics.roi_percentage,
      icon: <Target className="w-5 h-5" />,
      change: '+89%',
      positive: true
    },
    {
      title: 'Productivity Multiplier',
      value: mockAnalytics.key_metrics.productivity_multiplier,
      icon: <Zap className="w-5 h-5" />,
      change: '+15%',
      positive: true
    }
  ];

  const trafficData = mockAnalytics.performance_trends.traffic_estimates.map((value, index) => ({
    day: index + 1,
    traffic: value,
    seo_score: mockAnalytics.performance_trends.seo_scores[index],
    articles: mockAnalytics.performance_trends.articles_per_day[index]
  }));

  const modelUsageData = [
    { name: 'GPT-4', value: 35, color: '#3b82f6' },
    { name: 'Claude 3.5', value: 28, color: '#10b981' },
    { name: 'LLaMA 3.1', value: 22, color: '#f59e0b' },
    { name: 'Gemini Pro', value: 15, color: '#ef4444' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your AI content performance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={() => setSelectedTimeRange('7d')}>
              7 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTimeRange('30d')}>
              30 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedTimeRange('90d')}>
              90 Days
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyMetricsData.map((metric, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  {metric.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center space-x-2">
                  {metric.positive ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic & SEO Performance */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Traffic & SEO Performance</span>
                  </CardTitle>
                  <CardDescription>
                    Combined view of traffic growth and SEO score improvements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="traffic" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="seo_score" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Model Usage Distribution */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>AI Model Usage Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Which models you're using most frequently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={modelUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {modelUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Content Performance Table */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Top Performing Content</span>
                </CardTitle>
                <CardDescription>
                  Your highest-performing articles with key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.content_performance.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Search className="w-3 h-3" />
                            <span>SEO: {article.seo_score}</span>
                          </Badge>
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{article.traffic} visitors</span>
                          </Badge>
                          <Badge 
                            variant={article.grade === 'A+' ? 'default' : 'secondary'}
                            className="flex items-center space-x-1"
                          >
                            <Star className="w-3 h-3" />
                            <span>Grade: {article.grade}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ArrowUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">+{article.growth}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Opportunities */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>Top Growth Opportunities</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations to maximize your content impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnalytics.top_opportunities.map((opportunity, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                            <div className="flex items-center space-x-4 mt-3">
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3 text-blue-600" />
                                <span className="text-xs">+{opportunity.potential_impact.traffic_increase}% traffic</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="w-3 h-3 text-green-600" />
                                <span className="text-xs">+{opportunity.potential_impact.ranking_improvement}% ranking</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            Score: {opportunity.priority_score}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ROI Projections */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>ROI Projections</span>
                  </CardTitle>
                  <CardDescription>
                    Estimated returns from implementing recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Traffic Growth Potential</span>
                        <span className="text-sm text-gray-600">+45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Revenue Impact</span>
                        <span className="text-sm text-gray-600">+$12,500</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Cost Savings</span>
                        <span className="text-sm text-gray-600">+$8,200</span>
                      </div>
                      <Progress value={55} className="h-2" />
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+$20,700</div>
                        <div className="text-sm text-gray-600">Total Projected Value</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Trending Topics & Opportunities</span>
                </CardTitle>
                <CardDescription>
                  AI-detected trending topics with high content opportunity scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {mockAnalytics.trending_topics.map((trend, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{trend.topic}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Trend Score</span>
                          <span className="text-sm font-medium">{trend.trend_score}/100</span>
                        </div>
                        <Progress value={trend.trend_score} className="h-2" />
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Search Volume</span>
                          <span className="text-sm font-medium">{trend.search_volume.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Opportunity</span>
                          <span className="text-sm font-medium">{trend.content_opportunity}/100</span>
                        </div>
                        <div className="pt-2">
                          <Badge variant="outline" className="w-full justify-center">
                            Est. {trend.estimated_traffic_potential.toLocaleString()} monthly visits
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competitive Tab */}
          <TabsContent value="competitive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Competitive Advantages</span>
                  </CardTitle>
                  <CardDescription>
                    How your content outperforms the competition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Real-time benchmark data integration</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Multi-dimensional performance analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Cost-effectiveness calculations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Industry-specific recommendations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Expert insights and analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Market Gaps</span>
                  </CardTitle>
                  <CardDescription>
                    Untapped opportunities in your market
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">AI Model Security Benchmarks</h4>
                      <p className="text-sm text-gray-600 mt-1">15K monthly searches, 25% content availability</p>
                      <Badge variant="outline" className="mt-2">Opportunity Score: 92</Badge>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">Enterprise AI Cost Analysis</h4>
                      <p className="text-sm text-gray-600 mt-1">12K monthly searches, 30% content availability</p>
                      <Badge variant="outline" className="mt-2">Opportunity Score: 88</Badge>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-gray-900">AI Model Fine-tuning Guide</h4>
                      <p className="text-sm text-gray-600 mt-1">9.5K monthly searches, 20% content availability</p>
                      <Badge variant="outline" className="mt-2">Opportunity Score: 95</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}