import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prowriter AI - Premium AI Content Generation SaaS',
  description: 'Generate high-quality blog posts, articles, and content with Prowriter AI. Advanced AI writing platform for professional content creators.',
  keywords: 'AI writing, content generation, blog writer, AI articles, content creator, SEO writing, automated writing',
  authors: [{ name: 'Prowriter AI' }],
  creator: 'Prowriter AI',
  publisher: 'Prowriter AI',
  metadataBase: new URL('https://prowriter.miniai.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Prowriter AI - Premium AI Content Generation SaaS',
    description: 'Generate high-quality blog posts, articles, and content with Prowriter AI. Advanced AI writing platform for professional content creators.',
    url: 'https://prowriter.miniai.online',
    siteName: 'Prowriter AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prowriter AI - Premium AI Content Generation'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prowriter AI - Premium AI Content Generation SaaS',
    description: 'Generate high-quality blog posts, articles, and content with Prowriter AI.',
    images: ['/og-image.jpg'],
    creator: '@ProwriterAI',
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
  "name": "Prowriter AI",
  "description": "Premium AI Content Generation SaaS - Generate high-quality blog posts, articles, and content with advanced AI writing platform",
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
    "name": "Prowriter AI",
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
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
