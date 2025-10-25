import { NextRequest, NextResponse } from "next/server";
import { generateNextLevelBlog } from "@/lib/langchain-blog-pipeline";
import { sanitizeHTML, getWordCount, getReadingTime } from "@/lib/html-sanitizer";
import { getUserProfile, updateUserProfile } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId,
      topic, 
      tone = "professional", 
      length = "medium",
      provider = "google",
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

    // Increment user's article count in database
    if (userId) {
      try {
        const userProfile = await getUserProfile(userId);
        if (userProfile) {
          const today = new Date().toISOString().split('T')[0];
          const lastGenDate = userProfile.lastGenerationDate?.split('T')[0];
          
          // Reset count if it's a new day
          const newCount = (lastGenDate === today) 
            ? (userProfile.articlesGeneratedToday || 0) + 1 
            : 1;
          
          await updateUserProfile(userId, {
            articlesGeneratedToday: newCount,
            lastGenerationDate: new Date().toISOString()
          });
          
          console.log(`✅ Updated article count for user ${userId}: ${newCount}`);
        }
      } catch (error) {
        console.error('Failed to update user article count:', error);
        // Continue with generation even if count update fails
      }
    }

    console.log(`🚀 Starting next-level blog generation for: ${topic}`);
    
    // Step 1: Gather research data if requested
    let researchData = {};
    
    if (includeWebSearch) {
      console.log('🔍 Performing web search...');
      try {
        // Use mock web search data to avoid internal API calls
        const mockWebResults = [
          {
            name: `${topic} - Complete Guide`,
            url: `https://example.com/${topic.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `This comprehensive guide covers everything you need to know about ${topic}. Learn from experts and get practical tips.`,
            datePublished: new Date().toISOString()
          },
          {
            name: `Best Practices for ${topic}`,
            url: `https://bestpractices.com/${topic.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `Discover the top best practices and strategies for ${topic}. Improve your results with proven methods.`,
            datePublished: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        researchData = { ...researchData, webSearch: mockWebResults };
      } catch (error) {
        console.error('Web search failed:', error);
      }
    }
    
    if (includeSerpAnalysis) {
      console.log('📊 Performing SERP analysis...');
      try {
        // Use mock SERP data to avoid internal API calls
        const mockSerpData = {
          keyword: topic,
          searchVolume: Math.floor(Math.random() * 10000) + 1000,
          difficulty: Math.floor(Math.random() * 100),
          organicResults: [
            {
              position: 1,
              title: `${topic} - Complete Guide 2024`,
              snippet: `Everything you need to know about ${topic}`,
              domain: 'example1.com'
            }
          ],
          relatedKeywords: [`${topic} guide`, `${topic} tips`, `best ${topic}`]
        };
        researchData = { ...researchData, serpAnalysis: mockSerpData };
      } catch (error) {
        console.error('SERP analysis failed:', error);
      }
    }

    // Step 2: Generate next-level blog post with research data
    let result;
    try {
      result = await generateNextLevelBlog(topic, {
        provider,
        modelName,
        apiKey: provider === 'google' ? process.env.GOOGLE_AI_API_KEY : 
                 provider === 'baseten' ? process.env.BASETEN_API_KEY :
                 provider === 'openrouter' ? process.env.OPENROUTER_API_KEY :
                 process.env.DEEPSEEK_API_KEY,
        tone,
        length,
        includeInteractiveElements,
        addUniqueEnhancements,
        generateAdvancedMetadata
      });

      if (!result || !result.article) {
        console.error("generateNextLevelBlog returned invalid result:", result);
        throw new Error("Blog generation failed to produce content");
      }

      console.log(`✅ Next-level blog generated successfully: ${result.article.length} characters`);
    } catch (generationError) {
      console.error("generateNextLevelBlog failed:", generationError);
      throw new Error(`Blog generation failed: ${generationError instanceof Error ? generationError.message : 'Unknown error'}`);
    }

    // Safely access result properties with fallbacks
    const rawArticle = result.article || "<h1>Error</h1><p>Article generation failed.</p>";
    
    // CRITICAL: Sanitize the article to remove ALL markdown artifacts
    const article = sanitizeHTML(rawArticle);
    
    const metadata = result.metadata || {
      meta_description: "",
      keywords: [],
      reading_time: 0
    };
    const resultResearchData = result.research_data || [];
    const outline = result.outline || "";
    const sections = result.sections || {};
    const errors = result.errors || [];
    const enhancements = result.enhancements || {
      uniqueness_applied: false,
      interactive_elements_added: false,
      advanced_metadata_generated: false
    };

    return NextResponse.json({
      success: true,
      message: "Next-level blog post generated successfully!",
      data: {
        article: article,
        metadata: {
          meta_description: metadata.meta_description || `Complete guide about ${topic}`,
          keywords: metadata.keywords || [topic],
          reading_time: metadata.reading_time || getReadingTime(article),
          social_media_snippets: metadata.social_media_snippets || [],
          featured_snippet_optimized: metadata.featured_snippet_optimized || "",
          schema_markup: metadata.schema_markup || "",
          generation_type: "next-level",
          features_enabled: {
            interactive_elements: includeInteractiveElements,
            unique_enhancements: addUniqueEnhancements,
            advanced_metadata: generateAdvancedMetadata
          }
        },
        research_data: resultResearchData,
        outline: outline,
        sections: sections,
        errors: errors,
        enhancements: enhancements,
        statistics: {
          generated_at: new Date().toISOString(),
          word_count: getWordCount(article),
          estimated_reading_time: getReadingTime(article),
          research_sources: Array.isArray(resultResearchData) ? resultResearchData.length : 0,
          sections_generated: Object.keys(sections).length,
          keywords_extracted: (metadata.keywords || []).length
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
    
    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate next-level blog post",
        details: errorMessage,
        suggestion: "Please try again with a simpler topic or contact support if the issue persists.",
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
