'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Star, User, Building, ChevronLeft, ChevronRight, Play, Pause, Sparkles } from 'lucide-react'
import portfolioAPI, { Testimonial } from '@/lib/api'
import { TestimonialsSectionSkeleton } from './AppSkeletons'

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const [direction, setDirection] = useState(0) // -1 for left, 1 for right

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await portfolioAPI.getTestimonials()
                setTestimonials(data)
            } catch (error) {
                console.error('Failed to fetch testimonials:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTestimonials()
    }, [])

    const slideNext = useCallback(() => {
        setDirection(1)
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, [testimonials.length])

    const slidePrev = useCallback(() => {
        setDirection(-1)
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }, [testimonials.length])

    useEffect(() => {
        if (isAutoPlaying && testimonials.length > 0) {
            const timer = setInterval(slideNext, 6000)
            return () => clearInterval(timer)
        }
    }, [isAutoPlaying, testimonials.length, slideNext])

    if (loading) return <TestimonialsSectionSkeleton />
    if (!loading && testimonials.length === 0) return null

    const active = testimonials[activeIndex]

    // Animation variants for the unique slider effect
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 150 : -150,
            opacity: 0,
            scale: 0.95,
            rotateY: direction > 0 ? 15 : -15,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -150 : 150,
            opacity: 0,
            scale: 0.95,
            rotateY: direction > 0 ? -15 : 15,
            transition: {
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    }

    return (
        <section id="testimonials-root">
            <style>{`
                #testimonials-root {
                    max-width: 1200px;
                    margin: 64px auto;
                    padding: 0 16px;
                    position: relative;
                    perspective: 1500px;
                }

                .tm-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                    border-left: 3px solid var(--primary);
                    padding-left: 20px;
                }

                .tm-title-wrap h3 {
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    color: #fff;
                    margin-bottom: 4px;
                }

                .tm-subtitle {
                    color: var(--primary);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 14px;
                    opacity: 0.8;
                }

                /* ── Slider Container ── */
                .tm-viewport {
                    position: relative;
                    min-height: 380px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .tm-card {
                    position: absolute;
                    width: 100%;
                    max-width: 780px;
                    background: rgba(17, 24, 24, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 24px;
                    padding: 40px 48px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                    transform-style: preserve-3d;
                }

                .tm-card-glow {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at 10% 10%, rgba(var(--primary-rgb), 0.03) 0%, transparent 40%);
                    pointer-events: none;
                    border-radius: inherit;
                }

                .tm-quote-icon {
                    position: absolute;
                    top: -18px; left: 40px;
                    width: 44px; height: 44px;
                    background: var(--primary);
                    color: #000;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
                }

                .tm-content {
                    position: relative;
                    z-index: 2;
                }

                .tm-rating {
                    display: flex;
                    gap: 3px;
                    margin-bottom: 20px;
                }

                .tm-star {
                    color: var(--primary);
                    fill: var(--primary);
                    opacity: 0.2;
                }
                .tm-star.filled {
                    opacity: 1;
                }

                .tm-text {
                    font-size: 19px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.85);
                    font-weight: 500;
                    margin-bottom: 32px;
                    font-style: normal;
                    letter-spacing: 0.01em;
                }

                .tm-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 24px;
                }

                .tm-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .tm-avatar {
                    width: 44px; height: 44px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--primary);
                }

                .tm-author-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 1px;
                }

                .tm-author-meta {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.4);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .tm-company {
                    display: flex; align-items: center; gap: 4px;
                    color: var(--primary);
                }

                /* ── Controls ── */
                .tm-controls {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .tm-nav-btn {
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    color: #fff;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.25s ease;
                }

                .tm-nav-btn:hover {
                    background: var(--primary);
                    color: #000;
                    border-color: var(--primary);
                }

                .tm-progress {
                    display: flex;
                    gap: 6px;
                }

                .tm-dot {
                    width: 6px; height: 6px;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .tm-dot.active {
                    width: 20px;
                    background: var(--primary);
                }

                .tm-autoplay-toggle {
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.4);
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .tm-autoplay-toggle:hover {
                    color: var(--primary);
                }

                @media (max-width: 768px) {
                    .tm-card {
                        padding: 32px 24px;
                        max-width: 100%;
                    }
                    .tm-text {
                        font-size: 16px;
                    }
                    .tm-header {
                        padding-left: 14px;
                        margin-bottom: 30px;
                    }
                    .tm-viewport {
                        min-height: 400px;
                    }
                    .tm-quote-icon {
                        left: 24px; width: 36px; height: 36px;
                    }
                    .tm-nav-btn { display: none; }
                }
            `}</style>

            <div className="tm-header">
                <div className="tm-title-wrap">
                    <h3 className="tm-title">Success Stories</h3>
                    <div className="tm-subtitle">
                        <Sparkles size={12} style={{ display: 'inline', marginRight: '6px' }} />
                        Trusted by industry leaders
                    </div>
                </div>

                <div className="tm-controls">
                    <button className="tm-autoplay-toggle" onClick={() => setIsAutoPlaying(!isAutoPlaying)}>
                        {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <div className="tm-progress">
                        {testimonials.map((_, i) => (
                            <div 
                                key={i}
                                className={`tm-dot ${i === activeIndex ? 'active' : ''}`}
                                onClick={() => {
                                    setDirection(i > activeIndex ? 1 : -1)
                                    setActiveIndex(i)
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="tm-nav-btn" onClick={slidePrev}><ChevronLeft size={16} /></button>
                        <button className="tm-nav-btn" onClick={slideNext}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            <div className="tm-viewport">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={activeIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="tm-card"
                    >
                        <div className="tm-card-glow" />
                        <div className="tm-quote-icon">
                            <Quote size={28} />
                        </div>

                        <div className="tm-content">
                            <div className="tm-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={18} 
                                        className={`tm-star ${i < active.rating ? 'filled' : ''}`} 
                                    />
                                ))}
                            </div>

                            <blockquote className="tm-text">
                                "{active.text}"
                            </blockquote>

                            <div className="tm-footer">
                                <div className="tm-author">
                                    <div className="tm-avatar">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h5 className="tm-author-name">{active.name}</h5>
                                        <div className="tm-author-meta">
                                            <span>{active.role}</span>
                                            <span>•</span>
                                            <div className="tm-company">
                                                <Building size={11} />
                                                <span>{active.company}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="tm-date"
                                    style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', fontFamily: 'JetBrains Mono' }}
                                >
                                    {active.date}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

export default TestimonialsSection