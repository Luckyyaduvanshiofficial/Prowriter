const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'prowriter_db';
const ARTICLES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID || 'articles';

async function updateArticlesCollection() {
  console.log('🔧 Updating Articles Collection Schema...\n');

  try {
    // Get current collection
    const collection = await databases.getCollection(DATABASE_ID, ARTICLES_COLLECTION_ID);
    console.log(`✅ Found collection: ${collection.name}`);
    
    const existingAttrs = collection.attributes.map(a => a.key);
    console.log(`📊 Existing attributes: ${existingAttrs.join(', ')}\n`);

    // Define all required attributes
    const requiredAttributes = [
      { key: 'metaDescription', type: 'string', size: 1000, required: false },
      { key: 'modelA', type: 'string', size: 100, required: false },
      { key: 'modelB', type: 'string', size: 100, required: false },
      { key: 'useCase', type: 'string', size: 100, required: false },
      { key: 'articleLength', type: 'string', size: 50, required: false },
      { key: 'aiEngine', type: 'string', size: 100, required: false },
      { key: 'seoKeywords', type: 'string', size: 500, required: false },
      { key: 'targetAudience', type: 'string', size: 200, required: false },
      { key: 'brandVoice', type: 'string', size: 100, required: false },
      { key: 'usedWebSearch', type: 'boolean', required: false },
      { key: 'usedSerpAnalysis', type: 'boolean', required: false },
      { key: 'estimatedReadingTime', type: 'integer', required: false },
      { key: 'status', type: 'string', size: 50, required: false }
    ];

    console.log('⚙️  Adding missing attributes...\n');

    for (const attr of requiredAttributes) {
      if (!existingAttrs.includes(attr.key)) {
        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              DATABASE_ID, 
              ARTICLES_COLLECTION_ID, 
              attr.key, 
              attr.size, 
              attr.required
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              DATABASE_ID, 
              ARTICLES_COLLECTION_ID, 
              attr.key, 
              attr.required
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              DATABASE_ID, 
              ARTICLES_COLLECTION_ID, 
              attr.key, 
              attr.required
            );
          }
          console.log(`  ✅ Added: ${attr.key} (${attr.type})`);
          // Wait a bit between attribute creations
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.code === 409) {
            console.log(`  ℹ️  ${attr.key} already exists`);
          } else {
            console.error(`  ❌ Failed to add ${attr.key}:`, error.message);
          }
        }
      } else {
        console.log(`  ✓ ${attr.key} already exists`);
      }
    }

    console.log('\n⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Verify
    const updatedCollection = await databases.getCollection(DATABASE_ID, ARTICLES_COLLECTION_ID);
    console.log(`\n✅ Updated collection has ${updatedCollection.attributes.length} attributes`);
    console.log('📋 All attributes:', updatedCollection.attributes.map(a => a.key).join(', '));
    
    console.log('\n🎉 Articles collection updated successfully!');
    console.log('You can now save articles to the database.\n');

  } catch (error) {
    console.error('❌ Error updating collection:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('  1. Verify DATABASE_ID in .env:', DATABASE_ID);
    console.log('  2. Verify ARTICLES_COLLECTION_ID in .env:', ARTICLES_COLLECTION_ID);
    console.log('  3. Check Appwrite Console for collection status');
    console.log('  4. If collection doesn\'t exist, run: npm run setup:appwrite\n');
    process.exit(1);
  }
}

updateArticlesCollection();
