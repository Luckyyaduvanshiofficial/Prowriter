import { type NextRequest, NextResponse } from "next/server"
import { createProviderClient, getModelById } from "@/lib/ai-providers"
import { createWebResearcher, type WebSearchOptions } from "@/lib/web-search"

const MASTER_PROMPT = `You are an elite content strategist, SEO expert, and professional blog writer specializing in creating exceptional, high-value content that dominates search rankings and engages readers.

🎯 PRIMARY OBJECTIVE:
Create a professional, production-ready article with perfect HTML structure that:
- Provides genuine, actionable value to readers
- Ranks #1 in Google search results for target keywords  
- Engages readers from the first sentence to the last
- Converts readers into engaged followers and customers
- Establishes expertise, authority, and trust (E-E-A-T)

🔧 CRITICAL FORMATTING REQUIREMENTS:
- NEVER use markdown formatting (**, ##, *, etc.)
- ALWAYS use proper HTML tags for all formatting
- Use semantic HTML structure for accessibility and SEO
- Format content exactly as it would appear in WordPress
- All content must be properly escaped and valid HTML

📋 REQUIRED HTML STRUCTURE:
1. Start with HTML comment for meta description:
   <!-- Meta Description: Your 150-160 character description here -->

2. Use proper heading hierarchy:
   <h1>Main Article Title</h1>
   <h2>Major Section Headings</h2>
   <h3>Subsection Headings</h3>
   <h4>Minor Subsections (if needed)</h4>

3. Wrap all paragraphs in <p> tags with proper spacing:
   <p>Each paragraph should be wrapped properly with meaningful content that flows naturally.</p>

4. Use proper list formatting:
   <ul>
     <li>Unordered list items with detailed explanations</li>
     <li>Each item should provide valuable information</li>
   </ul>
   <ol>
     <li>Ordered list for step-by-step processes</li>
     <li>Sequential information that builds logically</li>
   </ol>

5. Use <strong> for emphasis and <em> for italics instead of markdown

6. Include professional comparison tables with proper styling:
   <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
     <thead>
       <tr style="background-color: #f8f9fa;">
         <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Feature</th>
         <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Details</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td style="border: 1px solid #dee2e6; padding: 12px;">Data Point</td>
         <td style="border: 1px solid #dee2e6; padding: 12px;">Explanation</td>
       </tr>
     </tbody>
   </table>

7. Use <blockquote> for important insights, expert opinions, or key takeaways:
   <blockquote style="border-left: 4px solid #007cba; padding: 16px; margin: 20px 0; background-color: #f8f9fa; font-style: italic;">
     <p>Important insights or expert quotes that add credibility and value</p>
   </blockquote>

8. Include descriptive content placeholders for images:
   <div style="margin: 20px 0; padding: 16px; background-color: #f8f9fa; border: 1px dashed #ccc; text-align: center; color: #6c757d;">
     <p><strong>[Image Placeholder]</strong> - Descriptive alt text for the image that would go here</p>
   </div>

9. Use proper code snippets when needed:
   <pre style="background-color: #f8f9fa; padding: 16px; border-radius: 4px; overflow-x: auto;">
     <code>Code examples or commands when relevant to the content</code>
   </pre>

📝 ENHANCED ARTICLE STRUCTURE TEMPLATE:

<h1>SEO-Optimized Title with Primary Keywords</h1>
<!-- Meta Description: Compelling 150-160 character summary that includes target keywords and entices clicks -->

<p>Engaging introduction that immediately hooks readers with a compelling question, statistic, or statement. This paragraph should clearly establish what the article covers and why it matters to the reader.</p>

<h2>Table of Contents</h2>
<ol>
  <li><a href="#overview">What You Need to Know</a></li>
  <li><a href="#background">Background and Context</a></li>
  <li><a href="#analysis">Detailed Analysis</a></li>
  <li><a href="#recommendations">Expert Recommendations</a></li>
  <li><a href="#faq">Frequently Asked Questions</a></li>
  <li><a href="#conclusion">Conclusion</a></li>
</ol>

<h2 id="overview">What You Need to Know</h2>
<p>Clear, concise overview that summarizes the key points readers will learn. Use bullet points or numbered lists when appropriate to improve scannability.</p>

<h2 id="background">Background and Context</h2>
<p>Industry landscape, current trends, and essential background information that helps readers understand the broader context.</p>

<h2 id="analysis">Detailed Analysis</h2>
<h3>Performance Comparison</h3>
<p>In-depth analysis with specific metrics, benchmarks, and real-world testing results.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Feature</th>
      <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Model A</th>
      <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Model B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Performance Metric</td>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Specific results</td>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Specific results</td>
    </tr>
  </tbody>
</table>

<h3>Use Case Scenarios</h3>
<ul>
  <li><strong>Scenario 1:</strong> Detailed explanation of real-world application</li>
  <li><strong>Scenario 2:</strong> Industry-specific use case with examples</li>
</ul>

<h2>Pros and Cons Analysis</h2>
<h3>Advantages</h3>
<ul>
  <li><strong>Specific Benefit:</strong> Detailed explanation with supporting evidence</li>
  <li><strong>Another Advantage:</strong> Clear description of the benefit and its impact</li>
</ul>

<h3>Limitations</h3>
<ul>
  <li><strong>Honest Limitation:</strong> Transparent discussion with context and workarounds</li>
  <li><strong>Another Consideration:</strong> Balanced perspective on potential drawbacks</li>
</ul>

<h2 id="recommendations">Expert Recommendations</h2>
<blockquote style="border-left: 4px solid #007cba; padding: 16px; margin: 20px 0; background-color: #f8f9fa; font-style: italic;">
  <p><strong>Expert Verdict:</strong> Clear recommendation with specific use case guidance and decision criteria.</p>
</blockquote>

<h2 id="faq">Frequently Asked Questions</h2>
<h3>Question 1 with target keywords?</h3>
<p>Comprehensive answer optimized for featured snippets with clear, actionable information.</p>

<h3>Question 2 addressing common concerns?</h3>
<p>Detailed response that addresses user intent and provides valuable insights.</p>

<h2 id="conclusion">Conclusion</h2>
<p>Powerful summary that reinforces key takeaways, provides final recommendations, and includes a clear call-to-action for readers.</p>

📝 CONTENT QUALITY STANDARDS (2025 BEST PRACTICES):

✅ WRITING EXCELLENCE:
- Write in a conversational, expert tone that builds trust and authority
- Use short paragraphs (2-4 sentences) for optimal readability on all devices
- Start with a powerful hook: question, statistic, or bold statement
- Include specific examples, case studies, and real-world scenarios
- Provide actionable insights readers can implement immediately
- Use power words and emotional triggers strategically
- Tell stories that resonate with your target audience
- Address reader pain points directly and offer solutions

✅ SEO MASTERY:
- Naturally integrate keywords without stuffing (aim for 1-2% keyword density)
- Use semantic keywords and LSI (Latent Semantic Indexing) terms
- Structure content for featured snippets (use "What is", "How to", "Why" formats)
- Optimize for voice search with natural, conversational language
- Include long-tail keywords that match user search intent
- Add internal linking opportunities with descriptive anchor text
- Create content that comprehensively covers the topic (search intent satisfaction)

✅ ENGAGEMENT OPTIMIZATION:
- Use bucket brigades to maintain reading flow ("Here's the truth:", "But wait...", "The bottom line:")
- Add social proof through statistics, expert opinions, and case studies
- Include surprising facts or counterintuitive insights
- Use numbered lists and bullet points for scannability
- Add "Pro Tips", "Quick Win", and "Expert Insight" callouts
- Create shareable quotes and takeaways
- Include pattern interrupts (questions, bold statements, visuals)

🔍 ADVANCED SEO OPTIMIZATION (2025):

✅ E-E-A-T SIGNALS (Experience, Expertise, Authoritativeness, Trustworthiness):
- Demonstrate real-world experience and first-hand knowledge
- Show subject matter expertise with depth and accuracy
- Build authority with data-driven insights and expert analysis
- Establish trust through transparency, citations, and accuracy
- Include author credentials and expertise indicators
- Add publication dates and update timestamps

✅ SEARCH INTENT OPTIMIZATION:
- Match content type to search intent (informational, navigational, transactional, commercial)
- Provide comprehensive answers that satisfy user queries
- Structure headings to answer "People Also Ask" questions
- Include semantic keywords and related terms for topical authority
- Optimize for featured snippets with definition boxes, lists, tables
- Use FAQ schema-friendly formatting for voice search

✅ TECHNICAL SEO INTEGRATION:
- Use proper heading hierarchy (H1 → H2 → H3 → H4)
- Include descriptive, keyword-rich headings
- Add alt text descriptions for all image placeholders
- Create structured data opportunities (schema markup comments)
- Optimize for Core Web Vitals (fast-loading, scannable content)
- Include internal linking with descriptive anchor text
- Add location-based keywords when relevant for local SEO

⚠️ ABSOLUTE FORMATTING COMPLIANCE:
- Output must be 100% HTML formatted with NO exceptions
- Zero markdown syntax allowed anywhere in the content
- All content must be wrapped in proper HTML tags
- Use semantic HTML for better accessibility and SEO
- Ensure clean, valid HTML structure throughout
- Include proper styling attributes for better presentation
- Test all HTML output for WordPress compatibility
- Maintain consistent formatting throughout the entire article

🚀 ENGAGEMENT AND CONVERSION OPTIMIZATION:

✅ READER RETENTION STRATEGIES:
- Hook readers in the first 3 sentences with curiosity, emotion, or value
- Use bucket brigades to maintain flow: "Here's the kicker:", "But there's more:", "Let me explain:"
- Break up text with visual elements (tables, blockquotes, lists)
- Add pattern interrupts every 300-400 words (questions, bold statements, surprising facts)
- Include progress indicators for long-form content
- Use transition phrases that create anticipation

✅ CONVERSION ELEMENTS:
- Include compelling CTAs (Call-to-Actions) at strategic points:
  * After introducing a problem (offer solution)
  * After sharing value (encourage engagement)
  * In the conclusion (clear next steps)
- Use action-oriented language ("Discover", "Learn", "Get Started", "Transform")
- Create FOMO (Fear of Missing Out) with limited information or urgency
- Add social proof elements (testimonials, statistics, case studies)
- Include lead magnets naturally (downloadable resources, templates, checklists)

✅ SHAREABILITY FACTORS:
- Create quotable snippets with <blockquote> styling
- Include surprising statistics or data visualizations
- Add controversial or thought-provoking statements (backed by evidence)
- Use emotional triggers: curiosity, surprise, joy, fear, anger (appropriately)
- Make content actionable and implementable
- Add value that readers want to share with their network`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      topic, 
      modelA, 
      modelB, 
      aiEngine = "gemini-2-flash",
      articleLength = "medium",
      tone = "friendly", 
      temperature = 0.7, 
      contentType = "comparison",
      seoKeywords = "",
      targetAudience = "",
      customInstructions = "",
      brandVoice = "friendly",
      includeWebSearch = false,
      includeSerpAnalysis = false,
      webSearchDepth = 5,
      includeRecentNews = false
    } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Get the AI model
    const model = getModelById(aiEngine)
    if (!model) {
      return NextResponse.json({ error: "Invalid AI model selected" }, { status: 400 })
    }

    // Create provider client
    const client = createProviderClient(model.provider)

    // Initialize web research if enabled
    let webResearchData = null
    let webResearchContext = ""
    
    if (includeWebSearch) {
      try {
        const researcher = createWebResearcher()
        
        // Build comprehensive search query
        let searchQuery = topic
        if (modelA && modelB && contentType === "comparison") {
          searchQuery = `${modelA} vs ${modelB} ${topic} comparison 2024`
        } else if (contentType === "news") {
          searchQuery = `${topic} latest news updates 2024`
        } else if (seoKeywords) {
          searchQuery = `${topic} ${seoKeywords}`
        }

        // Research options
        const researchOptions = {
          maxResults: webSearchDepth,
          maxScrapes: Math.min(webSearchDepth, 5),
          includeContent: true,
          searchOptions: {
            country: "us",
            language: "en",
            timeRange: includeRecentNews ? ("month" as const) : ("year" as const)
          }
        }

        console.log(`🔍 Starting web research for: ${searchQuery}`)
        
        // Perform comprehensive research
        webResearchData = await researcher.researchTopic(searchQuery, researchOptions)
        
        if (webResearchData && webResearchData.searchResults.length > 0) {
          console.log(`✅ Web research completed: ${webResearchData.searchResults.length} sources found`)
          
          // Build research context for AI prompt
          webResearchContext = `\n\n🌐 LATEST WEB RESEARCH DATA:
Based on recent web research, here are the key insights to incorporate:

📊 RESEARCH SUMMARY:
- Total Results Found: ${webResearchData.summary.totalResults}
- Content Analyzed: ${webResearchData.summary.totalWordCount} words
- Unique Sources: ${webResearchData.summary.uniqueDomains.length} domains
- Key Topics: ${webResearchData.summary.keyTopics.join(', ')}

📰 TOP SEARCH RESULTS (${webResearchData.searchResults.length} found):
${webResearchData.searchResults.slice(0, 5).map((result, index) => 
  `${index + 1}. **${result.title}**
     URL: ${result.url}
     Snippet: ${result.snippet}
     Domain: ${result.domain}`
).join('\n\n')}

📋 SCRAPED CONTENT INSIGHTS:
${webResearchData.scrapedContent.length > 0 ? 
  webResearchData.scrapedContent.slice(0, 3).map((content, index) => 
    `${index + 1}. **${content.title}**
       Content Preview: ${content.text.substring(0, 300)}...
       Word Count: ${content.wordCount}
       Key Headings: ${[...content.headings.h1, ...content.headings.h2].slice(0, 3).join(', ')}`
  ).join('\n\n') : 
  'No detailed content was scraped, but search results provide valuable context.'
}

💡 KEY TOPICS TO INCLUDE:
${webResearchData.summary.keyTopics.slice(0, 10).join(', ')}

🎯 INTEGRATION INSTRUCTIONS:
- Incorporate these findings naturally throughout your article
- Use specific data points and statistics from the research
- Reference recent developments and current market conditions
- Include relevant insights from the scraped content
- Ensure all information is current and fact-based
- Add source credibility to your analysis

🔍 SERP ANALYSIS INSIGHTS:
${includeSerpAnalysis ? `
- Structure headings to compete with top-ranking content: ${webResearchData.scrapedContent.map(c => c.headings.h2.slice(0, 2)).flat().join(', ')}
- Include FAQ sections that address common search queries
- Use semantic keywords found in competitor content: ${webResearchData.summary.keyTopics.slice(0, 5).join(', ')}
- Optimize for featured snippet opportunities
- Address search intent comprehensively based on current rankings
` : 'SERP analysis not enabled'}

IMPORTANT: Use this research data to enhance your content with current, factual information while maintaining the required HTML structure.`
        } else {
          console.log('⚠️ No web research data found, proceeding with standard content generation')
        }
      } catch (webError) {
        console.error('Web research failed:', webError)
        webResearchContext = "\n\n⚠️ Web research was requested but encountered an error. Proceeding with standard content generation based on your training data."
      }
    }

    // Customize prompt based on article length with HTML structure requirements
    const lengthInstructions: Record<string, string> = {
      "short": `Write a focused 800-1000 word article with:
        - 1 H1 title
        - 4-6 H2 sections with meaningful subheadings
        - 2-3 H3 subsections where appropriate
        - Minimum 8-12 paragraphs with proper <p> tags
        - At least 1 comparison table or list
        - 1-2 blockquotes for key insights
        - Clear introduction and conclusion sections`,
        
      "medium": `Write a comprehensive 1200-1500 word article with:
        - 1 H1 title optimized for SEO
        - 6-8 H2 sections with strategic keyword placement
        - 4-6 H3 subsections for detailed breakdowns
        - Minimum 12-18 paragraphs with engaging content
        - 2-3 comparison tables with detailed metrics
        - 2-3 blockquotes for expert insights
        - FAQ section with 3-4 questions
        - Detailed introduction, analysis, and conclusion`,
        
      "long": `Write an in-depth 1800-2500 word article with:
        - 1 H1 title with primary keywords
        - 8-12 H2 sections covering all aspects
        - 6-10 H3 subsections for comprehensive coverage
        - Minimum 20-30 paragraphs with rich detail
        - 3-4 comparison tables with comprehensive data
        - 4-5 blockquotes from different perspectives
        - Extensive FAQ section with 5-7 questions
        - Table of contents with anchor links
        - Multiple use case scenarios and examples`,
        
      "epic": `Write an ultimate 3000+ word comprehensive guide with:
        - 1 H1 title fully optimized for target keywords
        - 12+ H2 sections covering every angle
        - 10+ H3 subsections with detailed analysis
        - Minimum 35+ paragraphs with expert-level detail
        - 5+ comprehensive comparison tables
        - 6+ blockquotes with varied expert perspectives
        - Extensive FAQ section with 8+ questions
        - Detailed table of contents with anchor navigation
        - Multiple case studies and real-world examples
        - Step-by-step guides and implementation sections
        - Resource lists and further reading recommendations`
    }

    // Customize prompt based on content type with HTML structure focus
    const contentTypeInstructions: Record<string, string> = {
      "how-to": `Structure as a step-by-step tutorial with clear HTML formatting:
        - Use <h2> for major tutorial sections
        - Use <h3> for individual steps or sub-processes  
        - Include numbered <ol> lists for sequential steps
        - Add <div> callout boxes for prerequisites and requirements
        - Use <blockquote> for important tips and warnings
        - Include <table> for troubleshooting common issues
        - Provide clear <p> paragraphs with actionable instructions`,
        
      "guide": `Create a comprehensive educational guide with professional HTML structure:
        - Use <h2> for main concept sections
        - Use <h3> for detailed explanations and examples
        - Include <ul> lists for best practices and key points
        - Add <table> comparisons for different approaches
        - Use <blockquote> for expert insights and recommendations
        - Include <div> sections for case studies and examples
        - Structure with clear introduction, body, and conclusion <p> sections`,
        
      "comparison": `Focus on detailed side-by-side analysis with rich HTML formatting:
        - Use <h2> for major comparison categories
        - Use <h3> for specific feature comparisons
        - Include comprehensive <table> elements with styling for benchmarks
        - Add <ul> and <ol> lists for pros and cons analysis
        - Use <blockquote> for expert verdicts and recommendations
        - Include <div> callouts for use case scenarios
        - Structure with clear winner recommendations in conclusion`,
        
      "news": `Write in journalistic style with proper HTML news structure:
        - Use <h2> for story sections (What, Why, Impact, etc.)
        - Use <h3> for sub-stories and related developments
        - Include <blockquote> for expert quotes and industry reactions
        - Add <ul> lists for key facts and timeline events
        - Use <table> for market data and statistics
        - Include <p> paragraphs with journalistic lead and inverted pyramid
        - Structure with headline, lead, body, and future implications`,
        
      "informative": `Provide educational content with clear HTML learning structure:
        - Use <h2> for main educational topics
        - Use <h3> for subtopics and detailed explanations
        - Include <ul> lists for key concepts and takeaways
        - Add <table> elements for data, comparisons, and references
        - Use <blockquote> for important definitions and insights
        - Include <ol> lists for learning progression and steps
        - Structure with learning objectives, content, and summary sections`
    }

    // Brand voice adjustments with HTML formatting emphasis
    const brandVoiceInstructions: Record<string, string> = {
      "professional": `Use formal, authoritative language with industry terminology:
        - Structure with professional <h2> and <h3> headings
        - Use <strong> tags for key business terms and metrics
        - Include <table> elements for professional data presentation
        - Add <blockquote> for industry expert opinions and standards
        - Maintain formal tone in all <p> paragraph content
        - Use <ul> lists for professional recommendations and best practices`,
        
      "friendly": `Write conversationally with a warm, approachable tone:
        - Use engaging <h2> and <h3> headings that feel personal
        - Include <strong> emphasis for friendly advice and tips
        - Add <blockquote> for relatable insights and personal experiences
        - Use <ul> lists for easy-to-follow suggestions
        - Write <p> paragraphs in conversational, accessible language
        - Include <em> for gentle emphasis and friendly guidance`,
        
      "technical": `Include detailed technical explanations with precise HTML structure:
        - Use specific <h2> and <h3> headings with technical terminology
        - Include comprehensive <table> elements for specifications and data
        - Add <pre><code> blocks for technical examples and commands
        - Use <strong> for critical technical concepts and warnings
        - Structure <p> paragraphs with precise technical explanations
        - Include <ol> lists for technical procedures and methodologies`,
        
      "casual": `Use relaxed, easy-to-read language with accessible HTML formatting:
        - Create friendly <h2> and <h3> headings with casual language
        - Use <strong> for important points without being overwhelming
        - Include <blockquote> for casual insights and observations
        - Add <ul> lists for simple, easy-to-scan information
        - Write <p> paragraphs in relaxed, conversational style
        - Use <em> for subtle emphasis and casual commentary`,
        
      "journalistic": `Adopt news-style writing with objective HTML structure:
        - Use news-style <h2> and <h3> headings for story organization
        - Include <blockquote> for direct quotes and official statements
        - Add <table> elements for factual data and statistics
        - Use <strong> for key facts and important developments
        - Structure <p> paragraphs with journalistic lead and supporting facts
        - Include <ul> lists for timeline events and key points`
    }

    let customPrompt = MASTER_PROMPT

    // Add length and content type specific instructions
    customPrompt += `\n\n📏 ARTICLE LENGTH: ${lengthInstructions[articleLength] || lengthInstructions["medium"]}`
    customPrompt += `\n\n📝 CONTENT TYPE: ${contentTypeInstructions[contentType] || contentTypeInstructions["informative"]}`
    customPrompt += `\n\n🎨 BRAND VOICE: ${brandVoiceInstructions[brandVoice] || brandVoiceInstructions["friendly"]}`

    // Add SEO and audience targeting
    if (seoKeywords) {
      customPrompt += `\n\n🎯 SEO KEYWORDS: Focus on these keywords naturally throughout the content: ${seoKeywords}`
    }
    
    if (targetAudience) {
      customPrompt += `\n\n👥 TARGET AUDIENCE: Write specifically for: ${targetAudience}`
    }

    // Add custom instructions if provided
    if (customInstructions) {
      customPrompt += `\n\n📋 SPECIAL INSTRUCTIONS: ${customInstructions}`
    }

    // Add web research context if available
    if (webResearchContext) {
      customPrompt += webResearchContext
    }

    // Add web search context if enabled (PRO feature simulation)
    if (includeWebSearch && !webResearchContext) {
      customPrompt += `\n\n🌐 WEB SEARCH CONTEXT: Include latest industry trends, recent developments, and current market insights in your analysis.`
    }

    // Add SERP analysis if enabled (PRO feature simulation)
    if (includeSerpAnalysis && !webResearchContext) {
      customPrompt += `\n\n🔍 SERP OPTIMIZATION: Structure content to compete with top-ranking articles, include FAQ sections optimized for featured snippets, and use heading structures that perform well in search results.`
    }

    // Create the specific prompt based on content type
    let specificPrompt = ""

    if (contentType === "comparison" && modelA && modelB) {
      specificPrompt = `Write a comprehensive comparison article between ${modelA} and ${modelB}. Focus on: ${topic}

REQUIRED HTML STRUCTURE FOR COMPARISON:
<h1>Complete Comparison: ${modelA} vs ${modelB} - ${topic}</h1>
<!-- Meta Description: Expert comparison of ${modelA} vs ${modelB} covering performance, features, pricing, and recommendations for ${topic} -->

<h2>Executive Summary</h2>
<blockquote style="border-left: 4px solid #007cba; padding: 16px; margin: 20px 0; background-color: #f8f9fa;">
  <p><strong>Quick Verdict:</strong> [Your expert recommendation here]</p>
</blockquote>

<h2>Head-to-Head Comparison</h2>
[Include comprehensive comparison table with styling]

<h2>Performance Analysis</h2>
<h3>Speed and Efficiency</h3>
<h3>Accuracy and Quality</h3>
<h3>Cost and Value</h3>

<h2>Use Case Scenarios</h2>
<h3>Best for ${modelA}</h3>
<h3>Best for ${modelB}</h3>

<h2>Pros and Cons Analysis</h2>
<h2>Final Recommendation</h2>
<h2>Frequently Asked Questions</h2>

Key comparison points to cover with proper HTML formatting:
- Performance benchmarks in detailed <table> format
- Strengths and weaknesses in <ul> lists with <strong> emphasis
- Use case recommendations with <h3> subsections
- Pricing comparison in styled <table> format
- User experience evaluation with <blockquote> insights
- Final recommendation with clear decision criteria in conclusion`
    } else if (contentType === "how-to") {
      specificPrompt = `Write a detailed how-to guide about: ${topic}

REQUIRED HTML STRUCTURE FOR HOW-TO GUIDE:
<h1>Complete Guide: How to ${topic}</h1>
<!-- Meta Description: Step-by-step guide on ${topic} with expert tips, prerequisites, and troubleshooting advice -->

<h2>What You'll Learn</h2>
<ul>
  <li>Learning objective 1</li>
  <li>Learning objective 2</li>
</ul>

<h2>Prerequisites and Requirements</h2>
<ul>
  <li>Required knowledge or tools</li>
</ul>

<h2>Step-by-Step Instructions</h2>
<h3>Step 1: [Action Title]</h3>
<ol>
  <li>Detailed instruction</li>
</ol>

<h2>Troubleshooting Common Issues</h2>
<h3>Problem 1: [Issue Description]</h3>
<p><strong>Solution:</strong> [Step-by-step fix]</p>

<h2>Next Steps and Advanced Techniques</h2>
<h2>Frequently Asked Questions</h2>

Structure requirements with HTML formatting:
- Clear introduction with learning outcomes in <ul> format
- Prerequisites section with <ul> lists and <strong> emphasis
- Numbered <ol> instructions with detailed <p> explanations
- Visual aid placeholders with descriptive content
- Troubleshooting section with <h3> problems and solutions
- Conclusion with next steps in organized <ul> format`
    } else if (contentType === "guide") {
      specificPrompt = `Write a comprehensive guide about: ${topic}

REQUIRED HTML STRUCTURE FOR COMPREHENSIVE GUIDE:
<h1>The Complete Guide to ${topic}</h1>
<!-- Meta Description: Expert guide covering everything about ${topic} with best practices, examples, and actionable insights -->

<h2>Executive Summary</h2>
<blockquote style="border-left: 4px solid #007cba; padding: 16px; margin: 20px 0; background-color: #f8f9fa;">
  <p>Quick overview of what readers will learn and accomplish</p>
</blockquote>

<h2>Background and Context</h2>
<h2>Core Concepts and Fundamentals</h2>
<h3>Key Concept 1</h3>
<h3>Key Concept 2</h3>

<h2>Best Practices and Recommendations</h2>
<h2>Real-World Examples and Case Studies</h2>
<h2>Common Pitfalls and How to Avoid Them</h2>
<h2>Resources for Further Learning</h2>
<h2>Frequently Asked Questions</h2>

Content requirements with HTML structure:
- Executive summary with clear overview in <blockquote>
- Background context with proper <h2> and <h3> organization
- Core concepts with detailed <p> explanations and examples
- Best practices in organized <ul> lists with <strong> emphasis
- Real-world case studies with <h3> subsections
- Common pitfalls with solutions in <table> format
- Resource lists with <ul> formatting and links`
    } else if (contentType === "news") {
      specificPrompt = `Write a news-style article about: ${topic}

REQUIRED HTML STRUCTURE FOR NEWS ARTICLE:
<h1>[Breaking/Latest]: ${topic}</h1>
<!-- Meta Description: Latest news and analysis on ${topic} with industry impact, expert opinions, and future implications -->

<h2>Key Developments</h2>
<ul>
  <li><strong>What Happened:</strong> Main news point</li>
  <li><strong>When:</strong> Timeline information</li>
  <li><strong>Why It Matters:</strong> Significance</li>
</ul>

<h2>Industry Impact and Analysis</h2>
<h2>Expert Perspectives</h2>
<blockquote style="border-left: 4px solid #007cba; padding: 16px; margin: 20px 0; background-color: #f8f9fa;">
  <p>"Expert quote here" - Expert Name, Title, Company</p>
</blockquote>

<h2>Market Implications</h2>
<h2>Background Context</h2>
<h2>Future Outlook and Predictions</h2>
<h2>What This Means for You</h2>

Journalistic structure with HTML formatting:
- Compelling headline with primary keywords in <h1>
- Lead paragraph with who, what, when, where, why in <p>
- Industry expert perspectives in styled <blockquote> elements
- Market impact analysis with <table> data when relevant
- Background context with <h3> subsections
- Future outlook with <ul> prediction lists`
    } else if (contentType === "informative") {
      specificPrompt = `Write an informative educational article about: ${topic}

REQUIRED HTML STRUCTURE FOR EDUCATIONAL CONTENT:
<h1>Understanding ${topic}: A Complete Overview</h1>
<!-- Meta Description: Comprehensive educational guide to ${topic} with clear explanations, examples, and practical applications -->

<h2>Learning Objectives</h2>
<ul>
  <li>What you'll understand after reading</li>
  <li>Key concepts you'll master</li>
</ul>

<h2>Foundational Concepts</h2>
<h3>Basic Definition and Overview</h3>
<h3>Key Components and Elements</h3>

<h2>Detailed Explanations</h2>
<h3>How It Works</h3>
<h3>Why It Matters</h3>

<h2>Practical Applications and Examples</h2>
<h2>Key Takeaways and Summary</h2>
<h2>Further Reading and Resources</h2>
<h2>Frequently Asked Questions</h2>

Educational focus with HTML structure:
- Clear learning objectives in <ul> format
- Foundational concepts with progressive <h3> complexity
- Detailed explanations with <p> paragraphs and examples
- Practical applications with <ol> or <ul> lists
- Key takeaways in highlighted <blockquote> format
- Further reading with organized <ul> resource lists`
    } else {
      specificPrompt = `Write a comprehensive blog article about: ${topic}

REQUIRED HTML STRUCTURE:
<h1>Everything You Need to Know About ${topic}</h1>
<!-- Meta Description: Complete guide to ${topic} with expert insights, practical advice, and actionable recommendations -->

<h2>Introduction and Overview</h2>
<h2>Main Content Sections</h2>
<h2>Expert Analysis and Insights</h2>
<h2>Practical Applications</h2>
<h2>Conclusion and Recommendations</h2>
<h2>Frequently Asked Questions</h2>

Use proper HTML formatting throughout with semantic structure and engaging content.`
    }

    const finalPrompt = `${customPrompt}\n\n${specificPrompt}\n\n🚨 CRITICAL FINAL REMINDERS:
    - Start your response immediately with the HTML content (no introductory text)
    - Use ONLY HTML formatting - absolutely NO markdown syntax
    - Every heading must use proper <h1>, <h2>, <h3> tags
    - Every paragraph must be wrapped in <p> tags
    - All lists must use <ul>/<ol> with <li> tags
    - All emphasis must use <strong> or <em> tags
    - Include styled tables and blockquotes as specified
    - End with proper closing tags for all elements
    
    Begin writing the complete HTML article now:`

    // Generate content using the new provider system
    const maxTokensMap: Record<string, number> = {
      "short": 3000,
      "medium": 4000, 
      "long": 6000,
      "epic": 8000
    }

    const response = await client.generateContent({
      messages: [
        {
          role: 'system',
          content: `${customPrompt}\n\n⚠️ ABSOLUTE REQUIREMENT: You must respond ONLY with properly formatted HTML content. No markdown, no explanations, no prefacing text. Start immediately with HTML tags and end with proper closing tags.`
        },
        {
          role: 'user',
          content: specificPrompt
        }
      ],
      model: aiEngine,
      temperature,
      maxTokens: maxTokensMap[articleLength] || 4000
    })

    return NextResponse.json({
      content: response.content,
      metadata: {
        topic,
        modelA,
        modelB,
        aiEngine,
        provider: response.provider,
        articleLength,
        tone,
        temperature,
        contentType,
        seoKeywords,
        targetAudience,
        brandVoice,
        includeWebSearch,
        includeSerpAnalysis,
        webSearchDepth,
        includeRecentNews,
        webResearch: webResearchData ? {
          totalResults: webResearchData.summary.totalResults,
          totalWordCount: webResearchData.summary.totalWordCount,
          uniqueDomains: webResearchData.summary.uniqueDomains.length,
          keyTopics: webResearchData.summary.keyTopics.slice(0, 10),
          sourcesFound: webResearchData.searchResults.length,
          contentScraped: webResearchData.scrapedContent.length
        } : null,
        generatedAt: new Date().toISOString(),
        usage: response.usage
      },
    })
  } catch (error) {
    console.error("Content generation error:", error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return NextResponse.json({ 
      error: `Failed to generate content: ${errorMessage}` 
    }, { status: 500 })
  }
}
