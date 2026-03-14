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
                <div className="admin-section-title-wrapper">
                    <Award />
                    <h2 className="admin-section-title">Achievements & Stats</h2>
                </div>
                <button 
                    onClick={handleSaveStats} 
                    disabled={isSaving}
                    className="admin-btn admin-btn-primary"
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save All Stats'}
                </button>
            </div>

            <p className="admin-section-description">
                Manage the numerical statistics and key highlights shown in your portfolio's skills and about sections.
            </p>

            <div className="admin-grid admin-stats-edit-grid">
                {statFields.map((field) => {
                    const Icon = field.icon
                    return (
                        <div key={field.key} className="admin-card admin-stat-edit-card">
                            <div className="admin-stat-edit-header">
                                <div className="admin-stat-edit-icon" style={{ color: field.color }}>
                                    <Icon size={20} />
                                </div>
                                <label className="admin-stat-edit-label">{field.label}</label>
                            </div>
                            <input
                                type="number"
                                value={stats[field.key as keyof typeof stats]}
                                onChange={(e) => handleStatChange(field.key as keyof typeof stats, e.target.value)}
                                className="admin-form-input"
                            />
                        </div>
                    )
                })}
            </div>

            <div className="admin-section-header" style={{ marginTop: '48px' }}>
                <div className="admin-section-title-wrapper">
                    <Target />
                    <h2 className="admin-section-title">Key Highlights</h2>
                </div>
                <button 
                    onClick={handleSaveHighlights} 
                    disabled={isSaving}
                    className="admin-btn admin-btn-primary"
                >
                    <Save size={18} />
                    {isSaving ? 'Saving...' : 'Save Highlights'}
                </button>
            </div>

            <div className="admin-card admin-highlights-manager">
                <div className="admin-add-highlight-form">
                    <input
                        type="text"
                        placeholder="e.g. 🏆 Winner of Global Hackathon 2023"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="admin-form-input"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                    />
                    <button 
                        onClick={handleAddHighlight}
                        className="admin-btn admin-btn-green"
                    >
                        <Plus size={18} />
                        Add
                    </button>
                </div>

                <div className="admin-highlights-list" style={{ marginTop: '20px' }}>
                    {highlights.map((highlight, index) => (
                        <div key={index} className="admin-highlight-item">
                            <span className="admin-highlight-text">{highlight}</span>
                            <button 
                                onClick={() => handleRemoveHighlight(index)}
                                className="admin-btn-icon delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {highlights.length === 0 && (
                        <p className="admin-empty-text">No highlights added yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AchievementsTab
