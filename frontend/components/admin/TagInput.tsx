import React, { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
    tags: string[]
    onTagsChange: (newTags: string[]) => void
    placeholder?: string
    label?: string
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder = "Add tag...", label }) => {
    const [input, setInput] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            removeTag(tags.length - 1)
        }
    }

    const addTag = () => {
        const trimmed = input.trim()
        if (trimmed && !tags.includes(trimmed)) {
            onTagsChange([...tags, trimmed])
            setInput('')
        }
    }

    const removeTag = (index: number) => {
        onTagsChange(tags.filter((_, i) => i !== index))
    }

    return (
        <div className="admin-form-group">
            {label && <label className="admin-form-label">{label}</label>}
            <div className="admin-tag-input-container">
                {tags.map((tag, index) => (
                    <span key={index} className="admin-tag">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="admin-tag-remove"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    className="admin-tag-input-field"
                    placeholder={tags.length === 0 ? placeholder : ""}
                />
            </div>
            <p className="admin-field-hint">Press Enter or comma to add</p>
        </div>
    )
}

export default TagInput
