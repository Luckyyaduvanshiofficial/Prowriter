const sdk = require('node-appwrite');
require('dotenv').config();

const client = new sdk.Client();
const account = new sdk.Account(client);

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

async function createTestAccount() {
  const testEmail = 'test@prowriter.ai';
  const testPassword = 'TestPassword123';
  const testName = 'Test User';

  console.log('🧪 Creating test account...\n');
  console.log('Email:', testEmail);
  console.log('Password:', testPassword);
  console.log('Name:', testName);
  console.log();

  try {
    // Try to create account
    const user = await account.create(
      sdk.ID.unique(),
      testEmail,
      testPassword,
      testName
    );
    
    console.log('✅ Test account created successfully!');
    console.log('User ID:', user.$id);
    console.log('\n📝 Use these credentials to sign in:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Account already exists!');
      console.log('\n📝 Use these credentials to sign in:');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

createTestAccount();
