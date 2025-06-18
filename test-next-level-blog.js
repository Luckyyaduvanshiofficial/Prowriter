#!/usr/bin/env node

/**
 * Test script for Next-Level Blog Generation Pipeline
 * This demonstrates the enhanced capabilities of the LangChain blog pipeline
 */

const { createLangChainBlogPipeline, generateNextLevelBlog } = require('./lib/langchain-blog-pipeline.ts');

async function testNextLevelBlogGeneration() {
  console.log('🚀 Testing Next-Level Blog Generation Pipeline\n');
  
  try {
    // Test with OpenRouter/OpenAI
    console.log('📝 Generating next-level blog post...');
    
    const result = await generateNextLevelBlog('AI Content Marketing Strategies for 2025', {
      provider: 'openai',
      tone: 'professional',
      length: 'long',
      includeInteractiveElements: true,
      addUniqueEnhancements: true,
      generateAdvancedMetadata: true
    });
    
    console.log('\n✅ Generation Complete!\n');
    
    // Display results
    console.log('📊 METADATA:');
    console.log(`- Reading Time: ${result.metadata.reading_time} minutes`);
    console.log(`- Meta Description: ${result.metadata.meta_description}`);
    console.log(`- Keywords: ${result.metadata.keywords?.join(', ')}`);
    if (result.metadata.social_media_snippets) {
      console.log(`- Social Snippets: ${result.metadata.social_media_snippets.length} generated`);
    }
    
    console.log('\n🔍 RESEARCH DATA:');
    console.log(`- Sources Found: ${result.research_data.length}`);
    
    console.log('\n📋 OUTLINE SECTIONS:');
    console.log(`- Sections Generated: ${Object.keys(result.sections).length}`);
    
    console.log('\n🚀 ENHANCEMENTS APPLIED:');
    console.log(`- Uniqueness Applied: ${result.enhancements.uniqueness_applied ? '✅' : '❌'}`);
    console.log(`- Interactive Elements: ${result.enhancements.interactive_elements_added ? '✅' : '❌'}`);
    console.log(`- Advanced Metadata: ${result.enhancements.advanced_metadata_generated ? '✅' : '❌'}`);
    
    console.log('\n📄 ARTICLE PREVIEW (First 500 chars):');
    console.log(result.article.substring(0, 500) + '...');
    
    if (result.errors.length > 0) {
      console.log('\n⚠️ ERRORS ENCOUNTERED:');
      result.errors.forEach(error => console.log(`- ${error}`));
    }
    
    // Save the article
    const fs = require('fs');
    const filename = `next-level-blog-${Date.now()}.html`;
    fs.writeFileSync(filename, result.article);
    console.log(`\n💾 Article saved to: ${filename}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testStreamingGeneration() {
  console.log('\n🌊 Testing Streaming Next-Level Generation...\n');
  
  try {
    const pipeline = createLangChainBlogPipeline('openai');
    
    const stream = pipeline.generateNextLevelBlogPostStream(
      'Future of Remote Work Technology',
      'professional',
      'medium',
      {
        includeInteractiveElements: true,
        addUniqueEnhancements: true,
        generateAdvancedMetadata: true
      }
    );
    
    for await (const update of stream) {
      console.log(`📡 ${update.step}: ${update.message || 'Processing...'}`);
      
      if (update.step === 'complete') {
        console.log('\n🎉 Streaming generation complete!');
        console.log(`Article length: ${update.data?.article?.length || 0} characters`);
        break;
      }
    }
    
  } catch (error) {
    console.error('❌ Streaming test failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🧪 Starting Next-Level Blog Pipeline Tests\n');
  console.log('=' .repeat(60));
  
  await testNextLevelBlogGeneration();
  
  console.log('\n' + '=' .repeat(60));
  
  await testStreamingGeneration();
  
  console.log('\n✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testNextLevelBlogGeneration,
  testStreamingGeneration,
  runAllTests
};
