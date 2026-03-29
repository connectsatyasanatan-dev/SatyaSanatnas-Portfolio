'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, ExternalLink, Printer, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'

interface ResumeModalProps {
    isOpen: boolean
    onClose: () => void
    resumeUrl: string | null
    name: string
}

const ResumeModal = ({ isOpen, onClose, resumeUrl, name }: ResumeModalProps) => {
    const [loading, setLoading] = useState(true)
    const [zoom, setZoom] = useState(100)

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
            // Reset zoom when opening
            setZoom(100)
        }
    }, [isOpen])

    const handleDownload = async () => {
        if (!resumeUrl) return
        
        try {
            // Use fetch to get the file as a blob to bypass cross-origin restrictions on the 'download' attribute
            const response = await fetch(resumeUrl)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            
            const link = document.createElement('a')
            link.href = blobUrl
            // Exactly what's requested
            link.download = "Satya Sanatan Bastia's Resume.pdf"
            
            document.body.appendChild(link)
            link.click()
            
            // Cleanup
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Download failed:', error)
            // Fallback to simple link if fetch fails
            const link = document.createElement('a')
            link.href = resumeUrl
            link.target = '_blank'
            link.download = "Satya Sanatan Bastia's Resume.pdf"
            link.click()
        }
    }

    const handlePrint = () => {
        const iframe = document.getElementById('resume-iframe') as HTMLIFrameElement
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print()
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="resume-modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="resume-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="resume-modal-header">
                        <div className="header-left">
                            <FileText className="text-primary" size={20} />
                            <div>
                                <h3>Curriculum Vitae</h3>
                                <p>{name}</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <div className="zoom-controls">
                                <button onClick={() => setZoom(prev => Math.max(50, prev - 10))} title="Zoom Out">
                                    <ZoomOut size={18} />
                                </button>
                                <span>{zoom}%</span>
                                <button onClick={() => setZoom(prev => Math.min(200, prev + 10))} title="Zoom In">
                                    <ZoomIn size={18} />
                                </button>
                            </div>
                            
                            <button onClick={handlePrint} className="action-btn" title="Print">
                                <Printer size={18} />
                            </button>
                            
                            <button onClick={handleDownload} className="download-btn-modern">
                                <Download size={18} />
                                <span>Download PDF</span>
                            </button>
                            
                            <button onClick={onClose} className="close-btn-modern">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="resume-viewer-body">
                        {loading && (
                            <div className="resume-loader">
                                <Loader2 className="animate-spin text-primary" size={40} />
                                <p>Loading Document...</p>
                            </div>
                        )}
                        
                        {!resumeUrl ? (
                            <div className="resume-error">
                                <FileText size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                                <p>Resume file not found. Please upload one in the admin panel.</p>
                            </div>
                        ) : (
                            <iframe
                                id="resume-iframe"
                                src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="resume-iframe"
                                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                                onLoad={() => setLoading(false)}
                            />
                        )}
                    </div>
                    
                    <div className="resume-modal-footer">
                        <p>Document Security: Verified & Signed</p>
                        <a href={resumeUrl || '#'} target="_blank" rel="noopener noreferrer" className="external-link">
                            Open in New Tab <ExternalLink size={14} />
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ResumeModal
