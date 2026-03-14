'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Award, Calendar, MapPin, School, BookOpen, Star, FileCheck, Lightbulb } from 'lucide-react'
import portfolioAPI, { Education, Certification } from '@/lib/api'
import { EducationSectionSkeleton } from './AppSkeletons'

const EducationSection = () => {
    const [education, setEducation] = useState<Education[]>([])
    const [certifications, setCertifications] = useState<Certification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eduData, certData] = await Promise.all([
                    portfolioAPI.getEducation(),
                    portfolioAPI.getCertifications()
                ])
                setEducation(eduData)
                setCertifications(certData)
            } catch (error) {
                console.error('Failed to fetch education/certifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <EducationSectionSkeleton />
    }

    return (
        <section id="education-section">
            <div className="section-header">
                <GraduationCap />
                <h3 className="section-title">Education & Certifications</h3>
            </div>

            <div className="education-grid">
                {/* Education */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="education-column"
                >
                    <div className="column-header">
                        <BookOpen className="primary" />
                        <h4 className="column-title">Education</h4>
                    </div>

                    {education.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="education-item"
                        >
                            <div className="education-header">
                                <div>
                                    <h5 className="education-degree">{edu.degree}</h5>
                                    <p className="education-school">{edu.school}</p>
                                    <div className="education-meta">
                                        <div className="meta-item">
                                            <MapPin />
                                            <span>{edu.location}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Calendar />
                                            <span>{edu.period}</span>
                                        </div>
                                        {edu.gpa && (
                                            <div className="meta-item">
                                                <Star />
                                                <span>GPA: {edu.gpa}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                                <div className="education-courses">
                                    <h6 className="courses-title">Relevant Coursework:</h6>
                                    <div className="courses-list">
                                        {edu.relevant_courses.map((course, courseIndex) => (
                                            <span key={courseIndex} className="course-tag">
                                                {course}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {edu.achievements && edu.achievements.length > 0 && (
                                <div className="education-achievements">
                                    <h6 className="achievements-title">Achievements:</h6>
                                    <ul className="achievements-list">
                                        {edu.achievements.map((achievement, achIndex) => (
                                            <li key={achIndex}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {edu.focus && (
                                <div className="education-focus">
                                    <span className="focus-tag">
                                        Focus: {edu.focus}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Certifications */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="education-column"
                >
                    <div className="column-header">
                        <Award className="secondary" />
                        <h4 className="column-title">Certifications</h4>
                    </div>

                    {certifications.map((cert, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                            className="certification-item"
                        >
                            <div className="certification-content">
                                <div className="certification-icon">
                                    <Award />
                                </div>

                                <div className="certification-details">
                                    <h5 className="certification-name">{cert.name}</h5>
                                    <p className="certification-issuer">{cert.issuer}</p>

                                    <div className="certification-meta">
                                        <div className="meta-item">
                                            <Calendar />
                                            <span>Issued: {cert.date}</span>
                                        </div>
                                        {cert.validity && (
                                            <div className="meta-item">
                                                <span
                                                    className={`w-2 h-2 rounded-full ${cert.validity.includes('2025') || cert.validity.includes('2026')
                                                        ? 'bg-green-400'
                                                        : 'bg-yellow-400'
                                                        }`}
                                                    style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        backgroundColor: cert.validity.includes('2025') || cert.validity.includes('2026')
                                                            ? '#22c55e'
                                                            : '#eab308',
                                                        display: 'inline-block',
                                                        marginRight: '4px'
                                                    }}
                                                ></span>
                                                <span>{cert.validity}</span>
                                            </div>
                                        )}
                                    </div>

                                    {cert.credential && (
                                        <div className="certification-credential">
                                            <p className="credential-text">
                                                Credential ID: {cert.credential}
                                            </p>
                                        </div>
                                    )}

                                    <div className="certification-footer">
                                        <span className="verification-badge">
                                            Verified
                                        </span>
                                        <a href="#" className="view-certificate">
                                            View Certificate →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Certification Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="certification-summary"
                    >
                        <h5 className="summary-title">Certification Summary</h5>
                        <div className="summary-stats">
                            <div className="summary-stat">
                                <div className="stat-number secondary">{certifications.length}</div>
                                <div className="stat-label">Active Certs</div>
                            </div>
                            <div className="summary-stat">
                                <div className="stat-number primary">100%</div>
                                <div className="stat-label">Pass Rate</div>
                            </div>
                        </div>
                        <div className="summary-note">
                            <p className="note-text">
                                Committed to continuous learning and staying updated with latest technologies
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default EducationSection