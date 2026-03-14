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
    title: 'Modern Developer Portfolio v2.0',
    description: 'A modern VS Code inspired developer portfolio built with Next.js and React',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className}`} style={{ background: 'var(--background-dark)', color: 'white', fontFamily: 'var(--font-display)' }}>
                {children}
            </body>
        </html>
    )
}