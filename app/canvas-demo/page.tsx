"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CanvasWriter } from "@/components/canvas-writer"
import { 
  Type,
  Brain,
  Wand2,
  Palette,
  Users,
  Target,
  FileText,
  Settings,
  Play,
  ArrowLeft
} from "lucide-react"

// Sample content for demonstration
const SAMPLE_ARTICLES = {
  "Complete Guide to React Hooks": `<!-- Meta Description: Learn everything about React Hooks in this comprehensive guide. Master useState, useEffect, useContext and advanced hooks with practical examples. -->

<h1>Complete Guide to React Hooks: Mastering Modern React Development</h1>

<p>React Hooks revolutionized how we write React components by allowing functional components to use state and other React features. This comprehensive guide will take you from basic hooks to advanced patterns, helping you become a React Hooks expert.</p>

<h2>What Are React Hooks?</h2>

<p>React Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They were introduced in React 16.8 as a way to write more concise and reusable code without the complexity of class components.</p>

<h3>Key Benefits of Hooks</h3>

<ul>
  <li><strong>Simplified Component Logic:</strong> No more confusing class syntax or binding methods</li>
  <li><strong>Better Code Reuse:</strong> Custom hooks allow sharing stateful logic between components</li>
  <li><strong>Easier Testing:</strong> Functional components are simpler to test and debug</li>
  <li><strong>Improved Performance:</strong> Better optimization opportunities with React DevTools</li>
</ul>

<h2>Essential React Hooks</h2>

<h3>1. useState Hook</h3>

<p>The <strong>useState</strong> hook is the most fundamental hook for managing component state in functional components.</p>

<pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Increment
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h3>2. useEffect Hook</h3>

<p>The <strong>useEffect</strong> hook lets you perform side effects in functional components, replacing lifecycle methods like componentDidMount and componentDidUpdate.</p>

<pre><code>import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() =&gt; {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []); // Empty dependency array means this runs once on mount
  
  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  
  return &lt;div&gt;{JSON.stringify(data)}&lt;/div&gt;;
}</code></pre>

<h2>Advanced Hook Patterns</h2>

<h3>Custom Hooks</h3>

<p>Custom hooks are regular JavaScript functions that start with "use" and can call other hooks. They're perfect for extracting component logic into reusable functions.</p>

<pre><code>// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() =&gt; {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}</code></pre>

<h3>useContext Hook</h3>

<p>The <strong>useContext</strong> hook provides a clean way to consume context values without nesting Consumer components.</p>

<pre><code>import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    &lt;ThemeContext.Provider value={{ theme, setTheme }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

function ThemedComponent() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    &lt;div className={theme}&gt;
      &lt;button onClick={() =&gt; setTheme(theme === 'light' ? 'dark' : 'light')}&gt;
        Toggle Theme
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>Best Practices and Common Pitfalls</h2>

<h3>Rules of Hooks</h3>

<ol>
  <li><strong>Only call hooks at the top level:</strong> Don't call hooks inside loops, conditions, or nested functions</li>
  <li><strong>Only call hooks from React functions:</strong> Either React function components or custom hooks</li>
  <li><strong>Use the ESLint plugin:</strong> Install eslint-plugin-react-hooks to catch mistakes</li>
</ol>

<h3>Optimization Tips</h3>

<ul>
  <li><strong>Use useCallback for function dependencies:</strong> Prevent unnecessary re-renders</li>
  <li><strong>Implement useMemo for expensive calculations:</strong> Optimize performance-critical operations</li>
  <li><strong>Split state logically:</strong> Use multiple useState calls instead of one complex object</li>
  <li><strong>Consider useReducer for complex state:</strong> Better than useState for intricate state logic</li>
</ul>

<h2>Conclusion</h2>

<p>React Hooks have fundamentally changed how we build React applications. They provide a more intuitive and powerful way to manage state and side effects while promoting better code reuse and testing practices.</p>

<p>By mastering these patterns and following best practices, you'll be able to build more maintainable and efficient React applications. Remember to start with the basics and gradually incorporate advanced patterns as your understanding grows.</p>

<p><strong>Next Steps:</strong> Practice building small projects using different hooks, experiment with custom hooks, and explore the React DevTools to better understand how hooks work under the hood.</p>`,

  "Top 10 AI Tools for Developers": `<!-- Meta Description: Discover the top 10 AI tools that every developer should know in 2024. From code generation to debugging, these AI tools will boost your productivity. -->

<h1>Top 10 AI Tools for Developers in 2024: Boost Your Productivity</h1>

<p>Artificial Intelligence is revolutionizing software development, offering tools that can write code, debug issues, and even design entire applications. Here are the top 10 AI tools that every developer should consider integrating into their workflow.</p>

<h2>1. GitHub Copilot</h2>

<p><strong>What it does:</strong> AI-powered code completion and generation directly in your IDE.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Real-time code suggestions as you type</li>
  <li>Support for dozens of programming languages</li>
  <li>Context-aware code generation</li>
  <li>Integration with popular IDEs like VS Code, JetBrains, and Neovim</li>
</ul>

<p><strong>Best for:</strong> Day-to-day coding, learning new languages, and rapid prototyping.</p>

<h2>2. ChatGPT for Code</h2>

<p><strong>What it does:</strong> Conversational AI assistant for programming questions, code review, and debugging.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Explains complex code concepts</li>
  <li>Generates code snippets from natural language descriptions</li>
  <li>Helps debug and optimize existing code</li>
  <li>Provides architectural advice and best practices</li>
</ul>

<p><strong>Best for:</strong> Learning, problem-solving, and getting unstuck on complex issues.</p>

<h2>3. Cursor AI</h2>

<p><strong>What it does:</strong> AI-first code editor built specifically for pair programming with AI.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Multi-file editing with AI context</li>
  <li>Natural language code editing</li>
  <li>Codebase-wide understanding</li>
  <li>Built-in AI chat for development questions</li>
</ul>

<p><strong>Best for:</strong> Developers who want an AI-native coding experience.</p>

<h2>4. Replit Ghostwriter</h2>

<p><strong>What it does:</strong> AI coding assistant integrated into the Replit online development environment.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Code completion and generation</li>
  <li>Automatic code explanation</li>
  <li>Bug detection and fixing</li>
  <li>Works entirely in the browser</li>
</ul>

<p><strong>Best for:</strong> Quick prototyping, learning, and collaborative coding.</p>

<h2>5. Amazon CodeWhisperer</h2>

<p><strong>What it does:</strong> AWS's AI coding companion with a focus on cloud development.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Real-time code suggestions</li>
  <li>Security scanning and vulnerability detection</li>
  <li>AWS service integration</li>
  <li>Support for multiple programming languages</li>
</ul>

<p><strong>Best for:</strong> AWS cloud development and security-conscious teams.</p>

<h2>6. Tabnine</h2>

<p><strong>What it does:</strong> AI code assistant focused on privacy and customization.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Runs locally for privacy</li>
  <li>Learns from your codebase</li>
  <li>Supports 30+ programming languages</li>
  <li>Team collaboration features</li>
</ul>

<p><strong>Best for:</strong> Enterprise teams with strict privacy requirements.</p>

<h2>7. Sourcegraph Cody</h2>

<p><strong>What it does:</strong> AI assistant that understands your entire codebase for better context-aware suggestions.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Codebase-wide context understanding</li>
  <li>Code search and navigation</li>
  <li>Intelligent code completion</li>
  <li>Integration with existing development workflows</li>
</ul>

<p><strong>Best for:</strong> Large codebases and complex enterprise applications.</p>

<h2>8. DeepCode (now Snyk Code)</h2>

<p><strong>What it does:</strong> AI-powered static code analysis for bug detection and security vulnerabilities.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Real-time vulnerability scanning</li>
  <li>Intelligent bug detection</li>
  <li>Code quality suggestions</li>
  <li>Integration with CI/CD pipelines</li>
</ul>

<p><strong>Best for:</strong> Security-focused development and code quality assurance.</p>

<h2>9. Codex (OpenAI)</h2>

<p><strong>What it does:</strong> The AI model behind GitHub Copilot, available via API for custom integrations.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Natural language to code conversion</li>
  <li>Code explanation and documentation</li>
  <li>Multi-language support</li>
  <li>Customizable via API integration</li>
</ul>

<p><strong>Best for:</strong> Building custom AI-powered development tools.</p>

<h2>10. Mintlify Writer</h2>

<p><strong>What it does:</strong> AI-powered documentation generator that creates docs from your code.</p>

<p><strong>Key Features:</strong></p>
<ul>
  <li>Automatic docstring generation</li>
  <li>Code explanation in plain English</li>
  <li>Integration with popular documentation platforms</li>
  <li>Support for multiple programming languages</li>
</ul>

<p><strong>Best for:</strong> Documentation generation and code explanation.</p>

<h2>How to Choose the Right AI Tool</h2>

<p>When selecting AI development tools, consider these factors:</p>

<ol>
  <li><strong>Integration:</strong> How well does it work with your existing development environment?</li>
  <li><strong>Privacy:</strong> Does your team have specific privacy or security requirements?</li>
  <li><strong>Cost:</strong> What's the pricing model and does it fit your budget?</li>
  <li><strong>Language Support:</strong> Does it support the programming languages you use?</li>
  <li><strong>Team Features:</strong> Do you need collaboration and team management capabilities?</li>
</ol>

<h2>Best Practices for Using AI Development Tools</h2>

<ul>
  <li><strong>Review AI-generated code carefully:</strong> Always understand what the AI is suggesting</li>
  <li><strong>Use AI as a copilot, not autopilot:</strong> Maintain control over your development process</li>
  <li><strong>Learn from AI suggestions:</strong> Use AI tools as learning opportunities</li>
  <li><strong>Test thoroughly:</strong> AI-generated code still needs proper testing</li>
  <li><strong>Stay updated:</strong> AI tools evolve rapidly, keep exploring new features</li>
</ul>

<h2>The Future of AI in Development</h2>

<p>AI tools are becoming increasingly sophisticated, with capabilities extending beyond code generation to include:</p>

<ul>
  <li>Automated testing and quality assurance</li>
  <li>Intelligent code refactoring</li>
  <li>Performance optimization suggestions</li>
  <li>Automated documentation and API generation</li>
  <li>Predictive debugging and error prevention</li>
</ul>

<h2>Conclusion</h2>

<p>These AI tools represent just the beginning of how artificial intelligence will transform software development. By incorporating these tools into your workflow, you can boost productivity, learn new techniques, and focus on higher-level problem-solving.</p>

<p>Start with one or two tools that align with your current needs, and gradually expand your AI toolkit as you become more comfortable with AI-assisted development. The future of programming is collaborative—between human creativity and artificial intelligence.</p>`
}

