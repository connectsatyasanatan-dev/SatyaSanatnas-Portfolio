'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {

    // Size classes handling (custom implementing since we aren't using Tailwind utility classes for width)
    const getSizeStyle = () => {
        switch (size) {
            case 'sm': return { maxWidth: '400px' }
            case 'lg': return { maxWidth: '800px' }
            case 'xl': return { maxWidth: '1100px' }
            case 'md':
            default: return { maxWidth: '600px' }
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
                        if (e.target === e.currentTarget) onClose()
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="admin-modal"
                        style={{ width: '100%', ...getSizeStyle() }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">{title}</h2>
                            <button
                                onClick={onClose}
                                className="admin-modal-close"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="admin-modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal
