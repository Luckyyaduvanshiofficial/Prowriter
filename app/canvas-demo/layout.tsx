import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Kutumbhcraft - Canvas Writer Demo',
  description: 'Experience the new Canvas Writer with live typing animation, just like ChatGPT and Gemini.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}