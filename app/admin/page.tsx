'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    User, Settings, FileText, Briefcase,
    MessageSquare, Star, BarChart3, LogOut, Eye, Mail
} from 'lucide-react'
import adminApiClient from '@/lib/admin-api'
import type { AdminData, PersonalInfo, SkillCategory, Project, Experience, Testimonial, BlogPost } from '@/lib/admin-types'
import { toast } from '@/lib/toast'

// Import components
import { AdminSkeleton, AdminSidebarSkeleton } from '@/components/admin/AdminSkeleton'
import ToastContainer from '@/components/admin/ToastContainer'
import DashboardTab from '@/components/admin/DashboardTab'
import PersonalInfoTab from '@/components/admin/PersonalInfoTab'
import SkillsTab from '@/components/admin/SkillsTab'
import ProjectsTab from '@/components/admin/ProjectsTab'
import ExperienceTab from '@/components/admin/ExperienceTab'
import TestimonialsTab from '@/components/admin/TestimonialsTab'
import BlogTab from '@/components/admin/BlogTab'
import MessagesTab from '@/components/admin/MessagesTab'

const AdminPanel = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [adminData, setAdminData] = useState<AdminData | null>(null)
    const [loading, setLoading] = useState(false)
    const [loginForm, setLoginForm] = useState({ username: '', password: '' })
    const [loginError, setLoginError] = useState<string | null>(null)

    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token')
        if (savedToken) {
            adminApiClient.setToken(savedToken)
            verifyToken()
        }
    }, [])

    const verifyToken = async () => {
        try {
            await adminApiClient.verifyToken()
            setIsAuthenticated(true)
            loadAdminData()
        } catch (error) {
            adminApiClient.clearToken()
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoginError(null)
        setLoading(true)

        try {
            const response = await adminApiClient.login(loginForm.username, loginForm.password)
            if (response.success) {
                setIsAuthenticated(true)
                toast.success('Login successful!')
                loadAdminData()
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed'
            setLoginError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const loadAdminData = async () => {
        setLoading(true)
        try {
            const [dashboard, personalInfo, skills, projects, experience, testimonials, blog, contactMessages] = await Promise.all([
                adminApiClient.getDashboard(),
                adminApiClient.getPersonalInfo(),
                adminApiClient.getSkills(),
                adminApiClient.getProjects(),
                adminApiClient.getExperience(),
                adminApiClient.getTestimonials(),
                adminApiClient.getBlogPosts(),
                adminApiClient.getContactMessages()
            ])

            setAdminData({
                personalInfo,
                skills,
                projects,
                experience,
                testimonials,
                blogPosts: blog,
                contactMessages,
                stats: dashboard.stats
            })
        } catch (error: any) {
            toast.error('Failed to load data. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        adminApiClient.logout()
        setIsAuthenticated(false)
        setAdminData(null)
        setActiveTab('dashboard')
        toast.info('Logged out successfully')
    }

    // Handler functions for different sections
    const handleUpdatePersonalInfo = async (data: Partial<PersonalInfo>) => {
        try {
            const response = await adminApiClient.updatePersonalInfo(data)
            if (response.success) {
                toast.success('Personal info updated successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Update failed')
        }
    }

    const handleUpdateSkillsCategory = async (category: string, data: SkillCategory) => {
        try {
            const response = await adminApiClient.updateSkillsCategory(category, data)
            if (response.success) {
                toast.success('Skills updated successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Update failed')
        }
    }

    const handleAddSkill = async (category: string, skill: { name: string; level: number; years: number }) => {
        try {
            const response = await adminApiClient.addSkill(category, skill)
            if (response.success) {
                toast.success('Skill added successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Add failed')
        }
    }

    const handleAddProject = async (project: Omit<Project, 'id'>) => {
        try {
            const response = await adminApiClient.addProject(project)
            if (response.success) {
                toast.success('Project added successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add project')
            throw error
        }
    }

    const handleUpdateProject = async (id: number, project: Partial<Project>) => {
        try {
            const response = await adminApiClient.updateProject(id, project)
            if (response.success) {
                toast.success('Project updated successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update project')
            throw error
        }
    }

    const handleDeleteProject = async (id: number) => {
        try {
            const response = await adminApiClient.deleteProject(id)
            if (response.success) {
                toast.success('Project deleted successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete project')
            throw error
        }
    }

    const handleAddExperience = async (experience: Omit<Experience, 'id'>) => {
        try {
            const response = await adminApiClient.addExperience(experience)
            if (response.success) {
                toast.success('Experience added successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add experience')
            throw error
        }
    }

    const handleUpdateExperience = async (id: number, experience: Partial<Experience>) => {
        try {
            const response = await adminApiClient.updateExperience(id, experience)
            if (response.success) {
                toast.success('Experience saved! Changes will show on your portfolio.')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update experience')
            throw error
        }
    }

    const handleDeleteExperience = async (id: number) => {
        try {
            const response = await adminApiClient.deleteExperience(id)
            if (response.success) {
                toast.success('Experience deleted successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete experience')
            throw error
        }
    }

    const handleAddTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
        try {
            const response = await adminApiClient.addTestimonial(testimonial)
            if (response.success) {
                toast.success('Testimonial added successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add testimonial')
            throw error
        }
    }

    const handleUpdateTestimonial = async (id: number, testimonial: Partial<Testimonial>) => {
        try {
            const response = await adminApiClient.updateTestimonial(id, testimonial)
            if (response.success) {
                toast.success('Testimonial updated successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update testimonial')
            throw error
        }
    }

    const handleDeleteTestimonial = async (id: number) => {
        try {
            const response = await adminApiClient.deleteTestimonial(id)
            if (response.success) {
                toast.success('Testimonial deleted successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete testimonial')
            throw error
        }
    }

    const handleAddBlogPost = async (post: Omit<BlogPost, 'id'>) => {
        try {
            const response = await adminApiClient.addBlogPost(post)
            if (response.success) {
                toast.success('Blog post added successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add blog post')
            throw error
        }
    }

    const handleUpdateBlogPost = async (id: number, post: Partial<BlogPost>) => {
        try {
            const response = await adminApiClient.updateBlogPost(id, post)
            if (response.success) {
                toast.success('Blog post updated successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update blog post')
            throw error
        }
    }

    const handleDeleteBlogPost = async (id: number) => {
        try {
            const response = await adminApiClient.deleteBlogPost(id)
            if (response.success) {
                toast.success('Blog post deleted successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete blog post')
            throw error
        }
    }

    const handleDeleteContactMessage = async (id: number) => {
        try {
            const response = await adminApiClient.deleteContactMessage(id)
            if (response.success) {
                toast.success('Message deleted successfully!')
                loadAdminData()
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete message')
            throw error
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="admin-login-wrapper">
                <ToastContainer />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-login-card"
                >
                    <div className="admin-login-header">
                        <h1 className="admin-login-title">
                            Portfolio Admin
                        </h1>
                        <p className="admin-login-subtitle">Manage your portfolio content</p>
                    </div>

                    {loginError && (
                        <div className="admin-error-alert">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="admin-form">
                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                className="admin-form-input"
                                placeholder="Enter username"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="admin-form-group">
                            <label className="admin-form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="admin-form-input"
                                placeholder="Enter password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-btn-primary"
                        >
                            {loading ? (
                                <span className="admin-login-loading">
                                    <div className="admin-spinner" />
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>

                </motion.div>
            </div>
        )
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'skills', label: 'Skills', icon: Settings },
        { id: 'projects', label: 'Projects', icon: FileText },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { id: 'messages', label: 'Messages', icon: Mail },
        { id: 'blog', label: 'Blog Posts', icon: Star }
    ]

    return (
        <div className="admin-container">
            <ToastContainer />

            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-header-left">
                        <div className="admin-logo">
                            <BarChart3 />
                        </div>
                        <h1 className="admin-header-title">Portfolio Admin Panel</h1>
                    </div>
                    <div className="admin-header-right">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-view-site"
                        >
                            <Eye />
                            View Site
                        </a>
                        <button
                            onClick={handleLogout}
                            className="admin-btn-logout"
                        >
                            <LogOut />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="admin-layout-main">
                <nav className="admin-sidebar">
                    {loading && !adminData ? (
                        <AdminSidebarSkeleton />
                    ) : (
                        <ul className="admin-nav-list">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon
                                return (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                        >
                                            <IconComponent />
                                            <span>{tab.label}</span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </nav>

                <main className="admin-content">
                    {loading ? (
                        <AdminSkeleton activeTab={activeTab} />
                    ) : adminData ? (
                        <>
                            {activeTab === 'dashboard' && (
                                <DashboardTab stats={adminData.stats} />
                            )}

                            {activeTab === 'personal' && (
                                <PersonalInfoTab
                                    data={adminData.personalInfo}
                                    onUpdate={handleUpdatePersonalInfo}
                                />
                            )}

                            {activeTab === 'skills' && (
                                <SkillsTab
                                    skills={adminData.skills}
                                    onUpdateCategory={handleUpdateSkillsCategory}
                                    onAddSkill={handleAddSkill}
                                />
                            )}

                            {activeTab === 'projects' && (
                                <ProjectsTab
                                    projects={adminData.projects}
                                    onAddProject={handleAddProject}
                                    onUpdateProject={handleUpdateProject}
                                    onDeleteProject={handleDeleteProject}
                                />
                            )}

                            {activeTab === 'experience' && (
                                <ExperienceTab
                                    experience={adminData.experience}
                                    onAddExperience={handleAddExperience}
                                    onUpdateExperience={handleUpdateExperience}
                                    onDeleteExperience={handleDeleteExperience}
                                />
                            )}

                            {activeTab === 'testimonials' && (
                                <TestimonialsTab
                                    testimonials={adminData.testimonials}
                                    onAddTestimonial={handleAddTestimonial}
                                    onUpdateTestimonial={handleUpdateTestimonial}
                                    onDeleteTestimonial={handleDeleteTestimonial}
                                />
                            )}

                            {activeTab === 'messages' && (
                                <MessagesTab
                                    messages={adminData.contactMessages}
                                    onDeleteMessage={handleDeleteContactMessage}
                                    onRefresh={loadAdminData}
                                />
                            )}

                            {activeTab === 'blog' && (
                                <BlogTab
                                    blogPosts={adminData.blogPosts}
                                    onAddBlogPost={handleAddBlogPost}
                                    onUpdateBlogPost={handleUpdateBlogPost}
                                    onDeleteBlogPost={handleDeleteBlogPost}
                                />
                            )}
                        </>
                    ) : (
                        <div className="admin-loading-wrapper">
                            <p>No data available. Please refresh or check your connection.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default AdminPanel