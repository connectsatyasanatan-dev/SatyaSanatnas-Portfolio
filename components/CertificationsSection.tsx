'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Calendar } from 'lucide-react'
import portfolioAPI, { Certification } from '@/lib/api'
import { CertificationsSectionSkeleton } from './AppSkeletons'

const CertificationsSection = () => {
    const [certifications, setCertifications] = useState<Certification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const certData = await portfolioAPI.getCertifications()
                setCertifications(certData)
            } catch (error) {
                console.error('Failed to fetch certifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div 
                    key="skeleton-certifications"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                >
                    <CertificationsSectionSkeleton />
                </motion.div>
            ) : certifications.length === 0 ? null : (
                <motion.section 
                    key="certifications-content"
                    id="certifications-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ maxWidth: '1536px', margin: '0 auto 48px auto', padding: '0 16px', position: 'relative' }}
                >
                    <style>{`
                        .certifications-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                            gap: 24px;
                            margin-bottom: 32px;
                        }
                        .cert-card {
                            background: rgba(15, 23, 42, 0.6);
                            backdrop-filter: blur(12px);
                            border: 1px solid rgba(255, 255, 255, 0.08);
                            border-radius: 16px;
                            padding: 24px;
                            display: flex;
                            flex-direction: column;
                            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            position: relative;
                            overflow: hidden;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                        }
                        .cert-card::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: linear-gradient(90deg, transparent, #9333ea, #db2777, transparent);
                            opacity: 0.7;
                            transition: opacity 0.5s ease;
                        }
                        .cert-card::after {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            height: 150px;
                            background: radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.15), transparent 70%);
                            pointer-events: none;
                            z-index: 0;
                        }
                        .cert-card:hover {
                            transform: translateY(-6px);
                            border-color: rgba(218, 165, 32, 0.4);
                            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
                        }
                        .cert-card:hover::before {
                            opacity: 1;
                            background: linear-gradient(90deg, transparent, #db2777, #f59e0b, transparent);
                        }
                        .cert-header, .cert-meta-list, .cert-credential-id {
                            position: relative;
                            z-index: 1;
                        }
                        .cert-header {
                            display: flex;
                            align-items: flex-start;
                            gap: 16px;
                            margin-bottom: 20px;
                        }
                        .cert-icon-wrapper {
                            width: 56px;
                            height: 56px;
                            border-radius: 12px;
                            background: rgba(218, 165, 32, 0.1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: goldenrod;
                            flex-shrink: 0;
                            transition: all 0.3s ease;
                            border: 1px solid rgba(218, 165, 32, 0.2);
                        }
                        .cert-icon-wrapper.has-image {
                            background: transparent;
                            border: none;
                        }
                        .cert-icon-wrapper.has-image img {
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                        }
                        .cert-card:hover .cert-icon-wrapper:not(.has-image) {
                            background: goldenrod;
                            color: #fff;
                            transform: rotate(5deg) scale(1.05);
                        }
                        .cert-card:hover .cert-icon-wrapper.has-image img {
                            transform: scale(1.05);
                            transition: transform 0.3s ease;
                        }
                        .cert-title-area {
                            flex: 1;
                        }
                        .cert-name {
                            font-size: 18px;
                            font-weight: 700;
                            color: white;
                            margin: 0 0 6px 0;
                            line-height: 1.3;
                            letter-spacing: -0.01em;
                        }
                        .cert-issuer {
                            font-size: 14px;
                            color: rgba(255, 255, 255, 0.6);
                            margin: 0;
                            font-weight: 500;
                        }
                        .cert-meta-list {
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 8px;
                            padding: 12px;
                            margin-top: auto;
                            display: grid;
                            gap: 10px;
                        }
                        .cert-meta-item {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            font-size: 13px;
                            color: rgba(255, 255, 255, 0.7);
                        }
                        .cert-meta-icon {
                            width: 14px;
                            height: 14px;
                            color: var(--secondary);
                        }
                        .cert-status-indicator {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            box-shadow: 0 0 8px currentColor;
                        }
                        .cert-credential-id {
                            margin-top: 16px;
                            padding-top: 16px;
                            border-top: 1px dashed rgba(255, 255, 255, 0.1);
                            font-family: 'JetBrains Mono', monospace;
                            font-size: 12px;
                            color: rgba(255, 255, 255, 0.5);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .cert-verify-btn {
                            color: goldenrod;
                            text-decoration: none;
                            font-weight: 600;
                            transition: opacity 0.2s;
                        }
                        .cert-verify-btn:hover {
                            opacity: 0.8;
                        }
                        
                        @media (max-width: 768px) {
                            .certifications-grid {
                                grid-template-columns: 1fr;
                            }
                        }
                    `}</style>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <Award size={28} style={{ color: 'goldenrod' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.025em', color: 'white', margin: 0 }}>Licenses & Certifications</h3>
                    </div>

                    <div className="certifications-grid">
                        {certifications.map((cert, index) => {
                            const isValid = cert.validity?.includes('2025') || cert.validity?.includes('2026') || cert.validity?.toLowerCase().includes('no expiration');
                            const isOracle = cert.name.toLowerCase().includes('oracle') || cert.issuer.toLowerCase().includes('oracle');
                            
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="cert-card"
                                >
                                    <div className="cert-header">
                                        <div className={`cert-icon-wrapper ${isOracle ? 'has-image' : ''}`}>
                                            {isOracle ? (
                                                <img 
                                                    src="/images/oci_badge.jpeg" 
                                                    alt="Oracle Certification Badge" 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                                />
                                            ) : (
                                                <Award size={28} />
                                            )}
                                        </div>
                                        <div className="cert-title-area">
                                            <h4 className="cert-name">{cert.name}</h4>
                                            <p className="cert-issuer">{cert.issuer}</p>
                                        </div>
                                    </div>

                                    <div className="cert-meta-list">
                                        {cert.date && (
                                            <div className="cert-meta-item">
                                                <Calendar className="cert-meta-icon" />
                                                <span>Issued {cert.date}</span>
                                            </div>
                                        )}
                                        {cert.validity && (
                                            <div className="cert-meta-item">
                                                <span 
                                                    className="cert-status-indicator"
                                                    style={{ color: isValid ? '#22c55e' : '#eab308' }}
                                                />
                                                <span>{cert.validity}</span>
                                            </div>
                                        )}
                                    </div>

                                    {cert.credential && (
                                        <div className="cert-credential-id">
                                            <span>ID: {cert.credential}</span>
                                            <a href="#" className="cert-verify-btn">Verify ↗</a>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default CertificationsSection
