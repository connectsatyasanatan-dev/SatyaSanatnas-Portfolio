// Form validation utilities for admin panel

export interface ValidationError {
    field: string
    message: string
}

export interface ValidationResult {
    isValid: boolean
    errors: ValidationError[]
}

export class Validator {
    private errors: ValidationError[] = []

    required(value: any, field: string, message?: string): this {
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            this.errors.push({
                field,
                message: message || `${field} is required`
            })
        }
        return this
    }

    email(value: string, field: string, message?: string): this {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
            this.errors.push({
                field,
                message: message || `${field} must be a valid email address`
            })
        }
        return this
    }

    minLength(value: string, min: number, field: string, message?: string): this {
        if (value && value.length < min) {
            this.errors.push({
                field,
                message: message || `${field} must be at least ${min} characters`
            })
        }
        return this
    }

    maxLength(value: string, max: number, field: string, message?: string): this {
        if (value && value.length > max) {
            this.errors.push({
                field,
                message: message || `${field} must be at most ${max} characters`
            })
        }
        return this
    }

    min(value: number, min: number, field: string, message?: string): this {
        if (value !== undefined && value !== null && value < min) {
            this.errors.push({
                field,
                message: message || `${field} must be at least ${min}`
            })
        }
        return this
    }

    max(value: number, max: number, field: string, message?: string): this {
        if (value !== undefined && value !== null && value > max) {
            this.errors.push({
                field,
                message: message || `${field} must be at most ${max}`
            })
        }
        return this
    }

    url(value: string, field: string, message?: string): this {
        try {
            if (value) {
                new URL(value)
            }
        } catch {
            this.errors.push({
                field,
                message: message || `${field} must be a valid URL`
            })
        }
        return this
    }

    pattern(value: string, pattern: RegExp, field: string, message?: string): this {
        if (value && !pattern.test(value)) {
            this.errors.push({
                field,
                message: message || `${field} is invalid`
            })
        }
        return this
    }

    getResult(): ValidationResult {
        return {
            isValid: this.errors.length === 0,
            errors: [...this.errors]
        }
    }

    clear() {
        this.errors = []
    }
}

// Common validation rules
export const validatePersonalInfo = (data: any): ValidationResult => {
    const validator = new Validator()

    validator.required(data.name, 'name')
        .minLength(data.name, 2, 'name')
        .maxLength(data.name, 100, 'name')

        .required(data.title, 'title')
        .minLength(data.title, 2, 'title')
        .maxLength(data.title, 100, 'title')

        .required(data.email, 'email')
        .email(data.email, 'email')

        .required(data.phone, 'phone')
        .pattern(data.phone, /^[\d\s\-\+\(\)]+$/, 'phone', 'Phone number is invalid')

        .required(data.location, 'location')
        .minLength(data.location, 2, 'location')

        .required(data.bio, 'bio')
        .minLength(data.bio, 10, 'bio')
        .maxLength(data.bio, 500, 'bio')

        .required(data.github, 'github')
        .url(data.github, 'github')

        .required(data.linkedin, 'linkedin')
        .url(data.linkedin, 'linkedin')

    return validator.getResult()
}

export const validateSkill = (data: any): ValidationResult => {
    const validator = new Validator()

    validator.required(data.name, 'name')
        .minLength(data.name, 2, 'name')
        .maxLength(data.name, 50, 'name')

        .required(data.level, 'level')
        .min(data.level, 0, 'level')
        .max(data.level, 100, 'level')

        .required(data.years, 'years')
        .min(data.years, 0, 'years')
        .max(data.years, 50, 'years')

    return validator.getResult()
}

export const validateProject = (data: any): ValidationResult => {
    const validator = new Validator()

    validator.required(data.name, 'name')
        .minLength(data.name, 2, 'name')
        .maxLength(data.name, 100, 'name')

        .required(data.description, 'description')
        .minLength(data.description, 10, 'description')
        .maxLength(data.description, 500, 'description')

        .required(data.technologies, 'technologies')

        .required(data.features, 'features')

    return validator.getResult()
}

// Helper function to format validation errors for display
export const formatValidationErrors = (errors: ValidationError[]): string => {
    return errors.map(error => `${error.field}: ${error.message}`).join('\n')
}