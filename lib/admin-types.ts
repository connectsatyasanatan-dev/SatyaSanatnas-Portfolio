// Admin Panel TypeScript Interfaces

export interface Skill {
    name: string;
    level: number;
    years: number;
}

export interface SkillCategory {
    title: string;
    skills: Skill[];
}

export interface Project {
    id: number;
    name: string;
    filename: string;
    version: string;
    downloads: string;
    description: string;
    technologies: string[];
    features: string[];
    stars: number;
    forks: number;
    demoUrl?: string;
    githubUrl?: string;
    status: 'active' | 'archived' | 'in-progress';
    featured: boolean;
}

export interface Experience {
    id?: number;
    title: string;
    company: string;
    location: string;
    period: string;
    duration: string;
    type: string;
    description: string;
    achievements: string[];
    technologies: string[];
    commit?: string;
    color?: string;
    badge?: string;
}

export interface Education {
    id?: number;
    degree: string;
    school: string;
    location: string;
    period: string;
    gpa?: string;
    relevant_courses: string[];
    achievements: string[];
    focus?: string;
    projects?: number;
    certification?: string;
    duration?: string;
}

export interface Certification {
    id?: number;
    name: string;
    issuer: string;
    date: string;
    credential?: string;
    validity?: string;
    badge?: string;
}

export interface Achievements {
    stats: {
        yearsOfExperience: number;
        projectsCompleted: number;
        clientsSatisfied: number;
        codeCommits: number;
        linesOfCode: number;
        bugsFixed: number;
        coffeeConsumed: number;
        hackathonsWon: number;
    };
    highlights: string[];
}

export interface Testimonial {
    id?: number;
    name: string;
    role: string;
    company: string;
    text: string;
    rating: number;
    date: string;
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    tags: string[];
    featured: boolean;
}

/** Contact form submission from portfolio Send Message section */
export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
}

export interface PersonalInfo {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    github: string;
    linkedin: string;
    twitter?: string;
    website?: string;
    experience?: string;
    role?: string;
    status?: string;
    availability?: string;
    resume?: string;
    timezone?: string;
    languages?: string[];
    portfolio?: string;
}

export interface DashboardStats {
    projects: number;
    featured_projects: number;
    experience_entries: number;
    testimonials: number;
    blog_posts: number;
    skills_categories: number;
    total_skills: number;
    contact_messages: number;
}

export interface RecentActivity {
    action: string;
    timestamp: string;
}

export interface DashboardData {
    stats: DashboardStats;
    recent_activity: RecentActivity[];
}

export interface AdminData {
    personalInfo: PersonalInfo;
    skills: Record<string, SkillCategory>;
    projects: Project[];
    experience: Experience[];
    testimonials: Testimonial[];
    blogPosts: BlogPost[];
    contactMessages: ContactMessage[];
    stats: DashboardStats;
    education?: Education[];
    certifications?: Certification[];
    achievements?: Achievements;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        username: string;
        email: string;
    };
}

export interface TokenResponse {
    success: boolean;
    message: string;
}