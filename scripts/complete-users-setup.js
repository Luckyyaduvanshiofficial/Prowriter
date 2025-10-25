const sdk = require('node-appwrite');
require('dotenv').config();

// Initialize Appwrite Client
const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'prowriter_db';
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users';

async function completeUsersSetup() {
  try {
    console.log('🔧 Completing Users Collection Setup...\n');

    // Add missing attributes to Users collection
    console.log('⚙️  Adding remaining attributes to Users collection...');
    
    try {
      await databases.createEnumAttribute(
        DATABASE_ID, 
        USERS_COLLECTION_ID, 
        'plan', 
        ['free', 'pro', 'admin'], 
        true
      );
      console.log('  ✓ plan attribute added');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  plan attribute already exists');
      } else {
        console.log('  ⚠️  plan attribute error:', error.message);
      }
    }
    
    try {
      await databases.createIntegerAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'articlesGeneratedToday', true);
      console.log('  ✓ articlesGeneratedToday attribute added');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  articlesGeneratedToday attribute already exists');
      } else {
        console.log('  ⚠️  articlesGeneratedToday attribute error:', error.message);
      }
    }
    
    try {
      await databases.createDatetimeAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'lastGenerationDate', false);
      console.log('  ✓ lastGenerationDate attribute added');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  lastGenerationDate attribute already exists');
      } else {
        console.log('  ⚠️  lastGenerationDate attribute error:', error.message);
      }
    }
    
    try {
      await databases.createEnumAttribute(
        DATABASE_ID, 
        USERS_COLLECTION_ID, 
        'subscriptionStatus', 
        ['active', 'inactive', 'cancelled', 'past_due'], 
        true
      );
      console.log('  ✓ subscriptionStatus attribute added');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  subscriptionStatus attribute already exists');
      } else {
        console.log('  ⚠️  subscriptionStatus attribute error:', error.message);
      }
    }
    
    try {
      await databases.createDatetimeAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'createdAt', true);
      console.log('  ✓ createdAt attribute added');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  createdAt attribute already exists');
      } else {
        console.log('  ⚠️  createdAt attribute error:', error.message);
      }
    }
    
    try {
      await databases.createDatetimeAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'updatedAt', true);
      console.log('  ✓ updatedAt attribute added');
    } catch (error) {
      if (error.code === 409) {
        console.log('  ℹ️  updatedAt attribute already exists');
      } else {
        console.log('  ⚠️  updatedAt attribute error:', error.message);
      }
    }
    
    console.log('\n⏳ Waiting for attributes to be ready (10 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Add a test user
    console.log('\n🧪 Adding test user...');
    const testUserId = 'test_user_' + Date.now();
    
    try {
      const testUser = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        sdk.ID.unique(),
        {
          userId: testUserId,
          email: 'demo@prowriter.ai',
          name: 'Demo User',
          plan: 'pro',
          articlesGeneratedToday: 5,
          lastGenerationDate: new Date().toISOString(),
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      console.log('✅ Test user created:', testUser.email);
      console.log('   User ID:', testUser.userId);
      console.log('   Plan:', testUser.plan);
    } catch (error) {
      console.log('⚠️  Could not create test user:', error.message);
      console.log('   This is normal if attributes are still being processed.');
    }

    console.log('\n✅ Users collection setup completed!');

  } catch (error) {
    console.error('❌ Error during setup:', error);
    throw error;
  }
}

completeUsersSetup().catch(console.error);
