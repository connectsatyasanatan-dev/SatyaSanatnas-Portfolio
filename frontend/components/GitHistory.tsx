 'use client'

import { GitCommit, GitMerge, Play, Pause, Diff, Activity } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import portfolioAPI, { Experience } from '@/lib/api'
import { ExperienceSectionSkeleton } from './AppSkeletons'

const GitHistory = () => {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await portfolioAPI.getExperience()
                setExperiences(data)
            } catch (e) {
                console.error('Failed to load experience', e)
            } finally {
                setLoading(false)
            }
        }

        fetch()
    }, [])

    const changedFiles = [
        { status: "A", file: "src/components/Header.tsx", statusClass: "added" },
        { status: "M", file: "src/styles/globals.css", statusClass: "modified" },
        { status: "D", file: "legacy/OldNav.js", statusClass: "deleted" },
        { status: "M", file: "package.json", statusClass: "modified" },
    ]

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div 
                    key="skeleton-experience"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                >
                    <ExperienceSectionSkeleton />
                </motion.div>
            ) : (
                <motion.section 
                    key="experience-content"
                    id="git-history-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="section-header">
                        <GitCommit />
                        <h3 className="section-title">Git History (Experience)</h3>
                    </div>

                    <div className="timeline-container">
                        {/* Timeline */}
                        <div className="timeline-main">
                            <div className="timeline-line"></div>

                            {experiences.map((exp, index) => {
                                const isPresent = exp.period.toLowerCase().includes('present') || exp.period.toLowerCase().includes('current');
                                const IconComponent = isPresent ? Play : Pause;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                        className="timeline-item"
                                    >
                                        {/* Timeline dot */}
                                        <div className="timeline-dot">
                                            <motion.div
                                                whileHover={{ scale: 1.1 }}
                                                className={`timeline-dot-inner ${exp.color}`}
                                            >
                                                <IconComponent className={`${exp.color}`} />
                                            </motion.div>
                                        </div>

                                        {/* Content card */}
                                        <motion.div
                                            whileHover={{ y: -2 }}
                                            className={`timeline-content ${exp.color} ${exp.period.includes('Present') ? 'active' : ''}`}
                                            style={exp.period.includes('Present') ? {
                                                borderColor: 'var(--primary)',
                                                boxShadow: '0 0 15px rgba(6, 249, 249, 0.15), inset 0 0 20px rgba(6, 249, 249, 0.05)'
                                            } : {}}
                                        >
                                            <div className="timeline-header">
                                                <div className="timeline-title-group">
                                                    <div className="timeline-title-row">
                                                        <h4 className="timeline-title">{exp.title}</h4>
                                                        {exp.badge && (
                                                            <span className={`timeline-badge ${exp.color}`}>
                                                                {exp.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`timeline-company ${exp.color}`}>@ {exp.company}</p>
                                                </div>
                                                <div className="timeline-meta">
                                                    <div className={`timeline-period ${exp.period.includes('Present') ? 'active' : ''}`}>
                                                        {exp.period.includes('Present') && (
                                                            <span className="live-indicator"></span>
                                                        )}
                                                        {exp.period}
                                                    </div>
                                                    <div className="timeline-commit">{exp.commit}</div>
                                                </div>
                                            </div>

                                            <p className="timeline-description">{exp.description}</p>

                                            {exp.achievements && (
                                                <div className="timeline-achievements">
                                                    <ul>
                                                        {exp.achievements.map((achievement, achIndex) => (
                                                            <li key={achIndex}>{achievement}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="timeline-technologies">
                                                {exp.technologies.map((tech, techIndex) => (
                                                    <span
                                                        key={techIndex}
                                                        className={`tech-tag ${exp.color}`}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Changed files sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="changed-files-sidebar"
                        >
                            <div className="changed-files-header">
                                <Diff />
                                <h4 className="changed-files-title">Changed Files</h4>
                            </div>

                            <div className="changed-files-list">
                                {changedFiles.map((file, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="changed-file-item"
                                    >
                                        <span className={`file-status ${file.statusClass}`}>{file.status}</span>
                                        <span>{file.file}</span>
                                    </motion.div>
                                ))}

                                <div className="changed-files-stats">
                                    <div className="stats-row">
                                        <span>Additions</span>
                                        <span className="stats-additions">+452</span>
                                    </div>
                                    <div className="stats-row">
                                        <span>Deletions</span>
                                        <span className="stats-deletions">-128</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default GitHistory