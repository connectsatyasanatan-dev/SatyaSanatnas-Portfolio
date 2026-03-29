'use client'

import { useState } from 'react'
import ModalAlert from '@/components/admin/ModalAlert'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import ErrorAlert from '@/components/admin/ErrorAlert'

const TestPage = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [showInfoModal, setShowInfoModal] = useState(false)
    const [showWarningModal, setShowWarningModal] = useState(false)

    const handleDelete = () => {
        console.log('Item deleted')
        setShowConfirmDialog(false)
    }

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-header-left">
                        <div className="admin-logo">
                            <span>🧪</span>
                        </div>
                        <h1 className="admin-header-title">Admin Panel Test</h1>
                    </div>
                </div>
            </header>

            <div className="admin-layout-main">
                <nav className="admin-sidebar">
                    <ul className="admin-nav-list">
                        <li>
                            <button className="admin-nav-item active">
                                <span>Test Components</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <main className="admin-content">
                    <div className="admin-section-header">
                        <div className="admin-section-title-wrapper">
                            <h2 className="admin-section-title">Component Testing</h2>
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3 className="admin-form-title">Test Modal Alerts</h3>

                        <div className="admin-form-actions">
                            <button
                                onClick={() => setShowSuccessModal(true)}
                                className="admin-btn admin-btn-green"
                            >
                                Show Success Modal
                            </button>
                            <button
                                onClick={() => setShowErrorModal(true)}
                                className="admin-btn admin-btn-red"
                            >
                                Show Error Modal
                            </button>
                            <button
                                onClick={() => setShowInfoModal(true)}
                                className="admin-btn admin-btn-blue"
                            >
                                Show Info Modal
                            </button>
                            <button
                                onClick={() => setShowWarningModal(true)}
                                className="admin-btn admin-btn-yellow"
                            >
                                Show Warning Modal
                            </button>
                            <button
                                onClick={() => setShowConfirmDialog(true)}
                                className="admin-btn admin-btn-red"
                            >
                                Show Confirm Dialog
                            </button>
                        </div>

                        <div className="admin-divider"></div>

                        <h3 className="admin-form-title">Test Error Alerts</h3>

                        <ErrorAlert
                            message="This is a success message"
                            type="success"
                        />
                        <ErrorAlert
                            message="This is an error message"
                            type="error"
                        />
                        <ErrorAlert
                            message="This is a warning message"
                            type="warning"
                        />
                        <ErrorAlert
                            message="This is an info message"
                            type="info"
                        />

                        <div className="admin-divider"></div>

                        <h3 className="admin-form-title">Test Form Elements</h3>

                        <div className="admin-form-grid">
                            <div className="admin-form-group">
                                <label className="admin-form-label required">Text Input</label>
                                <input
                                    type="text"
                                    className="admin-form-input"
                                    placeholder="Enter text here"
                                />
                                <div className="admin-form-error">
                                    This field is required
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Textarea</label>
                                <textarea
                                    className="admin-textarea"
                                    rows={3}
                                    placeholder="Enter multiline text"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-form-label">Select</label>
                                <select className="admin-select">
                                    <option value="">Select an option</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label className="admin-checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        className="admin-checkbox"
                                    />
                                    <span className="admin-checkbox-label">Checkbox option</span>
                                </label>
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button className="admin-btn admin-btn-blue">
                                Submit Form
                            </button>
                            <button className="admin-btn admin-btn-gray">
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="admin-card admin-card-hover">
                        <h3 className="admin-form-title">Hover Card Test</h3>
                        <p className="admin-item-content">
                            This card has a hover effect. Try hovering over it!
                        </p>
                    </div>

                    <div className="admin-items-grid">
                        <div className="admin-item-card admin-card-hover">
                            <div className="admin-item-header">
                                <div>
                                    <h3 className="admin-item-title">Project 1</h3>
                                    <p className="admin-testimonial-role">Web Application</p>
                                </div>
                                <div className="admin-item-actions">
                                    <button className="admin-btn-icon edit">
                                        Edit
                                    </button>
                                    <button className="admin-btn-icon delete">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="admin-item-content">
                                A responsive web application built with React and TypeScript.
                            </p>
                        </div>

                        <div className="admin-item-card admin-card-hover">
                            <div className="admin-item-header">
                                <div>
                                    <h3 className="admin-item-title">Project 2</h3>
                                    <p className="admin-testimonial-role">Mobile App</p>
                                </div>
                                <div className="admin-item-actions">
                                    <button className="admin-btn-icon edit">
                                        Edit
                                    </button>
                                    <button className="admin-btn-icon delete">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="admin-item-content">
                                A cross-platform mobile application using React Native.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <ModalAlert
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Success!"
                message="Your action was completed successfully."
                type="success"
                confirmText="OK"
                showCancel={false}
            />

            <ModalAlert
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Error!"
                message="Something went wrong. Please try again."
                type="error"
                confirmText="OK"
                showCancel={false}
            />

            <ModalAlert
                isOpen={showInfoModal}
                onClose={() => setShowInfoModal(false)}
                title="Information"
                message="This is an informational message."
                type="info"
                confirmText="OK"
                showCancel={false}
            />

            <ModalAlert
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
                title="Warning!"
                message="This action cannot be undone."
                type="warning"
                confirmText="Proceed"
                cancelText="Cancel"
            />

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                title="Confirm Delete"
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                type="delete"
            />
        </div>
    )
}

export default TestPage