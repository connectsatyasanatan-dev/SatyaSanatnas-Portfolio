'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mail, Trash2, Search, X, Reply, Copy, Filter, Calendar, Eye
} from 'lucide-react'
import ConfirmDialog from './ConfirmDialog'
import type { ContactMessage } from '@/lib/admin-types'

type SortOption = 'newest' | 'oldest'
type SubjectFilter = 'all' | 'with_subject' | 'no_subject'

interface MessagesTabProps {
    messages: ContactMessage[]
    onDeleteMessage: (id: number) => Promise<void>
    onRefresh: () => void
}

const MessagesTab = ({ messages, onDeleteMessage, onRefresh }: MessagesTabProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all')
    const [dateFilter, setDateFilter] = useState('') // YYYY-MM-DD or ''
    const [detailMessage, setDetailMessage] = useState<ContactMessage | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null
    })
    const [copiedId, setCopiedId] = useState<number | null>(null)

    const handleDelete = (id: number) => setDeleteConfirm({ isOpen: true, id })

    const confirmDelete = async () => {
        if (deleteConfirm.id !== null) {
            try {
                await onDeleteMessage(deleteConfirm.id)
                setDetailMessage((prev) => (prev?.id === deleteConfirm.id ? null : prev))
                setDeleteConfirm({ isOpen: false, id: null })
                onRefresh()
            } catch {
                // Parent toast handles error
            }
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr)
            return d.toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
            })
        } catch {
            return dateStr
        }
    }

    const formatDateOnly = (dateStr: string) => {
        try {
            const d = new Date(dateStr)
            return d.toLocaleDateString(undefined, { dateStyle: 'medium' })
        } catch {
            return dateStr
        }
    }

    const getMessageDateString = (dateStr: string) => {
        const d = new Date(dateStr)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    const copyEmail = (msg: ContactMessage, e?: React.MouseEvent) => {
        e?.stopPropagation()
        const text = `${msg.name} <${msg.email}>`
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(msg.id)
            setTimeout(() => setCopiedId(null), 2000)
        })
    }

    const filteredAndSortedMessages = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        let list = messages.filter((msg) => {
            if (q) {
                const match =
                    msg.name.toLowerCase().includes(q) ||
                    msg.email.toLowerCase().includes(q) ||
                    (msg.subject || '').toLowerCase().includes(q) ||
                    msg.message.toLowerCase().includes(q)
                if (!match) return false
            }
            if (subjectFilter === 'with_subject') if (!msg.subject?.trim()) return false
            if (subjectFilter === 'no_subject') if (msg.subject?.trim()) return false
            if (dateFilter) {
                const msgDate = getMessageDateString(msg.created_at)
                if (msgDate !== dateFilter) return false
            }
            return true
        })
        list = [...list].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB
        })
        return list
    }, [messages, searchQuery, subjectFilter, sortBy, dateFilter])

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        sortBy !== 'newest' ||
        subjectFilter !== 'all' ||
        dateFilter !== ''

    const clearAllFilters = () => {
        setSearchQuery('')
        setSortBy('newest')
        setSubjectFilter('all')
        setDateFilter('')
    }

    return (
        <div className="admin-messages-wrap">
            <div className="admin-section-header admin-messages-header">
                <div>
                    <div className="admin-section-title-wrapper">
                        <Mail />
                        <h2 className="admin-section-title">Contact Messages</h2>
                    </div>
                    <p className="admin-section-description">
                        Messages from the portfolio &quot;Send Message&quot; form — stored in DB and emailed to you. Click a message to view full details.
                    </p>
                </div>
            </div>

            {/* Toolbar: Search + Filters (improved UI) */}
            <div className="admin-messages-toolbar-v2">
                <div className="admin-messages-toolbar-group">
                    <label className="admin-messages-toolbar-label">Search</label>
                    <div className="admin-messages-search-wrap">
                        <Search className="admin-messages-search-icon" />
                        <input
                            type="text"
                            className="admin-search-input admin-messages-search"
                            placeholder="Name, email, subject or message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search messages"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="admin-messages-clear-search"
                                onClick={() => setSearchQuery('')}
                                aria-label="Clear search"
                            >
                                <X />
                            </button>
                        )}
                    </div>
                </div>

                <div className="admin-messages-toolbar-group">
                    <label className="admin-messages-toolbar-label">Date</label>
                    <div className="admin-messages-date-wrap">
                        <Calendar className="admin-messages-date-icon" />
                        <input
                            type="date"
                            className="admin-messages-date-input"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            aria-label="Filter by date"
                        />
                        {dateFilter && (
                            <button
                                type="button"
                                className="admin-messages-clear-date"
                                onClick={() => setDateFilter('')}
                                aria-label="Clear date"
                            >
                                <X />
                            </button>
                        )}
                    </div>
                </div>

                <div className="admin-messages-toolbar-group">
                    <label className="admin-messages-toolbar-label">Subject</label>
                    <div className="admin-messages-select-wrap">
                        <Filter className="admin-messages-filter-icon" />
                        <select
                            className="admin-messages-select"
                            value={subjectFilter}
                            onChange={(e) => setSubjectFilter(e.target.value as SubjectFilter)}
                            aria-label="Filter by subject"
                        >
                            <option value="all">All</option>
                            <option value="with_subject">With subject</option>
                            <option value="no_subject">No subject</option>
                        </select>
                    </div>
                </div>

                <div className="admin-messages-toolbar-group">
                    <label className="admin-messages-toolbar-label">Sort</label>
                    <select
                        className="admin-messages-select admin-messages-select-standalone"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        aria-label="Sort by date"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="admin-btn admin-btn-gray admin-messages-clear-btn"
                        onClick={clearAllFilters}
                    >
                        <X />
                        Clear all
                    </button>
                )}
            </div>

            {/* Results count */}
            <div className="admin-messages-results">
                <span className="admin-messages-count">
                    Showing <strong>{filteredAndSortedMessages.length}</strong> of {messages.length} message{messages.length !== 1 ? 's' : ''}
                    {dateFilter && (
                        <span className="admin-messages-date-hint"> on {formatDateOnly(dateFilter + 'T12:00:00')}</span>
                    )}
                </span>
            </div>

            {/* Message list - cards clickable to open detail modal */}
            <div className="admin-items-grid">
                <AnimatePresence mode="popLayout">
                    {filteredAndSortedMessages.map((msg, index) => (
                        <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: Math.min(index * 0.03, 0.2) }}
                            className="admin-item-card admin-message-card admin-message-card-clickable"
                            onClick={() => setDetailMessage(msg)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setDetailMessage(msg)
                                }
                            }}
                            aria-label={`View message from ${msg.name}`}
                        >
                            <div className="admin-item-header">
                                <div className="admin-message-meta">
                                    <h3 className="admin-item-title">{msg.name}</h3>
                                    <a
                                        href={`mailto:${msg.email}`}
                                        className="admin-message-email"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {msg.email}
                                    </a>
                                    {msg.subject && (
                                        <p className="admin-message-subject">{msg.subject}</p>
                                    )}
                                    <p className="admin-message-date">{formatDate(msg.created_at)}</p>
                                </div>
                                <div className="admin-item-actions admin-message-actions" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        type="button"
                                        className="admin-btn-icon edit"
                                        title="View full details"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setDetailMessage(msg)
                                        }}
                                    >
                                        <Eye />
                                    </button>
                                    <a
                                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
                                        className="admin-btn-icon edit"
                                        title="Reply"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Reply />
                                    </a>
                                    <button
                                        type="button"
                                        className={`admin-btn-icon edit ${copiedId === msg.id ? 'copied' : ''}`}
                                        onClick={(e) => copyEmail(msg, e)}
                                        title={copiedId === msg.id ? 'Copied!' : 'Copy email'}
                                    >
                                        <Copy />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(msg.id)
                                        }}
                                        className="admin-btn-icon delete"
                                        title="Delete"
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <p className="admin-message-preview admin-message-card-preview">
                                {msg.message.length > 120 ? `${msg.message.slice(0, 120)}…` : msg.message}
                            </p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {messages.length === 0 && (
                <div className="admin-empty-state">
                    <Mail />
                    <h3>No messages yet</h3>
                    <p>Contact form submissions from your portfolio will appear here.</p>
                </div>
            )}

            {messages.length > 0 && filteredAndSortedMessages.length === 0 && (
                <div className="admin-empty-state admin-empty-state-filtered">
                    <Search />
                    <h3>No messages match your filters</h3>
                    <p>Try a different date, search term, or clear filters.</p>
                    <button
                        type="button"
                        className="admin-btn admin-btn-blue"
                        onClick={clearAllFilters}
                    >
                        Clear all filters
                    </button>
                </div>
            )}

            {/* Message detail modal */}
            <AnimatePresence>
                {detailMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="admin-modal-overlay"
                        onClick={() => setDetailMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                            className="admin-modal admin-message-detail-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="admin-modal-header">
                                <h2 className="admin-modal-title">Message details</h2>
                                <button
                                    type="button"
                                    onClick={() => setDetailMessage(null)}
                                    className="admin-modal-close"
                                    aria-label="Close"
                                >
                                    <X />
                                </button>
                            </div>
                            <div className="admin-modal-body admin-message-detail-body">
                                <div className="admin-message-detail-row">
                                    <span className="admin-message-detail-label">From</span>
                                    <div className="admin-message-detail-value">
                                        <strong>{detailMessage.name}</strong>
                                        <a
                                            href={`mailto:${detailMessage.email}`}
                                            className="admin-message-email"
                                        >
                                            {detailMessage.email}
                                        </a>
                                    </div>
                                </div>
                                {detailMessage.subject && (
                                    <div className="admin-message-detail-row">
                                        <span className="admin-message-detail-label">Subject</span>
                                        <span className="admin-message-detail-value">{detailMessage.subject}</span>
                                    </div>
                                )}
                                <div className="admin-message-detail-row">
                                    <span className="admin-message-detail-label">Date & time</span>
                                    <span className="admin-message-detail-value">{formatDate(detailMessage.created_at)}</span>
                                </div>
                                <div className="admin-message-detail-row admin-message-detail-message">
                                    <span className="admin-message-detail-label">Message</span>
                                    <div className="admin-message-detail-value admin-message-detail-message-text">
                                        {detailMessage.message}
                                    </div>
                                </div>
                            </div>
                            <div className="admin-modal-footer">
                                <a
                                    href={`mailto:${detailMessage.email}?subject=Re: ${encodeURIComponent(detailMessage.subject || 'Your message')}`}
                                    className="admin-btn admin-btn-blue"
                                >
                                    <Reply />
                                    Reply
                                </a>
                                <button
                                    type="button"
                                    className={`admin-btn admin-btn-gray ${copiedId === detailMessage.id ? 'copied' : ''}`}
                                    onClick={() => copyEmail(detailMessage)}
                                >
                                    <Copy />
                                    {copiedId === detailMessage.id ? 'Copied!' : 'Copy email'}
                                </button>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-red"
                                    onClick={() => {
                                        setDetailMessage(null)
                                        handleDelete(detailMessage.id)
                                    }}
                                >
                                    <Trash2 />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
                title="Delete Message"
                message="Are you sure you want to delete this contact message? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                type="delete"
            />
        </div>
    )
}

export default MessagesTab
