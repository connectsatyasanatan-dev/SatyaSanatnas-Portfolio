import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import '../styles/components.css'
import '../styles/sections.css'
import '../styles/sections-extended.css'
import '../styles/sections-final.css'
import '../styles/skills-modern.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Satya Sanatan's Portfolio",
    description: 'A modern VS Code inspired developer portfolio built with Next.js and React',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <head>
                {/* Noto Serif Devanagari – for Sanskrit preloader text */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;700&family=Noto+Sans+Oriya:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`${inter.className}`} style={{ background: 'var(--background-dark)', color: 'white', fontFamily: 'var(--font-display)' }}>
                {children}
            </body>
        </html>
    )
}