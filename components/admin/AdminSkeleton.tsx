'use client'

import React from 'react'
import Skeleton from '../Skeleton'

export const AdminSidebarSkeleton = () => {
    return (
        <div className="p-4 space-y-4">
            <div className="mb-10 px-3">
                <Skeleton variant="circle" width={40} height={40} />
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex gap-4 items-center p-3" style={{ animationDelay: `${i * 0.08}s` }}>
                    <Skeleton variant="circle" width={20} height={20} glow />
                    <Skeleton variant="text" width="60%" />
                </div>
            ))}
        </div>
    )
}

export const DashboardSkeleton = () => {
    return (
        <div className="admin-dashboard-skeleton">
            <div className="admin-stats-grid mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="admin-stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                        <Skeleton variant="circle" width={40} height={40} className="mb-4" glow />
                        <Skeleton variant="text" width="40%" className="mb-2" />
                        <Skeleton variant="title" width="70%" glow />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="admin-card">
                    <Skeleton variant="title" width="50%" className="mb-6" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-4 mb-4">
                            <Skeleton variant="circle" width={40} height={40} />
                            <div className="flex-1">
                                <Skeleton variant="text" width="60%" className="mb-2" />
                                <Skeleton variant="text" width="40%" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="admin-card">
                    <Skeleton variant="title" width="50%" className="mb-6" />
                    <Skeleton variant="rect" height={300} />
                </div>
            </div>
        </div>
    )
}

export const TableSkeleton = () => {
    return (
        <div className="admin-table-skeleton">
            <div className="admin-section-header">
                <Skeleton variant="title" width="200px" />
                <Skeleton variant="rect" width="120px" height="40px" />
            </div>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="admin-card" style={{ animationDelay: `${i * 0.15}s` }}>
                        <div className="admin-item-header mb-4">
                            <div className="flex-1">
                                <Skeleton variant="title" width="40%" className="mb-2" glow />
                                <Skeleton variant="text" width="20%" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton variant="rect" width="80px" height="36px" glow />
                                <Skeleton variant="rect" width="80px" height="36px" />
                            </div>
                        </div>
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="100%" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const FormSkeleton = () => {
    return (
        <div className="admin-form-skeleton">
            <div className="admin-section-header">
                <Skeleton variant="title" width="300px" />
            </div>
            <div className="admin-card">
                <div className="admin-form-grid">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="admin-form-group">
                            <Skeleton variant="text" width="30%" className="mb-2" />
                            <Skeleton variant="rect" height="45px" />
                        </div>
                    ))}
                    <div className="admin-form-group admin-form-group-full">
                        <Skeleton variant="text" width="15%" className="mb-2" />
                        <Skeleton variant="rect" height="150px" />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <Skeleton variant="rect" width="100px" height="40px" />
                    <Skeleton variant="rect" width="120px" height="40px" />
                </div>
            </div>
        </div>
    )
}

export const SkillsAdminSkeleton = () => {
    return (
        <div className="admin-skills-skeleton">
            <div className="admin-section-header">
                <Skeleton variant="title" width="250px" />
            </div>
            <div className="admin-skills-grid">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="admin-card">
                        <div className="admin-skills-category-header mb-6">
                            <Skeleton variant="title" width="40%" />
                            <div className="flex gap-2">
                                <Skeleton variant="circle" width={32} height={32} />
                                <Skeleton variant="rect" width={60} height={32} />
                            </div>
                        </div>
                        <div className="admin-skills-list space-y-4">
                            {[1, 2, 3].map((j) => (
                                <div key={j} className="admin-skill-item">
                                    <div className="admin-skill-details">
                                        <div className="admin-skill-content">
                                            <div className="flex justify-between mb-2">
                                                <Skeleton variant="text" width="30%" />
                                                <Skeleton variant="text" width="15%" />
                                            </div>
                                            <Skeleton variant="rect" height="8px" className="mb-2" />
                                            <Skeleton variant="text" width="10%" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export const AdminSkeleton = ({ activeTab }: { activeTab: string }) => {
    switch (activeTab) {
        case 'dashboard':
            return <DashboardSkeleton />
        case 'personal':
            return <FormSkeleton />
        case 'skills':
            return <SkillsAdminSkeleton />
        case 'projects':
        case 'experience':
        case 'testimonials':
        case 'blog':
        case 'messages':
            return <TableSkeleton />
        default:
            return <DashboardSkeleton />
    }
}
