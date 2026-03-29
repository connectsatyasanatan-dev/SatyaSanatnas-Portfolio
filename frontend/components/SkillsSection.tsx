'use client'

import { useState, useEffect } from 'react'
import {
    Code2,
    Database,
    Cloud,
    Wrench,
    TrendingUp,
    Award,
    Zap,
    Target,
    Brain,
    Rocket,
    Star,
    ChevronRight,
    Play,
    Pause
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import portfolioAPI, { SkillCategory, Achievements, PortfolioStats } from '@/lib/api'
import { SkillsSectionSkeleton } from './AppSkeletons'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
}

const SkillsSection = () => {
    const [activeCategory, setActiveCategory] = useState('frontend')
    const [isAnimating, setIsAnimating] = useState(true)
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)
    const [skills, setSkills] = useState<Record<string, SkillCategory>>({})
    const [achievements, setAchievements] = useState<Achievements | null>(null)
    const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [skillsData, achievementsData, statsData] = await Promise.all([
                    portfolioAPI.getSkills(),
                    portfolioAPI.getAchievements(),
                    portfolioAPI.getStats()
                ])
                setSkills(skillsData)
                
                // Set first category with skills as active
                const firstValidCategory = skillCategories.find(cat => skillsData[cat.key]?.skills.length > 0)
                if (firstValidCategory) {
                    setActiveCategory(firstValidCategory.key)
                }

                setAchievements(achievementsData)
                setPortfolioStats(statsData)
            } catch (error) {
                console.error('Failed to fetch skills data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const skillCategories = [
        {
            key: 'frontend',
            icon: Code2,
            color: '#06f9f9',
            gradient: 'from-cyan-400 to-blue-500',
            title: 'Frontend',
            description: 'User Interface & Experience'
        },
        {
            key: 'backend',
            icon: Database,
            color: '#ff00ff',
            gradient: 'from-purple-400 to-pink-500',
            title: 'Backend',
            description: 'Server & API Development'
        },
        {
            key: 'database',
            icon: Database,
            color: '#2de2e6',
            gradient: 'from-teal-400 to-cyan-500',
            title: 'Database',
            description: 'Data Storage & Management'
        },
        {
            key: 'cloud',
            icon: Cloud,
            color: '#00ff88',
            gradient: 'from-green-400 to-emerald-500',
            title: 'Cloud & DevOps',
            description: 'Infrastructure & Deployment'
        },
        {
            key: 'tools',
            icon: Wrench,
            color: '#ffaa00',
            gradient: 'from-yellow-400 to-orange-500',
            title: 'Tools & Others',
            description: 'Development Tools & Utilities'
        }
    ]

    const getSkillLevel = (level: number) => {
        if (level >= 90) return { label: 'Expert', color: '#00ff88' }
        if (level >= 80) return { label: 'Advanced', color: '#06f9f9' }
        if (level >= 70) return { label: 'Intermediate', color: '#ffaa00' }
        return { label: 'Beginner', color: '#ff00ff' }
    }

    const toggleAnimation = () => {
        setIsAnimating(!isAnimating)
    }

    useEffect(() => {
        if (isAnimating) {
            const interval = setInterval(() => {
                setActiveCategory(prev => {
                    const currentIndex = skillCategories.findIndex(cat => cat.key === prev)
                    const nextIndex = (currentIndex + 1) % skillCategories.length
                    return skillCategories[nextIndex].key
                })
            }, 4000)
            return () => clearInterval(interval)
        }
    }, [isAnimating, skillCategories])

    if (loading) {
        return <SkillsSectionSkeleton />
    }

    const activeSkillData = skills[activeCategory as keyof typeof skills]
    const activeCategoryData = skillCategories.find(cat => cat.key === activeCategory)

    // Derived stats
    const yearsExp = portfolioStats?.experience_years ?? achievements?.stats.yearsOfExperience ?? 0
    const projectsCount = portfolioStats?.projects_count ?? achievements?.stats.projectsCompleted ?? 0
    const codeCommits = portfolioStats?.code_commits ?? achievements?.stats.codeCommits ?? 0
    const hackathonsWon = achievements?.stats.hackathonsWon ?? 0

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div 
                    key="skeleton-skills"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                >
                    <SkillsSectionSkeleton />
                </motion.div>
            ) : (
                <motion.section 
                    key="skills-content"
                    id="skills-section" 
                    className="skills-modern-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header with Animation Control */}
                    <div className="section-header-modern">
                        <div className="header-content">
                            <div className="header-icon">
                                <Brain className="icon-brain" />
                                <div className="icon-glow"></div>
                            </div>
                            <div className="header-text">
                                <h3 className="section-title-modern">Technical Expertise</h3>
                                <p className="section-subtitle">Interactive Skills Showcase</p>
                            </div>
                        </div>
                        <button
                            className="animation-toggle"
                            onClick={toggleAnimation}
                            title={isAnimating ? 'Pause Animation' : 'Play Animation'}
                        >
                            {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                    </div>

                    {/* Stats Dashboard */}
                    <motion.div 
                        className="stats-dashboard"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {yearsExp > 0 && (
                            <motion.div className="stat-card-modern" variants={itemVariants}>
                                <div className="stat-icon">
                                    <Rocket />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{yearsExp}+</div>
                                    <div className="stat-label">Years Experience</div>
                                </div>
                                <div className="stat-progress">
                                    <motion.div 
                                        className="progress-bar" 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '85%' }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        )}

                        {projectsCount > 0 && (
                            <motion.div className="stat-card-modern" variants={itemVariants}>
                                <div className="stat-icon">
                                    <Target />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{projectsCount}+</div>
                                    <div className="stat-label">Projects Delivered</div>
                                </div>
                                <div className="stat-progress">
                                    <motion.div 
                                        className="progress-bar" 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '92%' }}
                                        transition={{ duration: 1, delay: 0.6 }}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        )}

                        {codeCommits > 0 && (
                            <motion.div className="stat-card-modern" variants={itemVariants}>
                                <div className="stat-icon">
                                    <Zap />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{Math.floor(codeCommits / 1000)}K+</div>
                                    <div className="stat-label">Code Commits</div>
                                </div>
                                <div className="stat-progress">
                                    <motion.div 
                                        className="progress-bar" 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '78%' }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        )}

                        {hackathonsWon > 0 && (
                            <motion.div className="stat-card-modern" variants={itemVariants}>
                                <div className="stat-icon">
                                    <Award />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{hackathonsWon}</div>
                                    <div className="stat-label">Hackathons Won</div>
                                </div>
                                <div className="stat-progress">
                                    <motion.div 
                                        className="progress-bar" 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '100%' }}
                                        transition={{ duration: 1, delay: 0.8 }}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Interactive Skills Explorer */}
                    <div className="skills-explorer">
                        {/* Category Navigation */}
                        <div className="category-nav">
                            {skillCategories
                                .filter(category => skills[category.key as keyof typeof skills]?.skills.length > 0)
                                .map((category) => {
                                    const IconComponent = category.icon
                                    const isActive = activeCategory === category.key

                                    return (
                                        <button
                                            key={category.key}
                                            className={`category-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => setActiveCategory(category.key)}
                                            style={{
                                                '--category-color': category.color,
                                                '--category-gradient': `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
                                            } as React.CSSProperties}
                                        >
                                            <div className="category-btn-icon">
                                                <IconComponent size={20} />
                                            </div>
                                            <div className="category-btn-content">
                                                <div className="category-btn-title">{category.title}</div>
                                                <div className="category-btn-desc">{category.description}</div>
                                            </div>
                                            <ChevronRight className="category-btn-arrow" size={16} />
                                        </button>
                                    )
                                })}
                        </div>

                        {/* Skills Display */}
                        <div className="skills-display">
                            {activeSkillData && (
                                <>
                                    <div className="skills-header">
                                        <div className="skills-category-info">
                                            <div
                                                className="category-icon-large"
                                                style={{ '--category-color': activeCategoryData?.color } as React.CSSProperties}
                                            >
                                                {activeCategoryData && <activeCategoryData.icon size={32} />}
                                            </div>
                                            <div className="category-details">
                                                <h4 className="category-title-large">{activeSkillData.title}</h4>
                                                <p className="category-description">{activeCategoryData?.description}</p>
                                            </div>
                                        </div>
                                        <div className="skills-count">
                                            {activeSkillData.skills.length} Skills
                                        </div>
                                    </div>

                                    <motion.div 
                                        className="skills-grid-modern"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        key={activeCategory} // Force re-animation on category change
                                    >
                                        {activeSkillData.skills.map((skill, index) => {
                                            const skillLevel = getSkillLevel(skill.level)
                                            const isHovered = hoveredSkill === skill.name

                                            return (
                                                <motion.div
                                                    key={skill.name}
                                                    variants={itemVariants}
                                                    className={`skill-card-modern ${isHovered ? 'hovered' : ''}`}
                                                    onMouseEnter={() => setHoveredSkill(skill.name)}
                                                    onMouseLeave={() => setHoveredSkill(null)}
                                                    style={{
                                                        '--skill-color': skillLevel.color,
                                                    } as React.CSSProperties}
                                                >
                                                    <div className="skill-card-header">
                                                        <div className="skill-name">{skill.name}</div>
                                                        <div className="skill-level-badge" style={{ backgroundColor: skillLevel.color }}>
                                                            {skillLevel.label}
                                                        </div>
                                                    </div>

                                                    <div className="skill-metrics">
                                                        <div className="skill-metric">
                                                            <span className="metric-label">Experience</span>
                                                            <span className="metric-value">{skill.years} years</span>
                                                        </div>
                                                        <div className="skill-metric">
                                                            <span className="metric-label">Proficiency</span>
                                                            <span className="metric-value">{skill.level}%</span>
                                                        </div>
                                                    </div>

                                                    <div className="skill-progress-container">
                                                        <div className="skill-progress-track">
                                                            <motion.div
                                                                className="skill-progress-fill"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${skill.level}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                style={{
                                                                    backgroundColor: skillLevel.color,
                                                                }}
                                                            ></motion.div>
                                                        </div>
                                                        <div className="skill-stars">
                                                            {[...Array(5)].map((_, starIndex) => (
                                                                <Star
                                                                    key={starIndex}
                                                                    size={12}
                                                                    className={`skill-star ${starIndex < Math.floor(skill.level / 20) ? 'filled' : ''}`}
                                                                    style={{
                                                                        color: starIndex < Math.floor(skill.level / 20) ? skillLevel.color : '#273a3a',
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="skill-card-glow" style={{ backgroundColor: skillLevel.color }}></div>
                                                </motion.div>
                                            )
                                        })}
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Achievements Showcase */}
                    {achievements && achievements.highlights && achievements.highlights.length > 0 && (
                        <div className="achievements-showcase">
                            <div className="achievements-header-modern">
                                <div className="achievements-icon-container">
                                    <Award className="achievements-icon" />
                                    <div className="achievements-icon-glow"></div>
                                </div>
                                <div className="achievements-text">
                                    <h4 className="achievements-title">Key Achievements</h4>
                                    <p className="achievements-subtitle">Milestones & Recognition</p>
                                </div>
                            </div>

                            <div className="achievements-grid-modern">
                                {achievements.highlights.slice(0, 6).map((achievement, index) => (
                                    <div
                                        key={index}
                                        className="achievement-card-modern"
                                        style={{ '--animation-delay': `${index * 0.1}s` } as React.CSSProperties}
                                    >
                                        <div className="achievement-emoji">
                                            {achievement.split(' ')[0]}
                                        </div>
                                        <div className="achievement-content">
                                            <p className="achievement-text">
                                                {achievement.substring(achievement.indexOf(' ') + 1)}
                                            </p>
                                        </div>
                                        <div className="achievement-glow"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default SkillsSection