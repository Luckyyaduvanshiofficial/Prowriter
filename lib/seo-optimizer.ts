// Advanced SEO Optimization Engine
// This system automatically optimizes content for search engines with data-driven insights

export interface SEOAnalysis {
  keyword_density: { [key: string]: number };
  readability_score: number;
  meta_description: string;
  title_tags: string[];
  heading_structure: { level: number; text: string }[];
  internal_links: string[];
  external_links: string[];
  image_alt_tags: string[];
  word_count: number;
  estimated_reading_time: number;
  seo_score: number;
  suggestions: string[];
  competitor_analysis?: {
    top_ranking_keywords: string[];
    content_gaps: string[];
    recommended_improvements: string[];
  };
}

export interface KeywordResearch {
  primary_keywords: string[];
  long_tail_keywords: string[];
  semantic_keywords: string[];
  trending_topics: string[];
  search_volumes: { [key: string]: number };
  competition_scores: { [key: string]: number };
  intent_analysis: { [key: string]: 'informational' | 'transactional' | 'commercial' | 'navigational' };
}

export class SEOOptimizer {
  private static instance: SEOOptimizer;
  
  static getInstance(): SEOOptimizer {
    if (!SEOOptimizer.instance) {
      SEOOptimizer.instance = new SEOOptimizer();
    }
    return SEOOptimizer.instance;
  }

  // Generate SEO-optimized content structure
  generateSEOStructure(modelA: string, modelB: string, useCase: string): {
    title: string;
    meta_description: string;
    headings: { level: number; text: string }[];
    keywords: KeywordResearch;
    content_outline: string[];
  } {
    const keywords = this.generateKeywordResearch(modelA, modelB, useCase);
    const title = this.generateSEOTitle(modelA, modelB, useCase, keywords);
    const meta_description = this.generateMetaDescription(modelA, modelB, useCase);
    const headings = this.generateHeadingStructure(modelA, modelB, useCase);
    const content_outline = this.generateContentOutline(modelA, modelB, useCase);

    return {
      title,
      meta_description,
      headings,
      keywords,
      content_outline
    };
  }

  // Generate keyword research for AI model comparisons
  generateKeywordResearch(modelA: string, modelB: string, useCase: string): KeywordResearch {
    const baseKeywords = [
      `${modelA} vs ${modelB}`,
      `${modelA} ${modelB} comparison`,
      `${modelA} versus ${modelB}`,
      `best ai model for ${useCase}`,
      `${useCase} ai model comparison`,
      `${modelA} ${useCase} performance`,
      `${modelB} ${useCase} benchmark`,
      `ai model comparison ${new Date().getFullYear()}`,
      `${modelA} ${modelB} which is better`,
      `${useCase} llm comparison`
    ];

    const longTailKeywords = [
      `${modelA} vs ${modelB} for ${useCase} detailed comparison`,
      `${modelA} ${modelB} performance benchmarks ${useCase}`,
      `which ai model is better ${modelA} or ${modelB} for ${useCase}`,
      `${modelA} vs ${modelB} cost comparison ${useCase}`,
      `${modelA} ${modelB} speed accuracy comparison`,
      `best ${useCase} ai model ${modelA} vs ${modelB} 2024`,
      `${modelA} ${modelB} pros and cons ${useCase}`,
      `${modelA} vs ${modelB} real world ${useCase} performance`,
      `${useCase} ai model evaluation ${modelA} ${modelB}`,
      `${modelA} ${modelB} ${useCase} use case analysis`
    ];

    const semanticKeywords = [
      'artificial intelligence model comparison',
      'large language model evaluation',
      'llm performance benchmarks',
      'ai model selection guide',
      'machine learning model comparison',
      'natural language processing models',
      'conversational ai comparison',
      'ai chatbot performance',
      'language model capabilities',
      'ai model cost effectiveness'
    ];

    const trendingTopics = [
      'ai model safety comparison',
      'multimodal ai capabilities',
      'enterprise ai solutions',
      'open source vs proprietary ai',
      'ai model fine-tuning',
      'context window comparison',
      'ai model reliability',
      'production ai deployment',
      'ai model integration',
      'custom ai solutions'
    ];

    // Simulate search volumes (in real implementation, use APIs like Google Keyword Planner)
    const search_volumes: { [key: string]: number } = {};
    const competition_scores: { [key: string]: number } = {};
    const intent_analysis: { [key: string]: 'informational' | 'transactional' | 'commercial' | 'navigational' } = {};

    [...baseKeywords, ...longTailKeywords, ...semanticKeywords, ...trendingTopics].forEach(keyword => {
      search_volumes[keyword] = Math.floor(Math.random() * 10000) + 100;
      competition_scores[keyword] = Math.random() * 100;
      
      if (keyword.includes('vs') || keyword.includes('comparison') || keyword.includes('best')) {
        intent_analysis[keyword] = 'commercial';
      } else if (keyword.includes('how') || keyword.includes('what') || keyword.includes('guide')) {
        intent_analysis[keyword] = 'informational';
      } else if (keyword.includes('buy') || keyword.includes('price') || keyword.includes('cost')) {
        intent_analysis[keyword] = 'transactional';
      } else {
        intent_analysis[keyword] = 'informational';
      }
    });

    return {
      primary_keywords: baseKeywords,
      long_tail_keywords: longTailKeywords,
      semantic_keywords: semanticKeywords,
      trending_topics: trendingTopics,
      search_volumes,
      competition_scores,
      intent_analysis
    };
  }

