'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
}

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) => {
    return (
        <div className="admin-loading-wrapper">
            <motion.div
                className={`admin-loading-spinner ${size}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="admin-loading-text"
                >
                    {text}
                </motion.p>
            )}
        </div>
    )
}

export default LoadingSpinner