export default function CanvasDemo() {
  const [selectedArticle, setSelectedArticle] = useState("")
  const [customContent, setCustomContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [canvasContent, setCanvasContent] = useState("")

  const handleLoadSample = () => {
    if (!selectedArticle) return
    
    setIsGenerating(true)
    setCanvasContent("")
    
    // Simulate loading delay
    setTimeout(() => {
      setCanvasContent(SAMPLE_ARTICLES[selectedArticle as keyof typeof SAMPLE_ARTICLES])
      setIsGenerating(false)
    }, 1000)
  }

  const handleLoadCustom = () => {
    if (!customContent.trim()) return
    
    setIsGenerating(true)
    setCanvasContent("")
    
    // Simulate loading delay
    setTimeout(() => {
      setCanvasContent(customContent)
      setIsGenerating(false)
    }, 1000)
  }

  const handleClearCanvas = () => {
    setCanvasContent("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <Type className="h-10 w-10 mr-4 text-blue-600" />
                Canvas Writer Demo
                <Badge className="ml-4 bg-gradient-to-r from-blue-500 to-purple-600">
                  Live Typing ✨
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Experience live typing animation like ChatGPT - Watch articles come to life character by character
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">New Canvas Writing Experience</h3>
                <p className="text-blue-700 text-sm mt-1">
                  This demo showcases the new Canvas Writer feature with live typing animation. Select a sample article or paste your own content to see the typing effect in action.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings className="h-6 w-6 mr-3 text-blue-600" />
                  Demo Controls
                </CardTitle>
                <CardDescription>
                  Choose content to demo the canvas writer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Articles */}
                <div>
                  <Label className="text-base font-medium">Sample Articles</Label>
                  <Select value={selectedArticle} onValueChange={setSelectedArticle}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a sample article" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SAMPLE_ARTICLES).map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleLoadSample}
                    disabled={!selectedArticle || isGenerating}
                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Load Sample Article
                  </Button>
                </div>

                {/* Custom Content */}
                <div>
                  <Label htmlFor="custom" className="text-base font-medium">
                    Custom Content
                  </Label>
                  <Textarea
                    id="custom"
                    placeholder="Paste your own HTML content here to see the typing effect..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                  <Button
                    onClick={handleLoadCustom}
                    disabled={!customContent.trim() || isGenerating}
                    variant="outline"
                    className="w-full mt-3"
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Load Custom Content
                  </Button>
                </div>

                {/* Clear Button */}
                <Button
                  onClick={handleClearCanvas}
                  disabled={!canvasContent}
                  variant="outline"
                  className="w-full"
                >
                  Clear Canvas
                </Button>

                {/* Features List */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Canvas Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Live typing animation
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Adjustable typing speed
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Play/pause controls
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Progress tracking
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Canvas & preview modes
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Copy & download options
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Panel */}
          <div className="lg:col-span-2">
            <CanvasWriter
              content={canvasContent}
              title="Article Demo Canvas"
              isGenerating={isGenerating}
              onContentUpdate={setCanvasContent}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Canvas Writer Features
            </h3>
            <p className="text-gray-600 mb-4">
              The Canvas Writer brings AI content generation to life with real-time typing animations, 
              just like ChatGPT and Gemini. This creates an engaging user experience that makes content 
              creation feel more interactive and dynamic.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-blue-600" />
                <span>Live typing animation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-600" />
                <span>Interactive controls</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span>Dual view modes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4 text-orange-600" />
                <span>Easy integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}