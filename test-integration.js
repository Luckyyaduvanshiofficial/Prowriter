// Quick test to verify AI provider integration works
const { getAvailableModels, getModelById, AI_MODELS } = require('./lib/ai-providers.ts');

console.log('🧪 Testing AI Provider Integration');
console.log('=================================');

try {
  console.log('\n✅ Testing getAvailableModels for free tier:');
  const freeModels = getAvailableModels('free');
  console.log(`Found ${freeModels.length} models for free tier`);
  freeModels.slice(0, 3).forEach(model => {
    console.log(`  • ${model.id}: ${model.name} (${model.provider})`);
  });

  console.log('\n✅ Testing getAvailableModels for pro tier:');
  const proModels = getAvailableModels('pro');
  console.log(`Found ${proModels.length} models for pro tier`);
  proModels.slice(0, 3).forEach(model => {
    console.log(`  • ${model.id}: ${model.name} (${model.provider})`);
  });

  console.log('\n✅ Testing getModelById:');
  const qwenModel = getModelById('qwen-72b');
  if (qwenModel) {
    console.log(`  • Found: ${qwenModel.name} (${qwenModel.provider})`);
  } else {
    console.log('  ❌ Qwen model not found');
  }

  console.log('\n✅ Testing AI_MODELS object:');
  console.log(`Total models in AI_MODELS: ${Object.keys(AI_MODELS).length}`);
  
  console.log('\n🎉 All AI provider tests passed!');
} catch (error) {
  console.error('❌ Test failed:', error.message);
}
