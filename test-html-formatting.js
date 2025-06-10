// Test HTML formatting output from the generate-content API
// This script tests the enhanced HTML output formatting and display improvements

// Enhanced validation function for our formatting improvements
const validateHTMLFormatting = (content) => {
  return {
    hasHTMLHeadings: /<h[1-6][^>]*>/.test(content),
    hasStyledTables: /<table[^>]*style=/.test(content),
    hasStyledBlockquotes: /<blockquote[^>]*style=/.test(content),
    hasWordPressStructure: content.includes('<!-- Meta Description:') && /<h[1-6]/.test(content),
    hasProperHeadingHierarchy: /<h1[^>]*>/.test(content) && /<h2[^>]*>/.test(content),
    noMarkdownArtifacts: !(/\*\*.*?\*\*|\##\s|###\s/.test(content)),
    noAIStars: !(/^\*\s|\s\*\s/.test(content)),
    hasRichFormatting: /<strong>/.test(content) && /<p>/.test(content)
  };
};

const testHTMLFormatting = async () => {
  console.log('🧪 Testing Enhanced HTML Output Formatting and Display...\n');

  const baseUrl = 'http://localhost:3000';
  const endpoint = '/api/generate-content';

  // Test data for enhanced formatting
  const testCases = [
    {
      name: 'Short WordPress-Style Article (Google AI)',
      payload: {
        topic: 'Essential WordPress SEO plugins',
        aiEngine: 'gemini-2-flash',
        articleLength: 'short',
        contentType: 'guide',
        brandVoice: 'professional',
        seoKeywords: 'WordPress SEO, plugins, optimization',
        targetAudience: 'bloggers'
      }
    },
    {
      name: 'Medium Technical Comparison (Google AI)',
      payload: {
        topic: 'React vs Vue.js performance analysis',
        modelA: 'React 18',
        modelB: 'Vue.js 3',
        aiEngine: 'gemini-2-flash',
        articleLength: 'medium',
        contentType: 'comparison',
        brandVoice: 'technical',
        seoKeywords: 'React Vue performance, frontend frameworks',
        targetAudience: 'developers'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.name}`);
    console.log('Payload:', JSON.stringify(testCase.payload, null, 2));

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error ${response.status}:`, errorText);
        continue;
      }

      const result = await response.json();
      
      if (result.content) {
        console.log('✅ Content generated successfully');
        
        // Enhanced validation for our formatting improvements
        const validationResults = validateHTMLFormatting(result.content);
        
        console.log('\n📊 Enhanced Format Analysis:');
        console.log(`HTML Headings found: ${validationResults.hasHTMLHeadings ? '✅' : '❌'}`);
        console.log(`Styled Tables found: ${validationResults.hasStyledTables ? '✅' : '❌'}`);
        console.log(`Styled Blockquotes found: ${validationResults.hasStyledBlockquotes ? '✅' : '❌'}`);
        console.log(`WordPress-style structure: ${validationResults.hasWordPressStructure ? '✅' : '❌'}`);
        console.log(`Proper heading hierarchy: ${validationResults.hasProperHeadingHierarchy ? '✅' : '❌'}`);
        console.log(`No markdown artifacts: ${validationResults.noMarkdownArtifacts ? '✅' : '❌'}`);
        console.log(`No AI-style stars: ${validationResults.noAIStars ? '✅' : '❌'}`);
        console.log(`Rich HTML formatting: ${validationResults.hasRichFormatting ? '✅' : '❌'}`);
        
        // Overall score
        const totalChecks = Object.keys(validationResults).length;
        const passedChecks = Object.values(validationResults).filter(Boolean).length;
        const score = Math.round((passedChecks / totalChecks) * 100);
        console.log(`\n🎯 Overall HTML Quality Score: ${score}%`);
        
        // Show content preview (first 800 chars for better analysis)
        console.log('\n📄 Content Preview:');
        console.log(result.content.substring(0, 800) + '...\n');
        
        console.log('📊 Metadata:', JSON.stringify(result.metadata, null, 2));
        
      } else {
        console.error('❌ No content in response:', result);
      }
      
    } catch (error) {
      console.error(`❌ Request failed:`, error.message);
    }
  }
};

// Run the test
testHTMLFormatting().catch(console.error);
