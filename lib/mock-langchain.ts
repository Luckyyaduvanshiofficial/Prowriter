// Mock LangChain dependencies for development
export class ChatOpenAI {
  constructor(config: any) {}
  async invoke(messages: any): Promise<string> {
    return "Mock response";
  }
}

export class ChatGoogleGenerativeAI {
  constructor(config: any) {}
  async invoke(messages: any): Promise<string> {
    return "Mock response";
  }
}

export class ChatPromptTemplate {
  static fromMessages(messages: any[]) {
    return new ChatPromptTemplate();
  }
  pipe(llm: any) {
    return {
      pipe: (parser: any) => {
        return {
          invoke: async (params: any) => {
            // Return the article parameter unchanged if it exists (for enhancements)
            // This prevents the enhancement methods from breaking the article
            if (params && params.article) {
              // Check if this is a metadata generation request
              if (params.topic) {
                // Return properly formatted metadata text for parsing
                return `Meta Description: Complete guide to ${params.topic} with expert insights and best practices.
Keywords: ${params.topic}, guide, tutorial, best practices, tips, strategies, 2025, complete guide
Social Media 1: Discover everything about ${params.topic} in this comprehensive guide
Social Media 2: Master ${params.topic} with proven strategies and expert tips
Social Media 3: Complete ${params.topic} tutorial for 2025
Featured Snippet: ${params.topic} involves understanding key concepts, implementing best practices, and staying current with latest trends.
Schema: {"@context": "https://schema.org", "@type": "Article", "headline": "${params.topic}"}`;
              }
              // For article enhancements, return the article unchanged
              return params.article;
            }
            
            // Return mock content for other cases
            return "<p>Mock enhanced content with proper HTML formatting.</p>";
          }
        };
      },
      // Direct invoke without parser
      invoke: async (params: any) => {
        if (params && params.article) {
          if (params.topic) {
            return `Meta Description: Complete guide to ${params.topic} with expert insights and best practices.
Keywords: ${params.topic}, guide, tutorial, best practices, tips, strategies, 2025, complete guide
Social Media 1: Discover everything about ${params.topic} in this comprehensive guide
Social Media 2: Master ${params.topic} with proven strategies and expert tips  
Social Media 3: Complete ${params.topic} tutorial for 2025
Featured Snippet: ${params.topic} involves understanding key concepts, implementing best practices, and staying current with latest trends.
Schema: {"@context": "https://schema.org", "@type": "Article", "headline": "${params.topic}"}`;
          }
          return params.article;
        }
        return "<p>Mock enhanced content with proper HTML formatting.</p>";
      }
    };
  }
}

export class StringOutputParser {
  constructor() {}
  
  // Mock the parse method that StringOutputParser would have
  parse(text: string): string {
    return text;
  }
  
  // Mock the invoke method
  async invoke(input: any): Promise<string> {
    if (typeof input === 'string') {
      return input;
    }
    return String(input);
  }
}

