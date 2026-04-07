'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreLoaderProps {
    onLoadingComplete: () => void;
}

const languageSequences = [
    { text: "Satya Sanatan's Portfolio", lang: 'en', fontFamily: 'var(--font-display)' },
    { text: 'सत्य सनातनस्य कृतिसञ्चिका', lang: 'sa', fontFamily: '"Noto Serif Devanagari", serif' },
    { text: 'ସତ୍ୟ ସନାତନଙ୍କ କୃତି ସଂଚିକା', lang: 'or', fontFamily: '"Noto Sans Oriya", serif' },
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

    useEffect(() => {
        let elapsed = 0
        const totalMs = languageSequences.reduce(
            (acc, seq) => acc + seq.text.length * typingSpeed + seq.text.length * typingSpeed * 0.5 + 1100 + 350,
            0
        )
        const logInterval = setInterval(() => {
            elapsed += 600
            const logIdx = Math.min(Math.floor((elapsed / totalMs) * logs.length), logs.length - 1)
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
                    timeout = setTimeout(() => setPhase(isLastSeq ? 'done' : 'erasing'), 1100)
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
                    timeout = setTimeout(() => { setSeqIndex(i => i + 1); setPhase('typing') }, 300)
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

        return () => { clearInterval(interval); clearTimeout(timeout) }
    }, [phase, seqIndex])

    return (
        <>
            <style>{`
                .preloader-root {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: #0b1212;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .preloader-glow {
                    position: absolute;
                    width: min(480px, 80vw);
                    height: min(480px, 80vw);
                    border-radius: 50%;
                    background: radial-gradient(circle, goldenrod 0%, transparent 70%);
                    filter: blur(72px);
                    z-index: 0;
                    pointer-events: none;
                }

                .preloader-center {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    width: 100%;
                    max-width: 780px;
                    padding: 0 clamp(16px, 5vw, 48px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .preloader-title-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: clamp(3rem, 8vw, 5rem);
                    width: 100%;
                }

                .preloader-title {
                    color: goldenrod;
                    font-size: clamp(1.3rem, 5vw, 2.5rem);
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-shadow: 0 0 28px rgba(218,165,32,0.5), 0 0 60px rgba(218,165,32,0.15);
                    margin: 0;
                    line-height: 1.4;
                    word-break: break-word;
                    overflow-wrap: break-word;
                    max-width: 100%;
                }

                .preloader-cursor {
                    display: inline-block;
                    margin-left: 6px;
                    width: 3px;
                    height: clamp(1.3rem, 5vw, 2.5rem);
                    background: goldenrod;
                    vertical-align: middle;
                    flex-shrink: 0;
                    border-radius: 2px;
                    box-shadow: 0 0 10px rgba(218,165,32,0.8);
                }

                .preloader-divider {
                    height: 1px;
                    width: 100%;
                    background: linear-gradient(90deg, transparent 0%, rgba(218,165,32,0.8) 35%, goldenrod 50%, rgba(218,165,32,0.8) 65%, transparent 100%);
                    margin-top: clamp(16px, 3vw, 28px);
                    box-shadow: 0 0 12px rgba(218,165,32,0.6);
                    transform-origin: center;
                }

                .preloader-subtitle {
                    color: white;
                    margin-top: clamp(12px, 2vw, 20px);
                    font-size: clamp(0.6rem, 1.5vw, 0.8rem);
                    letter-spacing: clamp(3px, 1vw, 6px);
                    text-transform: uppercase;
                    font-family: var(--font-mono);
                    opacity: 0.45;
                }

                .preloader-status {
                    position: absolute;
                    bottom: clamp(20px, 4vh, 40px);
                    left: clamp(16px, 4vw, 40px);
                    right: clamp(16px, 4vw, 40px);
                    font-family: var(--font-mono);
                    font-size: clamp(9px, 1.5vw, 11px);
                    color: rgba(255,255,255,0.25);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .preloader-status-text {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .preloader-bar-track {
                    width: 100%;
                    max-width: clamp(140px, 30vw, 220px);
                    height: 2px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 2px;
                    overflow: hidden;
                }

                /* Landscape phone */
                @media (max-height: 480px) and (orientation: landscape) {
                    .preloader-title { font-size: clamp(1rem, 4vw, 1.6rem); }
                    .preloader-subtitle { display: none; }
                    .preloader-status { bottom: 12px; }
                }

                /* Very small screens */
                @media (max-width: 320px) {
                    .preloader-title { font-size: 1.1rem; letter-spacing: 0; }
                    .preloader-cursor { height: 1.1rem; }
                }
            `}</style>

            <AnimatePresence>
                {showContent && (
                    <motion.div
                        className="preloader-root"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
                    >
                        {/* Pulsing radial glow */}
                        <motion.div
                            className="preloader-glow"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.6, opacity: 0.12 }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        />

                        {/* Center content */}
                        <div className="preloader-center">

                            {/* Title + cursor */}
                            <div className="preloader-title-wrap">
                                <motion.h2
                                    key={`font-${seqIndex}`}
                                    className="preloader-title"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                    lang={current.lang}
                                    style={{
                                        fontFamily: current.fontFamily,
                                        letterSpacing: current.lang === 'en' ? '2px' : '0.5px',
                                    }}
                                >
                                    {displayText}
                                </motion.h2>

                                <motion.span
                                    className="preloader-cursor"
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>

                            {/* Divider */}
                            <motion.div
                                className="preloader-divider"
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                            />

                            {/* Subtitle */}
                            <motion.p
                                className="preloader-subtitle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.45 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                Initializing Environment...
                            </motion.p>
                        </div>

                        {/* Bottom status */}
                        <div className="preloader-status">
                            <div className="preloader-status-text">
                                SYSTEM_STATUS:{' '}
                                <span style={{ color: 'var(--primary)', opacity: 0.8 }}>{currentLog}</span>
                            </div>
                            <div className="preloader-bar-track">
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
        </>
    )
}

export default PreLoader
