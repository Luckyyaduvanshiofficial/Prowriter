#!/usr/bin/env node

// OpenRouter API Test Script
// This script tests OpenRouter connectivity and helps diagnose issues

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testOpenRouter() {
  console.log('🔍 Testing OpenRouter API Connection...\n');

  // Check API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in environment variables');
    console.log('💡 Please add your OpenRouter API key to .env.local');
    console.log('   Get one from: https://openrouter.ai/keys\n');
    return;
  }

  console.log('✅ API Key found:', apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4));

  // Test models endpoint
  try {
    console.log('\n📋 Testing /models endpoint...');
    const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!modelsResponse.ok) {
      const errorText = await modelsResponse.text();
      console.error(`❌ Models endpoint failed: ${modelsResponse.status}`);
      console.error('Error:', errorText);
      return;
    }

    const modelsData = await modelsResponse.json();
    console.log(`✅ Models endpoint successful: ${modelsData.data?.length || 0} models available`);

    // Show available models
    if (modelsData.data) {
      console.log('\n📊 Available models:');
      const relevantModels = modelsData.data
        .filter(model => 
          model.id.includes('qwen') || 
          model.id.includes('llama') || 
          model.id.includes('deepseek') ||
          model.id.includes('gemini')
        )
        .slice(0, 10);
      
      relevantModels.forEach(model => {
        console.log(`  - ${model.id} (context: ${model.context_length})`);
      });
    }

  } catch (error) {
    console.error('❌ Failed to fetch models:', error.message);
    return;
  }

  // Test chat completion
  try {
    console.log('\n💬 Testing chat completion...');
    const testRequest = {
      model: 'qwen/qwen-2.5-72b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant. Respond briefly.'
        },
        {
          role: 'user',
          content: 'Say "Hello from OpenRouter test!" and nothing else.'
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    };

    const chatResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Prowriter AI Test'
      },
      body: JSON.stringify(testRequest)
    });

    if (!chatResponse.ok) {
      const errorData = await chatResponse.text();
      console.error(`❌ Chat completion failed: ${chatResponse.status}`);
      console.error('Error:', errorData);
      
      // Provide specific debugging advice
      if (chatResponse.status === 401) {
        console.log('\n💡 Authentication error - possible causes:');
        console.log('   - Invalid API key');
        console.log('   - API key expired');
        console.log('   - Incorrect API key format');
      } else if (chatResponse.status === 402) {
        console.log('\n💡 Payment required - possible causes:');
        console.log('   - No credits remaining');
        console.log('   - Billing setup required');
        console.log('   - Check: https://openrouter.ai/credits');
      } else if (chatResponse.status === 429) {
        console.log('\n💡 Rate limit exceeded - possible causes:');
        console.log('   - Too many requests');
        console.log('   - Free tier limits reached');
        console.log('   - Try again in a few minutes');
      }
      return;
    }

    const chatData = await chatResponse.json();
    console.log('✅ Chat completion successful!');
    console.log('Response:', chatData.choices?.[0]?.message?.content);
    
    if (chatData.usage) {
      console.log(`Usage: ${chatData.usage.total_tokens} tokens`);
    }

  } catch (error) {
    console.error('❌ Chat completion error:', error.message);
    return;
  }

  console.log('\n🎉 OpenRouter API test completed successfully!');
  console.log('✅ Your OpenRouter integration is working correctly.');
}

// Test credit/account info
async function testCredits() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return;

  try {
    console.log('\n💰 Checking account credits...');
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Account info:', JSON.stringify(data, null, 2));
    } else {
      console.log('⚠️  Could not fetch credit info');
    }
  } catch (error) {
    console.log('⚠️  Credit check failed:', error.message);
  }
}

// Run tests
async function main() {
  await testOpenRouter();
  await testCredits();
  
  console.log('\n📝 Next steps if there are issues:');
  console.log('   1. Verify your API key at: https://openrouter.ai/keys');
  console.log('   2. Check your credits at: https://openrouter.ai/credits');
  console.log('   3. Review the API docs: https://openrouter.ai/docs');
  console.log('   4. Make sure .env.local has OPENROUTER_API_KEY set');
}

main().catch(console.error);
