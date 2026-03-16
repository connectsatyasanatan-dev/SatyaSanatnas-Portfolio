'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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

    if (loading) {
        return <CertificationsSectionSkeleton />
    }

    if (!loading && certifications.length === 0) {
        return null
    }

    return (
        <section id="certifications-section" style={{ maxWidth: '1536px', margin: '0 auto 48px auto', padding: '0 16px', position: 'relative' }}>
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
                    background: linear-gradient(90deg, transparent, var(--secondary), transparent);
                    transform: scaleX(0);
                    transition: transform 0.5s ease;
                }
                .cert-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(218, 165, 32, 0.4);
                    box-shadow: 0 12px 30px rgba(218, 165, 32, 0.15);
                }
                .cert-card:hover::before {
                    transform: scaleX(1);
                }
                .cert-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    margin-bottom: 20px;
                }
                .cert-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background: rgba(218, 165, 32, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: goldenrod;
                    flex-shrink: 0;
                    transition: all 0.3s ease;
                }
                .cert-card:hover .cert-icon-wrapper {
                    background: goldenrod;
                    color: #fff;
                    transform: rotate(5deg) scale(1.05);
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
                
                .cert-summary-board {
                    background: linear-gradient(135deg, rgba(218, 165, 32, 0.1) 0%, rgba(15, 23, 42, 0.8) 100%);
                    border: 1px solid rgba(218, 165, 32, 0.2);
                    border-radius: 16px;
                    padding: 32px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 32px;
                    align-items: center;
                    justify-content: space-between;
                }
                .cert-summary-text h4 {
                    font-size: 24px;
                    color: white;
                    margin: 0 0 8px 0;
                    font-weight: 700;
                }
                .cert-summary-text p {
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    font-size: 15px;
                    max-width: 400px;
                    line-height: 1.5;
                }
                .cert-stats {
                    display: flex;
                    gap: 40px;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px 32px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .cert-stat-box {
                    text-align: center;
                }
                .cert-stat-val {
                    font-size: 32px;
                    font-weight: 800;
                    color: goldenrod;
                    line-height: 1;
                    margin-bottom: 8px;
                    text-shadow: 0 0 20px rgba(218, 165, 32, 0.3);
                }
                .cert-stat-lbl {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255, 255, 255, 0.6);
                    font-weight: 600;
                }
                
                @media (max-width: 768px) {
                    .certifications-grid {
                        grid-template-columns: 1fr;
                    }
                    .cert-summary-board {
                        flex-direction: column;
                        text-align: center;
                    }
                    .cert-summary-text p {
                        margin: 0 auto;
                    }
                    .cert-stats {
                        width: 100%;
                        justify-content: space-around;
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
                                <div className="cert-icon-wrapper">
                                    <Award size={24} />
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

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="cert-summary-board"
            >
                <div className="cert-summary-text">
                    <h4>Professional Endorsements</h4>
                    <p>Continuously expanding my skill set through industry-recognized certifications to deliver cutting-edge solutions.</p>
                </div>
                
                <div className="cert-stats">
                    <div className="cert-stat-box">
                        <div className="cert-stat-val">{certifications.length}</div>
                        <div className="cert-stat-lbl">Active Certs</div>
                    </div>
                    <div className="cert-stat-box">
                        <div className="cert-stat-val">100%</div>
                        <div className="cert-stat-lbl">Verified</div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default CertificationsSection
