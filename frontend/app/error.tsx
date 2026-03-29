'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled application error:', error)
    }, [error])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--background-dark)', // using existing css var
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--error-color, #f44336)' }}>
                Something went wrong!
            </h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary, #8b949e)' }}>
                An unexpected error has occurred. Our system has logged the problem.
            </p>
            <button
                onClick={() => reset()}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--accent-color, #0a74da)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background 0.2s',
                }}
            >
                Try again
            </button>
        </div>
    )
}
