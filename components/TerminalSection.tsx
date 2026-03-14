'use client'

import { Terminal, Minimize2, Maximize2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { TerminalSectionSkeleton } from './AppSkeletons'

const TerminalSection = () => {
    const [currentCommand, setCurrentCommand] = useState('')
    const [commandHistory, setCommandHistory] = useState<string[]>([])
    const [isMinimized, setIsMinimized] = useState(false)

    const terminalLogs = [
        "$ git status",
        "On branch main",
        "Your branch is up to date with 'origin/main'.",
        "",
        "Changes to be committed:",
        "  (use \"git reset HEAD <file>...\" to unstage)",
        "",
        "        modified:   src/components/Hero.tsx",
        "        new file:   src/components/Projects.tsx",
        "",
        "$ npm run build",
        "✔ Creating an optimized production build",
        "✔ Compiled successfully",
        "✔ Linting and checking validity of types",
        "✔ Collecting page data",
        "✔ Generating static pages (5/5)",
        "✔ Finalizing page optimization",
        "",
        "Route (app)                              Size     First Load JS",
        "┌ ○ /                                    142 B          87.4 kB",
        "└ ○ /about                               139 B          87.4 kB",
        "+ First Load JS shared by all            87.3 kB",
        "  ├ chunks/webpack-8fa1640cc84ba8ef.js   750 B",
        "  ├ chunks/fd9d1056-2821b0f0cabcd8bd.js  44.3 kB",
        "  ├ chunks/main-app-4f41eed9b4f4b9b8.js  216 B",
        "  └ chunks/main-c67cccb185a5d5a3.js      42.1 kB",
        "",
        "$ vercel deploy",
        "🔗  Linked to portfolio-v2 (created .vercel)",
        "🔍  Inspect: https://vercel.com/portfolio/deployments/abc123",
        "✅  Production: https://portfolio-v2.vercel.app [copied to clipboard]",
        "",
        "$ echo 'Ready for new opportunities! 🚀'",
        "Ready for new opportunities! 🚀",
        ""
    ]

    const typewriterCommands = [
        "whoami",
        "ls -la skills/",
        "cat experience.json",
        "git log --oneline",
        "npm run deploy"
    ]

    useEffect(() => {
        let commandIndex = 0
        let charIndex = 0

        const typeCommand = () => {
            if (commandIndex < typewriterCommands.length) {
                const command = typewriterCommands[commandIndex]
                if (charIndex < command.length) {
                    setCurrentCommand(command.slice(0, charIndex + 1))
                    charIndex++
                    setTimeout(typeCommand, 100)
                } else {
                    setTimeout(() => {
                        setCommandHistory(prev => [...prev, `$ ${command}`])
                        setCurrentCommand('')
                        charIndex = 0
                        commandIndex++
                        setTimeout(typeCommand, 1000)
                    }, 2000)
                }
            } else {
                // Reset and start over
                setTimeout(() => {
                    setCommandHistory([])
                    commandIndex = 0
                    charIndex = 0
                    typeCommand()
                }, 5000)
            }
        }

        const timer = setTimeout(typeCommand, 2000)
        return () => clearTimeout(timer)
    }, [])

    // Simulate an initial loading state for the terminal
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800)
        return () => clearTimeout(timer)
    }, [])

    if (isLoading) {
        return <TerminalSectionSkeleton />
    }

    return (
        <section id="terminal-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`terminal-window ${isMinimized ? 'minimized' : ''}`}
            >
                {/* Terminal header */}
                <div className="terminal-header">
                    <div className="terminal-title">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="title-text">Terminal</span>
                        <span className="title-info">— zsh — 80×24</span>
                    </div>
                    <div className="terminal-controls">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="control-btn"
                        >
                            {isMinimized ? (
                                <Maximize2 className="w-3 h-3 text-text-dim hover:text-white" />
                            ) : (
                                <Minimize2 className="w-3 h-3 text-text-dim hover:text-white" />
                            )}
                        </button>
                        <button className="control-btn close">
                            <X className="w-3 h-3 text-text-dim hover:text-red-400" />
                        </button>
                    </div>
                </div>

                {/* Terminal content */}
                {!isMinimized && (
                    <div className="terminal-content">
                        <div className="terminal-output">
                            <div className="terminal-scroll">
                                {/* Static logs */}
                                {terminalLogs.map((log, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1, delay: index * 0.05 }}
                                        className={`terminal-line ${log.startsWith('$') ? 'command' :
                                            log.includes('✔') || log.includes('✅') ? 'success' :
                                                log.includes('🔗') || log.includes('🔍') ? 'info' :
                                                    log.includes('modified:') || log.includes('new file:') ? 'warning' :
                                                        log.includes('Ready for new opportunities!') ? 'highlight' :
                                                            log.startsWith('  ') ? 'dim' :
                                                                'default'
                                            }`}
                                    >
                                        {log || '\u00A0'}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Command history */}
                            {commandHistory.map((cmd, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="terminal-line command"
                                >
                                    {cmd}
                                </motion.div>
                            ))}

                            {/* Current typing command */}
                            <div className="terminal-line command current">
                                <span>$ {currentCommand}</span>
                                <span className="cursor">|</span>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Terminal stats */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="terminal-stats"
            >
                <div className="stat-indicator">
                    <div className="status-dot online"></div>
                    <span>System Online</span>
                </div>
                <div className="stat-indicator">
                    <div className="status-dot success"></div>
                    <span>Build: Successful</span>
                </div>
                <div className="stat-indicator">
                    <div className="status-dot warning"></div>
                    <span>Deploy: Ready</span>
                </div>
            </motion.div>
        </section>
    )
}

export default TerminalSection