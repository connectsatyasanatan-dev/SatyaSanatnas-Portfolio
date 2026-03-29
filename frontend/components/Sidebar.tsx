'use client'

import {
    FolderOpen,
    Search,
    GitBranch,
    Bug,
    Package,
    User,
    Settings,
    ChevronRight,
    MoreHorizontal,
    Folder,
    FileText,
    File,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { SidebarSkeleton } from './AppSkeletons'

export interface SectionFile {
    id: string
    filename: string
    icon: string
    color: string
    sectionId: string
}

export const SECTION_FILES: SectionFile[] = [
    { id: 'hero', filename: 'index.tsx', icon: 'tsx', color: '#61dafb', sectionId: 'hero-section' },
    { id: 'skills', filename: 'skills.ts', icon: 'ts', color: '#3178c6', sectionId: 'skills-section' },
    { id: 'experience', filename: 'git-history.log', icon: 'log', color: '#f97316', sectionId: 'git-history-section' },
    { id: 'education', filename: 'education.md', icon: 'md', color: '#a78bfa', sectionId: 'edu-root' },
    { id: 'certifications', filename: 'certifications.json', icon: 'json', color: '#22c55e', sectionId: 'certifications-section' },
    { id: 'projects', filename: 'projects.sh', icon: 'sh', color: '#f59e0b', sectionId: 'projects-section' },
    { id: 'testimonials', filename: 'testimonials.md', icon: 'md', color: '#a78bfa', sectionId: 'testimonials-root' },
    { id: 'blog', filename: 'blog.md', icon: 'md', color: '#a78bfa', sectionId: 'blog-section' },
    { id: 'terminal', filename: 'terminal.sh', icon: 'sh', color: '#f59e0b', sectionId: 'terminal-section' },
    { id: 'contact', filename: 'contact.json', icon: 'json', color: '#22c55e', sectionId: 'contact-section' },
]

const FILE_ICON_COLORS: Record<string, string> = {
    tsx: '#61dafb',
    ts: '#3178c6',
    json: '#22c55e',
    md: '#a78bfa',
    sh: '#f59e0b',
    log: '#f97316',
}

function FileIcon({ ext, size = 14 }: { ext: string; size?: number }) {
    const color = FILE_ICON_COLORS[ext] || '#9ca3af'
    return <File size={size} style={{ color, flexShrink: 0 }} />
}

function scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

interface SidebarProps {
    activeSection?: string
}

const Sidebar = ({ activeSection }: SidebarProps) => {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200)
        return () => clearTimeout(timer)
    }, [])

    const SidebarContent = () => (
        <div className="sidebar-content">
            {/* Icon sidebar */}
            <div className="sidebar-icons">
                <div className="icon-wrapper active" title="Explorer">
                    <FolderOpen size={24} />
                </div>
                <div className="icon-wrapper" title="Search">
                    <Search size={24} />
                </div>
                <div className="icon-wrapper" title="Source Control">
                    <GitBranch size={24} />
                </div>
                <div className="icon-wrapper" title="Debug">
                    <Bug size={24} />
                </div>
                <div className="icon-wrapper" title="Extensions">
                    <Package size={24} />
                </div>
                <div className="icons-bottom">
                    <div className="icon-wrapper" title="Account">
                        <User size={24} />
                    </div>
                    <div className="icon-wrapper" title="Settings">
                        <Settings size={24} />
                    </div>
                </div>
            </div>

            {/* File explorer */}
            <div className="sidebar-explorer">
                <div className="explorer-header">
                    <span>Explorer</span>
                    <MoreHorizontal />
                </div>

                <div className="file-tree">
                    {/* Root folder */}
                    <div className="folder-root">
                        <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                        <span className="folder-name">Satya’s Portfolio</span>
                    </div>

                    <div className="folder-contents">
                        <div className="file-item">
                            <ChevronRight />
                            <Folder />
                            <span>.github</span>
                        </div>

                        <div className="file-item">
                            <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                            <FolderOpen size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                            <span>src</span>
                        </div>

                        {/* sections folder inside src */}
                        <div className="nested-folder">
                            <div className="file-item">
                                <ChevronRight />
                                <Folder style={{ color: '#eab308' }} />
                                <span>assets</span>
                            </div>

                            <div className="file-item">
                                <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                                <FolderOpen size={14} style={{ color: '#3b82f6', flexShrink: 0 }} />
                                <span>Components</span>
                            </div>

                            {/* Each section as a file */}
                            <div className="nested-folder">
                                {SECTION_FILES.map((file) => (
                                    <div
                                        key={file.id}
                                        className={`file-item${activeSection === file.id ? ' active' : ''}`}
                                        onClick={() => scrollToSection(file.sectionId)}
                                        title={`Go to ${file.filename}`}
                                    >
                                        <FileIcon ext={file.icon} />
                                        <span>{file.filename}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Root level files */}
                        <div className="file-item">
                            <File size={14} style={{ color: '#eab308', flexShrink: 0 }} />
                            <span>package.json</span>
                        </div>
                        <div className="file-item">
                            <FileText size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
                            <span>README.md</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    if (isLoading) {
        return <SidebarSkeleton />
    }

    return (
        <div className="sidebar-content-wrapper">
            <SidebarContent />
        </div>
    )
}

export default Sidebar
