import { type NextRequest, NextResponse } from "next/server"
import { createProviderClient, getModelById, getAvailableModels } from "@/lib/ai-providers"
import { cleanOutlineContent } from "@/lib/outline-formatter"

const OUTLINE_PROMPT = `You are an expert content strategist and SEO specialist. Your task is to create detailed, SEO-optimized article outlines that serve as blueprints for high-quality blog content.

🎯 OBJECTIVE:
Create a comprehensive article outline that includes:
- SEO-optimized structure with proper heading hierarchy
- Detailed section descriptions with word count targets
- Key points and sub-topics for each section
- SEO recommendations (keywords, meta descriptions, etc.)
- Content suggestions and examples

📝 OUTLINE STRUCTURE:
1. **Article Title Suggestions** (3-5 options)
   - Primary title (H1)
   - Alternative variations for A/B testing

2. **Meta Information**
   - Meta description (150-160 characters)
   - Primary keywords and secondary keywords
   - Target word count
   - Estimated reading time

3. **Detailed Section Breakdown**
   For each section, include:
   - Section title (H2/H3)
   - Target word count
   - Key points to cover
   - Content suggestions
   - SEO notes

4. **Content Enhancement Suggestions**
   - Visual content recommendations
   - Internal linking opportunities
   - Call-to-action placements
   - FAQ section ideas

5. **SEO Optimization Notes**
   - Keyword placement strategy
   - Featured snippet opportunities
   - Schema markup suggestions

Return the outline in clear, well-formatted text that can be easily followed by a content writer.`

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
      aiEngine = "qwen-72b"
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
