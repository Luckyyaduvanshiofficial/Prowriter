# Google OAuth Setup Guide for Prowriter AI

## 🎯 Overview
This guide will help you set up Google OAuth authentication for your Prowriter AI application using Appwrite.

## 📋 Prerequisites
- Appwrite project created
- Google Cloud Console access

## 🚀 Setup Steps

### 1. Configure Google OAuth in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit [https://console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Name it "Prowriter AI"

4. **Configure Authorized Redirect URIs**
   - In the "Authorized redirect URIs" section, add:
     ```
     https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/673b60030024f610e629
     ```
   - Note: Replace the project ID with your actual Appwrite project ID
   - You can find the exact redirect URI in Appwrite Console

5. **Save Your Credentials**
   - Copy the **Client ID**
   - Copy the **Client Secret**

### 2. Configure OAuth in Appwrite Console

1. **Open Appwrite Console**
   - Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
   - Navigate to your project

2. **Enable Google OAuth**
   - Go to "Auth" > "Settings"
   - Scroll down to "OAuth2 Providers"
   - Find "Google" and click on it

3. **Enter Credentials**
   - Toggle "Enable" to ON
   - Paste your **Client ID**
   - Paste your **Client Secret**
   - Click "Update"

4. **Copy the Redirect URL**
   - Appwrite will show you the redirect URL
   - Use this URL in your Google Cloud Console (step 1.4)

### 3. Testing the Integration

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test Sign In**
   - Go to `http://localhost:3000/sign-in`
   - Click "Sign in with Google"
   - You should be redirected to Google's login page
   - After authentication, you'll be redirected back to your dashboard

3. **Test Sign Up**
   - Go to `http://localhost:3000/sign-up`
   - Click "Sign up with Google"
   - Complete the Google authentication
   - You'll be redirected to your dashboard

## 🔧 Troubleshooting

### "Redirect URI Mismatch" Error
- Ensure the redirect URI in Google Cloud Console matches exactly with the one from Appwrite
- Check for trailing slashes
- Verify the project ID is correct

### OAuth Not Working
- Make sure Google+ API is enabled
- Verify Client ID and Client Secret are correct
- Check that OAuth is enabled in Appwrite Console
- Ensure your domain is authorized (for production)

### Development vs Production
- For development: `http://localhost:3000` is automatically allowed
- For production: Add your production domain to "Authorized JavaScript origins" and "Authorized redirect URIs"

## 📝 Code Implementation

The Google OAuth button has been added to both sign-in and sign-up pages:

**Sign In Page** (`app/sign-in/page.tsx`):
```typescript
const handleGoogleSignIn = () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/sign-in`
    )
  } catch (error) {
    console.error('❌ Google sign in error:', error)
    setError('Failed to initiate Google sign in')
  }
}
```

**Sign Up Page** (`app/sign-up/page.tsx`):
```typescript
const handleGoogleSignUp = () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/dashboard`,
      `${window.location.origin}/sign-up`
    )
  } catch (error) {
    console.error('❌ Google sign up error:', error)
    setError('Failed to initiate Google sign up')
  }
}
```

## 🎨 UI Components

The Google sign-in button includes:
- Google's brand colors and logo
- Proper spacing and styling
- Loading states
- Error handling
- Responsive design

## 🔒 Security Best Practices

1. **Never expose Client Secret** - Keep it in Appwrite Console only
2. **Use HTTPS in production** - Required for OAuth
3. **Verify redirect URIs** - Only allow trusted domains
4. **Monitor OAuth usage** - Check Appwrite logs regularly
5. **Keep credentials secure** - Don't commit them to version control

## ✅ What's Next?

After setting up Google OAuth:
- Users can sign in with their Google accounts
- No need to create passwords
- Faster onboarding experience
- Better security with Google's authentication

## 📚 Additional Resources

- [Appwrite OAuth Documentation](https://appwrite.io/docs/products/auth/oauth2)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Appwrite Client Web SDK](https://appwrite.io/docs/references/cloud/client-web/account)

---

**Note:** Remember to update your `.env.local` if you need to store any additional configuration.
