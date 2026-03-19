'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, Plus, Trash2, Calendar, Award } from 'lucide-react'
import type { Certification } from '@/lib/admin-types'
import ErrorAlert from './ErrorAlert'
import ConfirmDialog from './ConfirmDialog'

interface CertificationsTabProps {
    certifications: Certification[]
    onAddCertification: (certification: Omit<Certification, 'id'>) => Promise<void>
    onUpdateCertification: (id: number, certification: Partial<Certification>) => Promise<void>
    onDeleteCertification: (id: number) => Promise<void>
}

const CertificationsTab = ({ certifications, onAddCertification, onUpdateCertification, onDeleteCertification }: CertificationsTabProps) => {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState<Partial<Certification> | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newCertification, setNewCertification] = useState<Omit<Certification, 'id'>>({
        name: '',
        issuer: '',
        date: '',
        credential: '',
        validity: '',
        badge: ''
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })

    const handleEdit = (cert: Certification) => {
        setEditingId(cert.id ?? null)
        setEditData({ ...cert })
    }

    const handleSave = async () => {
        const id = editingId ?? editData?.id
        if (id == null || !editData) {
            setError('Cannot save: missing certification id')
            return
        }

        if (!editData.name?.trim() || !editData.issuer?.trim()) {
            setError('Name and issuer are required')
            return
        }

        setLoading(true)
        setError(null)
        try {
            const payload = {
                name: editData.name.trim(),
                issuer: editData.issuer.trim(),
                date: (editData.date ?? '').trim(),
                credential: (editData.credential ?? '').trim() || undefined,
                validity: (editData.validity ?? '').trim() || undefined,
                badge: (editData.badge ?? '').trim() || undefined
            }
            await onUpdateCertification(Number(id), payload)
            setEditingId(null)
            setEditData(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to update certification')
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
        if (!newCertification.name || !newCertification.issuer) {
            setError('Name and issuer are required')
            return
        }

        setLoading(true)
        try {
            await onAddCertification(newCertification)
            setNewCertification({
                name: '',
                issuer: '',
                date: '',
                credential: '',
                validity: '',
                badge: ''
            })
            setShowAddForm(false)
            setError(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to add certification')
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
                await onDeleteCertification(deleteConfirm.id)
                setDeleteConfirm({ isOpen: false, id: null })
            } catch (err: unknown) {
                setError((err as Error).message || 'Failed to delete certification')
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <Award />
                    <h2 className="admin-section-title">Certifications Management</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="admin-btn admin-btn-green"
                >
                    <Plus />
                    Add Certification
                </button>
            </div>

            {error && (
                <ErrorAlert
                    message={error}
                    type="error"
                    onDismiss={() => setError(null)}
                />
            )}

            {/* Add Certification Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-card"
                    style={{ marginBottom: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Certification</h3>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Name *</label>
                            <input
                                type="text"
                                value={newCertification.name}
                                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                                className="admin-form-input"
                                placeholder="AWS Certified Solutions Architect"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Issuer *</label>
                            <input
                                type="text"
                                value={newCertification.issuer}
                                onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                                className="admin-form-input"
                                placeholder="Amazon Web Services"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Date</label>
                            <input
                                type="text"
                                value={newCertification.date}
                                onChange={(e) => setNewCertification({ ...newCertification, date: e.target.value })}
                                className="admin-form-input"
                                placeholder="August 2023"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Credential ID</label>
                            <input
                                type="text"
                                value={newCertification.credential}
                                onChange={(e) => setNewCertification({ ...newCertification, credential: e.target.value })}
                                className="admin-form-input"
                                placeholder="A1B2C3D4E5"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Validity (e.g., Valid until 2026)</label>
                            <input
                                type="text"
                                value={newCertification.validity}
                                onChange={(e) => setNewCertification({ ...newCertification, validity: e.target.value })}
                                className="admin-form-input"
                                placeholder="Valid until Jan 2026"
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
                            {loading ? 'Adding...' : 'Add Certification'}
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

            {/* Certifications List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {certifications.map((cert, index) => (
                    <motion.div
                        key={cert.id ?? index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-card"
                    >
                        <div className="admin-item-header">
                            <div>
                                <h3 className="admin-item-title">{cert.name}</h3>
                                <div className="admin-experience-meta-row">
                                    <span className="admin-experience-meta-item">
                                        <Award className="admin-experience-meta-icon" />
                                        {cert.issuer}
                                    </span>
                                    {cert.date ? (
                                        <span className="admin-experience-meta-item">
                                            <Calendar className="admin-experience-meta-icon" />
                                            {cert.date}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="admin-item-actions admin-experience-card-actions">
                                {editingId === cert.id ? (
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
                                            onClick={() => handleEdit(cert)}
                                            className="admin-btn admin-btn-blue admin-experience-action-btn"
                                            title="Edit this certification"
                                        >
                                            <Edit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => cert.id != null && handleDelete(cert.id)}
                                            className="admin-btn admin-btn-red admin-experience-action-btn"
                                            title="Delete this certification"
                                            disabled={cert.id == null}
                                        >
                                            <Trash2 />
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingId === cert.id && editData ? (
                            <div className="admin-experience-edit-form">
                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Name *</label>
                                        <input
                                            type="text"
                                            value={editData.name ?? ''}
                                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="AWS Certified Solutions Architect"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Issuer *</label>
                                        <input
                                            type="text"
                                            value={editData.issuer ?? ''}
                                            onChange={(e) => setEditData({ ...editData, issuer: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="Amazon Web Services"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Date</label>
                                        <input
                                            type="text"
                                            value={editData.date ?? ''}
                                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="August 2023"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Credential ID</label>
                                        <input
                                            type="text"
                                            value={editData.credential ?? ''}
                                            onChange={(e) => setEditData({ ...editData, credential: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="A1B2C3D4E5"
                                        />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-form-label">Validity</label>
                                        <input
                                            type="text"
                                            value={editData.validity ?? ''}
                                            onChange={(e) => setEditData({ ...editData, validity: e.target.value })}
                                            className="admin-form-input"
                                            placeholder="Valid until Jan 2026"
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
                                {cert.credential && (
                                    <p className="admin-item-content" style={{ marginTop: '0', fontSize: '14px' }}>Credential ID: {cert.credential}</p>
                                )}
                                {cert.validity && (
                                    <p className="admin-item-content" style={{ marginTop: '0', fontSize: '14px' }}>Validity: {cert.validity}</p>
                                )}
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {certifications.length === 0 && !showAddForm && (
                <div className="admin-empty-state">
                    <Award />
                    <h3>No certifications yet</h3>
                    <p>Add your professional certifications</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="admin-btn admin-btn-blue"
                    >
                        <Plus />
                        Add Certification
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Certification"
                message="Are you sure you want to delete this certification? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default CertificationsTab
