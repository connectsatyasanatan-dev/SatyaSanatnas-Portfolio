'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Settings, Bell, Menu, X } from 'lucide-react'

const languageSequences = [
    {
        text: "Satya Sanatan's Portfolio",
        lang: 'en',
        fontFamily: 'var(--font-display)',
    },
    {
        text: 'सत्य सनातनस्य कृतिसञ्चिका',
        lang: 'sa',
        fontFamily: '"Noto Serif Devanagari", serif',
    },
    {
        text: 'ସତ୍ୟ ସନାତନଙ୍କ କୃତି ସଂଚିକା',
        lang: 'or',
        fontFamily: '"Noto Sans Oriya", serif',
    },
]

const typingSpeed = 70

const Header = () => {
    const [seqIndex, setSeqIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [phase, setPhase] = useState<'waiting-fonts' | 'typing' | 'waiting' | 'fading'>('waiting-fonts')

    const current = languageSequences[seqIndex]

    // Wait for fonts before starting typewriter — prevents FOUT
    useEffect(() => {
        if (typeof document === 'undefined') return
        const start = () => setPhase('typing')
        if (document.fonts?.ready) {
            document.fonts.ready.then(start)
        } else {
            // Fallback: small delay to let fonts load
            const t = setTimeout(start, 800)
            return () => clearTimeout(t)
        }
    }, [])

    useEffect(() => {
        if (phase === 'waiting-fonts') return

        let timeout: ReturnType<typeof setTimeout>
        let interval: ReturnType<typeof setInterval>

        if (phase === 'typing') {
            let idx = 0
            setDisplayText('')
            interval = setInterval(() => {
                idx++
                setDisplayText(current.text.slice(0, idx))
                if (idx >= current.text.length) {
                    clearInterval(interval)
                    setPhase('waiting')
                }
            }, typingSpeed)
        }

        if (phase === 'waiting') {
            timeout = setTimeout(() => {
                setPhase('fading')
            }, 4000) // Show fully typed text for 4 seconds
        }

        if (phase === 'fading') {
            timeout = setTimeout(() => {
                setSeqIndex((i) => (i + 1) % languageSequences.length)
                setPhase('typing')
            }, 600) // Fade out duration
        }

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [phase, seqIndex])

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Toggle class on app-container which can then control the sidebar visibility
    const toggleSidebar = () => {
        const isOpen = !isMenuOpen
        setIsMenuOpen(isOpen)
        const appBody = document.querySelector('.app-body')
        if (appBody) {
            if (isOpen) {
                appBody.classList.add('mobile-sidebar-open')
            } else {
                appBody.classList.remove('mobile-sidebar-open')
            }
        }
    }

    return (
        <header id="portfolio-header">
            <div className="header-left">
                <button
                    className="mobile-menu-btn"
                    onClick={toggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Title Container replaces hardcoded width/display */}
                <div className="header-title-container">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={`header-title-${seqIndex}`}
                            className="header-title"
                            lang={current.lang}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: phase === 'fading' ? 0 : 1, y: phase === 'fading' ? -5 : 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ fontFamily: current.fontFamily }}
                        >
                            {displayText}
                        </motion.h2>
                    </AnimatePresence>

                    {/* Blinking cursor via CSS class */}
                    <motion.span
                        animate={{ opacity: phase === 'fading' ? 0 : [0, 1, 0] }}
                        transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                        className="header-cursor"
                    />
                </div>

                <div className="header-nav">
                    <a href="#">File</a>
                    <a href="#">Edit</a>
                    <a href="#">View</a>
                    <a href="#">Run</a>
                </div>
            </div>
            <div className="header-right">
                <div className="run-build-btn">
                    <Play className="play-icon" />
                    <span className="btn-text-full">Run Build</span>
                    <span className="btn-text-short">Run</span>
                </div>
                <div className="header-buttons">
                    <button className="header-btn">
                        <Settings />
                    </button>
                    <button className="header-btn">
                        <Bell />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header