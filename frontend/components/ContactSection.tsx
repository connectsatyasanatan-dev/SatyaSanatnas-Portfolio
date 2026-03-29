'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, MapPin, Calendar, Coffee, Send } from 'lucide-react'
import portfolioAPI, { PersonalInfo } from '@/lib/api'
import { ContactSectionSkeleton } from './AppSkeletons'

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
    const [loadingInfo, setLoadingInfo] = useState(true)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            await portfolioAPI.submitContactForm(formData)
            setSubmitStatus('success')
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (error) {
            console.error('Contact form submission failed:', error)
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await portfolioAPI.getPersonalInfo()
                setPersonalInfo(data)
            } catch (e) {
                console.error('Failed to load personal info for contact section', e)
            } finally {
                setLoadingInfo(false)
            }
        }

        fetch()
    }, [])

    const contactMethods = [
        {
            icon: Mail,
            label: 'Email',
            value: personalInfo?.email || '',
            href: personalInfo?.email ? `mailto:${personalInfo.email}` : '#',
            color: 'text-primary'
        },
        {
            icon: Github,
            label: 'GitHub',
            value: personalInfo?.github || '',
            href: personalInfo?.github || '#',
            color: 'text-white'
        },
        {
            icon: Linkedin,
            label: 'LinkedIn',
            value: personalInfo?.linkedin || '',
            href: personalInfo?.linkedin || '#',
            color: 'text-blue-400'
        },
        {
            icon: Twitter,
            label: 'Twitter',
            value: personalInfo?.twitter || '',
            href: personalInfo?.twitter || '#',
            color: 'text-accent'
        }
    ]

    const availability = [
        {
            icon: MapPin,
            label: 'Location',
            value: personalInfo?.location || '',
            color: 'text-secondary'
        },
        {
            icon: Calendar,
            label: 'Availability',
            value: personalInfo?.availability || 'Available for new opportunities',
            color: 'text-green-400'
        },
        {
            icon: Coffee,
            label: 'Timezone',
            value: personalInfo?.timezone || 'PST (UTC-8)',
            color: 'text-yellow-400'
        }
    ]

    return (
        <AnimatePresence mode="wait">
            {loadingInfo ? (
                <motion.div 
                    key="skeleton-contact"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5 }}
                >
                    <ContactSectionSkeleton />
                </motion.div>
            ) : (
                <motion.section 
                    key="contact-content" 
                    id="contact-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <style>{`
                        .contact-form-section {
                            background: rgba(15, 23, 42, 0.6) !important;
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.08) !important;
                            border-radius: 16px !important;
                            padding: 24px !important;
                            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5) !important;
                            position: relative;
                            overflow: hidden;
                        }

                        @media (min-width: 768px) {
                            .contact-form-section {
                                padding: 36px !important;
                                border-radius: 20px !important;
                            }
                        }

                        .contact-form-section::before {
                            content: '';
                            position: absolute;
                            top: -100%; left: -100%; width: 300%; height: 300%;
                            background: radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.12) 0%, rgba(139, 92, 246, 0.12) 25%, transparent 50%);
                            animation: aurora 15s linear infinite;
                            z-index: 0;
                            pointer-events: none;
                        }

                        @keyframes aurora {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        .contact-form-section > * {
                            position: relative;
                            z-index: 1;
                        }

                        .contact-form-section .card-title {
                            color: white;
                            margin-bottom: 24px !important;
                            text-align: center;
                            font-size: 20px !important;
                            font-weight: 700 !important;
                            letter-spacing: -0.01em;
                            display: flex;
                            align-items: left;
                            justify-content: left;
                            gap: 8px;
                        }
                        
                        @media (min-width: 768px) {
                            .contact-form-section .card-title {
                                font-size: 24px !important;
                                margin-bottom: 32px !important;
                            }
                        }

                        .contact-form-section .card-title .bracket {
                            color: #f43f5e;
                            font-weight: 400;
                        }

                        .form-row {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                            margin-bottom: 16px;
                        }

                        @media (min-width: 768px) {
                            .form-row {
                                flex-direction: row;
                                gap: 20px;
                            }
                            .form-row .form-group {
                                flex: 1;
                                margin-bottom: 0;
                            }
                        }

                        .form-group {
                            margin-bottom: 16px;
                        }

                        .form-group label {
                            color: rgba(255, 255, 255, 0.6);
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.1em;
                            margin-bottom: 8px;
                            display: block;
                            transition: color 0.3s;
                        }

                        .form-group:focus-within label {
                            color: #f43f5e;
                        }

                        .form-input, .form-textarea {
                            width: 100%;
                            background: rgba(0, 0, 0, 0.25) !important;
                            border: 1px solid rgba(255, 255, 255, 0.1) !important;
                            border-radius: 10px !important;
                            padding: 12px 16px !important;
                            color: white !important;
                            font-size: 14px !important;
                            font-family: inherit;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                            box-shadow: inset 0 2px 4px rgba(0,0,0,0.2) !important;
                        }
                        
                        .form-textarea {
                            min-height: 120px;
                            resize: vertical;
                        }

                        .form-input::placeholder, .form-textarea::placeholder {
                            color: rgba(255, 255, 255, 0.3);
                        }

                        .form-input:focus, .form-textarea:focus {
                            outline: none !important;
                            background: rgba(0, 0, 0, 0.4) !important;
                            border-color: rgba(244, 63, 94, 0.6) !important;
                            box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.15), inset 0 2px 4px rgba(0,0,0,0.2) !important;
                            transform: translateY(-1px);
                        }

                        .form-submit {
                            width: 100%;
                            background: linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #3b82f6 100%) !important;
                            background-size: 200% auto !important;
                            color: white !important;
                            border: none !important;
                            border-radius: 10px !important;
                            padding: 14px 24px !important;
                            font-size: 14px !important;
                            font-weight: 700 !important;
                            text-transform: uppercase;
                            letter-spacing: 0.08em;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            cursor: pointer;
                            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                            box-shadow: 0 8px 20px -5px rgba(244, 63, 94, 0.4) !important;
                            position: relative;
                            overflow: hidden;
                            margin-top: 8px;
                        }

                        .form-submit::before {
                            content: '';
                            position: absolute;
                            top: 0; left: -100%; width: 50%; height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                            transform: skewX(-20deg);
                            transition: all 0.7s ease;
                        }

                        .form-submit:hover {
                            background-position: right center !important;
                            box-shadow: 0 15px 30px -5px rgba(139, 92, 246, 0.5) !important;
                            transform: translateY(-2px);
                        }

                        .form-submit:hover::before {
                            left: 200%;
                        }

                        .send-icon {
                            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                        }

                        .form-submit:hover .send-icon {
                            transform: translateX(4px) translateY(-4px) rotate(15deg) scale(1.1);
                        }

                        .form-submit.submitting {
                            opacity: 0.8 !important;
                            cursor: wait !important;
                            transform: scale(0.98) !important;
                        }
                    `}</style>
                    <div className="section-header">
                        <Mail className="w-5 h-5 text-primary" />
                        <h3 className="section-title">Contact & Availability</h3>
                    </div>

                    <div className="contact-grid">
                        {/* Contact Methods */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="contact-methods-card"
                        >
                            <h4 className="card-title">
                                <span className="bracket">{'{'}</span>
                                Connect with me
                                <span className="bracket">{'}'}</span>
                            </h4>

                            <div className="contact-methods">
                                {contactMethods.map((method, index) => {
                                    const IconComponent = method.icon
                                    return (
                                        <motion.a
                                            key={index}
                                            href={method.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            whileHover={{ x: 5 }}
                                            className="contact-method"
                                        >
                                            <div className="method-icon">
                                                <IconComponent className={`w-5 h-5 ${method.color}`} />
                                            </div>
                                            <div className="method-info">
                                                <div className="method-label">{method.label}</div>
                                                <div className="method-value">{method.value}</div>
                                            </div>
                                            <div className="method-arrow">
                                                <span>→</span>
                                            </div>
                                        </motion.a>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Availability Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="availability-card"
                        >
                            <h4 className="card-title">
                                <span className="bracket secondary">{'<'}</span>
                                Current Status
                                <span className="bracket secondary">{'/>'}</span>
                            </h4>

                            <div className="availability-info">
                                {availability.map((item, index) => {
                                    const IconComponent = item.icon
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                                            className="availability-item"
                                        >
                                            <div className="item-icon">
                                                <IconComponent className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                            <div className="item-info">
                                                <div className="item-label">{item.label}</div>
                                                <div className="item-value">{item.value}</div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Status indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="status-indicator"
                            >
                                <div className="status-header">
                                    <div className="status-dot available"></div>
                                    <span className="status-text">AVAILABLE FOR HIRE</span>
                                </div>
                                <p className="status-description">
                                    Currently seeking new opportunities in full-stack development,
                                    particularly interested in React, Node.js, and cloud architecture projects.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Quick contact CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="contact-cta"
                    >
                        <motion.a
                            href={personalInfo?.email ? `mailto:${personalInfo.email}?subject=Let's work together!` : '#'}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="cta-button"
                        >
                            <Mail className="w-5 h-5" />
                            Let's Build Something Amazing
                        </motion.a>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="contact-form-section"
                    >
                        <h4 className="card-title">
                            <span className="bracket">{'{'}</span>
                            Send Message
                            <span className="bracket">{'}'}</span>
                        </h4>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="form-input"
                                    placeholder="Project inquiry, collaboration, etc."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                    rows={5}
                                    className="form-textarea"
                                    placeholder="Tell me about your project or how we can work together..."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className={`form-submit ${isSubmitting ? 'submitting' : ''}`}
                            >
                                <Send className="w-5 h-5 send-icon" />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </motion.button>

                            {submitStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="form-message success"
                                >
                                    ✅ Message sent successfully! I'll get back to you soon.
                                </motion.div>
                            )}

                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="form-message error"
                                >
                                    ❌ Failed to send message. Please try again or email me directly.
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default ContactSection