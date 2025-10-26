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
const ARTICLES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ARTICLES_COLLECTION_ID || 'articles';

async function setupDatabase() {
  try {
    console.log('🚀 Starting Appwrite Database Setup...\n');

    // Step 1: Create Database
    console.log('📦 Creating database...');
    try {
      await databases.create(DATABASE_ID, 'Prowriter Database');
      console.log('✅ Database created successfully!\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists, skipping...\n');
      } else {
        throw error;
      }
    }

    // Step 2: Create Users Collection
    console.log('👥 Creating Users collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        'Users',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users()),
        ]
      );
      console.log('✅ Users collection created!\n');

      // Add attributes to Users collection
      console.log('⚙️  Adding attributes to Users collection...');
      
      await databases.createStringAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'userId', 255, true);
      console.log('  ✓ userId attribute added');
      
      await databases.createEmailAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'email', true);
      console.log('  ✓ email attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'name', 255, false);
      console.log('  ✓ name attribute added');
      
      await databases.createEnumAttribute(
        DATABASE_ID, 
        USERS_COLLECTION_ID, 
        'plan', 
        ['free', 'pro', 'admin'], 
        true
      );
      console.log('  ✓ plan attribute added');
      
      await databases.createIntegerAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'articlesGeneratedToday', true);
      console.log('  ✓ articlesGeneratedToday attribute added');
      
      await databases.createDatetimeAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'lastGenerationDate', false);
      console.log('  ✓ lastGenerationDate attribute added');
      
      await databases.createEnumAttribute(
        DATABASE_ID, 
        USERS_COLLECTION_ID, 
        'subscriptionStatus', 
        ['active', 'inactive', 'cancelled', 'past_due'], 
        true
      );
      console.log('  ✓ subscriptionStatus attribute added');
      
      await databases.createDatetimeAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'createdAt', true);
      console.log('  ✓ createdAt attribute added');
      
      await databases.createDatetimeAttribute(DATABASE_ID, USERS_COLLECTION_ID, 'updatedAt', true);
      console.log('  ✓ updatedAt attribute added');
      
      console.log('✅ All Users attributes added!\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Users collection already exists, skipping...\n');
      } else {
        throw error;
      }
    }

    // Step 3: Create Articles Collection
    console.log('📝 Creating Articles collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        ARTICLES_COLLECTION_ID,
        'Articles',
        [
          sdk.Permission.read(sdk.Role.users()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
          sdk.Permission.delete(sdk.Role.users()),
        ]
      );
      console.log('✅ Articles collection created!\n');

      // Add attributes to Articles collection
      console.log('⚙️  Adding attributes to Articles collection...');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'userId', 255, true);
      console.log('  ✓ userId attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'title', 500, true);
      console.log('  ✓ title attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'content', 65535, true);
      console.log('  ✓ content attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'metaDescription', 1000, false);
      console.log('  ✓ metaDescription attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'topic', 255, false);
      console.log('  ✓ topic attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'modelA', 100, false);
      console.log('  ✓ modelA attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'modelB', 100, false);
      console.log('  ✓ modelB attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'useCase', 100, false);
      console.log('  ✓ useCase attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'articleLength', 50, false);
      console.log('  ✓ articleLength attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'aiEngine', 100, false);
      console.log('  ✓ aiEngine attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'seoKeywords', 500, false);
      console.log('  ✓ seoKeywords attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'targetAudience', 200, false);
      console.log('  ✓ targetAudience attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'brandVoice', 100, false);
      console.log('  ✓ brandVoice attribute added');
      
      await databases.createBooleanAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'usedWebSearch', false);
      console.log('  ✓ usedWebSearch attribute added');
      
      await databases.createBooleanAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'usedSerpAnalysis', false);
      console.log('  ✓ usedSerpAnalysis attribute added');
      
      await databases.createIntegerAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'wordCount', true);
      console.log('  ✓ wordCount attribute added');
      
      await databases.createIntegerAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'estimatedReadingTime', false);
      console.log('  ✓ estimatedReadingTime attribute added');
      
      await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'status', 50, false);
      console.log('  ✓ status attribute added');
      
      await databases.createDatetimeAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'createdAt', true);
      console.log('  ✓ createdAt attribute added');
      
      await databases.createDatetimeAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'updatedAt', true);
      console.log('  ✓ updatedAt attribute added');
      
      console.log('✅ All Articles attributes added!\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Articles collection already exists, skipping...\n');
      } else {
        throw error;
      }
    }

    // Wait for attributes to be available
    console.log('⏳ Waiting for attributes to be ready (this may take a moment)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('✅ Attributes should be ready!\n');

    // Step 4: Add test data
    console.log('🧪 Adding test data...\n');
    
    // Test user data
    const testUserId = 'test_user_' + Date.now();
    try {
      const testUser = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        sdk.ID.unique(),
        {
          userId: testUserId,
          email: 'test@prowriter.ai',
          name: 'Test User',
          plan: 'pro',
          articlesGeneratedToday: 3,
          lastGenerationDate: new Date().toISOString(),
          subscriptionStatus: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      console.log('✅ Test user created:', testUser.email);
    } catch (error) {
      console.log('⚠️  Could not create test user:', error.message);
    }

    // Test articles
    const testArticles = [
      {
        userId: testUserId,
        title: 'The Future of AI Content Generation',
        content: `# The Future of AI Content Generation

Artificial Intelligence has revolutionized the way we create content. With advanced language models like GPT-4 and Gemini, writers can now generate high-quality articles in minutes.

## Benefits of AI Writing Tools

1. **Speed**: Generate content 10x faster
2. **Consistency**: Maintain tone and style across all content
3. **SEO Optimization**: Built-in SEO features for better rankings
4. **Cost-Effective**: Reduce content creation costs significantly

## The Road Ahead

As AI continues to evolve, we can expect even more sophisticated content generation capabilities. The future is bright for AI-powered writing tools.`,
        topic: 'AI Technology',
        keywords: ['AI', 'content generation', 'writing tools', 'SEO'],
        aiModel: 'gemini-2.0-flash',
        wordCount: 156,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        userId: testUserId,
        title: 'SEO Best Practices for 2025',
        content: `# SEO Best Practices for 2025

Search engine optimization continues to evolve. Here are the top strategies for 2025.

## Key Strategies

- Focus on user intent
- Optimize for voice search
- Improve page speed
- Create high-quality content
- Build authoritative backlinks

Stay ahead of the competition by implementing these proven SEO techniques.`,
        topic: 'SEO Marketing',
        keywords: ['SEO', 'marketing', 'search optimization', '2025'],
        aiModel: 'gemini-2.0-flash',
        wordCount: 89,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        userId: testUserId,
        title: 'Building a Successful Blog in 2025',
        content: `# Building a Successful Blog in 2025

Starting a blog has never been easier, but making it successful requires strategy and dedication.

## Essential Steps

1. Choose a profitable niche
2. Create valuable content consistently
3. Build an email list
4. Monetize with multiple streams
5. Engage with your audience

With the right approach and tools like AI content generators, you can build a thriving blog faster than ever before.`,
        topic: 'Blogging',
        keywords: ['blogging', 'content creation', 'online business'],
        aiModel: 'gemini-2.0-flash',
        wordCount: 112,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    for (const article of testArticles) {
      try {
        const createdArticle = await databases.createDocument(
          DATABASE_ID,
          ARTICLES_COLLECTION_ID,
          sdk.ID.unique(),
          article
        );
        console.log('✅ Test article created:', createdArticle.title);
      } catch (error) {
        console.log('⚠️  Could not create test article:', error.message);
      }
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - Database: Prowriter Database');
    console.log('  - Collections: Users, Articles');
    console.log('  - Test data: 1 user, 3 articles');
    console.log('\n✨ You can now run your application with: npm run dev');

  } catch (error) {
    console.error('❌ Error during setup:', error);
    throw error;
  }
}

// Run the setup
setupDatabase().catch(console.error);
