'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface ModalAlertProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type?: 'success' | 'error' | 'info' | 'warning'
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
    showCancel?: boolean
    showConfirm?: boolean
}

const ModalAlert = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    showCancel = true,
    showConfirm = true
}: ModalAlertProps) => {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm()
        }
        onClose()
    }

    const handleCancel = () => {
        if (onCancel) {
            onCancel()
        }
        onClose()
    }

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="admin-modal-alert-icon success" />
            case 'error':
                return <AlertCircle className="admin-modal-alert-icon error" />
            case 'warning':
                return <AlertTriangle className="admin-modal-alert-icon warning" />
            case 'info':
            default:
                return <Info className="admin-modal-alert-icon info" />
        }
    }

    const getButtonClass = () => {
        switch (type) {
            case 'success':
                return 'admin-btn admin-btn-green'
            case 'error':
                return 'admin-btn admin-btn-red'
            case 'warning':
                return 'admin-btn admin-btn-yellow'
            case 'info':
            default:
                return 'admin-btn admin-btn-blue'
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
                        className="admin-modal admin-modal-alert"
                    >
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">{title}</h2>
                            <button
                                onClick={handleCancel}
                                className="admin-modal-close"
                                aria-label="Close modal"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="admin-modal-body">
                            <div className="admin-modal-alert-content">
                                {getIcon()}
                                <h3 className="admin-modal-alert-title">{title}</h3>
                                <p className="admin-modal-alert-message">{message}</p>

                                <div className="admin-modal-alert-actions">
                                    {showCancel && (
                                        <button
                                            onClick={handleCancel}
                                            className="admin-btn admin-btn-gray"
                                        >
                                            {cancelText}
                                        </button>
                                    )}
                                    {showConfirm && (
                                        <button
                                            onClick={handleConfirm}
                                            className={getButtonClass()}
                                        >
                                            {confirmText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ModalAlert