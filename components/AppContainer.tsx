'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '@/components/Header'
import ResizableSidebar from '@/components/ResizableSidebar'
import TabBar from '@/components/TabBar'
import GlobalBackground from '@/components/GlobalBackground'
import PreLoader from '@/components/PreLoader'
import ScrollToTop from '@/components/ScrollToTop'

interface AppContainerProps {
    children: React.ReactNode
}

export default function AppContainer({ children }: AppContainerProps) {
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
                                {children}
                            </div>

                            <ScrollToTop />
                        </main>
                    </div>
                </motion.div>
            )}
        </>
    )
}
