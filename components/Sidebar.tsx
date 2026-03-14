'use client'

import {
    FolderOpen,
    Search,
    GitBranch,
    Bug,
    Package,
    User,
    Settings,
    ChevronRight,
    MoreHorizontal,
    File,
    Folder,
    FileText
} from 'lucide-react'

const Sidebar = () => {
    const SidebarContent = () => (
        <div className="sidebar-content">
            {/* Icon sidebar */}
            <div className="sidebar-icons">
                <FolderOpen className="active" />
                <Search />
                <GitBranch />
                <Bug />
                <Package />

                <div className="icons-bottom">
                    <User />
                    <Settings />
                </div>
            </div>

            {/* File explorer */}
            <div className="sidebar-explorer">
                <div className="explorer-header">
                    <span>Explorer</span>
                    <MoreHorizontal />
                </div>

                <div className="file-tree">
                    {/* Root folder */}
                    <div className="folder-root">
                        <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                        <span className="folder-name">PORTFOLIO-V2</span>
                    </div>

                    {/* File structure */}
                    <div className="folder-contents">
                        <div className="file-item">
                            <ChevronRight />
                            <Folder />
                            <span>.github</span>
                        </div>

                        <div className="file-item">
                            <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                            <FolderOpen />
                            <span>src</span>
                        </div>

                        {/* src folder contents */}
                        <div className="nested-folder">
                            <div className="file-item">
                                <ChevronRight />
                                <Folder style={{ color: '#eab308' }} />
                                <span>assets</span>
                            </div>

                            <div className="file-item">
                                <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                                <FolderOpen style={{ color: '#22c55e' }} />
                                <span>components</span>
                            </div>

                            {/* components folder contents */}
                            <div className="nested-folder">
                                <div className="file-item">
                                    <File style={{ color: '#61dafb' }} />
                                    <span>Hero.tsx</span>
                                </div>
                                <div className="file-item">
                                    <File style={{ color: '#61dafb' }} />
                                    <span>Skills.tsx</span>
                                </div>
                                <div className="file-item">
                                    <File style={{ color: '#61dafb' }} />
                                    <span>Projects.tsx</span>
                                </div>
                                <div className="file-item">
                                    <File style={{ color: '#61dafb' }} />
                                    <span>Contact.tsx</span>
                                </div>
                            </div>

                            <div className="file-item">
                                <ChevronRight style={{ transform: 'rotate(90deg)' }} />
                                <FolderOpen style={{ color: '#3b82f6' }} />
                                <span>pages</span>
                            </div>

                            {/* pages folder contents */}
                            <div className="nested-folder">
                                <div className="file-item active">
                                    <File style={{ color: '#61dafb' }} />
                                    <span>index.tsx</span>
                                </div>
                                <div className="file-item">
                                    <FileText style={{ color: '#e34c26' }} />
                                    <span>about.html</span>
                                </div>
                            </div>
                        </div>

                        {/* Root level files */}
                        <div className="file-item">
                            <File style={{ color: '#eab308' }} />
                            <span>package.json</span>
                        </div>
                        <div className="file-item">
                            <File style={{ color: 'var(--secondary)' }} />
                            <span>projects.sh</span>
                        </div>
                        <div className="file-item">
                            <File style={{ color: '#22c55e' }} />
                            <span>contact.json</span>
                        </div>
                        <div className="file-item">
                            <FileText style={{ color: '#6b7280' }} />
                            <span>README.md</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="sidebar-content-wrapper">
            <SidebarContent />
        </div>
    )
}

export default Sidebar