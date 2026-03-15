'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Settings, Bell, Terminal } from 'lucide-react'

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
    const [phase, setPhase] = useState<'typing' | 'waiting' | 'fading'>('typing')

    const current = languageSequences[seqIndex]

    useEffect(() => {
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

    return (
        <header id="portfolio-header">
            <div className="header-left">
                {/* <div className="header-logo">
                    <Terminal />
                </div> */}
                
                {/* Fixed width container prevents layout shifting of the nav buttons */}
                <div style={{ display: 'flex', alignItems: 'center', minWidth: '180px', width: '180px' }}>
                    <AnimatePresence mode="wait">
                        <motion.h2 
                            key={`header-title-${seqIndex}`}
                            className="header-title" 
                            lang={current.lang}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: phase === 'fading' ? 0 : 1, y: phase === 'fading' ? -5 : 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ 
                                color: 'goldenrod', 
                                textShadow: '0 0 10px rgba(218, 165, 32, 0.4)',
                                fontFamily: current.fontFamily,
                                margin: 0,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {displayText}
                        </motion.h2>
                    </AnimatePresence>
                    
                    {/* Blinking cursor */}
                    <motion.span
                        animate={{ opacity: phase === 'fading' ? 0 : [0, 1, 0] }}
                        transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            display: 'inline-block',
                            marginLeft: '5px',
                            width: '2px',
                            height: '1.2rem',
                            background: 'goldenrod',
                            verticalAlign: 'middle',
                            boxShadow: '0 0 6px rgba(218,165,32,0.8)',
                        }}
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
                    <span>Run Build</span>
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