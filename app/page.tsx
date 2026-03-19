'use client'

import Header from '@/components/Header'
import ResizableSidebar from '@/components/ResizableSidebar'
import TabBar from '@/components/TabBar'
import HeroSection from '@/components/HeroSection'
import SkillsSection from '@/components/SkillsSection'
import GitHistory from '@/components/GitHistory'
import EducationSection from '@/components/EducationSection'
import CertificationsSection from '@/components/CertificationsSection'
import ProjectsSection from '@/components/ProjectsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import BlogSection from '@/components/BlogSection'
import TerminalSection from '@/components/TerminalSection'
import ContactSection from '@/components/ContactSection'
import PreLoader from '@/components/PreLoader'
import GlobalBackground from '@/components/GlobalBackground'
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="app-container"
                >
                    <Header />

                    <div className="app-body">
                        <ResizableSidebar
                            minWidth={200}
                            maxWidth={600}
                            defaultWidth={288}
                        />

                        <main className="editor-main">
                            <GlobalBackground />
                            <div className="grid-overlay grid-pattern" />

                            <TabBar />

                            <div className="main-content">
                                <HeroSection />
                                <SkillsSection />
                                <GitHistory />
                                <EducationSection />
                                <CertificationsSection />
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