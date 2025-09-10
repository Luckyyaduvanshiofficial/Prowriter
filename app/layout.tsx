import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { ErrorHandler } from "@/components/error-handler"
import { AuthProvider } from "@/lib/auth-context"

export const metadata: Metadata = {
  title: 'Kutumbhcraft - Premium AI Content Generation Platform',
  description: 'Generate high-quality blog posts, articles, and content with Kutumbhcraft. Advanced AI writing platform for professional content creators.',
  keywords: 'AI writing, content generation, blog writer, AI articles, content creator, SEO writing, automated writing',
  authors: [{ name: 'Kutumbhcraft' }],
  creator: 'Kutumbhcraft',
  publisher: 'Kutumbhcraft',
  metadataBase: new URL('https://prowriter.miniai.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kutumbhcraft - Premium AI Content Generation Platform',
    description: 'Generate high-quality blog posts, articles, and content with Kutumbhcraft. Advanced AI writing platform for professional content creators.',
    url: 'https://prowriter.miniai.online',
    siteName: 'Kutumbhcraft',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kutumbhcraft - Premium AI Content Generation'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kutumbhcraft - Premium AI Content Generation Platform',
    description: 'Generate high-quality blog posts, articles, and content with Kutumbhcraft.',
    images: ['/og-image.jpg'],
    creator: '@Kutumbhcraft',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kutumbhcraft",
  "description": "Premium AI Content Generation Platform - Generate high-quality blog posts, articles, and content with advanced AI writing platform",
  "url": "https://prowriter.miniai.online",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Plan",
      "price": "0",
      "priceCurrency": "USD",
      "description": "5 articles per day with AI models"
    },
    {
      "@type": "Offer", 
      "name": "Pro Plan",
      "price": "4",
      "priceCurrency": "USD",
      "billingDuration": "P1M",
      "description": "25 articles per day with priority AI access"
    }
  ],
  "creator": {
    "@type": "Organization",
    "name": "Kutumbhcraft",
    "url": "https://prowriter.miniai.online"
  },
  "featureList": [
    "AI-powered content generation",
    "SEO optimization",
    "Multiple AI models (Qwen, LLaMA, Gemini)",
    "Article storage and export",
    "Professional templates"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <ErrorHandler />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