export class StateGraph {
  constructor(state: any) {}
  addNode(name: string, fn: any) { return this; }
  addEdge(from: any, to: any) { return this; }
  compile(config: any) {
    return {
      invoke: async (state: any, config: any) => {
        try {
          // Create a proper mock article with realistic content
          const topic = state.topic || 'AI Technology';
          
          const mockArticle = `<h1>${topic}: A Comprehensive Guide</h1>

<!-- Meta Description: Complete guide to ${topic}. Learn best practices, overcome challenges, and stay ahead with expert insights for 2025. -->

<p>Welcome to this comprehensive guide on ${topic}. In this article, we'll explore everything you need to know about this fascinating subject, from fundamentals to advanced techniques.</p>

<h2>Introduction</h2>
<p>The world of ${topic} continues to evolve rapidly, offering new opportunities and challenges. Understanding the fundamentals is crucial for anyone looking to stay ahead in this dynamic field. Whether you're a beginner or an experienced professional, this guide will provide valuable insights.</p>

<h2>Key Concepts and Fundamentals</h2>
<p>To fully grasp ${topic}, it's important to understand several core concepts that form the foundation of this domain. These principles will guide you through more advanced topics and help you make informed decisions.</p>

<ul>
  <li><strong>Core Principle 1:</strong> Essential foundation that every professional should understand</li>
  <li><strong>Core Principle 2:</strong> Critical concept that drives success in this field</li>
  <li><strong>Core Principle 3:</strong> Advanced strategy for optimizing results</li>
</ul>

<h2>Best Practices and Proven Strategies</h2>
<p>Implementing effective strategies requires following proven methodologies. Here are the most important best practices to consider when working with ${topic}.</p>

<h3>Strategy 1: Foundational Approach</h3>
<p>This fundamental strategy has been proven across thousands of implementations and consistently delivers outstanding results. By focusing on core principles, you can build a solid foundation for success.</p>

<h3>Strategy 2: Advanced Optimization</h3>
<p>For those ready to take their skills to the next level, this advanced optimization technique can dramatically improve outcomes and efficiency.</p>

<h2>Common Challenges and Solutions</h2>
<p>Every field has its obstacles, and ${topic} is no exception. By understanding common pitfalls and their solutions, you can avoid costly mistakes and achieve better results.</p>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Challenge</th>
      <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left;">Solution</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Implementation complexity</td>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Follow step-by-step guidelines and start with basics</td>
    </tr>
    <tr>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Resource constraints</td>
      <td style="border: 1px solid #dee2e6; padding: 12px;">Optimize workflows and prioritize high-impact activities</td>
    </tr>
  </tbody>
</table>

<h2>Future Trends and Predictions</h2>
<p>Looking ahead to 2025 and beyond, ${topic} shows promising developments that will shape the industry. Staying informed about these trends will help you make strategic decisions and maintain a competitive edge.</p>

<blockquote style="border-left: 4px solid #007cba; padding: 16px; margin: 20px 0; background-color: #f8f9fa; font-style: italic;">
  <p><strong>Expert Insight:</strong> The future of ${topic} is incredibly promising, with innovations emerging that will transform how we approach this field. Early adopters will have significant advantages.</p>
</blockquote>

<h2>Frequently Asked Questions</h2>

<h3>What is ${topic} and why is it important?</h3>
<p>${topic} is a comprehensive approach that combines proven strategies with innovative techniques to achieve outstanding results. It's important because it addresses critical challenges and opens new opportunities for growth and success.</p>

<h3>How do I get started with ${topic}?</h3>
<p>Begin by understanding the core concepts outlined in this guide, then gradually implement best practices. Start small, measure results, and scale what works. Consider consulting with experts for personalized guidance.</p>

<h3>What are the most common mistakes to avoid?</h3>
<p>The most common mistakes include rushing implementation without proper planning, ignoring fundamental principles, and failing to adapt strategies to specific contexts. Always prioritize learning and continuous improvement.</p>

<h2>Conclusion</h2>
<p>In conclusion, ${topic} offers tremendous potential for those willing to invest time in understanding its complexities. By following the guidelines outlined in this article, implementing best practices, and staying current with emerging trends, you'll be well-positioned for success in 2025 and beyond.</p>

<p>Remember to start with the fundamentals, apply proven strategies, and continuously adapt your approach based on results and new developments in the field.</p>`.trim();
          
          // Create realistic metadata
          const mockKeywords = [
            topic.toLowerCase(),
            'guide',
            'best practices',
            'strategies',
            'tips',
            '2025',
            'tutorial',
            'complete guide'
          ];
          
          const wordCount = mockArticle.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
          const readingTime = Math.ceil(wordCount / 250); // Average reading speed
          
          return {
            final_article: mockArticle,
            metadata: { 
              meta_description: `Complete guide to ${topic}. Learn best practices, overcome challenges, and stay ahead with expert insights for 2025.`,
              keywords: mockKeywords,
              reading_time: readingTime,
              social_media_snippets: [
                `Discover the essentials of ${topic} in our comprehensive guide for 2025.`,
                `Master ${topic} with proven strategies and expert insights.`,
                `Everything you need to know about ${topic} - complete professional guide.`
              ],
              featured_snippet_optimized: `${topic} is a comprehensive approach that involves understanding key concepts, implementing best practices, and staying current with trends. This guide covers fundamentals, strategies, and future predictions.`,
              schema_markup: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": `${topic}: A Comprehensive Guide`,
                "description": `Complete guide to ${topic}`,
                "wordCount": wordCount,
                "datePublished": new Date().toISOString(),
                "dateModified": new Date().toISOString()
              })
            },
            research_data: [
              `Research finding 1 about ${topic}: Industry analysis shows significant growth`,
              `Research finding 2 about ${topic}: Expert recommendations for implementation`,
              `Research finding 3 about ${topic}: Latest trends and future predictions`
            ],
            outline: `# Article Outline: ${topic}

## 1. Introduction
- Overview of ${topic}
- Why it matters in 2025
- What readers will learn

## 2. Key Concepts and Fundamentals
- Core principles
- Essential terminology
- Foundational knowledge

## 3. Best Practices and Strategies
- Proven methodologies
- Implementation strategies
- Success factors

## 4. Common Challenges and Solutions
- Typical obstacles
- Effective solutions
- Expert recommendations

## 5. Future Trends
- Emerging developments
- Industry predictions
- Strategic considerations

## 6. FAQ Section
- Common questions answered
- Expert insights

## 7. Conclusion
- Key takeaways
- Next steps
- Final recommendations`.trim(),
            sections: { 
              "Introduction": `<p>The world of ${topic} continues to evolve rapidly, offering new opportunities and challenges...</p>`,
              "Key Concepts": `<p>To fully grasp ${topic}, it's important to understand several core concepts...</p>`,
              "Best Practices": `<p>Implementing effective strategies requires following proven methodologies...</p>`,
              "Challenges": `<p>Every field has its obstacles, and ${topic} is no exception...</p>`,
              "Future Trends": `<p>Looking ahead to 2025 and beyond, ${topic} shows promising developments...</p>`,
              "FAQ": `<p>Answers to the most common questions about ${topic}...</p>`,
              "Conclusion": `<p>In conclusion, ${topic} offers tremendous potential for success...</p>`
            },
            errors: [],
            current_step: "complete"
          };
        } catch (error) {
          console.error("Mock StateGraph invoke error:", error);
          // Return a minimal valid structure even on error
          return {
            final_article: "<h1>Error Generating Content</h1><p>An error occurred during content generation. Please try again.</p>",
            metadata: {
              meta_description: "Error during content generation",
              keywords: ["error"],
              reading_time: 1
            },
            research_data: [],
            outline: "",
            sections: {},
            errors: [error instanceof Error ? error.message : "Unknown error"],
            current_step: "failed"
          };
        }
      },
      stream: async function* (state: any, config: any) {
        yield { current_step: "research", ...state };
        yield { current_step: "outline", ...state };
        yield { current_step: "sections", ...state };
        yield { current_step: "complete", ...state };
      }
    };
  }
}

export const Annotation = {
  Root: (obj: any) => ({ State: obj })
};

export class MemorySaver {}

export const START = "START";
export const END = "END";

// Mock additional exports
export const BaseMessage = {};
export const HumanMessage = {};
export const SystemMessage = {};
export const MessagesPlaceholder = {};
export const RunnableSequence = {};
export const RunnablePassthrough = {};
export const Tool = {};
export const WebBrowser = {};
