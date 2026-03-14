'use client'

import { Terminal, Download, Star, GitFork, ExternalLink, Grid3X3, List, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import portfolioAPI, { Project } from '@/lib/api'

const ProjectsSection = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await portfolioAPI.getProjects()
                setProjects(data)
            } catch (error) {
                console.error('Failed to fetch projects:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    const handleProjectClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    const getTerminalLineClass = (line: string) => {
        if (line.startsWith('$')) return 'command'
        if (line.startsWith('>')) return 'output'
        if (line.includes('✔') || line.includes('OK') || line.includes('Done')) return 'success'
        if (line.includes('🚀')) return 'highlight'
        return 'info'
    }

    return (
        <section id="projects-section">
            <div className="section-header">
                <div className="section-header-left">
                    <Grid3X3 />
                    <h3 className="section-title">Modules (Projects)</h3>
                </div>
                <div className="view-toggle">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    >
                        List
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading projects...
                </div>
            ) : (
                <div className={`projects-grid ${viewMode}-view`}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="project-card"
                        >
                            {/* Header */}
                            <div className="project-header">
                                <div className="project-header-left">
                                    <Terminal />
                                    <span className="project-filename">{project.filename}</span>
                                </div>
                                <div className="project-stats">
                                    <div className="download-stat">
                                        <Download />
                                        <span>{project.downloads}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Terminal/Preview */}
                            <div className="project-terminal">
                                <div className="terminal-gradient"></div>
                                <div className="terminal-content">
                                    {project.terminalOutput && project.terminalOutput.map((line, lineIndex) => (
                                        <motion.div
                                            key={lineIndex}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: lineIndex * 0.1 }}
                                            className={`terminal-line ${getTerminalLineClass(line)}`}
                                        >
                                            {line}
                                        </motion.div>
                                    ))}
                                    {(project.terminalOutput?.length ?? 0) > 4 && (
                                        <div className="terminal-progress">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: '33%' }}
                                                transition={{ duration: 2, delay: 1 }}
                                                className="progress-bar"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="project-content">
                                <div className="project-content-header">
                                    <h4 className="project-name">{project.name}</h4>
                                    <span className="project-version">{project.version}</span>
                                </div>

                                <p className="project-description">{project.description}</p>

                                {project.features && (
                                    <div className="project-features">
                                        <h5 className="features-title">Key Features:</h5>
                                        <ul className="features-list">
                                            {project.features.slice(0, 6).map((feature, featureIndex) => (
                                                <li key={featureIndex}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="project-technologies">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span key={techIndex} className="tech-tag">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="project-footer">
                                    <div className="project-stats-footer">
                                        <div className="stat-item">
                                            <Star />
                                            <span className="stat-value">{project.stars}</span>
                                        </div>
                                        <div className="stat-item">
                                            <GitFork />
                                            <span className="stat-value">{project.forks}</span>
                                        </div>
                                    </div>
                                    <div className="project-links">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleProjectClick(project.demoUrl)}
                                            className="project-link demo"
                                        >
                                            <Eye />
                                            Demo
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleProjectClick(project.githubUrl)}
                                            className="project-link code"
                                        >
                                            <ExternalLink />
                                            Code
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ProjectsSection