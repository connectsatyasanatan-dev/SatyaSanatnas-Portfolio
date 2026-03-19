'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, Plus, Trash2, Calendar, MapPin, Briefcase } from 'lucide-react'
import type { Experience } from '@/lib/admin-types'
import ErrorAlert from './ErrorAlert'
import ConfirmDialog from './ConfirmDialog'
import TagListField from './TagListField'

interface ExperienceTabProps {
    experience: Experience[]
    onAddExperience: (experience: Omit<Experience, 'id'>) => Promise<void>
    onUpdateExperience: (id: number, experience: Partial<Experience>) => Promise<void>
    onDeleteExperience: (id: number) => Promise<void>
}

const ExperienceTab = ({ experience, onAddExperience, onUpdateExperience, onDeleteExperience }: ExperienceTabProps) => {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState<Partial<Experience> | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
        title: '',
        company: '',
        location: '',
        period: '',
        duration: '',
        type: 'Full-time',
        description: '',
        achievements: [],
        technologies: []
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id ?? null)
        setEditData({ ...exp })
    }

    const handleSave = async () => {
        const id = editingId ?? editData?.id
        if (id == null || id === undefined || !editData) {
            setError('Cannot save: missing experience id')
            return
        }

        if (!editData.title?.trim() || !editData.company?.trim() || !editData.description?.trim()) {
            setError('Title, company, and description are required')
            return
        }

        setLoading(true)
        setError(null)
        try {
            const payload = {
                title: editData.title.trim(),
                company: editData.company.trim(),
                location: (editData.location ?? '').trim() || undefined,
                period: (editData.period ?? '').trim() || undefined,
                duration: (editData.duration ?? '').trim() || undefined,
                type: editData.type ?? 'Full-time',
                description: editData.description.trim(),
                achievements: Array.isArray(editData.achievements) ? editData.achievements : [],
                technologies: Array.isArray(editData.technologies) ? editData.technologies : [],
            }
            await onUpdateExperience(Number(id), payload)
            setEditingId(null)
            setEditData(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to update experience')
        } finally {
            setLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditData(null)
        setError(null)
    }

    const handleAdd = async () => {
        if (!newExperience.title || !newExperience.company || !newExperience.description) {
            setError('Title, company, and description are required')
            return
        }

        setLoading(true)
        try {
            await onAddExperience(newExperience)
            setNewExperience({
                title: '',
                company: '',
                location: '',
                period: '',
                duration: '',
                type: 'Full-time',
                description: '',
                achievements: [],
                technologies: []
            })
            setShowAddForm(false)
            setError(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to add experience')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id: number) => {
        setDeleteConfirm({ isOpen: true, id })
    }

    const confirmDelete = async () => {
        if (deleteConfirm.id !== null) {
            setLoading(true)
            try {
                await onDeleteExperience(deleteConfirm.id)
                setDeleteConfirm({ isOpen: false, id: null })
            } catch (err: unknown) {
                setError((err as Error).message || 'Failed to delete experience')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <Briefcase />
                    <h2 className="admin-section-title">Experience Management</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="admin-btn admin-btn-green"
                >
                    <Plus />
                    Add Experience
                </button>
            </div>

            {error && (
                <ErrorAlert
                    message={error}
                    type="error"
                    onDismiss={() => setError(null)}
                />
            )}

            {/* Add Experience Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-card"
                    style={{ marginBottom: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Experience</h3>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Job Title *</label>
                            <input
                                type="text"
                                value={newExperience.title}
                                onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                                className="admin-form-input"
                                placeholder="Senior Developer"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Company *</label>
                            <input
                                type="text"
                                value={newExperience.company}
                                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                                className="admin-form-input"
                                placeholder="Tech Corp Inc."
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Location</label>
                            <input
                                type="text"
                                value={newExperience.location}
                                onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                                className="admin-form-input"
                                placeholder="San Francisco, CA"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Period</label>
                            <input
                                type="text"
                                value={newExperience.period}
                                onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                                className="admin-form-input"
                                placeholder="Jan 2020 - Present"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Duration</label>
                            <input
                                type="text"
                                value={newExperience.duration}
                                onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                                className="admin-form-input"
                                placeholder="2 years 6 months"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Type</label>
                            <select
                                value={newExperience.type}
                                onChange={(e) => setNewExperience({ ...newExperience, type: e.target.value })}
                                className="admin-select"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="admin-form-group admin-form-group-full">
                            <label className="admin-form-label">Description *</label>
                            <textarea
                                value={newExperience.description}
                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                className="admin-textarea"
                                rows={3}
                                placeholder="Describe your role and responsibilities..."
                            />
                        </div>
                        <div className="admin-form-group">
                            <TagListField
                                label="Achievements"
                                hint=" Add one by one or paste multiple lines"
                                value={newExperience.achievements}
                                onChange={(items) => setNewExperience({ ...newExperience, achievements: items })}
                                placeholder="e.g. Led team of 5 developers"
                                variant="long"
                            />
                        </div>
                        <div className="admin-form-group">
                            <TagListField
                                label="Technologies"
                                hint=" Add one by one or paste multiple lines"
                                value={newExperience.technologies}
                                onChange={(items) => setNewExperience({ ...newExperience, technologies: items })}
                                placeholder="e.g. React, Node.js"
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="admin-btn admin-btn-green"
                        >
                            <Save />
                            {loading ? 'Adding...' : 'Add Experience'}
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="admin-btn admin-btn-gray"
                        >
                            <X />
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Experience List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {experience.map((exp, index) => (
                    <motion.div
                        key={exp.id ?? index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-card"
                    >
                        <div className="admin-item-header">
                            <div>
                                <h3 className="admin-item-title">{exp.title}</h3>
                                <div className="admin-experience-meta-row">
                                    <span className="admin-experience-meta-item">
                                        <Briefcase className="admin-experience-meta-icon" />
                                        {exp.company}
                                    </span>
                                    {exp.location ? (
                                        <span className="admin-experience-meta-item">
                                            <MapPin className="admin-experience-meta-icon" />
                                            {exp.location}
                                        </span>
                                    ) : null}
                                    {exp.period ? (
                                        <span className="admin-experience-meta-item">
                                            <Calendar className="admin-experience-meta-icon" />
                                            {exp.period}
                                        </span>
                                    ) : null}
                                    {exp.duration ? (
                                        <span className="admin-experience-meta-item">{exp.duration}</span>
                                    ) : null}
                                    {exp.type ? (
                                        <span className="admin-experience-badge">{exp.type}</span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="admin-item-actions admin-experience-card-actions">
                                {editingId === exp.id ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="admin-btn admin-btn-green admin-experience-action-btn"
                                        >
                                            <Save />
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="admin-btn admin-btn-gray admin-experience-action-btn"
                                        >
                                            <X />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="admin-btn admin-btn-blue admin-experience-action-btn"
                                            title="Edit this experience"
                                        >
                                            <Edit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => exp.id != null && handleDelete(exp.id)}
                                            className="admin-btn admin-btn-red admin-experience-action-btn"
                                            title="Delete this experience"
                                            disabled={exp.id == null}
                                        >
                                            <Trash2 />
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingId === exp.id && editData ? (
                            <div className="admin-experience-edit-form">
                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Job Title *</label>
                                        <input
                                            type="text"
                                            value={editData.title ?? ''}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="Senior Developer"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Company *</label>
                                        <input
                                            type="text"
                                            value={editData.company ?? ''}
                                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="Tech Corp Inc."
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Location</label>
                                        <input
                                            type="text"
                                            value={editData.location ?? ''}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="San Francisco, CA"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Period</label>
                                        <input
                                            type="text"
                                            value={editData.period ?? ''}
                                            onChange={(e) => setEditData({ ...editData, period: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="Jan 2020 - Present"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Duration</label>
                                        <input
                                            type="text"
                                            value={editData.duration ?? ''}
                                            onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="2 years 6 months"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Type</label>
                                        <select
                                            value={editData.type ?? 'Full-time'}
                                            onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                            className="admin-select"
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div className="admin-form-group admin-form-group-full">
                                        <label className="admin-form-label">Description *</label>
                                        <textarea
                                            value={editData.description ?? ''}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            className="admin-textarea"
                                            rows={3}
                                            placeholder="Describe your role and responsibilities..."
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <TagListField
                                            label="Achievements"
                                            hint=" Add one by one or paste multiple lines"
                                            value={editData.achievements ?? []}
                                            onChange={(items) => setEditData({ ...editData, achievements: items })}
                                            placeholder="e.g. Led team of 5 developers"
                                            variant="long"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <TagListField
                                            label="Technologies"
                                            hint=" Add one by one or paste multiple lines"
                                            value={editData.technologies ?? []}
                                            onChange={(items) => setEditData({ ...editData, technologies: items })}
                                            placeholder="e.g. React, Node.js"
                                        />
                                    </div>
                                </div>
                                <div className="admin-experience-edit-actions">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="admin-btn admin-btn-green"
                                    >
                                        <Save />
                                        {loading ? 'Saving...' : 'Save changes'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="admin-btn admin-btn-gray"
                                    >
                                        <X />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="admin-item-content admin-experience-description">{exp.description}</p>

                                {exp.achievements && exp.achievements.length > 0 && (
                                    <div className="admin-experience-block">
                                        <h4 className="admin-experience-block-title">Key Achievements</h4>
                                        <ul className="admin-experience-list">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="admin-experience-block">
                                        <h4 className="admin-experience-block-title">Technologies Used</h4>
                                        <div className="admin-item-meta">
                                            {exp.technologies.map((tech, i) => (
                                                <span key={i} className="admin-badge primary">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {experience.length === 0 && !showAddForm && (
                <div className="admin-empty-state">
                    <Briefcase />
                    <h3>No experience entries yet</h3>
                    <p>Add your work experience to showcase your career journey!</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="admin-btn admin-btn-blue"
                    >
                        <Plus />
                        Add Experience
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Experience"
                message="Are you sure you want to delete this experience entry? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default ExperienceTab