  // Generate SEO-optimized title
  generateSEOTitle(modelA: string, modelB: string, useCase: string, keywords: KeywordResearch): string {
    const templates = [
      `${modelA} vs ${modelB}: Complete ${useCase} Comparison & Performance Analysis 2024`,
      `${modelA} vs ${modelB} for ${useCase}: Which AI Model Wins? [Detailed Comparison]`,
      `${modelA} vs ${modelB}: ${useCase} Performance, Cost & Accuracy Comparison`,
      `${modelA} vs ${modelB} Comparison: Best AI Model for ${useCase} in 2024`,
      `${modelA} vs ${modelB}: Ultimate ${useCase} Showdown - Performance & Benchmarks`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate meta description
  generateMetaDescription(modelA: string, modelB: string, useCase: string): string {
    const templates = [
      `Compare ${modelA} vs ${modelB} for ${useCase}. Detailed analysis of performance, cost, accuracy & real-world benchmarks. Find the best AI model for your needs.`,
      `${modelA} vs ${modelB} comparison for ${useCase}. Performance benchmarks, cost analysis, and expert insights to help you choose the right AI model.`,
      `Comprehensive ${modelA} vs ${modelB} comparison covering ${useCase} performance, pricing, capabilities and real-world testing results.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  // Generate heading structure
  generateHeadingStructure(modelA: string, modelB: string, useCase: string): { level: number; text: string }[] {
    return [
      { level: 1, text: `${modelA} vs ${modelB}: Complete ${useCase} Comparison` },
      { level: 2, text: 'Executive Summary' },
      { level: 2, text: `${modelA} Overview` },
      { level: 3, text: `${modelA} Key Features` },
      { level: 3, text: `${modelA} ${useCase} Performance` },
      { level: 3, text: `${modelA} Pricing & Availability` },
      { level: 2, text: `${modelB} Overview` },
      { level: 3, text: `${modelB} Key Features` },
      { level: 3, text: `${modelB} ${useCase} Performance` },
      { level: 3, text: `${modelB} Pricing & Availability` },
      { level: 2, text: 'Head-to-Head Comparison' },
      { level: 3, text: 'Performance Benchmarks' },
      { level: 3, text: 'Cost Analysis' },
      { level: 3, text: 'Feature Comparison' },
      { level: 3, text: 'Real-World Testing Results' },
      { level: 2, text: `Best Use Cases for ${modelA}` },
      { level: 2, text: `Best Use Cases for ${modelB}` },
      { level: 2, text: 'Recommendation & Conclusion' },
      { level: 2, text: 'Frequently Asked Questions' }
    ];
  }

  // Generate content outline
  generateContentOutline(modelA: string, modelB: string, useCase: string): string[] {
    return [
      `Introduction to ${modelA} vs ${modelB} for ${useCase}`,
      `Market context and importance of choosing the right AI model`,
      `Detailed analysis of ${modelA} capabilities and performance`,
      `Comprehensive evaluation of ${modelB} features and benchmarks`,
      `Side-by-side performance comparison with real data`,
      `Cost-benefit analysis and pricing comparison`,
      `Real-world testing scenarios and results`,
      `Expert recommendations based on different use cases`,
      `Implementation considerations and best practices`,
      `Future roadmap and updates for both models`,
      `Conclusion and final recommendations`
    ];
  }

  // Analyze content for SEO optimization
  analyzeContent(content: string, targetKeywords: string[]): SEOAnalysis {
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Keyword density analysis
    const keyword_density: { [key: string]: number } = {};
    targetKeywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      const matches = content.toLowerCase().split(keywordLower).length - 1;
      keyword_density[keyword] = (matches / wordCount) * 100;
    });

    // Readability score (simplified Flesch Reading Ease)
    const sentences = content.split(/[.!?]+/).length;
    const syllables = words.reduce((count, word) => count + this.countSyllables(word), 0);
    const readability_score = 206.835 - (1.015 * (wordCount / sentences)) - (84.6 * (syllables / wordCount));

    // Extract headings (simplified)
    const headings = content.match(/#{1,6}\s+(.+)/g) || [];
    const heading_structure = headings.map(h => ({
      level: h.match(/#{1,6}/)?.[0].length || 1,
      text: h.replace(/#{1,6}\s+/, '')
    }));

    // SEO score calculation
    let seo_score = 0;
    
    // Keyword density scoring
    Object.values(keyword_density).forEach(density => {
      if (density >= 0.5 && density <= 3) seo_score += 10;
      else if (density > 0) seo_score += 5;
    });

    // Word count scoring
    if (wordCount >= 1500 && wordCount <= 4000) seo_score += 20;
    else if (wordCount >= 1000) seo_score += 10;

    // Readability scoring
    if (readability_score >= 60) seo_score += 15;
    else if (readability_score >= 30) seo_score += 10;

    // Heading structure scoring
    if (heading_structure.length >= 5) seo_score += 15;
    else if (heading_structure.length >= 3) seo_score += 10;

    // Generate suggestions
    const suggestions: string[] = [];
    
    if (wordCount < 1500) {
      suggestions.push('Content is too short. Aim for at least 1500 words for better SEO performance.');
    }
    
    if (readability_score < 30) {
      suggestions.push('Content is difficult to read. Consider using shorter sentences and simpler words.');
    }
    
    if (heading_structure.length < 5) {
      suggestions.push('Add more headings to improve content structure and readability.');
    }
    
    targetKeywords.forEach(keyword => {
      if (keyword_density[keyword] < 0.5) {
        suggestions.push(`Increase usage of keyword "${keyword}" (current density: ${keyword_density[keyword].toFixed(2)}%)`);
      } else if (keyword_density[keyword] > 3) {
        suggestions.push(`Reduce usage of keyword "${keyword}" to avoid keyword stuffing (current density: ${keyword_density[keyword].toFixed(2)}%)`);
      }
    });

    return {
      keyword_density,
      readability_score,
      meta_description: this.generateMetaDescription('Model A', 'Model B', 'general'),
      title_tags: ['AI Model Comparison', 'Performance Analysis', 'Benchmark Results'],
      heading_structure,
      internal_links: [],
      external_links: [],
      image_alt_tags: [],
      word_count: wordCount,
      estimated_reading_time: readingTime,
      seo_score,
      suggestions
    };
  }

  // Helper method to count syllables
  private countSyllables(word: string): number {
    const vowels = 'aeiouy';
    let count = 0;
    let previousChar = '';
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i].toLowerCase();
      if (vowels.includes(char) && !vowels.includes(previousChar)) {
        count++;
      }
      previousChar = char;
    }
    
    // Adjust for silent 'e'
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  }

  // Generate schema markup for better SEO
  generateSchemaMarkup(modelA: string, modelB: string, useCase: string): string {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${modelA} vs ${modelB}: Complete ${useCase} Comparison`,
      "description": `Comprehensive comparison of ${modelA} and ${modelB} for ${useCase} applications`,
      "author": {
        "@type": "Organization",
        "name": "Kutumbhcraft"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Kutumbhcraft",
        "logo": {
          "@type": "ImageObject",
          "url": "https://prowriter.ai/logo.png"
        }
      },
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://prowriter.ai/comparison/${modelA}-vs-${modelB}`
      },
      "about": [
        {
          "@type": "Thing",
          "name": modelA,
          "description": `${modelA} AI model analysis and performance`
        },
        {
          "@type": "Thing",
          "name": modelB,
          "description": `${modelB} AI model analysis and performance`
        }
      ],
      "keywords": [
        `${modelA} vs ${modelB}`,
        `${useCase} AI comparison`,
        "AI model benchmarks",
        "Language model performance"
      ]
    };

    return JSON.stringify(schema, null, 2);
  }
}

// Export singleton instance
export const seoOptimizer = SEOOptimizer.getInstance();