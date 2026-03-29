'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, Plus, Trash2, Calendar, MapPin, BookOpen, GraduationCap } from 'lucide-react'
import type { Education } from '@/lib/admin-types'
import ErrorAlert from './ErrorAlert'
import ConfirmDialog from './ConfirmDialog'
import TagListField from './TagListField'

interface EducationTabProps {
    education: Education[]
    onAddEducation: (education: Omit<Education, 'id'>) => Promise<void>
    onUpdateEducation: (id: number, education: Partial<Education>) => Promise<void>
    onDeleteEducation: (id: number) => Promise<void>
}

const EducationTab = ({ education, onAddEducation, onUpdateEducation, onDeleteEducation }: EducationTabProps) => {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState<Partial<Education> | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newEducation, setNewEducation] = useState<Omit<Education, 'id'>>({
        degree: '',
        school: '',
        location: '',
        period: '',
        gpa: '',
        relevant_courses: [],
        achievements: [],
        focus: ''
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })

    const handleEdit = (edu: Education) => {
        setEditingId(edu.id ?? null)
        setEditData({ ...edu })
    }

    const handleSave = async () => {
        const id = editingId ?? editData?.id
        if (id == null || !editData) {
            setError('Cannot save: missing education id')
            return
        }

        if (!editData.degree?.trim() || !editData.school?.trim()) {
            setError('Degree and school are required')
            return
        }

        setLoading(true)
        setError(null)
        try {
            const payload = {
                degree: editData.degree.trim(),
                school: editData.school.trim(),
                location: (editData.location ?? '').trim(),
                period: (editData.period ?? '').trim(),
                gpa: (editData.gpa ?? '').trim() || undefined,
                relevant_courses: Array.isArray(editData.relevant_courses) ? editData.relevant_courses : [],
                achievements: Array.isArray(editData.achievements) ? editData.achievements : [],
                focus: (editData.focus ?? '').trim() || undefined
            }
            await onUpdateEducation(Number(id), payload)
            setEditingId(null)
            setEditData(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to update education')
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
        if (!newEducation.degree || !newEducation.school) {
            setError('Degree and school are required')
            return
        }

        setLoading(true)
        try {
            await onAddEducation(newEducation)
            setNewEducation({
                degree: '',
                school: '',
                location: '',
                period: '',
                gpa: '',
                relevant_courses: [],
                achievements: [],
                focus: ''
            })
            setShowAddForm(false)
            setError(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to add education')
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
                await onDeleteEducation(deleteConfirm.id)
                setDeleteConfirm({ isOpen: false, id: null })
            } catch (err: unknown) {
                setError((err as Error).message || 'Failed to delete education')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <GraduationCap />
                    <h2 className="admin-section-title">Education Management</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="admin-btn admin-btn-green"
                >
                    <Plus />
                    Add Education
                </button>
            </div>

            {error && (
                <ErrorAlert
                    message={error}
                    type="error"
                    onDismiss={() => setError(null)}
                />
            )}

            {/* Add Education Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-card"
                    style={{ marginBottom: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Education</h3>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Degree *</label>
                            <input
                                type="text"
                                value={newEducation.degree}
                                onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                className="admin-form-input"
                                placeholder="B.S. Computer Science"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">School *</label>
                            <input
                                type="text"
                                value={newEducation.school}
                                onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                                className="admin-form-input"
                                placeholder="University Name"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Location</label>
                            <input
                                type="text"
                                value={newEducation.location}
                                onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                                className="admin-form-input"
                                placeholder="City, State"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Period</label>
                            <input
                                type="text"
                                value={newEducation.period}
                                onChange={(e) => setNewEducation({ ...newEducation, period: e.target.value })}
                                className="admin-form-input"
                                placeholder="2018 - 2022"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">GPA</label>
                            <input
                                type="text"
                                value={newEducation.gpa}
                                onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                                className="admin-form-input"
                                placeholder="3.8/4.0"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Stream</label>
                            <input
                                type="text"
                                value={newEducation.focus}
                                onChange={(e) => setNewEducation({ ...newEducation, focus: e.target.value })}
                                className="admin-form-input"
                                placeholder="e.g. Science, Computer Science"
                            />
                        </div>
                        <div className="admin-form-group">
                            <TagListField
                                label="Relevant Courses"
                                hint=" Add one by one or paste multiple lines"
                                value={newEducation.relevant_courses}
                                onChange={(items) => setNewEducation({ ...newEducation, relevant_courses: items })}
                                placeholder="e.g. Data Structures"
                            />
                        </div>
                        <div className="admin-form-group">
                            <TagListField
                                label="Achievements"
                                hint=" Add one by one or paste multiple lines"
                                value={newEducation.achievements}
                                onChange={(items) => setNewEducation({ ...newEducation, achievements: items })}
                                placeholder="e.g. Dean's List"
                                variant="long"
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
                            {loading ? 'Adding...' : 'Add Education'}
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

            {/* Education List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[...education].reverse().map((edu, index) => (
                    <motion.div
                        key={edu.id ?? index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-card"
                    >
                        <div className="admin-item-header">
                            <div>
                                <h3 className="admin-item-title">{edu.degree}</h3>
                                <div className="admin-experience-meta-row">
                                    <span className="admin-experience-meta-item">
                                        <BookOpen className="admin-experience-meta-icon" />
                                        {edu.school}
                                    </span>
                                    {edu.location ? (
                                        <span className="admin-experience-meta-item">
                                            <MapPin className="admin-experience-meta-icon" />
                                            {edu.location}
                                        </span>
                                    ) : null}
                                    {edu.period ? (
                                        <span className="admin-experience-meta-item">
                                            <Calendar className="admin-experience-meta-icon" />
                                            {edu.period}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="admin-item-actions admin-experience-card-actions">
                                {editingId === edu.id ? (
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
                                            onClick={() => handleEdit(edu)}
                                            className="admin-btn admin-btn-blue admin-experience-action-btn"
                                            title="Edit this education"
                                        >
                                            <Edit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => edu.id != null && handleDelete(edu.id)}
                                            className="admin-btn admin-btn-red admin-experience-action-btn"
                                            title="Delete this education"
                                            disabled={edu.id == null}
                                        >
                                            <Trash2 />
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingId === edu.id && editData ? (
                            <div className="admin-experience-edit-form">
                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Degree *</label>
                                        <input
                                            type="text"
                                            value={editData.degree ?? ''}
                                            onChange={(e) => setEditData({ ...editData, degree: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="B.S. Computer Science"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">School *</label>
                                        <input
                                            type="text"
                                            value={editData.school ?? ''}
                                            onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="University Name"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Location</label>
                                        <input
                                            type="text"
                                            value={editData.location ?? ''}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="City, State"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Period</label>
                                        <input
                                            type="text"
                                            value={editData.period ?? ''}
                                            onChange={(e) => setEditData({ ...editData, period: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="2018 - 2022"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">GPA</label>
                                        <input
                                            type="text"
                                            value={editData.gpa ?? ''}
                                            onChange={(e) => setEditData({ ...editData, gpa: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="3.8/4.0"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Stream</label>
                                        <input
                                            type="text"
                                            value={editData.focus ?? ''}
                                            onChange={(e) => setEditData({ ...editData, focus: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="e.g. Science, Computer Science"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <TagListField
                                            label="Relevant Courses"
                                            hint=" Add one by one or paste multiple lines"
                                            value={editData.relevant_courses ?? []}
                                            onChange={(items) => setEditData({ ...editData, relevant_courses: items })}
                                            placeholder="e.g. Data Structures"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <TagListField
                                            label="Achievements"
                                            hint=" Add one by one or paste multiple lines"
                                            value={editData.achievements ?? []}
                                            onChange={(items) => setEditData({ ...editData, achievements: items })}
                                            placeholder="e.g. Dean's List"
                                            variant="long"
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
                                {edu.gpa && (
                                    <p className="admin-item-content" style={{ marginTop: '0', fontSize: '14px' }}>GPA: {edu.gpa}</p>
                                )}
                                {edu.focus && (
                                    <p className="admin-item-content" style={{ marginTop: '0', fontSize: '14px' }}>Stream: {edu.focus}</p>
                                )}
                                {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                                    <div className="admin-experience-block">
                                        <h4 className="admin-experience-block-title">Relevant Courses</h4>
                                        <div className="admin-item-meta">
                                            {edu.relevant_courses.map((course, i) => (
                                                <span key={i} className="admin-badge primary">
                                                    {course}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {edu.achievements && edu.achievements.length > 0 && (
                                    <div className="admin-experience-block">
                                        <h4 className="admin-experience-block-title">Key Achievements</h4>
                                        <ul className="admin-experience-list">
                                            {edu.achievements.map((achievement, i) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {education.length === 0 && !showAddForm && (
                <div className="admin-empty-state">
                    <GraduationCap />
                    <h3>No education entries yet</h3>
                    <p>Add your education history</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="admin-btn admin-btn-blue"
                    >
                        <Plus />
                        Add Education
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Education"
                message="Are you sure you want to delete this education entry? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default EducationTab
