'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    type?: 'delete' | 'warning' | 'info'
}

const ConfirmDialog = ({
    isOpen,
    onClose,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    type = 'delete'
}: ConfirmDialogProps) => {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    const handleCancel = () => {
        onClose()
    }

    const getButtonClass = () => {
        switch (type) {
            case 'delete':
                return 'admin-btn admin-btn-red'
            case 'warning':
                return 'admin-btn admin-btn-yellow'
            case 'info':
            default:
                return 'admin-btn admin-btn-blue'
        }
    }

    const getIcon = () => {
        switch (type) {
            case 'delete':
                return <AlertTriangle className="admin-modal-alert-icon error" />
            case 'warning':
                return <AlertTriangle className="admin-modal-alert-icon warning" />
            case 'info':
            default:
                return <AlertTriangle className="admin-modal-alert-icon info" />
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="admin-modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            handleCancel()
                        }
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="admin-modal admin-confirm-dialog"
                    >
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">{title}</h2>
                            <button
                                onClick={handleCancel}
                                className="admin-modal-close"
                                aria-label="Close dialog"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="admin-confirm-dialog-content">
                                {getIcon()}
                                <h3 className="admin-confirm-dialog-title">{title}</h3>
                                <p className="admin-confirm-dialog-message">{message}</p>

                                <div className="admin-confirm-dialog-actions">
                                    <button
                                        onClick={handleCancel}
                                        className="admin-btn admin-btn-gray"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className={getButtonClass()}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ConfirmDialog