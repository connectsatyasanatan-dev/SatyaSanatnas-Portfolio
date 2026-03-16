'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Star, BookOpen, Award, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import portfolioAPI, { Education } from '@/lib/api'
import { EducationSectionSkeleton } from './AppSkeletons'

const EducationSection = () => {
    const [education, setEducation] = useState<Education[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eduData = await portfolioAPI.getEducation()
                setEducation(eduData)
            } catch (error) {
                console.error('Failed to fetch education:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <EducationSectionSkeleton />
    }

    if (!loading && education.length === 0) {
        return null
    }

    return (
        <section id="education-section">
            <style>{`
                /* ── Education Section ── */
                #education-section {
                    max-width: 1536px;
                    margin: 0 auto 48px auto;
                    padding: 0 16px;
                    position: relative;
                }

                /* Section header */
                .edu-section-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .edu-section-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(6, 249, 249, 0.12);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #06f9f9;
                    flex-shrink: 0;
                }
                .edu-section-title {
                    font-size: 24px;
                    font-weight: 700;
                    font-family: 'Space Grotesk', sans-serif;
                    letter-spacing: -0.025em;
                    color: white;
                    margin: 0;
                }
                .edu-section-count {
                    margin-left: auto;
                    font-size: 12px;
                    font-family: 'JetBrains Mono', monospace;
                    color: rgba(255,255,255,0.4);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 4px 10px;
                    border-radius: 20px;
                    letter-spacing: 0.05em;
                }

                /* Timeline wrapper */
                .edu-timeline {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }
                .edu-timeline::before {
                    content: '';
                    position: absolute;
                    left: 21px;
                    top: 24px;
                    bottom: 24px;
                    width: 2px;
                    background: linear-gradient(to bottom, #06f9f9 0%, rgba(6,249,249,0.15) 60%, transparent 100%);
                    border-radius: 2px;
                }

                /* Individual education card */
                .edu-card {
                    display: flex;
                    gap: 24px;
                    padding-bottom: 32px;
                    position: relative;
                }
                .edu-card:last-child {
                    padding-bottom: 0;
                }

                /* Left dot */
                .edu-dot-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex-shrink: 0;
                    margin-top: 18px;
                }
                .edu-dot {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(6,249,249,0.25), rgba(6,249,249,0.05));
                    border: 2px solid rgba(6,249,249,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #06f9f9;
                    flex-shrink: 0;
                    box-shadow: 0 0 16px rgba(6,249,249,0.2), inset 0 0 8px rgba(6,249,249,0.08);
                    z-index: 2;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .edu-card:hover .edu-dot {
                    border-color: #06f9f9;
                    box-shadow: 0 0 24px rgba(6,249,249,0.4), inset 0 0 12px rgba(6,249,249,0.12);
                    transform: scale(1.08);
                }

                /* Card body */
                .edu-body {
                    flex: 1;
                    min-width: 0;
                    background: rgba(15, 23, 42, 0.55);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px;
                    padding: 24px;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .edu-body::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #06f9f9, transparent);
                    transform: scaleX(0);
                    transition: transform 0.5s ease;
                }
                .edu-card:hover .edu-body {
                    border-color: rgba(6,249,249,0.25);
                    box-shadow: 0 8px 32px rgba(6,249,249,0.08), 0 4px 20px rgba(0,0,0,0.25);
                    transform: translateY(-2px);
                }
                .edu-card:hover .edu-body::before {
                    transform: scaleX(1);
                }

                /* Card header row */
                .edu-card-header {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 16px;
                    margin-bottom: 12px;
                }
                .edu-title-group {
                    flex: 1;
                    min-width: 0;
                }
                .edu-degree {
                    font-size: 18px;
                    font-weight: 700;
                    color: white;
                    margin: 0 0 4px 0;
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                }
                .edu-school {
                    font-size: 14px;
                    font-weight: 600;
                    color: #06f9f9;
                    margin: 0;
                    opacity: 0.9;
                }
                .edu-toggle-btn {
                    background: rgba(6,249,249,0.08);
                    border: 1px solid rgba(6,249,249,0.15);
                    border-radius: 8px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #06f9f9;
                    flex-shrink: 0;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }
                .edu-toggle-btn:hover {
                    background: rgba(6,249,249,0.18);
                    border-color: rgba(6,249,249,0.35);
                }

                /* Meta tags row */
                .edu-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 0;
                }
                .edu-meta-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    font-family: 'JetBrains Mono', monospace;
                    color: rgba(255,255,255,0.55);
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 4px 10px;
                    border-radius: 20px;
                }
                .edu-meta-badge svg {
                    width: 12px;
                    height: 12px;
                    flex-shrink: 0;
                }
                .edu-meta-badge.gpa {
                    color: #fbbf24;
                    background: rgba(251,191,36,0.08);
                    border-color: rgba(251,191,36,0.2);
                }
                .edu-meta-badge.gpa svg {
                    color: #fbbf24;
                }

                /* Expandable content */
                .edu-expandable {
                    overflow: hidden;
                    transition: max-height 0.4s ease, opacity 0.35s ease, margin-top 0.3s ease;
                }
                .edu-expandable.open {
                    margin-top: 20px;
                }
                .edu-expandable.closed {
                    max-height: 0;
                    opacity: 0;
                    margin-top: 0;
                }

                /* Focus */
                .edu-focus-strip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    padding: 10px 14px;
                    background: rgba(45,226,230,0.06);
                    border: 1px solid rgba(45,226,230,0.15);
                    border-radius: 8px;
                }
                .edu-focus-icon {
                    color: #2de2e6;
                    flex-shrink: 0;
                    width: 14px;
                    height: 14px;
                }
                .edu-focus-label {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #2de2e6;
                    margin-right: 4px;
                }
                .edu-focus-value {
                    font-size: 13px;
                    color: rgba(255,255,255,0.75);
                }

                /* Courses */
                .edu-courses-section {
                    margin-bottom: 16px;
                }
                .edu-sub-label {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .edu-sub-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                }
                .edu-courses-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .edu-course-chip {
                    font-size: 12px;
                    font-family: 'JetBrains Mono', monospace;
                    background: rgba(6,249,249,0.07);
                    color: #06f9f9;
                    border: 1px solid rgba(6,249,249,0.18);
                    padding: 4px 10px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }
                .edu-course-chip:hover {
                    background: rgba(6,249,249,0.14);
                    border-color: rgba(6,249,249,0.35);
                }

                /* Achievements */
                .edu-achievements-section {
                    margin-bottom: 4px;
                }
                .edu-achievement-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.04);
                }
                .edu-achievement-item:last-child {
                    border-bottom: none;
                }
                .edu-achievement-bullet {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #22c55e;
                    flex-shrink: 0;
                    margin-top: 6px;
                    box-shadow: 0 0 6px rgba(34,197,94,0.5);
                }
                .edu-achievement-text {
                    font-size: 13px;
                    color: rgba(255,255,255,0.7);
                    line-height: 1.55;
                }

                /* Summary board */
                .edu-summary-board {
                    margin-top: 40px;
                    background: linear-gradient(135deg, rgba(6,249,249,0.07) 0%, rgba(15,23,42,0.85) 100%);
                    border: 1px solid rgba(6,249,249,0.15);
                    border-radius: 16px;
                    padding: 28px 32px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 28px;
                    align-items: center;
                    justify-content: space-between;
                }
                .edu-summary-text h4 {
                    font-size: 20px;
                    color: white;
                    margin: 0 0 6px 0;
                    font-weight: 700;
                    font-family: 'Space Grotesk', sans-serif;
                }
                .edu-summary-text p {
                    color: rgba(255,255,255,0.55);
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.6;
                    max-width: 380px;
                }
                .edu-stats {
                    display: flex;
                    gap: 32px;
                    background: rgba(0,0,0,0.25);
                    padding: 18px 28px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.04);
                }
                .edu-stat-box { text-align: center; }
                .edu-stat-val {
                    font-size: 28px;
                    font-weight: 800;
                    color: #06f9f9;
                    line-height: 1;
                    margin-bottom: 6px;
                    text-shadow: 0 0 20px rgba(6,249,249,0.3);
                }
                .edu-stat-lbl {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: rgba(255,255,255,0.5);
                    font-weight: 600;
                }

                /* Responsive */
                @media (max-width: 600px) {
                    .edu-timeline::before { left: 17px; }
                    .edu-dot { width: 36px; height: 36px; }
                    .edu-card { gap: 16px; }
                    .edu-body { padding: 18px 16px; }
                    .edu-degree { font-size: 16px; }
                    .edu-summary-board { flex-direction: column; }
                    .edu-stats { width: 100%; justify-content: space-around; }
                }
                @media (min-width: 640px) {
                    #education-section { padding: 0 24px; }
                }
                @media (min-width: 768px) {
                    #education-section { margin-bottom: 64px; padding: 0 32px; }
                }
                @media (min-width: 1024px) {
                    #education-section { margin-bottom: 80px; padding: 0; }
                }
            `}</style>

            {/* Section Header */}
            <div className="edu-section-header">
                <div className="edu-section-icon">
                    <GraduationCap size={20} />
                </div>
                <h3 className="edu-section-title">Education</h3>
                <span className="edu-section-count">{education.length} {education.length === 1 ? 'record' : 'records'}</span>
            </div>

            {/* Timeline */}
            <div className="edu-timeline">
                {education.map((edu, index) => {
                    const isOpen = expandedIndex === index
                    const hasExpandable = (
                        (edu.relevant_courses && edu.relevant_courses.length > 0) ||
                        (edu.achievements && edu.achievements.length > 0) ||
                        edu.focus
                    )

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.55, delay: index * 0.15 }}
                            className="edu-card"
                            onClick={() => hasExpandable && setExpandedIndex(isOpen ? null : index)}
                        >
                            {/* Left dot */}
                            <div className="edu-dot-col">
                                <div className="edu-dot">
                                    <GraduationCap size={18} />
                                </div>
                            </div>

                            {/* Body */}
                            <div className="edu-body">
                                {/* Header */}
                                <div className="edu-card-header">
                                    <div className="edu-title-group">
                                        <h5 className="edu-degree">{edu.degree}</h5>
                                        <p className="edu-school">{edu.school}</p>
                                    </div>
                                    {hasExpandable && (
                                        <button className="edu-toggle-btn" aria-label="Toggle details">
                                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                    )}
                                </div>

                                {/* Meta badges */}
                                <div className="edu-meta">
                                    {edu.location && (
                                        <span className="edu-meta-badge">
                                            <MapPin />
                                            {edu.location}
                                        </span>
                                    )}
                                    {edu.period && (
                                        <span className="edu-meta-badge">
                                            <Calendar />
                                            {edu.period}
                                        </span>
                                    )}
                                    {edu.gpa && (
                                        <span className="edu-meta-badge gpa">
                                            <Star />
                                            GPA: {edu.gpa}
                                        </span>
                                    )}
                                </div>

                                {/* Expandable details */}
                                {hasExpandable && (
                                    <div className={`edu-expandable ${isOpen ? 'open' : 'closed'}`}
                                         style={{ maxHeight: isOpen ? '600px' : '0', opacity: isOpen ? 1 : 0 }}>

                                        {edu.focus && (
                                            <div className="edu-focus-strip">
                                                <Lightbulb className="edu-focus-icon" />
                                                <span className="edu-focus-label">Focus</span>
                                                <span className="edu-focus-value">{edu.focus}</span>
                                            </div>
                                        )}

                                        {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                                            <div className="edu-courses-section">
                                                <div className="edu-sub-label">
                                                    <BookOpen size={11} />
                                                    Relevant Coursework
                                                </div>
                                                <div className="edu-courses-grid">
                                                    {edu.relevant_courses.map((course, ci) => (
                                                        <span key={ci} className="edu-course-chip">{course}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {edu.achievements && edu.achievements.length > 0 && (
                                            <div className="edu-achievements-section">
                                                <div className="edu-sub-label">
                                                    <Award size={11} />
                                                    Highlights
                                                </div>
                                                {edu.achievements.map((ach, ai) => (
                                                    <div key={ai} className="edu-achievement-item">
                                                        <div className="edu-achievement-bullet" />
                                                        <span className="edu-achievement-text">{ach}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Summary board */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="edu-summary-board"
            >
                <div className="edu-summary-text">
                    <h4>Academic Foundation</h4>
                    <p>A strong educational background fueling continuous growth in technology, problem-solving, and creative engineering.</p>
                </div>
                <div className="edu-stats">
                    <div className="edu-stat-box">
                        <div className="edu-stat-val">{education.length}</div>
                        <div className="edu-stat-lbl">{education.length === 1 ? 'Degree' : 'Degrees'}</div>
                    </div>
                    <div className="edu-stat-box">
                        <div className="edu-stat-val">
                            {education.reduce((acc, e) => acc + (e.relevant_courses?.length || 0), 0)}
                        </div>
                        <div className="edu-stat-lbl">Courses</div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default EducationSection