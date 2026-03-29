'use client'

import { Terminal, Download, Star, GitFork, ExternalLink, Grid3X3, List, Eye, Github } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import portfolioAPI, { Project } from '@/lib/api'
import { ProjectsSectionSkeleton } from './AppSkeletons'

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
        if (!url) return
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
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div 
                    key="skeleton-projects"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                >
                    <ProjectsSectionSkeleton />
                </motion.div>
            ) : projects.length === 0 ? null : (
                <motion.section 
                    key="projects-content"
                    id="projects-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
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

                    <div className={`projects-grid ${viewMode}-view`}>
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="project-card"
                            >
                                {/* Header */}
                                <div className="project-header">
                                    <div className="project-header-left">
                                        <Terminal size={18} />
                                        <span className="project-filename">{project.filename}</span>
                                    </div>
                                    <div className="project-stats">
                                        <div className="download-stat">
                                            <Download size={14} />
                                            <span>{project.downloads || '0'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terminal/Preview */}
                                <div className="project-terminal">
                                    <div className="terminal-gradient"></div>
                                    <div className="terminal-content">
                                        {project.terminalOutput && project.terminalOutput.map((line, lineIndex) => (
                                            <div
                                                key={lineIndex}
                                                className={`terminal-line ${getTerminalLineClass(line)}`}
                                            >
                                                {line}
                                            </div>
                                        ))}
                                        {(!project.terminalOutput || project.terminalOutput.length === 0) && (
                                            <div className="terminal-line command">$ npm list dependencies</div>
                                        )}
                                        <div className="terminal-progress">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                transition={{ duration: 2, delay: 0.5 }}
                                                className="progress-bar"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="project-content">
                                    <div className="project-content-header">
                                        <h4 className="project-name">{project.name}</h4>
                                        <span className="project-version">v{project.version || '1.0.0'}</span>
                                    </div>

                                    <p className="project-description">{project.description}</p>

                                    <div className="project-technologies">
                                        {project.technologies.slice(0, 4).map((tech, techIndex) => (
                                            <span key={techIndex} className="tech-tag">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.technologies.length > 4 && (
                                            <span className="tech-tag-more">+{project.technologies.length - 4}</span>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="project-footer">
                                        <div className="project-stats-footer">
                                            <div className="stat-item">
                                                <Star size={14} />
                                                <span className="stat-value">{project.stars || 0}</span>
                                            </div>
                                            <div className="stat-item">
                                                <GitFork size={14} />
                                                <span className="stat-value">{project.forks || 0}</span>
                                            </div>
                                        </div>
                                        <div className="project-links">
                                            <button
                                                onClick={() => handleProjectClick(project.demoUrl)}
                                                className="project-link demo"
                                                disabled={!project.demoUrl}
                                            >
                                                <Eye size={16} />
                                                Demo
                                            </button>
                                            <button
                                                onClick={() => handleProjectClick(project.githubUrl)}
                                                className="project-link code"
                                                disabled={!project.githubUrl}
                                            >
                                                <Github size={16} />
                                                Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default ProjectsSection