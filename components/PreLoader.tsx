'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PreLoaderProps {
    onLoadingComplete: () => void;
}

const PreLoader: React.FC<PreLoaderProps> = ({ onLoadingComplete }) => {
    const [text, setText] = useState('')
    const [showContent, setShowContent] = useState(true)
    const [currentLog, setCurrentLog] = useState('SYSTEM_INIT')
    const fullText = "Satya Sanatan's Portfolio"
    const typingSpeed = 80

    const logs = [
        "BOOTING_CORE_ENGINE",
        "LOADING_REACT_COMPONENTS",
        "INJECTING_NEURAL_STREAMS",
        "CALIBRATING_UX_INTERFACE",
        "SYNCING_DATABASE_STATE",
        "PREPARING_WORKSPACE",
        "READY_TO_LAUNCH"
    ]

    useEffect(() => {
        let currentIdx = 0
        const interval = setInterval(() => {
            if (currentIdx <= fullText.length) {
                setText(fullText.slice(0, currentIdx))
                currentIdx++
                
                // Update logs periodically
                if (currentIdx % 4 === 0) {
                    setCurrentLog(logs[Math.floor((currentIdx / fullText.length) * (logs.length - 1))])
                }
            } else {
                clearInterval(interval)
                setCurrentLog("ACCESS_GRANTED")
                setTimeout(() => {
                    setShowContent(false)
                    setTimeout(onLoadingComplete, 800)
                }, 1200)
            }
        }, typingSpeed)

        return () => clearInterval(interval)
    }, [onLoadingComplete])

    return (
        <AnimatePresence>
            {showContent && (
                <motion.div
                    className="preloader-overlay"
                    initial={{ opacity: 1 }}
                    exit={{ 
                        opacity: 0,
                        transition: { duration: 0.8, ease: "easeInOut" }
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
                        overflow: 'hidden'
                    }}
                >
                    {/* Animated Background Elements */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        style={{
                            position: 'absolute',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                            zIndex: 0
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.h2
                                layoutId="shared-title"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    color: 'goldenrod',
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    fontFamily: 'var(--font-display)',
                                    letterSpacing: '2px',
                                    textShadow: '0 0 20px rgba(218, 165, 32, 0.4)',
                                    margin: 0
                                }}
                            >
                                {text}
                            </motion.h2>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                style={{
                                    display: 'inline-block',
                                    marginLeft: '10px',
                                    width: '4px',
                                    height: '2.5rem',
                                    background: 'goldenrod',
                                    verticalAlign: 'middle'
                                }}
                            />
                        </div>

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: fullText.length * (typingSpeed / 1000) }}
                            style={{
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, goldenrod, transparent)',
                                marginTop: '20px',
                                boxShadow: '0 0 10px goldenrod'
                            }}
                        />

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                color: 'white',
                                marginTop: '15px',
                                fontSize: '0.9rem',
                                letterSpacing: '4px',
                                textTransform: 'uppercase'
                            }}
                        >
                            Initializing Environment...
                        </motion.p>
                    </div>

                    {/* Progress Bar in corner */}
                    <div style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.3)',
                        textAlign: 'left'
                    }}>
                        <div style={{ marginBottom: '5px' }}>SYSTEM_STATUS: <span style={{ color: 'var(--primary)' }}>{currentLog}</span></div>
                        <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 4 }}
                                style={{ height: '100%', background: 'var(--primary)' }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default PreLoader
