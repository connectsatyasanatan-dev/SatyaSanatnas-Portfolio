'use client'

import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { motion } from 'framer-motion'
import { Edit, Save, X, Plus, Trash2, Settings } from 'lucide-react'

interface Skill {
    name: string
    level: number
    years: number
}

interface SkillCategory {
    title: string
    skills: Skill[]
}

interface SkillsTabProps {
    skills: Record<string, SkillCategory>
    onUpdateCategory: (category: string, data: SkillCategory) => void
    onAddSkill: (category: string, skill: Skill) => void
}

const SkillsTab = ({ skills, onUpdateCategory, onAddSkill }: SkillsTabProps) => {
    const [editingCategory, setEditingCategory] = useState<string | null>(null)
    const [editData, setEditData] = useState<SkillCategory | null>(null)
    const [showAddSkill, setShowAddSkill] = useState<string | null>(null)
    const [newSkill, setNewSkill] = useState<Skill>({
        name: '',
        level: 50,
        years: 1
    })

    // State for adding new category
    const [showAddCategory, setShowAddCategory] = useState(false)
    const [newCategory, setNewCategory] = useState({ key: '', title: '' })

    const handleAddCategory = () => {
        if (newCategory.key && newCategory.title) {
            onUpdateCategory(newCategory.key, {
                title: newCategory.title,
                skills: []
            })
            setNewCategory({ key: '', title: '' })
            setShowAddCategory(false)
        }
    }

    const handleEditCategory = (category: string) => {
        setEditingCategory(category)
        setEditData({ ...skills[category] })
    }

    const handleSaveCategory = () => {
        if (editingCategory && editData) {
            onUpdateCategory(editingCategory, editData)
            setEditingCategory(null)
            setEditData(null)
        }
    }

    const handleCancelEdit = () => {
        setEditingCategory(null)
        setEditData(null)
    }

    const handleAddSkill = (category: string) => {
        onAddSkill(category, newSkill)
        setNewSkill({ name: '', level: 50, years: 1 })
        setShowAddSkill(null)
    }

    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; category?: string | null; index?: number | null }>({ isOpen: false, category: null, index: null })

    const handleDeleteSkill = (category: string, skillIndex: number) => {
        setDeleteConfirm({ isOpen: true, category, index: skillIndex })
    }

    const confirmDelete = () => {
        const { category, index } = deleteConfirm
        if (!category || index === undefined || index === null) return

        const updatedCategory = { ...skills[category] }
        updatedCategory.skills = updatedCategory.skills.filter((_, i) => i !== index)
        onUpdateCategory(category, updatedCategory)
        setDeleteConfirm({ isOpen: false, category: null, index: null })
    }

    const updateSkillInCategory = (skillIndex: number, field: keyof Skill, value: string | number) => {
        if (editData) {
            const updatedSkills = [...editData.skills]
            updatedSkills[skillIndex] = {
                ...updatedSkills[skillIndex],
                [field]: field === 'name' ? value : Number(value)
            }
            setEditData({
                ...editData,
                skills: updatedSkills
            })
        }
    }

    return (
        <div>
            <div className="admin-section-header">
                <div className="admin-section-title-wrapper">
                    <Settings />
                    <h2 className="admin-section-title">Skills Management</h2>
                </div>
                <div className="admin-section-actions">
                    <button
                        onClick={() => setShowAddCategory(!showAddCategory)}
                        className="admin-btn admin-btn-green"
                    >
                        <Plus />
                        Add Category
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, category: null, index: null })}
                title="Delete Skill"
                message="Are you sure you want to delete this skill? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />

            {/* Add Category Form */}
            {showAddCategory && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="admin-card admin-add-category-card"
                >
                    <h3 className="admin-card-title">Add New Skill Category</h3>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Category Key (e.g., &quot;tools&quot;, &quot;frontend&quot;)</label>
                        <input
                            type="text"
                            value={newCategory.key}
                            onChange={(e) => setNewCategory({ ...newCategory, key: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            className="admin-form-input"
                            placeholder="category-key"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label className="admin-form-label">Display Title</label>
                        <input
                            type="text"
                            value={newCategory.title}
                            onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                            className="admin-form-input"
                            placeholder="Tools & Others"
                        />
                    </div>
                    <div className="admin-add-skill-actions">
                        <button
                            onClick={handleAddCategory}
                            className="admin-btn admin-btn-green"
                            disabled={!newCategory.key || !newCategory.title}
                        >
                            Create Category
                        </button>
                        <button
                            onClick={() => setShowAddCategory(false)}
                            className="admin-btn admin-btn-gray"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="admin-skills-grid">
                {Object.entries(skills).map(([category, categoryData]) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-card"
                    >
                        <div className="admin-skills-category-header">
                            <h3 className="admin-skills-category-title">
                                {editingCategory === category ? (
                                    <input
                                        type="text"
                                        value={editData?.title || ''}
                                        onChange={(e) => setEditData(editData ? { ...editData, title: e.target.value } : null)}
                                        className="admin-form-input"
                                    />
                                ) : (
                                    categoryData.title
                                )}
                            </h3>

                            <div className="admin-skills-actions">
                                {editingCategory === category ? (
                                    <>
                                        <button
                                            onClick={handleSaveCategory}
                                            className="admin-btn-icon edit"
                                        >
                                            <Save />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="admin-btn-icon delete"
                                        >
                                            <X />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEditCategory(category)}
                                            className="admin-btn-icon edit"
                                        >
                                            <Edit />
                                        </button>
                                        <button
                                            onClick={() => setShowAddSkill(category)}
                                            className="admin-btn admin-btn-green admin-add-skill-btn"
                                        >
                                            <Plus />
                                            Add
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Add Skill Form */}
                        {showAddSkill === category && (
                            <div className="admin-add-skill-form-wrapper">
                                <h4 className="admin-add-skill-form-title">Add New Skill</h4>
                                <div className="admin-add-skill-form">
                                    <input
                                        type="text"
                                        placeholder="Skill Name"
                                        value={newSkill.name}
                                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                        className="admin-form-input"
                                    />
                                    <div className="admin-add-skill-grid">
                                        <div>
                                            <label className="admin-form-label">Level (%)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={newSkill.level}
                                                onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                        <div>
                                            <label className="admin-form-label">Years</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newSkill.years}
                                                onChange={(e) => setNewSkill({ ...newSkill, years: Number(e.target.value) })}
                                                className="admin-form-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="admin-add-skill-actions">
                                        <button
                                            onClick={() => handleAddSkill(category)}
                                            className="admin-btn admin-btn-green"
                                        >
                                            Add Skill
                                        </button>
                                        <button
                                            onClick={() => setShowAddSkill(null)}
                                            className="admin-btn admin-btn-gray"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Skills List */}
                        <div className="admin-skills-list">
                            {(editingCategory === category ? editData?.skills : categoryData.skills)?.map((skill, index) => (
                                <div key={index} className="admin-skill-item">
                                    {editingCategory === category ? (
                                        <div className="admin-skill-edit-grid">
                                            <input
                                                type="text"
                                                value={skill.name}
                                                onChange={(e) => updateSkillInCategory(index, 'name', e.target.value)}
                                                className="admin-form-input admin-skill-edit-input"
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={skill.level}
                                                onChange={(e) => updateSkillInCategory(index, 'level', e.target.value)}
                                                className="admin-form-input admin-skill-edit-input"
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                value={skill.years}
                                                onChange={(e) => updateSkillInCategory(index, 'years', e.target.value)}
                                                className="admin-form-input admin-skill-edit-input"
                                            />
                                        </div>
                                    ) : (
                                        <div className="admin-skill-details">
                                            <div className="admin-skill-content">
                                                <div className="admin-skill-meta-row">
                                                    <span className="admin-skill-name">{skill.name}</span>
                                                    <span className="admin-skill-meta">{skill.years} years</span>
                                                </div>
                                                <div className="admin-progress-bar">
                                                    <div
                                                        className="admin-progress-fill"
                                                        style={{ width: `${skill.level}%` }}
                                                    />
                                                </div>
                                                <div className="admin-skill-meta admin-skill-level">{skill.level}%</div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteSkill(category, index)}
                                                className="admin-btn-icon delete admin-skill-delete-btn"
                                            >
                                                <Trash2 />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default SkillsTab