'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    const handleScroll = useCallback(() => {
        const mainContent = document.querySelector('.main-content')
        if (!mainContent) return

        const scrollTop = mainContent.scrollTop
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

        setScrollProgress(progress)
        setIsVisible(scrollTop > 300)
    }, [])

    useEffect(() => {
        const mainContent = document.querySelector('.main-content')
        if (!mainContent) return

        mainContent.addEventListener('scroll', handleScroll, { passive: true })
        return () => mainContent.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    const scrollToTop = () => {
        const mainContent = document.querySelector('.main-content')
        if (!mainContent) return

        mainContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // Calculate the circumference for the progress ring
    const radius = 22
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    id="scroll-to-top-btn"
                    className="scroll-to-top-btn"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Scroll to top"
                    title="Back to Top"
                >
                    {/* Progress Ring SVG */}
                    <svg
                        className="scroll-progress-ring"
                        width="52"
                        height="52"
                        viewBox="0 0 52 52"
                    >
                        {/* Background circle */}
                        <circle
                            cx="26"
                            cy="26"
                            r={radius}
                            fill="none"
                            stroke="rgba(39, 58, 58, 0.5)"
                            strokeWidth="2.5"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="26"
                            cy="26"
                            r={radius}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            style={{
                                transform: 'rotate(-90deg)',
                                transformOrigin: '50% 50%',
                                transition: 'stroke-dashoffset 0.15s ease-out'
                            }}
                        />
                    </svg>

                    {/* Arrow Icon */}
                    <ArrowUp className="scroll-to-top-icon" />
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default ScrollToTop
