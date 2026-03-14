'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, User, Mail, MapPin, Globe, Github, Linkedin, Twitter, Phone, Clock, Languages, Briefcase } from 'lucide-react'

interface PersonalInfoTabProps {
    data: any
    onUpdate: (data: any) => void
}

const PersonalInfoTab = ({ data, onUpdate }: PersonalInfoTabProps) => {
    const [editData, setEditData] = useState(data)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        try {
            await onUpdate(editData)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update personal info', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setEditData(data)
        setIsEditing(false)
    }

    // Field configuration with icons and grouping
    const fieldGroups = [
        {
            title: 'Basic Information',
            fields: [
                { key: 'name', label: 'Full Name', icon: User, required: true },
                { key: 'title', label: 'Professional Title', icon: Briefcase, required: true },
                { key: 'role', label: 'Role', icon: User },
                { key: 'status', label: 'Status', icon: Clock },
            ]
        },
        {
            title: 'Contact Details',
            fields: [
                { key: 'email', label: 'Email', icon: Mail, type: 'email', required: true },
                { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
                { key: 'location', label: 'Location', icon: MapPin },
                { key: 'timezone', label: 'Timezone', icon: Clock },
            ]
        },
        {
            title: 'Professional Links',
            fields: [
                { key: 'github', label: 'GitHub', icon: Github, type: 'url' },
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, type: 'url' },
                { key: 'twitter', label: 'Twitter', icon: Twitter, type: 'url' },
                { key: 'website', label: 'Website', icon: Globe, type: 'url' },
                { key: 'portfolio', label: 'Portfolio', icon: Globe, type: 'url' },
                { key: 'resume', label: 'Resume URL', icon: Globe, type: 'url' },
            ]
        },
        {
            title: 'Additional Information',
            fields: [
                { key: 'bio', label: 'Bio', icon: User, multiline: true },
                { key: 'experience', label: 'Years of Experience', icon: Briefcase },
                { key: 'availability', label: 'Availability', icon: Clock },
                { key: 'languages', label: 'Languages (comma separated)', icon: Languages, isArray: true },
            ]
        }
    ]

    const renderField = (field: any) => {
        const { key, label, icon: Icon, type = 'text', multiline = false, isArray = false, required = false } = field
        const value = editData[key] || ''
        const displayValue = isArray && Array.isArray(value) ? value.join(', ') : value

        return (
            <div key={key} className="admin-form-group">
                <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {Icon && <Icon size={14} style={{ opacity: 0.7 }} />}
                    {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                {isEditing ? (
                    multiline ? (
                        <textarea
                            value={displayValue}
                            onChange={(e) => setEditData({
                                ...editData,
                                [key]: isArray ? e.target.value.split(',').map(s => s.trim()) : e.target.value
                            })}
                            className="admin-textarea"
                            rows={4}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                        />
                    ) : (
                        <input
                            type={type}
                            value={displayValue}
                            onChange={(e) => setEditData({
                                ...editData,
                                [key]: isArray ? e.target.value.split(',').map(s => s.trim()) : e.target.value
                            })}
                            className="admin-form-input"
                            placeholder={`Enter ${label.toLowerCase()}...`}
                        />
                    )
                ) : (
                    <div className="admin-readonly-field" style={{
                        padding: '12px 16px',
                        background: 'rgba(55, 65, 81, 0.3)',
                        borderRadius: '8px',
                        color: value ? '#e4e7eb' : '#6b7280',
                        minHeight: multiline ? '80px' : 'auto',
                        whiteSpace: multiline ? 'pre-wrap' : 'normal'
                    }}>
                        {displayValue || <span style={{ fontStyle: 'italic' }}>Not set</span>}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <User />
                    <h2 className="admin-section-title">Personal Information</h2>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="admin-btn admin-btn-green"
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="admin-btn admin-btn-gray"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="admin-btn admin-btn-blue"
                        >
                            <Edit size={18} />
                            Edit Information
                        </button>
                    )}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="admin-card"
            >
                {fieldGroups.map((group, groupIndex) => (
                    <div key={group.title} style={{
                        marginBottom: groupIndex < fieldGroups.length - 1 ? '32px' : '0',
                        paddingBottom: groupIndex < fieldGroups.length - 1 ? '24px' : '0',
                        borderBottom: groupIndex < fieldGroups.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                    }}>
                        <h3 style={{
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            color: '#9ca3af',
                            marginBottom: '16px',
                            letterSpacing: '0.05em',
                            fontWeight: '600'
                        }}>
                            {group.title}
                        </h3>
                        <div className="admin-form-grid">
                            {group.fields.map(field => renderField(field))}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default PersonalInfoTab