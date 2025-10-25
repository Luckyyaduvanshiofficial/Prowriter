import { type NextRequest, NextResponse } from "next/server"
import { createProviderClient, getModelById, getAvailableModels } from "@/lib/ai-providers"
import { cleanOutlineContent } from "@/lib/outline-formatter"

const OUTLINE_PROMPT = `You are an elite content strategist and SEO architect. Your mission is to create battle-tested article outlines that serve as blueprints for content that ranks #1 on Google and captivates readers.

🎯 OBJECTIVE:
Create a comprehensive, SEO-optimized article outline that includes:
- Magnetic, click-worthy heading hierarchy (H1-H4)
- Detailed section descriptions with strategic word count targets
- Key points and sub-topics for each section with actionable guidance
- Advanced SEO recommendations (primary/secondary keywords, LSI terms, search intent)
- Content enhancement suggestions (visuals, CTAs, engagement elements)
- E-E-A-T signals and authority-building elements

📝 ADVANCED OUTLINE STRUCTURE (2025 STANDARDS):

1. **TITLE OPTIMIZATION** (3-5 power title variations)
   - Primary title (H1) with emotional trigger + keyword + benefit
   - Alternative variations for A/B testing and different platforms
   - Character count optimization (50-60 chars for SEO)
   - Include power words: "Ultimate", "Complete", "Proven", "Expert", "2025"

2. **META INFORMATION & SEO FOUNDATION**
   - Meta description (150-160 characters) with action words and FOMO
   - Primary keyword (high search volume, medium competition)
   - Secondary keywords (3-5 related terms)
   - LSI keywords (semantic variations)
   - Target word count with reading time estimate
   - Search intent classification (informational/navigational/transactional/commercial)
   - Content angle and unique value proposition

3. **DETAILED SECTION BREAKDOWN** (For each H2/H3 section):
   - Compelling section title with keyword integration
   - Target word count (be specific: 200-300, 400-500, etc.)
   - Key points to cover (5-7 specific bullet points)
   - Content angle (what makes this section unique)
   - SEO notes (keywords to include, related terms, search intent)
   - Engagement elements (CTAs, examples, statistics, case studies)
   - Visual content suggestions (charts, infographics, screenshots)

4. **CONTENT ENHANCEMENT ROADMAP**
   - Visual content strategy (specific image/video/infographic recommendations)
   - Internal linking opportunities (contextual anchor text suggestions)
   - External linking strategy (types of sources to reference)
   - Interactive elements (quizzes, calculators, polls, assessments)
   - Call-to-action placements (when and where to include CTAs)
   - FAQ section strategy (voice search optimization)
   - Social proof elements (where to add testimonials, case studies, statistics)

5. **ADVANCED SEO OPTIMIZATION STRATEGY**
   - Keyword placement strategy (titles, intro, headers, conclusion)
   - Featured snippet opportunities (definition boxes, lists, tables, steps)
   - Schema markup suggestions (Article, FAQ, HowTo, Review)
   - Voice search optimization (natural question formats)
   - Long-tail keyword integration points
   - Semantic keyword clusters for topical authority
   - Competitor content gap analysis
   - E-E-A-T signal integration points

6. **ENGAGEMENT & CONVERSION PLANNING**
   - Reader hook strategy (first 3 sentences plan)
   - Pattern interrupt placements (questions, bold statements every 300-400 words)
   - Bucket brigade integration ("Here's the truth:", "But wait...")
   - Social sharing optimization (quotable snippets, key takeaways)
   - Lead magnet opportunities (downloadable resources, templates)
   - Email capture strategy (where to place opt-in forms)

Return the outline in clear, well-structured Markdown format that can be easily followed by any professional content writer to create exceptional, ranking content.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      topic,
      contentType = "informative",
      articleLength = "medium",
      seoKeywords = "",
      targetAudience = "",
      brandVoice = "friendly",
      aiEngine = "gemini-2-flash"
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

    // Content type specific instructions
    const contentTypeInstructions: Record<string, string> = {
      "how-to": "Structure as a step-by-step tutorial with clear progression from beginner to completion. Include prerequisites, tools needed, and troubleshooting sections.",
      "guide": "Create a comprehensive educational outline covering fundamentals to advanced concepts. Include background, core concepts, best practices, and practical applications.",
      "comparison": "Focus on detailed comparative analysis structure. Include introduction, individual analysis of each option, direct comparisons, and clear recommendations.",
      "news": "Use journalistic structure with lead, background, analysis, expert opinions, and future implications. Include fact-checking and source requirements.",
      "informative": "Structure for maximum educational value with clear learning progression. Include concept introduction, detailed explanations, examples, and takeaways."
    }

    // Article length specifications
    const lengthSpecs: Record<string, { words: string; sections: string; depth: string }> = {
      "short": { words: "800-1000", sections: "4-5", depth: "focused and concise" },
      "medium": { words: "1200-1500", sections: "6-8", depth: "comprehensive coverage" },
      "long": { words: "1800-2500", sections: "8-12", depth: "in-depth analysis" },
      "epic": { words: "3000+", sections: "12-15", depth: "ultimate comprehensive guide" }
    }

    const lengthSpec = lengthSpecs[articleLength] || lengthSpecs["medium"]

    let customPrompt = OUTLINE_PROMPT
    
    customPrompt += `\n\n📋 CONTENT SPECIFICATIONS:
