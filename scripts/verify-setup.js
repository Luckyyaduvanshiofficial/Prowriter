const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'prowriter_db';
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users';
const ARTICLES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID || 'articles';

async function verifySetup() {
  console.log('🔍 Verifying Prowriter AI Setup...\n');
  
  let allGood = true;

  // Check environment variables
  console.log('📋 Checking Environment Variables:');
  const requiredEnvVars = [
    'NEXT_PUBLIC_APPWRITE_PROJECT_ID',
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'APPWRITE_API_KEY',
    'GOOGLE_API_KEY'
  ];
  
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName} is set`);
    } else {
      console.log(`  ❌ ${varName} is missing`);
      allGood = false;
    }
  });
  console.log();

  // Check database
  console.log('🗄️  Checking Database:');
  try {
    const db = await databases.get(DATABASE_ID);
    console.log(`  ✅ Database found: ${db.name}`);
  } catch (error) {
    console.log(`  ❌ Database not found: ${DATABASE_ID}`);
    allGood = false;
  }
  console.log();

  // Check Users collection
  console.log('👥 Checking Users Collection:');
  try {
    const collection = await databases.getCollection(DATABASE_ID, USERS_COLLECTION_ID);
    console.log(`  ✅ Collection found: ${collection.name}`);
    console.log(`  📊 Attributes: ${collection.attributes.length}`);
    
    const expectedAttrs = ['userId', 'email', 'name', 'plan', 'articlesGeneratedToday', 
                          'lastGenerationDate', 'subscriptionStatus', 'createdAt', 'updatedAt'];
    const foundAttrs = collection.attributes.map(a => a.key);
    
    expectedAttrs.forEach(attr => {
      if (foundAttrs.includes(attr)) {
        console.log(`    ✅ ${attr}`);
      } else {
        console.log(`    ❌ ${attr} missing`);
        allGood = false;
      }
    });

    // Check for test data
    const users = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID);
    console.log(`  📝 Documents: ${users.total}`);
    if (users.total > 0) {
      console.log(`    ✅ Test user: ${users.documents[0].email}`);
    }
  } catch (error) {
    console.log(`  ❌ Users collection error: ${error.message}`);
    allGood = false;
  }
  console.log();

  // Check Articles collection
  console.log('📝 Checking Articles Collection:');
  try {
    const collection = await databases.getCollection(DATABASE_ID, ARTICLES_COLLECTION_ID);
    console.log(`  ✅ Collection found: ${collection.name}`);
    console.log(`  📊 Attributes: ${collection.attributes.length}`);
    
    const expectedAttrs = ['userId', 'title', 'content', 'topic', 'keywords', 
                          'aiModel', 'wordCount', 'createdAt', 'updatedAt'];
    const foundAttrs = collection.attributes.map(a => a.key);
    
    expectedAttrs.forEach(attr => {
      if (foundAttrs.includes(attr)) {
        console.log(`    ✅ ${attr}`);
      } else {
        console.log(`    ❌ ${attr} missing`);
        allGood = false;
      }
    });

    // Check for test data
    const articles = await databases.listDocuments(DATABASE_ID, ARTICLES_COLLECTION_ID);
    console.log(`  📝 Documents: ${articles.total}`);
    if (articles.total > 0) {
      articles.documents.slice(0, 3).forEach(article => {
        console.log(`    ✅ "${article.title}"`);
      });
    }
  } catch (error) {
    console.log(`  ❌ Articles collection error: ${error.message}`);
    allGood = false;
  }
  console.log();

  // Summary
  console.log('═══════════════════════════════════════════');
  if (allGood) {
    console.log('✅ SETUP VERIFICATION PASSED!');
    console.log('\n🎉 Your Prowriter AI setup is complete and ready!');
    console.log('\n🚀 Next steps:');
    console.log('  1. Run: npm run dev');
    console.log('  2. Visit: http://localhost:3000/test-gemini');
    console.log('  3. Test Gemini API integration');
    console.log('  4. Start building!\n');
  } else {
    console.log('⚠️  SETUP VERIFICATION INCOMPLETE');
    console.log('\n🔧 Please review the errors above and:');
    console.log('  1. Check your .env file');
    console.log('  2. Re-run: npm run setup:appwrite');
    console.log('  3. Run this verification again\n');
  }
  console.log('═══════════════════════════════════════════\n');
}

verifySetup().catch(error => {
  console.error('❌ Verification failed:', error.message);
  process.exit(1);
});
