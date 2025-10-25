// Direct test of the next-level-generate API
const testBlogGeneration = async () => {
  console.log('🧪 Testing blog generation API...\n');
  
  try {
    const response = await fetch('http://localhost:3001/api/next-level-generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: 'AI Technology in 2025',
        tone: 'professional',
        length: 'medium',
        provider: 'google',
        includeInteractiveElements: true,
        addUniqueEnhancements: true,
        generateAdvancedMetadata: true
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Status Text:', response.statusText);
    
    const data = await response.json();
    
    console.log('\n📦 Response Data Structure:');
    console.log('  - success:', data.success);
    console.log('  - message:', data.message);
    
    if (data.success) {
      console.log('\n✅ SUCCESS! Blog generated successfully!');
      console.log('\n📝 Article Preview:');
      console.log(data.data.article.substring(0, 500) + '...');
      console.log('\n📊 Statistics:');
      console.log('  - Word Count:', data.data.statistics.word_count);
      console.log('  - Reading Time:', data.data.statistics.estimated_reading_time, 'minutes');
      console.log('  - Keywords:', data.data.metadata.keywords.slice(0, 5).join(', '));
    } else {
      console.log('\n❌ FAILED! Error details:');
      console.log('  - Error:', data.error);
      console.log('  - Details:', data.details);
      console.log('  - Suggestion:', data.suggestion);
    }
    
  } catch (error) {
    console.error('\n💥 Test Failed with Error:', error.message);
  }
};

// Run the test
testBlogGeneration();
