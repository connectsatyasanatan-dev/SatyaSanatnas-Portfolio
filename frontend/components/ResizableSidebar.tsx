'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Sidebar from './Sidebar'

interface ResizableSidebarProps {
    minWidth?: number
    maxWidth?: number
    defaultWidth?: number
    activeSection?: string
}

const ResizableSidebar = ({
    minWidth = 200,
    maxWidth = 600,
    defaultWidth = 288,
    activeSection
}: ResizableSidebarProps) => {
    const [sidebarWidth, setSidebarWidth] = useState(defaultWidth)
    const [isResizing, setIsResizing] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const resizeHandleRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizing(true)

        // Add global class for cursor styling
        document.body.classList.add('resizing')
        if (containerRef.current) {
            containerRef.current.classList.add('resizing')
        }
    }, [])

    const stopResizing = useCallback(() => {
        setIsResizing(false)

        // Remove global class
        document.body.classList.remove('resizing')
        if (containerRef.current) {
            containerRef.current.classList.remove('resizing')
        }
    }, [])

    const handleDoubleClick = useCallback(() => {
        setSidebarWidth(defaultWidth)
    }, [defaultWidth])

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing && sidebarRef.current) {
            const newWidth = e.clientX
            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setSidebarWidth(newWidth)
            }
        }
    }, [isResizing, minWidth, maxWidth])

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', resize)
            document.addEventListener('mouseup', stopResizing)
        } else {
            document.removeEventListener('mousemove', resize)
            document.removeEventListener('mouseup', stopResizing)
        }

        return () => {
            document.removeEventListener('mousemove', resize)
            document.removeEventListener('mouseup', stopResizing)
        }
    }, [isResizing, resize, stopResizing])

    // Save width to localStorage
    useEffect(() => {
        localStorage.setItem('sidebarWidth', sidebarWidth.toString())
    }, [sidebarWidth])

    // Load width from localStorage on mount
    useEffect(() => {
        const savedWidth = localStorage.getItem('sidebarWidth')
        if (savedWidth) {
            const width = parseInt(savedWidth, 10)
            if (width >= minWidth && width <= maxWidth) {
                setSidebarWidth(width)
            }
        }
    }, [minWidth, maxWidth])

    // Keyboard shortcut to toggle sidebar (Ctrl+B)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault()
                setIsCollapsed(prev => !prev)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div
            ref={containerRef}
            className="resizable-sidebar-container"
        >
            {/* Collapsed sidebar toggle button */}
            {isCollapsed && (
                <div
                    className="sidebar-toggle-collapsed"
                    onClick={() => setIsCollapsed(false)}
                    title="Show Sidebar (Ctrl+B)"
                    style={{
                        width: '24px',
                        height: '100%',
                        backgroundColor: 'var(--sidebar-bg)',
                        borderRight: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sidebar-bg)'
                    }}
                >
                    <div
                        style={{
                            width: '2px',
                            height: '20px',
                            backgroundColor: 'var(--text-dim)',
                            borderRadius: '1px'
                        }}
                    />
                </div>
            )}

            <aside
                ref={sidebarRef}
                id="portfolio-sidebar"
                style={{
                    width: isCollapsed ? '0px' : `${sidebarWidth}px`,
                    minWidth: isCollapsed ? '0px' : `${minWidth}px`,
                    maxWidth: `${maxWidth}px`,
                    transition: isResizing ? 'none' : 'width 0.3s ease-out',
                    overflow: isCollapsed ? 'hidden' : 'hidden',
                    height: '100%',
                    flexShrink: 0
                }}
            >
                {!isCollapsed && <Sidebar activeSection={activeSection} />}
            </aside>

            {/* Resize handle */}
            {!isCollapsed && (
                <div
                    ref={resizeHandleRef}
                    className="sidebar-resize-handle"
                    onMouseDown={startResizing}
                    onDoubleClick={handleDoubleClick}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={{
                        width: '4px',
                        height: '100%',
                        cursor: 'col-resize',
                        backgroundColor: isResizing || isHovering ? 'var(--primary)' : 'transparent',
                        position: 'relative',
                        zIndex: 10,
                        transition: isResizing ? 'none' : 'background-color 0.2s ease'
                    }}
                >
                    {/* Visual indicator line */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '1px',
                            height: '100%',
                            backgroundColor: isResizing || isHovering ? 'transparent' : 'var(--border-color)',
                            pointerEvents: 'none',
                            transition: 'background-color 0.2s ease'
                        }}
                    />

                    {/* Hover area for better UX */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '-2px',
                            width: '8px',
                            height: '100%',
                            cursor: 'col-resize'
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default ResizableSidebar