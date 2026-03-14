'use client'

import React from 'react'

interface SkeletonProps {
    className?: string
    variant?: 'text' | 'title' | 'circle' | 'rect'
    width?: string | number
    height?: string | number
    style?: React.CSSProperties
    glow?: boolean
    glass?: boolean
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    style,
    glow = false,
    glass = true
}) => {
    const skeletonClasses = [
        'skeleton',
        `skeleton-${variant}`,
        glass ? 'skeleton-glass' : '',
        glow ? 'skeleton-glow' : '',
        className
    ].filter(Boolean).join(' ')

    const combinedStyle: React.CSSProperties = {
        width,
        height,
        ...style
    }

    return (
        <div 
            className={skeletonClasses}
            style={combinedStyle}
        />
    )
}

export default Skeleton
