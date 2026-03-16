'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Rocket, Target, Zap, Save, Plus, Trash2, Info, ChevronRight, BarChart3, Star, CheckCircle2, Coffee, Bug } from 'lucide-react'
import type { Achievements } from '@/lib/admin-types'

interface AchievementsTabProps {
    data: Achievements
    onUpdate: (category: string, data: any) => Promise<void>
}

const AchievementsTab = ({ data, onUpdate }: AchievementsTabProps) => {
    const [stats, setStats] = useState(data.stats)
    const [highlights, setHighlights] = useState(data.highlights)
    const [newHighlight, setNewHighlight] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [savingType, setSavingType] = useState<'stats' | 'highlights' | null>(null)

    // Sync with props when they change
    useEffect(() => {
        setStats(data.stats)
        setHighlights(data.highlights)
    }, [data])

    const handleStatChange = (field: keyof typeof stats, value: string) => {
        setStats({
            ...stats,
            [field]: parseInt(value) || 0
        })
    }

    const handleSaveStats = async () => {
        setIsSaving(true)
        setSavingType('stats')
        try {
            await onUpdate('stats', stats)
        } finally {
            setIsSaving(false)
            setSavingType(null)
        }
    }

    const handleAddHighlight = () => {
        if (newHighlight.trim()) {
            const updated = [...highlights, newHighlight.trim()]
            setHighlights(updated)
            setNewHighlight('')
        }
    }

    const handleRemoveHighlight = (index: number) => {
        const updated = highlights.filter((_, i) => i !== index)
        setHighlights(updated)
    }

    const handleSaveHighlights = async () => {
        setIsSaving(true)
        setSavingType('highlights')
        try {
            await onUpdate('highlights', highlights)
        } finally {
            setIsSaving(false)
            setSavingType(null)
        }
    }

    const statFields = [
        { key: 'yearsOfExperience', label: 'Years of Experience', icon: Rocket, color: '#06f9f9', description: 'Total professional journey' },
        { key: 'projectsCompleted', label: 'Projects Delivered', icon: Target, color: '#ff00ff', description: 'End-to-end completions' },
        { key: 'codeCommits', label: 'Code Commits', icon: Zap, color: '#ffaa00', description: 'GitHub/GitLab activity' },
        { key: 'hackathonsWon', label: 'Hackathons Won', icon: Award, color: '#00ff88', description: 'Competitive recognitions' },
        { key: 'clientsSatisfied', label: 'Clients Satisfied', icon: Star, color: '#2de2e6', description: 'Happy partnerships' },
        { key: 'linesOfCode', label: 'Lines of Code', icon: BarChart3, color: '#06f9f9', description: 'Approximate scope' },
        { key: 'bugsFixed', label: 'Bugs Fixed', icon: Bug, color: '#ff00ff', description: 'Quality assurance' },
        { key: 'coffeeConsumed', label: 'Coffee Consumed', icon: Coffee, color: '#ffaa00', description: 'Developer fuel' },
    ]

    return (
        <div className="admin-achievements-tab">
            <style>{`
                .admin-achievements-tab {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* ── Stats Section UI ── */
                .stats-container-modern {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    margin-top: 32px;
                }

                .stat-edit-card-modern {
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .stat-edit-card-modern:hover {
                    border-color: var(--stat-color, #3b82f6);
                    background: rgba(30, 41, 59, 0.6);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
                }

                .stat-edit-header-modern {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .stat-edit-icon-wrap {
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    background: rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--stat-color);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: transform 0.3s ease;
                }

                .stat-edit-card-modern:hover .stat-edit-icon-wrap {
                    transform: scale(1.1) rotate(5deg);
                }

                .stat-edit-info {
                    flex: 1;
                }

                .stat-edit-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 4px;
                }

                .stat-edit-desc {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 500;
                }

                .stat-edit-input-wrap {
                    position: relative;
                    margin-top: 8px;
                }

                .stat-edit-input-modern {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 14px 16px;
                    color: #fff;
                    font-size: 24px;
                    font-weight: 700;
                    font-family: 'JetBrains Mono', monospace;
                    transition: all 0.2s ease;
                }

                .stat-edit-input-modern:focus {
                    outline: none;
                    border-color: var(--stat-color);
                    background: rgba(0, 0, 0, 0.4);
                    box-shadow: 0 0 0 4px rgba(var(--stat-color-rgb), 0.1);
                }

                .stat-edit-input-modern::-webkit-inner-spin-button {
                    opacity: 0;
                }

                .stat-card-glow {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, var(--stat-color) 0%, transparent 60%);
                    opacity: 0.03;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .stat-edit-card-modern:hover .stat-card-glow {
                    opacity: 0.08;
                }

                /* ── Highlights Section ── */
                .highlights-manager-modern {
                    margin-top: 64px;
                }

                .highlights-scroll-area {
                    max-height: 500px;
                    overflow-y: auto;
                    padding-right: 12px;
                    margin-top: 24px;
                }

                .highlights-scroll-area::-webkit-scrollbar {
                    width: 6px;
                }

                .highlights-scroll-area::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }

                .highlight-edit-item {
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 16px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 12px;
                    transition: all 0.2s ease;
                }

                .highlight-edit-item:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateX(4px);
                }

                .highlight-icon-circle {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(59, 130, 246, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #3b82f6;
                    flex-shrink: 0;
                }

                .highlight-text-modern {
                    flex: 1;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                    line-height: 1.5;
                }

                .highlight-delete-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    opacity: 0;
                }

                .highlight-edit-item:hover .highlight-delete-btn {
                    opacity: 1;
                }

                .highlight-delete-btn:hover {
                    background: #ef4444;
                    color: #fff;
                    transform: scale(1.1);
                }

                .add-highlight-box {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    border-radius: 20px;
                    padding: 10px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-top: 24px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .add-highlight-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #fff;
                    padding: 12px 16px;
                    font-size: 15px;
                }

                .add-highlight-input:focus {
                    outline: none;
                }

                .add-highlight-btn {
                    background: #3b82f6;
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .add-highlight-btn:hover {
                    background: #2563eb;
                    transform: scale(1.02);
                }
            `}</style>

            <div className="admin-section-header">
                <div>
                    <div className="admin-section-title-wrapper">
                        <Award className="admin-section-icon" />
                        <h2 className="admin-section-title">Achievements & Stats</h2>
                    </div>
                    <p className="admin-section-description">
                        Numerical highlights that showcase your professional growth and impact.
                    </p>
                </div>
                <button 
                    onClick={handleSaveStats} 
                    disabled={isSaving}
                    className="admin-btn admin-btn-primary"
                    style={{ minWidth: '180px' }}
                >
                    {savingType === 'stats' ? (
                        <>Saving Stats...</>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Statistics
                        </>
                    )}
                </button>
            </div>

            <div className="stats-container-modern">
                {statFields.map((field, index) => {
                    const Icon = field.icon
                    // Helper to convert hex to rgb for shadow/glow
                    const hexToRgb = (hex: string) => {
                        const r = parseInt(hex.slice(1, 3), 16)
                        const g = parseInt(hex.slice(3, 5), 16)
                        const b = parseInt(hex.slice(5, 7), 16)
                        return `${r}, ${g}, ${b}`
                    }

                    return (
                        <motion.div 
                            key={field.key} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="stat-edit-card-modern"
                            style={{ 
                                '--stat-color': field.color,
                                '--stat-color-rgb': hexToRgb(field.color)
                            } as any}
                        >
                            <div className="stat-card-glow" />
                            <div className="stat-edit-header-modern">
                                <div className="stat-edit-icon-wrap">
                                    <Icon size={24} />
                                </div>
                                <div className="stat-edit-info">
                                    <span className="stat-edit-label">{field.label}</span>
                                    <span className="stat-edit-desc">{field.description}</span>
                                </div>
                            </div>
                            <div className="stat-edit-input-wrap">
                                <input
                                    type="number"
                                    value={stats[field.key as keyof typeof stats]}
                                    onChange={(e) => handleStatChange(field.key as keyof typeof stats, e.target.value)}
                                    className="stat-edit-input-modern"
                                    placeholder="0"
                                />
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <div className="highlights-manager-modern">
                <div className="admin-section-header">
                    <div>
                        <div className="admin-section-title-wrapper">
                            <Target className="admin-section-icon" style={{ color: '#ff00ff' }} />
                            <h2 className="admin-section-title">Key Career Milestones</h2>
                        </div>
                        <p className="admin-section-description">
                            Bullet points of major recognitions, breakthrough projects, or career highlights.
                        </p>
                    </div>
                    <button 
                        onClick={handleSaveHighlights} 
                        disabled={isSaving}
                        className="admin-btn admin-btn-primary"
                        style={{ minWidth: '180px', background: 'linear-gradient(135deg, #ff00ff 0%, #db2777 100%)' }}
                    >
                        {savingType === 'highlights' ? (
                            <>Saving Highlights...</>
                        ) : (
                            <>
                                <Save size={18} />
                                Update Highlights
                            </>
                        )}
                    </button>
                </div>

                <div className="add-highlight-box">
                    <input
                        type="text"
                        placeholder="e.g. 🏆 First prize at HackTheWeb 2024 for innovative AI tool"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="add-highlight-input"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                    />
                    <button 
                        onClick={handleAddHighlight}
                        className="add-highlight-btn"
                        disabled={!newHighlight.trim()}
                    >
                        <Plus size={18} />
                        Add Milestone
                    </button>
                </div>

                <div className="highlights-scroll-area">
                    <AnimatePresence>
                        {highlights.map((highlight, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.03 }}
                                className="highlight-edit-item"
                            >
                                <div className="highlight-icon-circle">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="highlight-text-modern">{highlight}</div>
                                <button 
                                    onClick={() => handleRemoveHighlight(index)}
                                    className="highlight-delete-btn"
                                    title="Remove this milestone"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {highlights.length === 0 && (
                        <div className="admin-empty-state" style={{ background: 'rgba(30, 41, 59, 0.2)', borderRadius: '20px', padding: '80px 0' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center', margin: '0 auto 24px' }}>
                                <Rocket size={40} style={{ opacity: 0.1 }} />
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '15px' }}>
                                Start listing your breakthrough moments to show the world your potential.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AchievementsTab
