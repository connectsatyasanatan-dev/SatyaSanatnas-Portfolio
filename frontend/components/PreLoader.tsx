'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreLoaderProps {
    onLoadingComplete: () => void;
}

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

const logs = [
    "BOOTING_CORE_ENGINE",
    "LOADING_REACT_COMPONENTS",
    "INJECTING_NEURAL_STREAMS",
    "CALIBRATING_UX_INTERFACE",
    "SYNCING_DATABASE_STATE",
    "PREPARING_WORKSPACE",
    "READY_TO_LAUNCH"
]

const PreLoader: React.FC<PreLoaderProps> = ({ onLoadingComplete }) => {
    const [showContent, setShowContent] = useState(true)
    const [currentLog, setCurrentLog] = useState('SYSTEM_INIT')
    const [seqIndex, setSeqIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [phase, setPhase] = useState<'typing' | 'erasing' | 'done'>('typing')

    const current = languageSequences[seqIndex]
    const isLastSeq = seqIndex === languageSequences.length - 1

    // Cycle through system log messages smoothly
    useEffect(() => {
        let elapsed = 0
        const totalMs = languageSequences.reduce(
            (acc, seq) => acc + seq.text.length * typingSpeed + seq.text.length * typingSpeed * 0.5 + 1100 + 350,
            0
        )
        const logInterval = setInterval(() => {
            elapsed += 600
            const logIdx = Math.min(
                Math.floor((elapsed / totalMs) * logs.length),
                logs.length - 1
            )
            setCurrentLog(logs[logIdx])
        }, 600)
        return () => clearInterval(logInterval)
    }, [])

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
                    timeout = setTimeout(() => {
                        setPhase(isLastSeq ? 'done' : 'erasing')
                    }, 1100)
                }
            }, typingSpeed)
        }

        if (phase === 'erasing') {
            let idx = current.text.length
            interval = setInterval(() => {
                idx--
                setDisplayText(current.text.slice(0, idx))
                if (idx <= 0) {
                    clearInterval(interval)
                    timeout = setTimeout(() => {
                        setSeqIndex(i => i + 1)
                        setPhase('typing')
                    }, 300)
                }
            }, typingSpeed * 0.45)
        }

        if (phase === 'done') {
            setCurrentLog('ACCESS_GRANTED')
            timeout = setTimeout(() => {
                setShowContent(false)
                setTimeout(onLoadingComplete, 800)
            }, 1200)
        }

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [phase, seqIndex])

    return (
        <AnimatePresence>
            {showContent && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.9, ease: 'easeInOut' }
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: '#0b1212',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    {/* Pulsing radial glow */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.6, opacity: 0.12 }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            width: '480px',
                            height: '480px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, goldenrod 0%, transparent 70%)',
                            filter: 'blur(72px)',
                            zIndex: 0,
                        }}
                    />

                    {/* Center content */}
                    <div style={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        width: '100%',
                        maxWidth: '780px',
                        padding: '0 32px',
                    }}>

                        {/* Title with typewriter — consistent size for all languages */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '4rem',
                        }}>
                            <motion.h2
                                key={`font-${seqIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                lang={current.lang}
                                style={{
                                    color: 'goldenrod',
                                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                                    fontWeight: 700,
                                    fontFamily: current.fontFamily,
                                    letterSpacing: current.lang === 'en' ? '2px' : '0.5px',
                                    textShadow: '0 0 28px rgba(218, 165, 32, 0.5), 0 0 60px rgba(218, 165, 32, 0.15)',
                                    margin: 0,
                                    lineHeight: 1.4,
                                    whiteSpace: 'normal',
                                    wordBreak: 'keep-all',
                                }}
                            >
                                {displayText}
                            </motion.h2>

                            {/* Blinking cursor */}
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '6px',
                                    width: '3px',
                                    height: 'clamp(1.8rem, 4vw, 2.5rem)',
                                    background: 'goldenrod',
                                    verticalAlign: 'middle',
                                    flexShrink: 0,
                                    borderRadius: '2px',
                                    boxShadow: '0 0 10px rgba(218,165,32,0.8)',
                                }}
                            />
                        </div>

                        {/* Animated golden divider */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                            style={{
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent 0%, rgba(218,165,32,0.8) 35%, goldenrod 50%, rgba(218,165,32,0.8) 65%, transparent 100%)',
                                marginTop: '24px',
                                boxShadow: '0 0 12px rgba(218,165,32,0.6)',
                                transformOrigin: 'center',
                            }}
                        />

                        {/* Initializing text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.45 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            style={{
                                color: 'white',
                                marginTop: '18px',
                                fontSize: '0.8rem',
                                letterSpacing: '5px',
                                textTransform: 'uppercase',
                                fontFamily: 'var(--font-mono)',
                            }}
                        >
                            Initializing Environment...
                        </motion.p>
                    </div>

                    {/* Bottom-left system status */}
                    <div style={{
                        position: 'absolute',
                        bottom: '36px',
                        left: '36px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.25)',
                        textAlign: 'left',
                    }}>
                        <div style={{ marginBottom: '6px' }}>
                            SYSTEM_STATUS:{' '}
                            <span style={{ color: 'var(--primary)', opacity: 0.8 }}>{currentLog}</span>
                        </div>
                        <div style={{ width: '180px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: languageSequences.length * 4.5, ease: 'linear' }}
                                style={{ height: '100%', background: 'var(--primary)', borderRadius: '2px' }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PreLoader
