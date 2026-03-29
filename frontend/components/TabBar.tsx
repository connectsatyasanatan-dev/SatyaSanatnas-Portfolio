'use client'

import { X, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SECTION_FILES, SectionFile } from './Sidebar'

interface TabBarProps {
    activeSection: string
}

const TabBar = ({ activeSection }: TabBarProps) => {
    // open tabs — start with all, user can close them
    const [openTabs, setOpenTabs] = useState<string[]>(
        SECTION_FILES.map((f) => f.id)
    )

    const activeFile = SECTION_FILES.find((f) => f.id === activeSection)
        ?? SECTION_FILES[0]

    function closeTab(e: React.MouseEvent, id: string) {
        e.stopPropagation()
        setOpenTabs((prev) => prev.filter((t) => t !== id))
    }

    function openTab(id: string) {
        if (!openTabs.includes(id)) {
            setOpenTabs((prev) => [...prev, id])
        }
        const file = SECTION_FILES.find((f) => f.id === id)
        if (file) {
            const el = document.getElementById(file.sectionId)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    function handleTabClick(file: SectionFile) {
        const el = document.getElementById(file.sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const visibleTabs = SECTION_FILES.filter((f) => openTabs.includes(f.id))

    return (
        <div id="portfolio-tabbar">
            {/* Tab bar */}
            <div className="tab-container">
                {visibleTabs.map((file) => {
                    const isActive = file.id === activeSection
                    return (
                        <div
                            key={file.id}
                            className={`tab-item${isActive ? ' active' : ''}`}
                            onClick={() => handleTabClick(file)}
                            title={file.filename}
                        >
                            <span
                                className="tab-icon"
                                style={{ color: file.color, fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}
                            >
                                .{file.icon}
                            </span>
                            <span className="tab-name">{file.filename}</span>
                            <X
                                className="tab-close"
                                onClick={(e) => closeTab(e, file.id)}
                            />
                        </div>
                    )
                })}

                {/* Closed tabs — show as ghost pills to reopen */}
                {SECTION_FILES.filter((f) => !openTabs.includes(f.id)).map((file) => (
                    <div
                        key={`closed-${file.id}`}
                        className="tab-item tab-closed"
                        onClick={() => openTab(file.id)}
                        title={`Reopen ${file.filename}`}
                    >
                        <span
                            className="tab-icon"
                            style={{ color: '#4b5563', fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}
                        >
                            .{file.icon}
                        </span>
                        <span className="tab-name" style={{ color: '#4b5563' }}>{file.filename}</span>
                    </div>
                ))}
            </div>

            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="breadcrumb-path">
                    <span>portfolio-v2</span>
                    <ChevronRight />
                    <span>src</span>
                    <ChevronRight />
                    <span>sections</span>
                    <ChevronRight />
                    <span className="current-file">
                        <span
                            className="file-icon"
                            style={{ color: activeFile.color, fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}
                        >
                            .{activeFile.icon}
                        </span>
                        {activeFile.filename}
                    </span>
                </div>
                <div className="breadcrumb-info">
                    <span>Ln 1, Col 1</span>
                    <span>UTF-8</span>
                    <span>TypeScript</span>
                </div>
            </div>
        </div>
    )
}

export default TabBar
