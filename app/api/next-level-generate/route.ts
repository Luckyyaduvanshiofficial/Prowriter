import { NextRequest, NextResponse } from "next/server";
import { generateNextLevelBlog } from "@/lib/langchain-blog-pipeline";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      topic, 
      tone = "professional", 
      length = "medium",
      provider = "openai",
      modelName,
      // Research options
      includeWebSearch = false,
      includeSerpAnalysis = false,
      // Next-level specific options
      includeInteractiveElements = true,
      addUniqueEnhancements = true,
      generateAdvancedMetadata = true
    } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required for next-level blog generation" },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting next-level blog generation for: ${topic}`);
    
    // Step 1: Gather research data if requested
    let researchData = {};
    
    if (includeWebSearch) {
      console.log('🔍 Performing web search...');
      try {
        const webSearchResponse = await fetch(new URL('/api/web-search', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: topic, maxResults: 5 })
        });
        
        if (webSearchResponse.ok) {
          const webData = await webSearchResponse.json();
          researchData = { ...researchData, webSearch: webData.results };
        }
      } catch (error) {
        console.error('Web search failed:', error);
      }
    }
    
    if (includeSerpAnalysis) {
      console.log('📊 Performing SERP analysis...');
      try {
        const serpResponse = await fetch(new URL('/api/serp-analysis', request.url).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keyword: topic })
        });
        
        if (serpResponse.ok) {
          const serpData = await serpResponse.json();
          researchData = { ...researchData, serpAnalysis: serpData.data };
        }
      } catch (error) {
        console.error('SERP analysis failed:', error);
      }
    }

    // Step 2: Generate next-level blog post with research data
    const result = await generateNextLevelBlog(topic, {
      provider,
      modelName,
      apiKey: provider === 'google' ? process.env.GOOGLE_AI_API_KEY : process.env.OPENROUTER_API_KEY,
      tone,
      length,
      includeInteractiveElements,
      addUniqueEnhancements,
      generateAdvancedMetadata,
      researchData // Pass research data to the blog generator
    });

    console.log(`✅ Next-level blog generated successfully: ${result.article.length} characters`);

    return NextResponse.json({
      success: true,
      message: "Next-level blog post generated successfully!",
      data: {
        article: result.article,
        metadata: {
          ...result.metadata,
          generation_type: "next-level",
          features_enabled: {
            interactive_elements: includeInteractiveElements,
            unique_enhancements: addUniqueEnhancements,
            advanced_metadata: generateAdvancedMetadata
          }
        },
        research_data: result.research_data,
        outline: result.outline,
        sections: result.sections,
        errors: result.errors,
        enhancements: result.enhancements,
        statistics: {
          generated_at: new Date().toISOString(),
          word_count: result.article.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length,
          estimated_reading_time: result.metadata.reading_time,
          research_sources: result.research_data.length,
          sections_generated: Object.keys(result.sections).length,
          keywords_extracted: result.metadata.keywords?.length || 0
        },
        pipeline_info: {
          version: "next-level-v2.0",
          provider: provider,
          model: modelName || (provider === 'google' ? 'gemini-2.0-flash' : 'gpt-4o-mini'),
          tone: tone,
          length: length
        }
      }
    });

  } catch (error) {
    console.error('❌ Next-level blog generation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate next-level blog post",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        pipeline_version: "next-level-v2.0"
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
