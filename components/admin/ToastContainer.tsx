'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { toast } from '@/lib/toast'

const ToastContainer = () => {
    const [toasts, setToasts] = useState<Array<{
        id: string
        message: string
        type: 'success' | 'error' | 'warning' | 'info'
    }>>([])

    useEffect(() => {
        const unsubscribe = toast.subscribe(newToasts => {
            setToasts(newToasts)
        })

        return unsubscribe
    }, [])

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle />
            case 'error':
                return <XCircle />
            case 'warning':
                return <AlertCircle />
            default:
                return <Info />
        }
    }

    return (
        <div className="admin-toast-container">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className={`admin-toast ${t.type}`}
                    >
                        <div className="admin-toast-icon">
                            {getIcon(t.type)}
                        </div>
                        <div className="admin-toast-message">
                            {t.message}
                        </div>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="admin-toast-close"
                        >
                            <X className="admin-icon-sm" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default ToastContainer