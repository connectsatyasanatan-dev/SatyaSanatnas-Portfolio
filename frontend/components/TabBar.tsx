'use client'

import { X, ChevronRight } from 'lucide-react'

const TabBar = () => {
    const tabs = [
        { name: 'index.tsx', icon: '⚛️', active: true },
        { name: 'projects.sh', icon: '🔧', active: false },
        { name: 'about.md', icon: '📄', active: false },
        { name: 'contact.json', icon: '📝', active: false },
    ]

    return (
        <div id="portfolio-tabbar">
            {/* Tab bar */}
            <div className="tab-container">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-item ${tab.active ? 'active' : ''}`}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-name">{tab.name}</span>
                        <X className="tab-close" />
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
                    <span>pages</span>
                    <ChevronRight />
                    <span className="current-file">
                        <span className="file-icon">⚛️</span>
                        index.tsx
                    </span>
                </div>
                <div className="breadcrumb-info">
                    <span>Ln 14, Col 32</span>
                    <span>UTF-8</span>
                    <span>TypeScript</span>
                </div>
            </div>
        </div>
    )
}

export default TabBar