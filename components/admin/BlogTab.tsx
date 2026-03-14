'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, FileText, Calendar, Clock, Tag } from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'

interface BlogPost {
    id: number
    title: string
    excerpt: string
    date: string
    readTime: string
    tags: string[]
    featured: boolean
}

interface BlogTabProps {
    blogPosts: BlogPost[]
    onAddBlogPost: (post: Omit<BlogPost, 'id'>) => Promise<void>
    onUpdateBlogPost: (id: number, post: Partial<BlogPost>) => Promise<void>
    onDeleteBlogPost: (id: number) => Promise<void>
}

const BlogTab = ({ blogPosts, onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost }: BlogTabProps) => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '5 min read',
        tags: '',
        featured: false
    })

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            date: new Date().toISOString().split('T')[0],
            readTime: '5 min read',
            tags: '',
            featured: false
        })
    }

    const handleAdd = async () => {
        const postData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }
        try {
            await onAddBlogPost(postData)
            resetForm()
            setShowAddForm(false)
        } catch (error) {
            // Error is handled by parent component via toast
        }
    }

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post)
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            date: post.date,
            readTime: post.readTime,
            tags: post.tags.join(', '),
            featured: post.featured
        })
    }

    const handleUpdate = async () => {
        if (editingPost) {
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
            try {
                await onUpdateBlogPost(editingPost.id, postData)
                setEditingPost(null)
                resetForm()
            } catch (error) {
                // Error is handled by parent component via toast
            }
        }
    }

    const handleCancel = () => {
        setEditingPost(null)
        setShowAddForm(false)
        resetForm()
    }

    const handleDelete = (id: number) => {
        setDeleteConfirm({ isOpen: true, id })
    }

    const confirmDelete = async () => {
        if (deleteConfirm.id !== null) {
            try {
                await onDeleteBlogPost(deleteConfirm.id)
                setDeleteConfirm({ isOpen: false, id: null })
            } catch (error) {
                // Error is handled by parent component via toast
            }
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <FileText />
                    <h2 className="admin-section-title">Blog Posts Management</h2>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="admin-btn admin-btn-green"
                >
                    <Plus />
                    Add Blog Post
                </button>
            </div>

            {/* Add/Edit Form */}
            {(showAddForm || editingPost) && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-card"
                    style={{ marginBottom: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
                        {editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="admin-form-input"
                                placeholder="Enter blog post title"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Excerpt *</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                className="admin-textarea"
                                rows={3}
                                placeholder="Brief description of the blog post"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div className="admin-form-group">
                                <label className="admin-form-label">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="admin-form-input"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Read Time</label>
                                <input
                                    type="text"
                                    value={formData.readTime}
                                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                    className="admin-form-input"
                                    placeholder="5 min read"
                                />
                            </div>

                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <label className="admin-checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="admin-checkbox"
                                    />
                                    <span className="admin-checkbox-label">Featured Post</span>
                                </label>
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="admin-form-input"
                                placeholder="React, JavaScript, Web Development"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button
                            onClick={editingPost ? handleUpdate : handleAdd}
                            className="admin-btn admin-btn-green"
                        >
                            <Save />
                            {editingPost ? 'Update' : 'Add'} Post
                        </button>
                        <button
                            onClick={handleCancel}
                            className="admin-btn admin-btn-gray"
                        >
                            <X />
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Blog Posts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {blogPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="admin-card"
                    >
                        <div className="admin-item-header">
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <h3 className="admin-item-title">{post.title}</h3>
                                    {post.featured && (
                                        <span className="admin-badge warning">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <p className="admin-item-content" style={{ marginBottom: '12px' }}>{post.excerpt}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#9ca3af' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Calendar style={{ width: '16px', height: '16px' }} />
                                        {formatDate(post.date)}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock style={{ width: '16px', height: '16px' }} />
                                        {post.readTime}
                                    </div>
                                </div>

                                <div className="admin-item-meta" style={{ marginTop: '12px' }}>
                                    {post.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="admin-badge primary"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Tag style={{ width: '12px', height: '12px' }} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-item-actions" style={{ marginLeft: '16px' }}>
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="admin-btn-icon edit"
                                >
                                    <Edit />
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="admin-btn-icon delete"
                                >
                                    <Trash2 />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {blogPosts.length === 0 && !showAddForm && (
                <div className="admin-empty-state">
                    <FileText />
                    <h3>No blog posts yet</h3>
                    <p>Start sharing your knowledge and insights with the world</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="admin-btn admin-btn-blue"
                    >
                        <Plus />
                        Write Your First Post
                    </button>
                </div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Blog Post"
                message="Are you sure you want to delete this blog post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default BlogTab
