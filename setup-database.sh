#!/bin/bash

# =============================================================================
# AI BLOG WRITER SUPABASE SETUP SCRIPT
# =============================================================================
# This script helps you set up your Supabase database for the AI Blog Writer
# =============================================================================

echo "🚀 AI Blog Writer - Supabase Database Setup"
echo "============================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local file with your Supabase credentials first."
    echo ""
    echo "Required environment variables:"
    echo "- NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "- OPENROUTER_API_KEY=your_openrouter_api_key"
    exit 1
fi

echo "✅ Found .env.local file"
echo ""

# Check if supabase-schema.sql exists
if [ ! -f "supabase-schema.sql" ]; then
    echo "❌ Error: supabase-schema.sql file not found!"
    echo "Please make sure the SQL schema file is in the project root."
    exit 1
fi

echo "✅ Found supabase-schema.sql file"
echo ""

echo "📋 SETUP INSTRUCTIONS:"
echo "======================"
echo ""
echo "1. Open your Supabase Dashboard: https://app.supabase.com"
echo "2. Navigate to your project"
echo "3. Go to 'SQL Editor' in the left sidebar"
echo "4. Create a new query"
echo "5. Copy and paste the contents of 'supabase-schema.sql'"
echo "6. Run the query to create all tables and functions"
echo ""
echo "📄 The schema includes:"
echo "• profiles table (user information and subscription data)"
echo "• articles table (generated articles with metadata)"
echo "• article_outlines table (article outlines and planning)"
echo "• usage_tracking table (daily usage limits and statistics)"
echo "• RLS policies (Row Level Security for data protection)"
echo "• Helper functions (automatic profile creation, usage tracking)"
echo ""

echo "🔧 VERIFICATION STEPS:"
echo "======================"
echo ""
echo "After running the SQL schema, verify the setup:"
echo ""
echo "1. Check Tables:"
echo "   - Go to Database > Tables"
echo "   - Verify these tables exist: profiles, articles, article_outlines, usage_tracking"
echo ""
echo "2. Test Authentication:"
echo "   - Go to Authentication > Users"
echo "   - Create a test user or sign up through your app"
echo "   - Check that a profile is automatically created"
echo ""
echo "3. Test Article Creation:"
echo "   - Use the AI Blog Writer to generate an article"
echo "   - Verify the article appears in the articles table"
echo ""
echo "4. Check RLS Policies:"
echo "   - Go to Database > Tables > articles > RLS"
echo "   - Verify policies are enabled and active"
echo ""

echo "🎯 NEXT STEPS:"
echo "============="
echo ""
echo "1. Run the SQL schema in Supabase"
echo "2. Test user registration and profile creation"
echo "3. Generate a test article to verify database integration"
echo "4. Configure Stripe for subscription management (optional)"
echo "5. Deploy your application"
echo ""

echo "📞 NEED HELP?"
echo "============="
echo ""
echo "If you encounter issues:"
echo "• Check the Supabase logs for any SQL errors"
echo "• Verify your environment variables are correct"
echo "• Make sure RLS is enabled on all tables"
echo "• Test the API endpoints using the browser developer tools"
echo ""

echo "✨ Your AI Blog Writer platform will be ready once the database is set up!"
echo ""

# Optional: Check if dependencies are installed
if command -v npm &> /dev/null; then
    echo "🔍 Checking project dependencies..."
    if npm list @supabase/supabase-js &> /dev/null; then
        echo "✅ Supabase client is installed"
    else
        echo "⚠️  Warning: @supabase/supabase-js might not be installed"
        echo "   Run: npm install @supabase/supabase-js"
    fi
fi

echo ""
echo "🎉 Setup guide complete! Follow the instructions above to set up your database."
