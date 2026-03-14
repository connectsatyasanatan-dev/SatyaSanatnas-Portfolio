'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Rocket, Target, Zap, Save, Plus, Trash2, Info } from 'lucide-react'
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
        try {
            await onUpdate('stats', stats)
        } finally {
            setIsSaving(false)
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
        try {
            await onUpdate('highlights', highlights)
        } finally {
            setIsSaving(false)
        }
    }

    const statFields = [
        { key: 'yearsOfExperience', label: 'Years of Experience', icon: Rocket, color: '#06f9f9' },
        { key: 'projectsCompleted', label: 'Projects Delivered', icon: Target, color: '#ff00ff' },
        { key: 'codeCommits', label: 'Code Commits', icon: Zap, color: '#ffaa00' },
        { key: 'hackathonsWon', label: 'Hackathons Won', icon: Award, color: '#00ff88' },
        { key: 'clientsSatisfied', label: 'Clients Satisfied', icon: Info, color: '#2de2e6' },
        { key: 'linesOfCode', label: 'Lines of Code', icon: Zap, color: '#06f9f9' },
        { key: 'bugsFixed', label: 'Bugs Fixed', icon: Target, color: '#ff00ff' },
        { key: 'coffeeConsumed', label: 'Coffee Consumed', icon: Zap, color: '#ffaa00' },
    ]

    return (
        <div className="admin-achievements-tab">
            <div className="admin-section-header">
                <div>
                    <div className="admin-section-title-wrapper">
                        <Award className="admin-section-icon" />
                        <h2 className="admin-section-title">Achievements & Stats</h2>
                    </div>
                    <p className="admin-section-description" style={{ marginLeft: '0', marginTop: '8px' }}>
                        Configure the numerical statistics displayed in your portfolio's skills dashboard.
                    </p>
                </div>
                <button 
                    onClick={handleSaveStats} 
                    disabled={isSaving}
                    className="admin-btn admin-btn-primary"
                    style={{ minWidth: '160px', height: 'fit-content' }}
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save All Stats'}
                </button>
            </div>

            <div className="admin-grid admin-stats-edit-grid">
                {statFields.map((field, index) => {
                    const Icon = field.icon
                    return (
                        <motion.div 
                            key={field.key} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="admin-card admin-stat-edit-card"
                            style={{ '--stat-color': field.color } as any}
                        >
                            <div className="admin-stat-edit-header">
                                <div className="admin-stat-edit-icon" style={{ color: field.color, boxShadow: `0 8px 16px ${field.color}15` }}>
                                    <Icon size={22} />
                                </div>
                                <label className="admin-stat-edit-label">{field.label}</label>
                            </div>
                            <input
                                type="number"
                                value={stats[field.key as keyof typeof stats]}
                                onChange={(e) => handleStatChange(field.key as keyof typeof stats, e.target.value)}
                                className="admin-form-input"
                                placeholder="0"
                            />
                        </motion.div>
                    )
                })}
            </div>

            <div className="admin-section-header" style={{ marginTop: '80px' }}>
                <div>
                    <div className="admin-section-title-wrapper">
                        <Target className="admin-section-icon" />
                        <h2 className="admin-section-title">Key Highlights</h2>
                    </div>
                    <p className="admin-section-description" style={{ marginLeft: '0', marginTop: '8px' }}>
                        List major milestones, awards, or career breakthroughs.
                    </p>
                </div>
                <button 
                    onClick={handleSaveHighlights} 
                    disabled={isSaving}
                    className="admin-btn admin-btn-primary"
                    style={{ minWidth: '180px', height: 'fit-content' }}
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Highlights'}
                </button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="admin-card admin-highlights-manager"
                style={{ padding: '40px' }}
            >
                <div className="admin-add-highlight-form">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            type="text"
                            placeholder="e.g. 🏆 Featured in TechCrunch for 'Project X' Innovation"
                            value={newHighlight}
                            onChange={(e) => setNewHighlight(e.target.value)}
                            className="admin-form-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                            style={{ paddingRight: '120px' }}
                        />
                        <button 
                            onClick={handleAddHighlight}
                            className="admin-btn admin-btn-green"
                            style={{ 
                                position: 'absolute', 
                                right: '6px', 
                                top: '6px', 
                                height: '44px',
                                padding: '0 20px',
                                borderRadius: '12px',
                                transform: 'none'
                            }}
                        >
                            <Plus size={18} />
                            Add
                        </button>
                    </div>
                </div>

                <div className="admin-highlights-list" style={{ marginTop: '32px' }}>
                    {highlights.map((highlight, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="admin-highlight-item"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="highlight-bullet" style={{ 
                                    width: '10px', 
                                    height: '10px', 
                                    borderRadius: '50%', 
                                    background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
                                }}></div>
                                <span className="admin-highlight-text">{highlight}</span>
                            </div>
                            <button 
                                onClick={() => handleRemoveHighlight(index)}
                                className="admin-btn-icon delete"
                                title="Delete highlight"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                    {highlights.length === 0 && (
                        <div className="admin-empty-state" style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                background: 'rgba(255,255,255,0.03)', 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <Info size={32} style={{ opacity: 0.2 }} />
                            </div>
                            <p className="admin-empty-text" style={{ fontSize: '15px' }}>
                                Your career highlights are empty. Add milestones to impress your visitors.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default AchievementsTab
