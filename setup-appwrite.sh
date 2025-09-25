#!/bin/bash

# Appwrite Database Setup Script for Prowriter AI Platform
# This script creates the database and collections for the Appwrite backend

echo "🚀 Setting up Appwrite Database for Prowriter AI Platform..."

# Check if Appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    echo "❌ Appwrite CLI is not installed. Please install it first:"
    echo "   npm install -g appwrite-cli"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please copy .env.example to .env.local and configure it."
    exit 1
fi

# Load environment variables
source .env.local

# Check required environment variables
if [ -z "$APPWRITE_PROJECT_ID" ] || [ -z "$APPWRITE_ENDPOINT" ] || [ -z "$APPWRITE_API_KEY" ]; then
    echo "❌ Missing required environment variables. Please check your .env.local file."
    echo "   Required: APPWRITE_PROJECT_ID, APPWRITE_ENDPOINT, APPWRITE_API_KEY"
    exit 1
fi

# Login to Appwrite (if needed)
echo "🔐 Logging into Appwrite..."
appwrite login --endpoint "$APPWRITE_ENDPOINT"

# Set project context
echo "📋 Setting project context..."
appwrite client --endpoint "$APPWRITE_ENDPOINT"
appwrite client --project-id "$APPWRITE_PROJECT_ID"
appwrite client --key "$APPWRITE_API_KEY"

# Create database
echo "🗄️  Creating database: $APPWRITE_DATABASE_ID"
appwrite databases create --database-id "$APPWRITE_DATABASE_ID" --name "Prowriter AI Database" || echo "Database already exists"

# Create Profiles Collection
echo "📝 Creating Profiles collection..."
appwrite databases createCollection \
    --database-id "$APPWRITE_DATABASE_ID" \
    --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" \
    --name "Profiles" \
    --permission "document" \
    --read 'user:userId' \
    --write 'user:userId' || echo "Profiles collection already exists"

# Add attributes to Profiles collection
echo "➕ Adding attributes to Profiles collection..."
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "userId" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "email" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "fullName" --size 255 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "avatarUrl" --size 512 --required false
appwrite databases createEnumAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "plan" --elements "free" "pro" "admin" --required true --default "free"
appwrite databases createIntegerAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "articlesGeneratedToday" --required true --default 0
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "lastGenerationDate" --size 50 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "subscriptionId" --size 255 --required false
appwrite databases createEnumAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "subscriptionStatus" --elements "active" "inactive" "cancelled" "past_due" --required true --default "inactive"

# Create Articles Collection
echo "📄 Creating Articles collection..."
appwrite databases createCollection \
    --database-id "$APPWRITE_DATABASE_ID" \
    --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" \
    --name "Articles" \
    --permission "document" \
    --read 'user:userId' \
    --write 'user:userId' || echo "Articles collection already exists"

# Add attributes to Articles collection
echo "➕ Adding attributes to Articles collection..."
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "userId" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "title" --size 512 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "content" --size 65535 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "metaDescription" --size 512 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "topic" --size 512 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "modelA" --size 255 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "modelB" --size 255 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "useCase" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "articleLength" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "aiEngine" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "seoKeywords" --size 1024 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "targetAudience" --size 512 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "brandVoice" --size 255 --required true
appwrite databases createBooleanAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "usedWebSearch" --required true --default false
appwrite databases createBooleanAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "usedSerpAnalysis" --required true --default false
appwrite databases createIntegerAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "wordCount" --required false
appwrite databases createIntegerAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "estimatedReadingTime" --required false
appwrite databases createEnumAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "status" --elements "draft" "published" "archived" --required true --default "draft"
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "publishedAt" --size 50 --required false

# Create Usage Tracking Collection
echo "📊 Creating Usage Tracking collection..."
appwrite databases createCollection \
    --database-id "$APPWRITE_DATABASE_ID" \
    --collection-id "$APPWRITE_USAGE_COLLECTION_ID" \
    --name "Usage Tracking" \
    --permission "document" \
    --read 'user:userId' \
    --write 'user:userId' || echo "Usage Tracking collection already exists"

# Add attributes to Usage Tracking collection
echo "➕ Adding attributes to Usage Tracking collection..."
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_USAGE_COLLECTION_ID" --key "userId" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_USAGE_COLLECTION_ID" --key "date" --size 50 --required true
appwrite databases createIntegerAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_USAGE_COLLECTION_ID" --key "articlesGenerated" --required true --default 0
appwrite databases createIntegerAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_USAGE_COLLECTION_ID" --key "outlinesGenerated" --required true --default 0
appwrite databases createIntegerAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_USAGE_COLLECTION_ID" --key "apiCallsMade" --required true --default 0

# Create Article Outlines Collection
echo "📝 Creating Article Outlines collection..."
appwrite databases createCollection \
    --database-id "$APPWRITE_DATABASE_ID" \
    --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" \
    --name "Article Outlines" \
    --permission "document" \
    --read 'user:userId' \
    --write 'user:userId' || echo "Article Outlines collection already exists"

# Add attributes to Article Outlines collection
echo "➕ Adding attributes to Article Outlines collection..."
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "userId" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "articleId" --size 255 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "title" --size 512 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "outlineContent" --size 65535 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "topic" --size 512 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "contentType" --size 255 --required true
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "seoKeywords" --size 1024 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "targetAudience" --size 512 --required false
appwrite databases createStringAttribute --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_OUTLINES_COLLECTION_ID" --key "aiEngine" --size 255 --required true

# Create indexes for performance
echo "🔍 Creating indexes..."
appwrite databases createIndex --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_PROFILES_COLLECTION_ID" --key "userId_index" --type "key" --attributes "userId"
appwrite databases createIndex --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "userId_index" --type "key" --attributes "userId"
appwrite databases createIndex --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_ARTICLES_COLLECTION_ID" --key "status_index" --type "key" --attributes "status"
appwrite databases createIndex --database-id "$APPWRITE_DATABASE_ID" --collection-id "$APPWRITE_USAGE_COLLECTION_ID" --key "userId_date_index" --type "key" --attributes "userId" "date"

echo "✅ Appwrite database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env.local file with the correct Appwrite configuration"
echo "2. Test the authentication and database functionality"
echo "3. Run the application: npm run dev"
echo ""
echo "🔧 Database Configuration:"
echo "   Database ID: $APPWRITE_DATABASE_ID"
echo "   Collections:"
echo "     - Profiles: $APPWRITE_PROFILES_COLLECTION_ID"
echo "     - Articles: $APPWRITE_ARTICLES_COLLECTION_ID" 
echo "     - Usage Tracking: $APPWRITE_USAGE_COLLECTION_ID"
echo "     - Article Outlines: $APPWRITE_OUTLINES_COLLECTION_ID"