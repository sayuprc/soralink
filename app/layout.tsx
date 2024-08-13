import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ときのそら Twitter 週別リンク',
  description: 'ときのそらの Twitter リンク',
}

export const viewport: Viewport = {
  themeColor: [{ color: '#0146ea' }, { color: '#245eff' }, { color: '#266aff' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
