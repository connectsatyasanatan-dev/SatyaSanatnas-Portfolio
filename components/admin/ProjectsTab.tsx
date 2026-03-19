'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, X, Plus, Trash2, ExternalLink, Github, Star, FileText } from 'lucide-react'
import type { Project } from '@/lib/admin-types'
import { validateProject } from '@/lib/validation'
import ErrorAlert from './ErrorAlert'
import ConfirmDialog from './ConfirmDialog'
import TagListField from './TagListField'

interface ProjectsTabProps {
    projects: Project[]
    onAddProject: (project: Omit<Project, 'id'>) => Promise<void>
    onUpdateProject: (id: number, project: Partial<Project>) => Promise<void>
    onDeleteProject: (id: number) => Promise<void>
}

const ProjectsTab = ({ projects, onAddProject, onUpdateProject, onDeleteProject }: ProjectsTabProps) => {
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editData, setEditData] = useState<Partial<Project> | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
        name: '',
        filename: '',
        version: 'v1.0.0',
        downloads: '0/wk',
        description: '',
        technologies: [],
        features: [],
        stars: 0,
        forks: 0,
        demoUrl: '',
        githubUrl: '',
        status: 'active',
        featured: false
    })
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })

    const handleEdit = (project: Project) => {
        setEditingId(project.id)
        setEditData({
            ...project,
            technologies: project.technologies || [],
            features: project.features || []
        })
    }

    const handleSave = async () => {
        if (!editingId || !editData) return

        const validation = validateProject(editData)
        if (!validation.isValid) {
            setError(validation.errors.map(e => e.message).join(', '))
            return
        }

        setLoading(true)
        try {
            await onUpdateProject(editingId, editData)
            setEditingId(null)
            setEditData(null)
            setError(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to update project')
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
        const validation = validateProject(newProject)
        if (!validation.isValid) {
            setError(validation.errors.map(e => e.message).join(', '))
            return
        }

        setLoading(true)
        try {
            await onAddProject(newProject)
            setNewProject({
                name: '',
                filename: '',
                version: 'v1.0.0',
                downloads: '0/wk',
                description: '',
                technologies: [],
                features: [],
                stars: 0,
                forks: 0,
                demoUrl: '',
                githubUrl: '',
                status: 'active',
                featured: false
            })
            setShowAddForm(false)
            setError(null)
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to add project')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (id: number) => {
        setDeleteConfirm({ isOpen: true, id })
    }

    const confirmDelete = async () => {
        if (deleteConfirm.id === null) return

        setLoading(true)
        try {
            await onDeleteProject(deleteConfirm.id)
            setDeleteConfirm({ isOpen: false, id: null })
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to delete project')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <FileText />
                    <h2 className="admin-section-title">Projects Management</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="admin-btn admin-btn-green"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            <div className="admin-card admin-info-card" style={{ marginBottom: '24px', borderLeftColor: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ color: '#3b82f6', marginTop: '2px' }}><Star size={20} /></div>
                    <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: '#fff' }}>Portfolio Stats Tip</h4>
                        <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
                            Working with actual projects here? Great! Note that the <strong>"Projects Delivered"</strong> counter shown on your public site (e.g. "10+") is a marketing number managed in the <strong>Achievements & Stats</strong> tab.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <ErrorAlert
                    message={error}
                    type="error"
                    onDismiss={() => setError(null)}
                />
            )}

            {/* Add Project Form */}
            {showAddForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-card"
                    style={{ marginBottom: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add New Project</h3>

                    {/* Basic Info */}
                    <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>Basic Information</h4>
                        <div className="admin-form-grid">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Project Name *</label>
                                <input
                                    type="text"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="My Awesome Project"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Status</label>
                                <select
                                    value={newProject.status}
                                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as "active" | "in-progress" | "archived" })}
                                    className="admin-select"
                                >
                                    <option value="active">Active</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div className="admin-form-group admin-form-group-full">
                                <label className="admin-form-label">Description *</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="admin-textarea"
                                    rows={3}
                                    placeholder="Describe your project..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>Technical Details</h4>
                        <div className="admin-form-grid">
                            <div className="admin-form-group">
                                <TagListField
                                    label="Technologies"
                                    hint=" Add technologies used"
                                    value={newProject.technologies}
                                    onChange={(items) => setNewProject({ ...newProject, technologies: items })}
                                    placeholder="e.g. React, Node.js"
                                />
                            </div>
                            <div className="admin-form-group">
                                <TagListField
                                    label="Key Features"
                                    hint=" Add key features"
                                    value={newProject.features}
                                    onChange={(items) => setNewProject({ ...newProject, features: items })}
                                    placeholder="e.g. Responsive Design"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Version</label>
                                <input
                                    type="text"
                                    value={newProject.version}
                                    onChange={(e) => setNewProject({ ...newProject, version: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="v1.0.0"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Filename</label>
                                <input
                                    type="text"
                                    value={newProject.filename}
                                    onChange={(e) => setNewProject({ ...newProject, filename: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="project-main.zip"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Downloads</label>
                                <input
                                    type="text"
                                    value={newProject.downloads}
                                    onChange={(e) => setNewProject({ ...newProject, downloads: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="1.2k/mo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Links & Stats */}
                    <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>Links & Metrics</h4>
                        <div className="admin-form-grid">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Demo URL</label>
                                <input
                                    type="url"
                                    value={newProject.demoUrl || ''}
                                    onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="https://demo.example.com"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">GitHub URL</label>
                                <input
                                    type="url"
                                    value={newProject.githubUrl || ''}
                                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="https://github.com/user/repo"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Stars</label>
                                <input
                                    type="number"
                                    value={newProject.stars}
                                    onChange={(e) => setNewProject({ ...newProject, stars: parseInt(e.target.value) || 0 })}
                                    className="admin-form-input"
                                />
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Forks</label>
                                <input
                                    type="number"
                                    value={newProject.forks}
                                    onChange={(e) => setNewProject({ ...newProject, forks: parseInt(e.target.value) || 0 })}
                                    className="admin-form-input"
                                />
                            </div>
                            <div className="admin-form-group admin-form-group-full">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={newProject.featured}
                                        onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                    <span className="admin-form-label" style={{ marginBottom: 0 }}>Mark as Featured Project</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleAdd}
                            disabled={loading}
                            className="admin-btn admin-btn-green"
                        >
                            <Save size={18} />
                            {loading ? 'Adding...' : 'Add Project'}
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

            {/* Projects List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-card"
                    >
                        <div className="admin-item-header">
                            <div>
                                <h3 className="admin-item-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {project.name}
                                    {project.featured && (
                                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                    )}
                                </h3>
                                <div className="admin-experience-meta-row">
                                    <span className={`admin-experience-badge`} style={{
                                        background: project.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(107, 114, 128, 0.15)',
                                        color: project.status === 'active' ? '#34d399' : '#9ca3af'
                                    }}>
                                        {project.status}
                                    </span>
                                    <span className="admin-experience-meta-item">v{project.version}</span>
                                    <span className="admin-experience-meta-item">{project.downloads} downloads</span>
                                </div>
                            </div>
                            <div className="admin-item-actions admin-experience-card-actions">
                                {editingId === project.id ? (
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
                                            onClick={() => handleEdit(project)}
                                            className="admin-btn admin-btn-blue admin-experience-action-btn"
                                            title="Edit project"
                                        >
                                            <Edit size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="admin-btn admin-btn-red admin-experience-action-btn"
                                            title="Delete project"
                                        >
                                            <Trash2 size={18} />
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {editingId === project.id && editData ? (
                            <div className="admin-experience-edit-form">
                                {/* Basic Info */}
                                <div style={{ marginBottom: '24px' }}>
                                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>Basic Information</h4>
                                    <div className="admin-form-grid">
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Project Name *</label>
                                            <input
                                                type="text"
                                                value={editData.name || ''}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Status</label>
                                            <select
                                                value={editData.status || 'active'}
                                                onChange={(e) => setEditData({ ...editData, status: e.target.value as "active" | "in-progress" | "archived" })}
                                                className="admin-select"
                                            >
                                                <option value="active">Active</option>
                                                <option value="in-progress">In Progress</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                        <div className="admin-form-group admin-form-group-full">
                                            <label className="admin-form-label">Description *</label>
                                            <textarea
                                                value={editData.description || ''}
                                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                                className="admin-textarea"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Details */}
                                <div style={{ marginBottom: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>Technical Details</h4>
                                    <div className="admin-form-grid">
                                        <div className="admin-form-group">
                                            <TagListField
                                                label="Technologies"
                                                hint=" Add technologies used"
                                                value={editData.technologies || []}
                                                onChange={(items) => setEditData({ ...editData, technologies: items })}
                                                placeholder="e.g. React, Node.js"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <TagListField
                                                label="Key Features"
                                                hint=" Add key features"
                                                value={editData.features || []}
                                                onChange={(items) => setEditData({ ...editData, features: items })}
                                                placeholder="e.g. Responsive Design"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Version</label>
                                            <input
                                                type="text"
                                                value={editData.version || ''}
                                                onChange={(e) => setEditData({ ...editData, version: e.target.value })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Filename</label>
                                            <input
                                                type="text"
                                                value={editData.filename || ''}
                                                onChange={(e) => setEditData({ ...editData, filename: e.target.value })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Downloads</label>
                                            <input
                                                type="text"
                                                value={editData.downloads || ''}
                                                onChange={(e) => setEditData({ ...editData, downloads: e.target.value })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Links & Stats */}
                                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>Links & Metrics</h4>
                                    <div className="admin-form-grid">
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Demo URL</label>
                                            <input
                                                type="url"
                                                value={editData.demoUrl || ''}
                                                onChange={(e) => setEditData({ ...editData, demoUrl: e.target.value })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">GitHub URL</label>
                                            <input
                                                type="url"
                                                value={editData.githubUrl || ''}
                                                onChange={(e) => setEditData({ ...editData, githubUrl: e.target.value })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Stars</label>
                                            <input
                                                type="number"
                                                value={editData.stars || 0}
                                                onChange={(e) => setEditData({ ...editData, stars: parseInt(e.target.value) || 0 })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group">
                                            <label className="admin-form-label">Forks</label>
                                            <input
                                                type="number"
                                                value={editData.forks || 0}
                                                onChange={(e) => setEditData({ ...editData, forks: parseInt(e.target.value) || 0 })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div className="admin-form-group admin-form-group-full">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={editData.featured || false}
                                                    onChange={(e) => setEditData({ ...editData, featured: e.target.checked })}
                                                    style={{ width: '16px', height: '16px' }}
                                                />
                                                <span className="admin-form-label" style={{ marginBottom: 0 }}>Mark as Featured Project</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="admin-item-content admin-experience-description">{project.description}</p>

                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="admin-experience-block">
                                        <h4 className="admin-experience-block-title">Technologies Used</h4>
                                        <div className="admin-item-meta">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="admin-badge primary">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.features && project.features.length > 0 && (
                                    <div className="admin-experience-block">
                                        <h4 className="admin-experience-block-title">Key Features</h4>
                                        <ul className="admin-experience-list">
                                            {project.features.map((feature, i) => (
                                                <li key={i}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="admin-experience-block" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: '#9ca3af' }}>
                                        <span>⭐ {project.stars} stars</span>
                                        <span>🍴 {project.forks} forks</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="admin-btn admin-btn-blue"
                                                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                                            >
                                                <ExternalLink size={14} />
                                                Demo
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="admin-btn admin-btn-gray"
                                                style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                                            >
                                                <Github size={14} />
                                                Code
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {projects.length === 0 && !showAddForm && (
                <div className="admin-empty-state">
                    <FileText size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
                    <h3>No projects yet</h3>
                    <p>Add your first project to showcase your work!</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="admin-btn admin-btn-blue"
                        style={{ marginTop: '16px' }}
                    >
                        <Plus size={18} />
                        Add Project
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default ProjectsTab