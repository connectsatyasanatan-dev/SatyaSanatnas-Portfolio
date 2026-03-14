'use client'

import { useState, KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'

interface TagListFieldProps {
    label: string
    value: string[]
    onChange: (items: string[]) => void
    placeholder?: string
    hint?: string
    /** For achievements (longer text) use more rows in paste area */
    variant?: 'default' | 'long'
}

export default function TagListField({
    label,
    value,
    onChange,
    placeholder = 'Type and press Enter to add',
    hint,
    variant = 'default'
}: TagListFieldProps) {
    const [inputValue, setInputValue] = useState('')
    const [showPaste, setShowPaste] = useState(false)
    const [pasteValue, setPasteValue] = useState('')

    const addItem = (item: string) => {
        const trimmed = item.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
    }

    const removeItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addItem(inputValue)
            setInputValue('')
        }
    }

    const handleAddClick = () => {
        addItem(inputValue)
        setInputValue('')
    }

    const applyPaste = () => {
        const lines = pasteValue
            .split(/\n/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
        const newItems = [...value]
        lines.forEach((line) => {
            if (!newItems.includes(line)) newItems.push(line)
        })
        onChange(newItems)
        setPasteValue('')
        setShowPaste(false)
    }

    return (
        <div className="admin-tag-list-field">
            <label className="admin-form-label">
                {label}
                {hint && <span className="admin-tag-list-hint">{hint}</span>}
            </label>

            {/* Chips */}
            {value.length > 0 && (
                <div className="admin-tag-list-chips">
                    {value.map((item, index) => (
                        <span key={`${index}-${item}`} className="admin-tag-chip">
                            <span className="admin-tag-chip-text">{item}</span>
                            <button
                                type="button"
                                className="admin-tag-chip-remove"
                                onClick={() => removeItem(index)}
                                aria-label={`Remove ${item}`}
                            >
                                <X />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Add one by one */}
            <div className="admin-tag-list-input-row">
                <input
                    type="text"
                    className="admin-form-input admin-tag-list-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    aria-label={`Add ${label}`}
                />
                <button
                    type="button"
                    className="admin-btn admin-btn-blue admin-tag-list-add-btn"
                    onClick={handleAddClick}
                    disabled={!inputValue.trim()}
                >
                    <Plus />
                    Add
                </button>
            </div>

            {/* Paste multiple */}
            {!showPaste ? (
                <button
                    type="button"
                    className="admin-tag-list-paste-toggle"
                    onClick={() => setShowPaste(true)}
                >
                    Paste multiple lines
                </button>
            ) : (
                <div className="admin-tag-list-paste-area">
                    <textarea
                        className="admin-textarea admin-tag-list-paste-textarea"
                        rows={variant === 'long' ? 4 : 2}
                        value={pasteValue}
                        onChange={(e) => setPasteValue(e.target.value)}
                        placeholder="Paste one item per line..."
                        aria-label="Paste multiple lines"
                    />
                    <div className="admin-tag-list-paste-actions">
                        <button
                            type="button"
                            className="admin-btn admin-btn-green"
                            onClick={applyPaste}
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            className="admin-btn admin-btn-gray"
                            onClick={() => {
                                setShowPaste(false)
                                setPasteValue('')
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
