'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Star, MessageSquare } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'

interface Testimonial {
    id?: number
    name: string
    role: string
    company: string
    text: string
    rating: number
    date: string
}

interface TestimonialsTabProps {
    testimonials: Testimonial[]
    onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>
    onUpdateTestimonial: (id: number, testimonial: Partial<Testimonial>) => Promise<void>
    onDeleteTestimonial: (id: number) => Promise<void>
}

const TestimonialsTab = ({ testimonials, onAddTestimonial, onUpdateTestimonial, onDeleteTestimonial }: TestimonialsTabProps) => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState<Partial<Testimonial> | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })

    const initialFormState: Testimonial = {
        name: '',
        role: '',
        company: '',
        text: '',
        rating: 5,
        date: new Date().getFullYear().toString()
    }

    const [newTestimonial, setNewTestimonial] = useState<Testimonial>(initialFormState)
    const [loading, setLoading] = useState(false)

    const handleEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id!)
        setEditData({ ...testimonial })
    }

    const handleSave = async () => {
        if (!editingId || !editData) return

        setLoading(true)
        try {
            await onUpdateTestimonial(editingId, editData)
            setEditingId(null)
            setEditData(null)
        } catch (error) {
            console.error("Failed to update testimonial", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditData(null)
    }

    const handleAdd = async () => {
        setLoading(true)
        try {
            await onAddTestimonial(newTestimonial)
            setNewTestimonial(initialFormState)
            setShowAddForm(false)
        } catch (error) {
            console.error("Failed to add testimonial", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id: number) => {
        setDeleteConfirm({ isOpen: true, id })
    }

    const confirmDelete = async () => {
        if (deleteConfirm.id !== null) {
            try {
                await onDeleteTestimonial(deleteConfirm.id)
                setDeleteConfirm({ isOpen: false, id: null })
            } catch (error) {
                console.error("Failed to delete testimonial", error)
            }
        }
    }

    const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
        return (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={interactive ? 20 : 16}
                        style={{
                            color: star <= rating ? '#fcd34d' : '#4b5563',
                            fill: star <= rating ? '#fcd34d' : 'none',
                            cursor: interactive ? 'pointer' : 'default',
                            transition: 'all 0.2s'
                        }}
                        onClick={interactive && onChange ? () => onChange(star) : undefined}
                    />
                ))}
            </div>
        )
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <MessageSquare />
                    <h2 className="admin-section-title">Testimonials Management</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="admin-btn admin-btn-green"
                >
                    <Plus size={18} />
                    Add Testimonial
                </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-card"
                    style={{ marginBottom: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Testimonial</h3>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Name *</label>
                            <input
                                type="text"
                                value={newTestimonial.name}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                className="admin-form-input"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Role *</label>
                            <input
                                type="text"
                                value={newTestimonial.role}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                className="admin-form-input"
                                placeholder="CEO, CTO, etc."
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Company *</label>
                            <input
                                type="text"
                                value={newTestimonial.company}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                                className="admin-form-input"
                                placeholder="Company Name"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Date</label>
                            <input
                                type="text"
                                value={newTestimonial.date}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, date: e.target.value })}
                                className="admin-form-input"
                                placeholder="2024"
                            />
                        </div>

                        <div className="admin-form-group admin-form-group-full">
                            <label className="admin-form-label">Rating</label>
                            <div style={{ padding: '8px 0' }}>
                                {renderStars(newTestimonial.rating, true, (rating) => setNewTestimonial({ ...newTestimonial, rating }))}
                            </div>
                        </div>

                        <div className="admin-form-group admin-form-group-full">
                            <label className="admin-form-label">Testimonial Text *</label>
                            <textarea
                                value={newTestimonial.text}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                className="admin-textarea"
                                rows={4}
                                placeholder="Write the testimonial text here..."
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="admin-btn admin-btn-green"
                        >
                            <Save size={18} />
                            {loading ? 'Adding...' : 'Add Testimonial'}
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="admin-btn admin-btn-gray"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Testimonials List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={testimonial.id ?? index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-card"
                    >
                        <div className="admin-item-header">
                            <div>
                                <h3 className="admin-item-title">{testimonial.name}</h3>
                                <div className="admin-experience-meta-row">
                                    <span className="admin-experience-meta-item">
                                        {testimonial.role} @ {testimonial.company}
                                    </span>
                                    <span className="admin-experience-meta-item" style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                                        {testimonial.date}
                                    </span>
                                </div>
                            </div>
                            <div className="admin-item-actions admin-experience-card-actions">
                                {editingId === testimonial.id ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="admin-btn admin-btn-green admin-experience-action-btn"
                                        >
                                            <Save size={18} />
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="admin-btn admin-btn-gray admin-experience-action-btn"
                                        >
                                            <X size={18} />
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEdit(testimonial)}
                                            className="admin-btn admin-btn-blue admin-experience-action-btn"
                                            title="Edit testimonial"
                                        >
                                            <Edit size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial.id!)}
                                            className="admin-btn admin-btn-red admin-experience-action-btn"
                                            title="Delete testimonial"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingId === testimonial.id && editData ? (
                            <div className="admin-experience-edit-form">
                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Name *</label>
                                        <input
                                            type="text"
                                            value={editData.name ?? ''}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Role *</label>
                                        <input
                                            type="text"
                                            value={editData.role ?? ''}
                                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="CEO, CTO, etc."
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Company *</label>
                                        <input
                                            type="text"
                                            value={editData.company ?? ''}
                                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="Company Name"
                                        />
                                    </div>

                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Date</label>
                                        <input
                                            type="text"
                                            value={editData.date ?? ''}
                                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="2024"
                                        />
                                    </div>

                                    <div className="admin-form-group admin-form-group-full">
                                        <label className="admin-form-label">Rating</label>
                                        <div style={{ padding: '8px 0' }}>
                                            {renderStars(editData.rating ?? 5, true, (rating) => setEditData({ ...editData, rating }))}
                                        </div>
                                    </div>

                                    <div className="admin-form-group admin-form-group-full">
                                        <label className="admin-form-label">Testimonial Text *</label>
                                        <textarea
                                            value={editData.text ?? ''}
                                            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
                                            className="admin-textarea"
                                            rows={4}
                                            placeholder="Write the testimonial text here..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                                    {renderStars(testimonial.rating)}
                                </div>

                                <blockquote className="admin-item-content" style={{
                                    fontStyle: 'italic',
                                    color: '#d1d5db',
                                    lineHeight: '1.6',
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    borderLeft: '3px solid rgba(96, 165, 250, 0.5)'
                                }}>
                                    "{testimonial.text}"
                                </blockquote>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {testimonials.length === 0 && !showAddForm && (
                <div className="admin-empty-state">
                    <Star size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <h3>No testimonials yet</h3>
                    <p>Add client testimonials to build trust and credibility</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="admin-btn admin-btn-blue"
                        style={{ marginTop: '16px' }}
                    >
                        <Plus size={18} />
                        Add Your First Testimonial
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Testimonial"
                message="Are you sure you want to delete this testimonial? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default TestimonialsTab
