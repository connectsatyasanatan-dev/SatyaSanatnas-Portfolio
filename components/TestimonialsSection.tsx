'use client'

import { Quote, Star, User, Building } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import portfolioAPI, { Testimonial } from '@/lib/api'
import { TestimonialsSectionSkeleton } from './AppSkeletons'

const TestimonialsSection = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)

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
    if (!loading && testimonials.length === 0) {
        return null
    }

    return (
        <section id="testimonials-section">
            <div className="section-header">
                <Quote />
                <h3 className="section-title">Client Testimonials</h3>
            </div>

            {loading ? (
                <TestimonialsSectionSkeleton />
            ) : (
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="testimonial-card"
                        >
                            {/* Background Quote */}
                            <div className="quote-bg">
                                <Quote />
                            </div>

                            {/* Rating */}
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, starIndex) => (
                                    <Star key={starIndex} className="star" />
                                ))}
                                <span className="rating-text">({testimonial.rating}/5)</span>
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="testimonial-text">
                                {testimonial.text}
                            </blockquote>

                            {/* Author Info */}
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    <User />
                                </div>
                                <div className="author-info">
                                    <h5 className="author-name">{testimonial.name}</h5>
                                    <div className="author-details">
                                        <span className="author-role">{testimonial.role}</span>
                                        <span>•</span>
                                        <div className="author-company">
                                            <Building />
                                            <span>{testimonial.company}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="testimonial-date">
                                    {testimonial.date}
                                </div>
                            </div>

                            {/* Hover Effect */}
                            <div className="testimonial-gradient"></div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="testimonials-cta"
            >
                <div className="cta-card">
                    <h4 className="cta-title">Want to work together?</h4>
                    <p className="cta-description">
                        Join the list of satisfied clients who have transformed their ideas into successful digital products.
                        Let's discuss how I can help bring your vision to life.
                    </p>
                    <div className="cta-buttons">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cta-btn"
                        >
                            Start a Project
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cta-btn secondary"
                        >
                            View More Reviews
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default TestimonialsSection