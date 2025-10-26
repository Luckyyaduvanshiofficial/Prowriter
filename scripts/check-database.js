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

async function checkDatabaseStatus() {
  console.log('🔍 Checking Database Status...\n');
  console.log('Configuration:');
  console.log(`  DATABASE_ID: ${DATABASE_ID}`);
  console.log(`  ARTICLES_COLLECTION_ID: ${ARTICLES_COLLECTION_ID}`);
  console.log(`  ENDPOINT: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}\n`);

  try {
    // Check database
    const db = await databases.get(DATABASE_ID);
    console.log(`✅ Database exists: ${db.name} (ID: ${db.$id})\n`);

    // Check Articles collection
    const collection = await databases.getCollection(DATABASE_ID, ARTICLES_COLLECTION_ID);
    console.log(`✅ Articles collection exists: ${collection.name}`);
    console.log(`   Total attributes: ${collection.attributes.length}\n`);

    // List all attributes
    console.log('📋 Current Attributes:');
    const attributes = collection.attributes.map(a => ({
      key: a.key,
      type: a.type,
      required: a.required
    }));
    
    console.table(attributes);

    // Check for missing attributes
    const requiredAttrs = [
      'userId', 'title', 'content', 'metaDescription', 'topic',
      'modelA', 'modelB', 'useCase', 'articleLength', 'aiEngine',
      'seoKeywords', 'targetAudience', 'brandVoice', 'usedWebSearch',
      'usedSerpAnalysis', 'wordCount', 'estimatedReadingTime', 'status',
      'createdAt', 'updatedAt'
    ];

    const existingAttrs = collection.attributes.map(a => a.key);
    const missingAttrs = requiredAttrs.filter(attr => !existingAttrs.includes(attr));

    if (missingAttrs.length > 0) {
      console.log('\n⚠️  Missing Attributes:');
      missingAttrs.forEach(attr => console.log(`   ❌ ${attr}`));
      console.log('\n💡 Run this command to add missing attributes:');
      console.log('   npm run update:articles-schema\n');
    } else {
      console.log('\n✅ All required attributes are present!\n');
    }

    // Check for articles
    const articles = await databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID);
    console.log(`📝 Total articles in database: ${articles.total}`);
    
    if (articles.total > 0) {
      console.log('\n📄 Recent articles:');
      articles.documents.slice(0, 5).forEach((article, i) => {
        console.log(`   ${i + 1}. ${article.title} (${article.wordCount || 0} words)`);
      });
    }

    console.log('\n═══════════════════════════════════════');
    console.log('✅ DATABASE STATUS: READY');
    console.log('Articles can be saved successfully!');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.log('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    
    if (error.code === 404) {
      if (error.message.includes('Database')) {
        console.log('   The database does not exist.');
        console.log('   Run: npm run setup:appwrite');
      } else if (error.message.includes('Collection')) {
        console.log('   The Articles collection does not exist.');
        console.log('   Run: npm run setup:appwrite');
      }
    } else if (error.code === 401) {
      console.log('   Authentication error. Check your APPWRITE_API_KEY in .env');
    } else {
      console.log('   Unexpected error:', error.message);
    }
    
    console.log('\n');
    process.exit(1);
  }
}

checkDatabaseStatus();
