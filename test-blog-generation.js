/**
 * Quick test script to verify blog generation works
 * Run with: node test-blog-generation.js
 */

async function testBlogGeneration() {
  try {
    console.log('🧪 Testing Blog Generation API...\n');
    
    const testPayload = {
      topic: "AI Technology in 2025",
      tone: "professional",
      length: "medium",
      provider: "google",
      includeInteractiveElements: true,
      addUniqueEnhancements: true,
      generateAdvancedMetadata: true
    };

    console.log('📤 Sending request to API with payload:');
    console.log(JSON.stringify(testPayload, null, 2));
    console.log('\n');

    const response = await fetch('http://localhost:3001/api/next-level-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}\n`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:');
      console.error(errorText);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('\n📋 Parsed Error Details:');
        console.error(JSON.stringify(errorJson, null, 2));
      } catch (e) {
        // Error text is not JSON
      }
      
      process.exit(1);
    }

    const data = await response.json();

    console.log('✅ API Response Received Successfully!\n');
    
    if (data.success) {
      console.log('🎉 Blog Generation SUCCESSFUL!\n');
      
      console.log('📊 Statistics:');
      console.log(`- Word Count: ${data.data.statistics.word_count}`);
      console.log(`- Reading Time: ${data.data.statistics.estimated_reading_time} min`);
      console.log(`- Sections Generated: ${data.data.statistics.sections_generated}`);
      console.log(`- Keywords Extracted: ${data.data.statistics.keywords_extracted}`);
      console.log('\n');

      console.log('🚀 Enhancements Applied:');
      console.log(`- Uniqueness Applied: ${data.data.enhancements.uniqueness_applied}`);
      console.log(`- Interactive Elements: ${data.data.enhancements.interactive_elements_added}`);
      console.log(`- Advanced Metadata: ${data.data.enhancements.advanced_metadata_generated}`);
      console.log('\n');

      console.log('📝 Article Preview (first 500 chars):');
      console.log(data.data.article.substring(0, 500) + '...\n');

      console.log('✅ ALL TESTS PASSED! Blog generation is working correctly.');
      
    } else {
      console.error('❌ API returned success=false:');
      console.error(JSON.stringify(data, null, 2));
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test Failed with Error:');
    console.error(error);
    process.exit(1);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3001', {
      method: 'HEAD'
    });
    return true;
  } catch (error) {
    console.error('❌ Server is not running on http://localhost:3001');
    console.error('   Please start the server with: npm run dev');
    return false;
  }
}

// Run the test
(async () => {
  console.log('🔍 Checking if server is running...\n');
  const serverRunning = await checkServer();
  
  if (serverRunning) {
    console.log('✅ Server is running!\n');
    await testBlogGeneration();
  } else {
    process.exit(1);
  }
})();
