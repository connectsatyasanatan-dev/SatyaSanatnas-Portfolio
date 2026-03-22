// Public API client for portfolio data
import apiClient from './apiClient'

export interface PersonalInfo {
    name: string
    role: string
    title: string
    location: string
    status: string
    experience: string
    email: string
    phone: string
    github: string
    linkedin: string
    twitter: string
    portfolio: string
    resume: string
    bio: string
    availability: string
    timezone: string
    languages: string[]
}

export interface Skill {
    name: string
    level: number
    years: number
}

export interface SkillCategory {
    title: string
    skills: Skill[]
}

export interface Project {
    id: number
    name: string
    filename: string
    version: string
    downloads: string
    description: string
    technologies: string[]
    features: string[]
    stars: number
    forks: number
    demoUrl: string
    githubUrl: string
    status: string
    featured: boolean
    terminalOutput?: string[]
}

export interface Experience {
    id: number
    title: string
    company: string
    location: string
    period: string
    duration: string
    type: string
    description: string
    achievements: string[]
    technologies: string[]
    commit?: string
    color?: string
    badge?: string
}

export interface Education {
    id?: number
    degree: string
    school: string
    location: string
    period: string
    gpa?: string
    relevant_courses: string[]
    achievements: string[]
    focus?: string
    projects?: number
    certification?: string
    duration?: string
}

export interface Certification {
    id?: number
    name: string
    issuer: string
    date: string
    credential?: string
    validity?: string
    badge?: string
}

export interface Achievements {
    stats: {
        yearsOfExperience: number
        projectsCompleted: number
        clientsSatisfied: number
        codeCommits: number;
        linesOfCode: number
        bugsFixed: number
        coffeeConsumed: number
        hackathonsWon: number
    }
    highlights: string[]
}

export interface Testimonial {
    id: number
    name: string
    role: string
    company: string
    text: string
    rating: number
    date: string
}

export interface BlogPost {
    id: number
    title: string
    excerpt: string
    date: string
    readTime: string
    tags: string[]
    featured: boolean
}

export interface PortfolioStats {
    projects_count: number
    featured_projects: number
    total_stars: number
    total_forks: number
    experience_years: number
    skills_count: number
    testimonials_count: number
    blog_posts_count: number
    clients_satisfied: number
    code_commits: number
    lines_of_code: number
    coffee_consumed: number
}


class PortfolioAPI {
    private async request<T>(endpoint: string): Promise<T> {
        try {
            const response = await apiClient.get<T>(endpoint)
            return response.data
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error)
            throw error
        }
    }

    async getPersonalInfo(): Promise<PersonalInfo> {
        return this.request<PersonalInfo>('/personal-info')
    }

    async getSkills(): Promise<Record<string, SkillCategory>> {
        return this.request<Record<string, SkillCategory>>('/skills')
    }

    async getProjects(featured?: boolean): Promise<Project[]> {
        const endpoint = featured ? '/projects?featured=true' : '/projects'
        return this.request<Project[]>(endpoint)
    }

    async getExperience(): Promise<Experience[]> {
        return this.request<Experience[]>('/experience')
    }

    async getEducation(): Promise<Education[]> {
        return this.request<Education[]>('/education')
    }

    async getCertifications(): Promise<Certification[]> {
        return this.request<Certification[]>('/certifications')
    }

    async getAchievements(): Promise<Achievements> {
        return this.request<Achievements>('/achievements')
    }

    async getTestimonials(): Promise<Testimonial[]> {
        return this.request<Testimonial[]>('/testimonials')
    }

    async getBlogPosts(featured?: boolean): Promise<BlogPost[]> {
        const endpoint = featured ? '/blog?featured=true' : '/blog'
        return this.request<BlogPost[]>(endpoint)
    }

    async getStats(): Promise<PortfolioStats> {
        return this.request<PortfolioStats>('/stats')
    }

    async submitContactForm(data: { name: string; email: string; subject?: string; message: string }) {
        try {
            const response = await apiClient.post('/contact', data)
            return response.data
        } catch (error) {
            console.error('Contact form error:', error)
            throw error
        }
    }

    async trackVisit(data: {
        visitorId: string;
        sessionId: string;
        deviceType: string;
        browser: string;
        referrer: string;
        pagePath: string;
    }) {
        try {
            const response = await apiClient.post('/track-visit', data)
            return response.data
        } catch (error) {
            console.error('Track visit error:', error)
        }
    }

    async trackDuration(data: { sessionId: string; duration: number }) {
        try {
            const response = await apiClient.post('/track-duration', data)
            return response.data
        } catch (error) {
            // Silently fail for duration tracking as it happens in background
        }
    }
}

export const portfolioAPI = new PortfolioAPI()
export default portfolioAPI
