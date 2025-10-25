import { ChatOpenAI, ChatGoogleGenerativeAI, ChatPromptTemplate, StringOutputParser, StateGraph, Annotation, MemorySaver, START, END } from "./mock-langchain";
import { createWebResearcher } from "./web-search";

// Define the state structure for our blog generation pipeline
const BlogGenerationState = Annotation.Root({
  topic: Annotation,
  tone: Annotation,
  length: Annotation,
  research_data: Annotation,
  outline: Annotation,
  sections: Annotation,
  final_article: Annotation,
  metadata: Annotation,
  errors: Annotation,
  current_step: Annotation
});

type BlogGenerationStateType = typeof BlogGenerationState.State;

// Enhanced Blog Generation Pipeline using LangChain
export class LangChainBlogPipeline {
  private llm: ChatOpenAI | ChatGoogleGenerativeAI;
  private webResearcher: any;
  private graph: any;

  constructor(
    provider: 'google' | 'baseten' | 'deepseek' | 'openrouter' = 'google',
    modelName?: string,
    apiKey?: string
  ) {
    // Initialize the LLM based on provider
    if (provider === 'google') {
      this.llm = new ChatGoogleGenerativeAI({
        modelName: modelName || "gemini-2.0-flash-exp",
        apiKey: apiKey || process.env.GOOGLE_AI_API_KEY,
        temperature: 0.7,
        maxOutputTokens: 4096,
      });
    } else if (provider === 'baseten') {
      // Use OpenAI-compatible interface for Baseten
      this.llm = new ChatOpenAI({
        modelName: modelName || "openai/gpt-oss-120b",
        openAIApiKey: apiKey || process.env.BASETEN_API_KEY,
        configuration: {
          baseURL: "https://inference.baseten.co/v1",
          defaultHeaders: {
            "Content-Type": "application/json",
          },
        },
        temperature: 1,
        maxTokens: 4096,
      });
    } else if (provider === 'deepseek') {
      // Use OpenAI-compatible interface for DeepSeek
      this.llm = new ChatOpenAI({
        modelName: modelName || "deepseek-chat",
        openAIApiKey: apiKey || process.env.DEEPSEEK_API_KEY,
        configuration: {
          baseURL: "https://api.deepseek.com/v1",
          defaultHeaders: {
            "Content-Type": "application/json",
          },
        },
        temperature: 0.7,
        maxTokens: 8192,
      });
    } else if (provider === 'openrouter') {
      // Use OpenAI-compatible interface for OpenRouter
      this.llm = new ChatOpenAI({
        modelName: modelName || "deepseek/deepseek-chat-v3.1:free",
        openAIApiKey: apiKey || process.env.OPENROUTER_API_KEY,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://prowriter.app",
            "X-Title": "ProWriter AI"
          },
        },
        temperature: 0.7,
        maxTokens: 8192,
      });
    } else {
      // Default to Google Gemini
      this.llm = new ChatGoogleGenerativeAI({
        modelName: "gemini-2.0-flash-exp",
        apiKey: process.env.GOOGLE_AI_API_KEY,
        temperature: 0.7,
        maxOutputTokens: 4096,
      });
    }

    this.webResearcher = createWebResearcher();

    this.initializeGraph();
  }

  private initializeGraph() {
    // Define the research node
    const researchNode = async (state: BlogGenerationStateType) => {
      console.log("🔍 Starting research phase...");
      
      try {
        const researchPrompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an elite research analyst with expertise in comprehensive topic investigation. Generate 5-7 highly specific, strategic search queries to thoroughly research the topic.
          
          RESEARCH STRATEGY:
          📊 Data & Statistics:
          - Current industry statistics and market data (2024-2025)
          - Benchmark comparisons and performance metrics
          - Growth trends and future projections
          
          🎓 Expert Insights:
          - Industry expert opinions and thought leadership
          - Academic research and white papers
          - Case studies and success stories
          - Best practices from top performers
          
          🔧 Technical Details:
          - Implementation guides and technical specifications
          - Common challenges and proven solutions
          - Tools, frameworks, and methodologies
          - Step-by-step processes and workflows
          
          🌍 Real-World Applications:
          - Practical use cases across industries
          - Success metrics and ROI examples
          - Before/after comparisons
          - User testimonials and reviews
          
          📈 Market Intelligence:
          - Competitor analysis and positioning
          - Future trends and predictions
          - Industry disruptions and innovations
          - Regulatory changes and compliance
          
          QUERY QUALITY STANDARDS:
          - Use long-tail keywords for specific results
          - Include year "2024" or "2025" for recent content
          - Add qualifiers like "expert", "guide", "comparison", "statistics"
          - Target different search intents (informational, commercial, navigational)
          - Focus on authoritative sources (research, industry leaders, case studies)
          
          Return ONLY the search queries, one per line. No explanations, just queries.`],
          ["human", "Topic: {topic}"]
        ]);

        const researchChain = researchPrompt.pipe(this.llm).pipe(new StringOutputParser());
        const queries = await researchChain.invoke({ topic: state.topic });
        
        const searchQueries = queries.split('\n').filter((q: string) => q.trim().length > 0);
        const researchData: string[] = [];

        // Perform web searches for each query
        for (const query of searchQueries.slice(0, 5)) { // Limit to 5 queries
          try {
            const searchResults = await this.webResearcher.search(query.trim());
            if (searchResults?.results?.length > 0) {
              const topResults = searchResults.results.slice(0, 3);
              for (const result of topResults) {
                researchData.push(`Source: ${result.title}\nURL: ${result.url}\nSnippet: ${result.snippet}`);
              }
            }
          } catch (error) {
            console.warn(`Search failed for query: ${query}`, error);
          }
        }

        return {
          ...state,
          research_data: researchData,
          current_step: "research_complete"
        };
      } catch (error) {
        console.error("Research phase failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Research failed: ${error}`],
          current_step: "research_failed"
        };
      }
    };

    // Define the outline generation node
    const outlineNode = async (state: BlogGenerationStateType) => {
      console.log("📝 Generating article outline...");
      
      try {
        const outlinePrompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an elite content strategist and SEO architect. Create a detailed, battle-tested blog post outline that dominates search rankings and captivates readers.

          🎯 ADVANCED OUTLINE REQUIREMENTS (2025 STANDARDS):
          
          📋 TITLE MASTERY:
          - Create a magnetic, click-worthy title with emotional triggers
          - Include power words: "Ultimate", "Complete", "Proven", "Expert", "2025"
          - Integrate primary keyword naturally
          - Optimize length: 50-60 characters for SEO
          - Add benefit or transformation promise
          
          🏗️ STRUCTURE EXCELLENCE:
          - Use strategic HTML heading tags (h1, h2, h3, h4) with proper hierarchy
          - Design 6-12 main sections that flow logically
          - Include compelling subsections that dive deep
          - Add hook-driven introduction (question, stat, or bold statement)
          - Create strong conclusion with clear next steps
          - Plan strategic call-to-action placements
          
          💎 CONTENT DIFFERENTIATION:
          - Unique angles and fresh perspectives on the topic
          - Original research findings or data analysis
          - Personal stories, case studies, and real examples
          - Data-driven insights with specific metrics
          - Contrarian viewpoints when appropriate (backed by evidence)
          - Step-by-step actionable frameworks
          - Expert quotes and industry insights
          - Future predictions and emerging trends
          
          🎨 ENGAGEMENT ELEMENTS:
          - Interactive element suggestions (polls, quizzes, calculators, tables)
          - Visual content placement (infographics, charts, comparison tables, screenshots)
          - "Pro Tip" and "Quick Win" callout boxes
          - "Common Mistakes" warning sections
          - FAQ section with voice search optimization
          - Social proof integration points (stats, testimonials, case studies)
          - Pattern interrupts every 300-400 words
          
          📊 WORD COUNT & PACING:
          - Add estimated word counts per section
          - Plan reading flow with varied section lengths
          - Include strategic content breaks
          - Total article reading time estimate
          
          🔍 SEO OPTIMIZATION STRATEGY:
          - Create engaging meta description with action words (150-160 chars)
          - Suggest primary keyword + 3-5 secondary keywords
          - Include long-tail keyword opportunities
          - Plan for featured snippets optimization (definitions, lists, tables, steps)
          - Voice search question format integration
          - Internal linking opportunities with anchor text
          - Schema markup suggestions (Article, FAQ, HowTo)
          - E-E-A-T signal placement (expertise, experience, authority, trust)
          
          🎯 SEARCH INTENT ALIGNMENT:
          - Match outline to user search intent
          - Address "People Also Ask" questions
          - Cover related searches comprehensively
          - Include comparison sections if relevant
          - Add troubleshooting/FAQ for problem-solving intent
          
          TONE: {tone}
          LENGTH TARGET: {length}
          CURRENT YEAR: 2025
          
          Research Data Available:
          {research_data}
          
          Format as structured HTML outline with detailed content planning guidance that any skilled writer can follow to create exceptional, ranking content.`],
          ["human", "Create a next-level, comprehensive outline for: {topic}"]
        ]);

        const outlineChain = outlinePrompt.pipe(this.llm).pipe(new StringOutputParser());
        const outline = await outlineChain.invoke({
          topic: state.topic,
          tone: state.tone,
          length: state.length,
          research_data: state.research_data?.join('\n\n') || ''
        });

        return {
          ...state,
          outline,
          current_step: "outline_complete"
        };
      } catch (error) {
        console.error("Outline generation failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Outline generation failed: ${error}`],
          current_step: "outline_failed"
        };
      }
    };

    // Define the section writing node
    const sectionWritingNode = async (state: BlogGenerationStateType) => {
      console.log("✍️ Writing article sections...");
      
      try {
        // Extract section headings from outline
        const sectionRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
        const sections: Record<string, string> = {};
        let match;
        
        while ((match = sectionRegex.exec(state.outline || '')) !== null) {
          const sectionTitle = match[1].replace(/<[^>]*>/g, '').trim();
          
          const sectionPrompt = ChatPromptTemplate.fromMessages([
            ["system", `You are a master content creator who writes engaging, professional content that captivates readers and ranks #1 on Google. Write a comprehensive section that's both informative and irresistibly engaging.

            SECTION TO WRITE: {section_title}
            TOPIC CONTEXT: {topic}
            TONE: {tone}
            CURRENT YEAR: 2025
            
            🎯 ADVANCED SECTION WRITING FRAMEWORK:
            
            ✅ STRUCTURE & FORMATTING MASTERY:
            - Use semantic HTML5 tags for accessibility and SEO
            - Include proper heading hierarchy (h3, h4 for subsections)
            - Create scannable content with bullet points and numbered lists
            - Add relevant tables, comparison charts, or code blocks
            - Include styled <blockquote> for key insights and expert quotes
            - Use <mark> or <strong> tags for highlighting critical concepts
            - Add visual breaks every 200-300 words for better readability
            
            ✅ CONTENT EXCELLENCE STANDARDS:
            - START: Hook with compelling question, surprising statistic, or bold statement
            - DEVELOP: Include 2-3 real-world examples or case studies
            - GUIDE: Add actionable tips and step-by-step instructions
            - SUPPORT: Incorporate data, statistics, and research findings
            - VALIDATE: Include expert quotes or industry insights
            - CLOSE: Mini-conclusion with key takeaway and smooth transition
            
            ✅ ENGAGEMENT AMPLIFICATION:
            - Add interactive elements like checklists and worksheets
            - Include "Pro Tip 💡" and "Common Mistake ⚠️" callouts
            - Create comparison tables for different approaches/tools
            - Add FAQ-style Q&A within sections when relevant
            - Include relevant emojis strategically (not overused)
            - Use bucket brigades: "Here's the truth:", "But wait...", "The bottom line:"
            - Add pattern interrupts (questions, bold statements, surprising facts)
            
            ✅ SEO & READABILITY OPTIMIZATION:
            - Integrate semantic keywords naturally (no keyword stuffing)
            - Vary sentence length: mix short (5-10 words) and medium (15-20 words)
            - Include internal linking opportunities with descriptive anchor text
            - Add schema markup suggestions in HTML comments
            - Optimize for featured snippets (use "What is", "How to", "Why" formats)
            - Use transition words for better flow (However, Therefore, Moreover, Additionally)
            
            ✅ VALUE DELIVERY FRAMEWORK:
            - Make every sentence count - remove fluff and filler words
            - Provide specific, actionable advice (not generic platitudes)
            - Include quantifiable metrics and benchmarks
            - Share insider tips and lesser-known strategies
            - Address common objections and concerns
            - Give readers something they can implement immediately
            
            ✅ STORYTELLING ELEMENTS:
            - Use mini-stories or anecdotes to illustrate points
            - Include before/after scenarios
            - Add relatable examples from everyday life
            - Use analogies and metaphors for complex concepts
            - Create emotional connection with reader's pain points
            
            Research Data Available:
            {research_data}
            
            Return professionally formatted HTML content that's engaging, valuable, and optimized for both search engines and human readers. Make it so good that readers want to bookmark, share, and implement immediately.`],
            ["human", "Write an exceptional, engaging section: {section_title}"]
          ]);

          const sectionChain = sectionPrompt.pipe(this.llm).pipe(new StringOutputParser());
          const sectionContent = await sectionChain.invoke({
            topic: state.topic,
            section_title: sectionTitle,
            tone: state.tone,
            research_data: state.research_data?.join('\n\n') || ''
          });

          sections[sectionTitle] = sectionContent;
        }

        return {
          ...state,
          sections,
          current_step: "sections_complete"
        };
      } catch (error) {
        console.error("Section writing failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Section writing failed: ${error}`],
          current_step: "sections_failed"
        };
      }
    };

    // Define the final assembly and polish node
    const finalPolishNode = async (state: BlogGenerationStateType) => {
      console.log("✨ Final polish and assembly...");
      
      try {
        const polishPrompt = ChatPromptTemplate.fromMessages([
          ["system", `You are an elite editor, SEO specialist, and content strategist. Transform the provided content into a magazine-quality, next-level blog article that dominates 2025 search rankings and captivates readers.

          🎯 MASTER CONTENT ASSEMBLY & POLISH FRAMEWORK:
          
          📝 ARTICLE STRUCTURE PERFECTION:
          1. **Title Mastery**
             - Eye-catching title with power words and emotional triggers
             - Include primary keyword + benefit/transformation
             - Optimize for 50-60 characters for perfect SEO display
             - Add year "2025" for recency signals
          
          2. **Meta & SEO Foundation**
             - Compelling meta description with action words and FOMO
             - Include primary keyword in first 120 characters
             - Add call-to-action in meta description
             - Character count: 150-160 (not a character more or less)
          
          3. **Introduction Excellence** (First 300 words)
             - Hook: Start with question, statistic, or bold statement
             - Problem identification: Address reader's pain point
             - Promise: What they'll learn/gain from reading
             - Credibility: Brief authority signal
             - Transition: Smooth bridge to first section
          
          4. **Table of Contents** (For 1500+ word articles)
             - Add clickable jump links for easy navigation
             - Use benefit-driven section names
             - Include emoji icons for visual appeal
             - Improve user experience and dwell time
          
          5. **Body Content Optimization**
             - Well-structured sections with proper H2/H3/H4 hierarchy
             - Strategic keyword placement (natural, not stuffed)
             - Pattern interrupts every 300-400 words
             - Visual breaks and engagement elements
             - Transition phrases between sections
          
          6. **Call-to-Action Strategy**
             - Early CTA (after intro, 20% through article)
             - Mid-content CTA (at 50% mark, after high-value section)
             - Final CTA (in conclusion with clear next steps)
             - Make CTAs contextual and value-driven
          
          7. **Conclusion Mastery**
             - Recap key takeaways (3-5 bullet points)
             - Reinforce main benefit/transformation
             - Clear next steps or action items
             - Strong final CTA with urgency or value
             - Leave reader inspired and empowered
          
          8. **Enhanced Sections**
             - Author bio with expertise highlights and credibility
             - FAQ section optimized for voice search and featured snippets
             - Related articles suggestions (3-5 internal links)
             - Resource section with tools/templates
             - Social proof section (testimonials, case studies, statistics)
          
          🚀 ADVANCED HTML FORMATTING:
          - Use semantic HTML5 tags: <article>, <section>, <aside>, <nav>
          - Add schema markup in HTML comments: <!-- schema: Article -->
          - Include ARIA labels for accessibility: aria-label="Main content"
          - Create visually appealing content blocks with proper styling
          - Add progress indicators for long-form content
          - Include social sharing meta tags optimization
          - Optimize images with descriptive alt text in placeholders
          
          💎 CONTENT ENHANCEMENT ARSENAL:
          - Add compelling statistics with sources
          - Include expert quotes with proper attribution
          - Create actionable takeaways and checklists
          - Add "Key Takeaway 🎯" and "Pro Tip 💡" sections
          - Include "Common Mistake ⚠️" warnings
          - Add future predictions and industry trends
          - Insert personal anecdotes or case studies
          - Create comparison tables with styling
          - Add before/after examples
          
          📈 SEO & ENGAGEMENT OPTIMIZATION:
          - **Featured Snippets**: Optimize for position zero
            * Definition boxes (What is...)
            * Numbered lists (How to... in X steps)
            * Comparison tables (X vs Y)
            * FAQ format with direct answers
          
          - **Keyword Strategy**:
            * Primary keyword: Title, H1, first 100 words, conclusion
            * Secondary keywords: H2s, throughout content naturally
            * Long-tail keywords: H3s, FAQ section
            * LSI keywords: Body paragraphs, organically integrated
          
          - **Internal Linking**:
            * 3-5 contextual internal links with descriptive anchor text
            * Link to related content naturally in flow
            * Include "Related Reading" section
          
          - **Voice Search Optimization**:
            * Natural, conversational language
            * Question-based headings and FAQ
            * Direct, concise answers to questions
          
          - **E-E-A-T Signals**:
            * Experience: First-hand insights and real examples
            * Expertise: Author credentials and subject knowledge
            * Authoritativeness: Data citations and expert quotes
            * Trustworthiness: Accurate info, proper sources, transparency
          
          🎨 VISUAL & INTERACTIVE ELEMENTS:
          - Add descriptive image placeholders with detailed alt text
          - Suggest infographic opportunities (data visualization)
          - Recommend chart and graph placements (statistics, trends)
          - Create quotable social media snippets (tweetable quotes)
          - Add interactive element suggestions (calculators, quizzes, polls)
          - Include video embed recommendations
          - Add downloadable resource mentions (PDFs, templates, checklists)
          
          ⚡ ENGAGEMENT MAXIMIZATION:
          - Bucket brigades: "Here's the deal:", "The truth is:", "Listen..."
          - Power words: Ultimate, Proven, Revolutionary, Essential, Transform
          - Emotional triggers: Curiosity, fear of missing out, desire for success
          - Specificity: Use exact numbers (not "many" but "47%")
          - Credibility markers: "According to [Source]", "Research shows"
          - Social proof: "10,000+ readers", "Trusted by industry leaders"
          
          🎯 CONVERSION OPTIMIZATION:
          - Value-first CTAs: "Get Your Free Template", "Start Your Transformation"
          - Urgency elements: "Limited Time", "Join 1,000+ Readers Today"
          - Risk reversal: "No Credit Card Required", "Cancel Anytime"
          - Benefit-driven: Focus on what reader gains, not features
          - Multiple CTA types: Email signup, resource download, next article
          
          TONE: {tone}
          TARGET LENGTH: {length}
          PUBLICATION YEAR: 2025
          
          OUTLINE:
          {outline}
          
          SECTIONS:
          {sections}
          
          Create a masterpiece article that readers will love and search engines will rank highly.`],
          ["human", "Create the ultimate, next-level article for: {topic}"]
        ]);

        const polishChain = polishPrompt.pipe(this.llm).pipe(new StringOutputParser());
        const finalArticle = await polishChain.invoke({
          topic: state.topic,
          tone: state.tone,
          length: state.length,
          outline: state.outline || '',
          sections: Object.entries(state.sections || {})
            .map(([title, content]) => `<h2>${title}</h2>\n${content}`)
            .join('\n\n')
        });

        // Extract metadata with enhanced parsing
        const metaDescMatch = finalArticle.match(/<!-- Meta Description: (.*?) -->/);
        const keywordsMatch = finalArticle.match(/<!-- Keywords: (.*?) -->/);
        const metaDescription = metaDescMatch ? metaDescMatch[1] : 
          finalArticle.substring(0, 160).replace(/<[^>]*>/g, '').trim() + '...';
        
        // Extract keywords from content if not found in comments
        const keywords = keywordsMatch ? 
          keywordsMatch[1].split(',').map((k: string) => k.trim()) :
          this.extractKeywordsFromContent(finalArticle, state.topic);
        
        // Enhanced reading time calculation
        const wordCount = finalArticle.replace(/<[^>]*>/g, '').split(/\s+/).filter((w: string) => w.length > 0).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 250)); // 250 WPM average

        return {
          ...state,
          final_article: finalArticle,
          metadata: {
            meta_description: metaDescription,
            keywords: keywords,
            reading_time: readingTime
          },
          current_step: "complete"
        };
      } catch (error) {
        console.error("Final polish failed:", error);
        return {
          ...state,
          errors: [...(state.errors || []), `Final polish failed: ${error}`],
          current_step: "polish_failed"
        };
      }
    };

    // Create the state graph
    const workflow = new StateGraph(BlogGenerationState)
      .addNode("research", researchNode)
      .addNode("outline", outlineNode)
      .addNode("sections", sectionWritingNode)
      .addNode("polish", finalPolishNode)
      .addEdge(START, "research")
      .addEdge("research", "outline")
      .addEdge("outline", "sections")
      .addEdge("sections", "polish")
      .addEdge("polish", END);

    // Compile the graph
    this.graph = workflow.compile({
      checkpointer: new MemorySaver()
    });
  }

  // Enhanced main method to generate next-level blog posts
  async generateNextLevelBlogPost(
    topic: string,
    tone: string = "professional",
    length: string = "medium",
    options: {
      includeInteractiveElements?: boolean;
      addUniqueEnhancements?: boolean;
      generateAdvancedMetadata?: boolean;
    } = {}
  ): Promise<{
    article: string;
    metadata: {
      meta_description: string;
      keywords: string[];
      reading_time: number;
      social_media_snippets?: string[];
      featured_snippet_optimized?: string;
      schema_markup?: string;
    };
    research_data: string[];
    outline: string;
    sections: Record<string, string>;
    errors: string[];
    enhancements: {
      uniqueness_applied: boolean;
      interactive_elements_added: boolean;
      advanced_metadata_generated: boolean;
    };
  }> {
    try {
      // First, run the base generation pipeline
      console.log(`🚀 Starting next-level blog generation for topic: ${topic}`);
      const baseResult = await this.generateBlogPost(topic, tone, length);
      
      // Validate base result
      if (!baseResult || !baseResult.article) {
        console.error("Base generation failed - no article produced");
        throw new Error("Base blog generation failed to produce content");
      }
      
      console.log(`✅ Base article generated: ${baseResult.article.length} characters`);
      
      let enhancedArticle = baseResult.article;
      let enhancedMetadata = baseResult.metadata || {
        meta_description: "",
        keywords: [],
        reading_time: 0
      };
      const enhancements = {
        uniqueness_applied: false,
        interactive_elements_added: false,
        advanced_metadata_generated: false
      };

      // Apply enhancements with individual try-catch blocks for each
      // This ensures one failing enhancement doesn't break the whole process
      
      // Apply uniqueness enhancements
      if (options.addUniqueEnhancements !== false) {
        try {
          console.log("🚀 Applying uniqueness enhancements...");
          const enhanced = await this.enhanceArticleUniqueness(
            topic,
            enhancedArticle,
            baseResult.research_data || []
          );
          if (enhanced && enhanced.length > 0) {
            enhancedArticle = enhanced;
            enhancements.uniqueness_applied = true;
            console.log("✅ Uniqueness enhancements applied");
          }
        } catch (error) {
          console.warn("⚠️ Uniqueness enhancement failed, using base article:", error);
        }
      }

      // Add interactive elements
      if (options.includeInteractiveElements !== false) {
        try {
          console.log("🎮 Adding interactive elements...");
          const enhanced = await this.addInteractiveElements(enhancedArticle);
          if (enhanced && enhanced.length > 0) {
            enhancedArticle = enhanced;
            enhancements.interactive_elements_added = true;
            console.log("✅ Interactive elements added");
          }
        } catch (error) {
          console.warn("⚠️ Interactive elements enhancement failed, using current article:", error);
        }
      }

      // Generate advanced metadata
      if (options.generateAdvancedMetadata !== false) {
        try {
          console.log("📊 Generating advanced metadata...");
          const advancedMeta = await this.generateAdvancedMetadata(enhancedArticle, topic);
          if (advancedMeta) {
            enhancedMetadata = {
              ...enhancedMetadata,
              ...advancedMeta
            };
            enhancements.advanced_metadata_generated = true;
            console.log("✅ Advanced metadata generated");
          }
        } catch (error) {
          console.warn("⚠️ Advanced metadata generation failed, using base metadata:", error);
        }
      }

      console.log(`🎉 Next-level blog post complete with enhancements:`, enhancements);

      return {
        article: enhancedArticle,
        metadata: enhancedMetadata,
        research_data: baseResult.research_data || [],
        outline: baseResult.outline || "",
        sections: baseResult.sections || {},
        errors: baseResult.errors || [],
        enhancements
      };
    } catch (error) {
      console.error("❌ Next-level blog generation failed:", error);
      throw error;
    }
  }

  // Stream the next-level generation process for real-time updates
  async *generateNextLevelBlogPostStream(
    topic: string,
    tone: string = "professional",
    length: string = "medium",
    options: {
      includeInteractiveElements?: boolean;
      addUniqueEnhancements?: boolean;
      generateAdvancedMetadata?: boolean;
    } = {}
  ) {
    yield { step: "initializing", message: "Starting next-level blog generation..." };
    
    // First run the base pipeline with streaming
    const baseStream = this.generateBlogPostStream(topic, tone, length);
    let baseResult: any = null;
    
    for await (const update of baseStream) {
      yield update;
      if (update.step === "complete" || update.data?.current_step === "complete") {
        baseResult = update.data;
      }
    }
    
    if (!baseResult?.final_article) {
      yield { step: "error", message: "Base generation failed" };
      return;
    }
    
    let enhancedArticle = baseResult.final_article;
    const enhancements = {
      uniqueness_applied: false,
      interactive_elements_added: false,
      advanced_metadata_generated: false
    };

    try {
      // Apply enhancements with progress updates
      if (options.addUniqueEnhancements !== false) {
        yield { step: "enhancing", message: "🚀 Applying uniqueness enhancements..." };
        enhancedArticle = await this.enhanceArticleUniqueness(
          topic,
          enhancedArticle,
          baseResult.research_data || []
        );
        enhancements.uniqueness_applied = true;
        yield { step: "enhanced", message: "✅ Uniqueness enhancements applied" };
      }

      if (options.includeInteractiveElements !== false) {
        yield { step: "interactive", message: "🎮 Adding interactive elements..." };
        enhancedArticle = await this.addInteractiveElements(enhancedArticle);
        enhancements.interactive_elements_added = true;
        yield { step: "interactive_complete", message: "✅ Interactive elements added" };
      }

      if (options.generateAdvancedMetadata !== false) {
        yield { step: "metadata", message: "📊 Generating advanced metadata..." };
        const advancedMeta = await this.generateAdvancedMetadata(enhancedArticle, topic);
        enhancements.advanced_metadata_generated = true;
        yield { 
          step: "metadata_complete", 
          message: "✅ Advanced metadata generated",
          data: { metadata: advancedMeta }
        };
      }

      yield {
        step: "complete",
        message: "🎉 Next-level blog post generated successfully!",
        data: {
          article: enhancedArticle,
          metadata: baseResult.metadata,
          research_data: baseResult.research_data,
          outline: baseResult.outline,
          sections: baseResult.sections,
          errors: baseResult.errors,
          enhancements
        }
      };

    } catch (error) {
      yield { 
        step: "enhancement_error", 
        message: `Enhancement failed: ${error}. Using base article.`,
        data: baseResult
      };
    }
  }

  // Advanced article enhancement methods
  private async enhanceArticleUniqueness(
    topic: string,
    baseArticle: string,
    researchData: string[]
  ): Promise<string> {
    try {
      const enhancementPrompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a content innovation expert. Take this base article and make it truly unique and next-level by adding:

        🔥 UNIQUENESS ENHANCERS:
        - Contrarian viewpoints or myth-busting sections
        - Personal stories and real-world case studies
        - Industry predictions for 2025-2026
        - Step-by-step frameworks and methodologies
        - Comparison tables and decision matrices
        - Interactive checklists and assessments
        - Quote collections from industry experts
        - Data visualizations and infographic descriptions
        
        🎯 FORMATTING UPGRADES:
        - Add compelling subheadings with power words
        - Include "Quick Takeaway" boxes for key points
        - Create "Pro vs. Beginner" comparison sections
        - Add "Common Pitfalls" warning boxes
        - Include "Action Items" at the end of sections
        - Add "Related Tool/Resource" recommendations
        
        📊 CONTENT ADDITIONS:
        - Statistics with source citations
        - Real company examples and case studies
        - Tool recommendations with pros/cons
        - Cost breakdowns and ROI calculations
        - Timeline projections and milestones
        - Risk assessments and mitigation strategies
        
        Research Data:
        {research_data}
        
        Transform this into a premium, magazine-quality article that stands out from competitors.`],
        ["human", "Enhance this article to next-level quality:\n\n{article}"]
      ]);

      const chain = enhancementPrompt.pipe(this.llm).pipe(new StringOutputParser());
      return await chain.invoke({
        article: baseArticle,
        research_data: researchData.join('\n\n')
      });
    } catch (error) {
      console.error("enhanceArticleUniqueness error:", error);
      // Return original article on error
      return baseArticle;
    }
  }

  private async addInteractiveElements(article: string): Promise<string> {
    try {
      const interactivePrompt = ChatPromptTemplate.fromMessages([
        ["system", `Add interactive and engaging elements to this article:

        🎮 INTERACTIVE ELEMENTS TO ADD:
        - Self-assessment quizzes with scoring
        - Interactive checklists with checkboxes
        - Progress trackers and milestone markers
        - Comparison calculators and tools
        - Before/after scenarios
        - Decision trees and flowcharts
        - Poll questions for reader engagement
        
        🎨 VISUAL ENHANCEMENTS:
        - Detailed image descriptions for visuals
        - Infographic outlines and data points
        - Chart specifications (bar, pie, line graphs)
        - Icon suggestions for bullet points
        - Color scheme recommendations
        - Layout suggestions for better readability
        
        💡 ENGAGEMENT BOOSTERS:
        - "Try This Now" action boxes
        - "Reader Challenge" sections
        - "Share Your Experience" prompts
        - "Quick Win" opportunity highlights
        - "Next Level" advanced tips
        - Social proof testimonial slots
        
        Format everything in clean HTML with proper semantic tags.`],
        ["human", "Add interactive elements to: {article}"]
      ]);

      const chain = interactivePrompt.pipe(this.llm).pipe(new StringOutputParser());
      return await chain.invoke({ article });
    } catch (error) {
      console.error("addInteractiveElements error:", error);
      // Return original article on error
      return article;
    }
  }

  private async generateAdvancedMetadata(article: string, topic: string): Promise<{
    meta_description: string;
    keywords: string[];
    reading_time: number;
    social_media_snippets: string[];
    featured_snippet_optimized: string;
    schema_markup: string;
  }> {
    try {
      const metadataPrompt = ChatPromptTemplate.fromMessages([
        ["system", `Generate comprehensive metadata for this article:

        CREATE:
        1. Compelling meta description (150-160 chars) with action words
        2. 15-20 relevant keywords (primary, secondary, long-tail)
        3. 3-5 social media snippets for different platforms
        4. Featured snippet optimized paragraph
        5. Schema markup suggestions (JSON-LD format)
        
        Focus on 2025 SEO best practices and user engagement.`],
        ["human", "Generate metadata for article about: {topic}\n\nArticle content: {article}"]
      ]);

      const chain = metadataPrompt.pipe(this.llm).pipe(new StringOutputParser());
      const metadataText = await chain.invoke({ article, topic });

      // Parse the metadata response (simplified parsing)
      const wordCount = article.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 250); // Updated to 250 WPM for better accuracy

      return {
        meta_description: this.extractMetaDescription(metadataText),
        keywords: this.extractKeywords(metadataText),
        reading_time: readingTime,
        social_media_snippets: this.extractSocialSnippets(metadataText),
        featured_snippet_optimized: this.extractFeaturedSnippet(metadataText),
        schema_markup: this.extractSchemaMarkup(metadataText)
      };
    } catch (error) {
      console.error("generateAdvancedMetadata error:", error);
      // Return default metadata on error
      const wordCount = article.replace(/<[^>]*>/g, '').split(/\s+/).length;
      return {
        meta_description: `Complete guide to ${topic}`,
        keywords: [topic, 'guide', 'tutorial'],
        reading_time: Math.ceil(wordCount / 250),
        social_media_snippets: [`Learn about ${topic}`],
        featured_snippet_optimized: `Guide to ${topic}`,
        schema_markup: '{}'
      };
    }
  }

  private extractMetaDescription(text: string): string {
    const match = text.match(/meta description[:\s]*([^\n]+)/i);
    return match ? match[1].trim().replace(/['"]/g, '') : '';
  }

  private extractKeywords(text: string): string[] {
    const match = text.match(/keywords[:\s]*([^\n]+)/i);
    if (!match) return [];
    return match[1].split(',').map(k => k.trim()).filter(k => k.length > 0);
  }

  private extractSocialSnippets(text: string): string[] {
    const snippets: string[] = [];
    const matches = text.match(/social[^:]*:[^\n]+/gi);
    if (matches) {
      matches.forEach(match => {
        const snippet = match.replace(/social[^:]*:/i, '').trim();
        if (snippet) snippets.push(snippet);
      });
    }
    return snippets;
  }

  private extractFeaturedSnippet(text: string): string {
    const match = text.match(/featured snippet[:\s]*([^\n]+)/i);
    return match ? match[1].trim() : '';
  }

  private extractSchemaMarkup(text: string): string {
    const match = text.match(/schema[^{]*(\{[^}]+\})/i);
    return match ? match[1] : '';
  }

  private extractKeywordsFromContent(content: string, topic: string): string[] {
    const cleanContent = content.replace(/<[^>]*>/g, '').toLowerCase();
    const words = cleanContent.split(/\s+/);
    const topicWords = topic.toLowerCase().split(/\s+/);
    
    // Find frequently occurring words (basic keyword extraction)
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      if (word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'].includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    // Sort by frequency and take top keywords
    const keywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
    
    // Always include topic words
    return [...topicWords, ...keywords].slice(0, 15);
  }

  // Main method to generate a blog post
  async generateBlogPost(
    topic: string,
    tone: string = "professional",
    length: string = "medium"
  ): Promise<{
    article: string;
    metadata: {
      meta_description: string;
      keywords: string[];
      reading_time: number;
    };
    research_data: string[];
    outline: string;
    sections: Record<string, string>;
    errors: string[];
  }> {
    const initialState: BlogGenerationStateType = {
      topic,
      tone,
      length,
      research_data: [],
      outline: "",
      sections: {},
      final_article: "",
      metadata: {
        meta_description: "",
        keywords: [],
        reading_time: 0
      },
      errors: [],
      current_step: "initialized"
    };

    try {
      const result = await this.graph.invoke(initialState, {
        configurable: { thread_id: `blog-${Date.now()}` }
      });

      return {
        article: result.final_article || "",
        metadata: result.metadata || {
          meta_description: "",
          keywords: [],
          reading_time: 0
        },
        research_data: result.research_data || [],
        outline: result.outline || "",
        sections: result.sections || {},
        errors: result.errors || []
      };
    } catch (error) {
      console.error("Blog generation pipeline failed:", error);
      throw new Error(`Blog generation failed: ${error}`);
    }
  }

  // Stream the generation process for real-time updates
  async *generateBlogPostStream(
    topic: string,
    tone: string = "professional",
    length: string = "medium"
  ) {
    const initialState: BlogGenerationStateType = {
      topic,
      tone,
      length,
      research_data: [],
      outline: "",
      sections: {},
      final_article: "",
      metadata: {
        meta_description: "",
        keywords: [],
        reading_time: 0
      },
      errors: [],
      current_step: "initialized"
    };

    const config = { configurable: { thread_id: `blog-stream-${Date.now()}` } };
    
    for await (const output of await this.graph.stream(initialState, config)) {
      yield {
        step: output.current_step || "processing",
        data: output
      };
    }
  }
}

// Export utility functions
export function createLangChainBlogPipeline(
  provider: 'google' | 'baseten' | 'deepseek' | 'openrouter' = 'google',
  modelName?: string,
  apiKey?: string
) {
  return new LangChainBlogPipeline(provider, modelName, apiKey);
}

// Quick function to generate next-level blog posts
export async function generateNextLevelBlog(
  topic: string,
  options: {
    provider?: 'google' | 'baseten' | 'deepseek' | 'openrouter';
    modelName?: string;
    apiKey?: string;
    tone?: string;
    length?: string;
    includeInteractiveElements?: boolean;
    addUniqueEnhancements?: boolean;
    generateAdvancedMetadata?: boolean;
  } = {}
) {
  const pipeline = createLangChainBlogPipeline(
    options.provider,
    options.modelName,
    options.apiKey
  );
  
  return await pipeline.generateNextLevelBlogPost(
    topic,
    options.tone || "professional",
    options.length || "medium",
    {
      includeInteractiveElements: options.includeInteractiveElements,
      addUniqueEnhancements: options.addUniqueEnhancements,
      generateAdvancedMetadata: options.generateAdvancedMetadata
    }
  );
}

export type { BlogGenerationStateType };