- Content Type: ${contentType}
- Target Length: ${lengthSpec.words} words
- Number of Sections: ${lengthSpec.sections}
- Content Depth: ${lengthSpec.depth}
- Content Type Focus: ${contentTypeInstructions[contentType] || contentTypeInstructions["informative"]}`

    if (seoKeywords) {
      customPrompt += `\n\n🎯 SEO FOCUS: Primary keywords to target: ${seoKeywords}`
    }

    if (targetAudience) {
      customPrompt += `\n\n👥 TARGET AUDIENCE: ${targetAudience}`
    }

    customPrompt += `\n\n🎨 BRAND VOICE: ${brandVoice} tone and style`

    const specificPrompt = `Create a detailed article outline for: "${topic}"

CRITICAL FORMATTING REQUIREMENTS:
- Use proper heading hierarchy: # for main title, ## for sections, ### for subsections
- Use **bold** for important concepts and key points (NOT asterisks for emphasis)
- Use bullet points (-) for lists and sub-points
- Write in clear, professional language (avoid robotic or overly formal tone)
- Include actionable content guidance for each section
- DO NOT include any "thinking", meta-commentary, or planning text in your response
- DO NOT use <thinking> tags or similar internal processing text
- Focus ONLY on the outline content
- Start directly with the article title using # heading
- Make each section engaging and reader-focused

The outline should be comprehensive enough that any skilled writer could use it to create a high-quality, SEO-optimized article. Include specific guidance for content creation, keyword placement, and reader engagement strategies.

Structure the outline with clear sections that flow logically and provide value to readers.`

    const finalPrompt = `${customPrompt}\n\n${specificPrompt}`

    // Generate outline using the new provider system
    const response = await client.generateContent({
      messages: [
        {
          role: 'system',
          content: customPrompt
        },
        {
          role: 'user',
          content: specificPrompt
        }
      ],
      model: aiEngine,
      temperature: 0.3,
      maxTokens: 2000
    })

    // Clean the outline content to remove thinking text and improve formatting
    const cleanedOutline = cleanOutlineContent(response.content)

    return NextResponse.json({
      outline: cleanedOutline,
      metadata: {
        topic,
        contentType,
        articleLength,
        seoKeywords,
        targetAudience,
        brandVoice,
        aiEngine,
        provider: response.provider,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Outline generation error:", error)
    return NextResponse.json({ 
      error: `Failed to generate outline: ${error instanceof Error ? error.message : 'Unknown error occurred'}` 
    }, { status: 500 })
  }
}
