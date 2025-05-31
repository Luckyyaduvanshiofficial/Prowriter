#!/usr/bin/env node

// Test script for multi-provider AI integration
// This script tests all three AI providers: OpenRouter, Google AI, and Together.ai

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const { createProviderClient, getModelById, AI_MODELS, AI_PROVIDERS } = require('./lib/ai-providers');

async function testProvider(providerId, modelId) {
  console.log(`\n🔧 Testing ${providerId.toUpperCase()} Provider`);
  console.log('=' .repeat(50));
  
  try {
    const client = createProviderClient(providerId);
    const model = getModelById(modelId);
    
    if (!model) {
      console.log(`❌ Model ${modelId} not found`);
      return false;
    }
    
    console.log(`📋 Model: ${model.name} (${model.modelId})`);
    console.log(`💰 Cost: ${model.costPer1000Tokens === 0 ? 'Free' : `$${model.costPer1000Tokens}/1K tokens`}`);
    console.log(`🎯 Tier: ${model.tier}`);
    
    const testPrompt = "Write a brief 100-word overview of artificial intelligence.";
    
    console.log(`🚀 Generating content...`);
    const startTime = Date.now();
    
    const response = await client.generateContent({
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ],
      model: modelId,
      temperature: 0.7,
      maxTokens: 200
    });
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`✅ Success! Generated in ${duration.toFixed(2)}s`);
    console.log(`📄 Content length: ${response.content.length} characters`);
    
    if (response.usage) {
      console.log(`📊 Usage: ${response.usage.totalTokens} total tokens (${response.usage.promptTokens} prompt + ${response.usage.completionTokens} completion)`);
    }
    
    console.log(`🔤 Preview: ${response.content.substring(0, 100)}...`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function testAllProviders() {
  console.log('🎯 AI BLOG WRITER - MULTI-PROVIDER TEST');
  console.log('=' .repeat(60));
  
  // Check environment variables
  console.log('\n🔑 Checking API Keys...');
  console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('TOGETHER_AI_API_KEY:', process.env.TOGETHER_AI_API_KEY ? '✅ Set' : '❌ Missing');
  
  // Test models from each provider
  const testModels = [
    { provider: 'openrouter', model: 'qwen-72b' },
    { provider: 'google', model: 'gemini-2-flash' },
    { provider: 'together', model: 'llama-3-3-70b-free' }
  ];
  
  const results = [];
  
  for (const test of testModels) {
    const result = await testProvider(test.provider, test.model);
    results.push({ ...test, success: result });
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('=' .repeat(30));
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${result.provider.padEnd(15)} | ${result.model.padEnd(20)} | ${status}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎯 ${successCount}/${results.length} providers working correctly`);
  
  if (successCount === results.length) {
    console.log('🎉 All providers are working! Your AI Blog Writer is ready.');
  } else {
    console.log('⚠️  Some providers failed. Check API keys and network connectivity.');
  }
}

// Run tests
testAllProviders().catch(console.error);