import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'TIETPrep — Smart Exam Prep for TIET Students',
    template: '%s | TIETPrep',
  },
  description:
    'AI-powered exam preparation platform for Thapar Institute of Engineering & Technology. PYQs, pattern analysis, practice, and your personal AI tutor — all grounded in real TIET material.',
  keywords: ['TIET', 'Thapar', 'exam prep', 'PYQ', 'MST', 'EST', 'AI tutor'],
  authors: [{ name: 'TIETPrep (student-run, unofficial)' }],
  robots: { index: false, follow: false }, // Private platform — no indexing
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
