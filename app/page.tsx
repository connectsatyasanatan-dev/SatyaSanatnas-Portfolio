'use client'

import Header from '@/components/Header'
import ResizableSidebar from '@/components/ResizableSidebar'
import TabBar from '@/components/TabBar'
import HeroSection from '@/components/HeroSection'
import SkillsSection from '@/components/SkillsSection'
import GitHistory from '@/components/GitHistory'
import EducationSection from '@/components/EducationSection'
import ProjectsSection from '@/components/ProjectsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import BlogSection from '@/components/BlogSection'
import TerminalSection from '@/components/TerminalSection'
import ContactSection from '@/components/ContactSection'
import PreLoader from '@/components/PreLoader'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Home() {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <PreLoader key="loader" onLoadingComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>

            {!isLoading && (
                <motion.div 
                    id="portfolio-app" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'var(--background-dark)',
                        overflow: 'hidden'
                    }}
                >
            <Header />

            <div style={{
                display: 'flex',
                flex: 1,
                height: '100%',
                overflow: 'hidden'
            }}>
                <ResizableSidebar
                    minWidth={200}
                    maxWidth={600}
                    defaultWidth={288}
                />

                <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    background: 'var(--editor-bg)',
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden'
                }}>
                    {/* Grid pattern background */}
                    <div className="grid-pattern" style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundSize: '20px 20px',
                        opacity: 0.03,
                        pointerEvents: 'none',
                        zIndex: 0
                    }}></div>

                    <TabBar />

                    {/* Main content - this is the scrollable area */}
                    <div className="main-content" style={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <HeroSection />
                        <SkillsSection />
                        <GitHistory />
                        <EducationSection />
                        <ProjectsSection />
                        <TestimonialsSection />
                        <BlogSection />
                        <TerminalSection />
                        <ContactSection />
                    </div>
                </main>
            </div>
                </motion.div>
            )}
        </>
    )
}