import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Portfolio data types ──────────────────────────────────
interface PortfolioData {
    name: string;
    role: string;
    bio: string;
    location: string;
    email: string;
    github: string;
    linkedin: string;
    availability: string;
    skills: Record<string, { title: string; skills: { name: string; level?: number }[] }>;
    projects: { name: string; description: string; technologies: string[]; status: string; featured?: boolean; demoUrl?: string; githubUrl?: string }[];
    experience: { title: string; company: string; period: string; description: string; achievements?: string[] }[];
    education: { degree: string; school: string; period: string; gpa?: string }[];
    certifications: { name: string; issuer: string; date: string }[];
    stats: { projectsCompleted: number; yearsOfExperience: number; clientsSatisfied: number; codeCommits: number };
}

// ── Fetch all portfolio data from Flask ───────────────────
async function fetchPortfolioData(): Promise<PortfolioData> {
    const BASE = 'http://localhost:5000/api';
    const empty: PortfolioData = {
        name: '', role: '', bio: '', location: '', email: '',
        github: '', linkedin: '', availability: '',
        skills: {}, projects: [], experience: [],
        education: [], certifications: [],
        stats: { projectsCompleted: 0, yearsOfExperience: 0, clientsSatisfied: 0, codeCommits: 0 },
    };

    try {
        const [personal, skills, projects, experience, education, certs, achievements] =
            await Promise.allSettled([
                fetch(`${BASE}/personal-info`, { cache: 'no-store' }).then(r => r.json()),
                fetch(`${BASE}/skills`, { cache: 'no-store' }).then(r => r.json()),
                fetch(`${BASE}/projects`, { cache: 'no-store' }).then(r => r.json()),
                fetch(`${BASE}/experience`, { cache: 'no-store' }).then(r => r.json()),
                fetch(`${BASE}/education`, { cache: 'no-store' }).then(r => r.json()),
                fetch(`${BASE}/certifications`, { cache: 'no-store' }).then(r => r.json()),
                fetch(`${BASE}/achievements`, { cache: 'no-store' }).then(r => r.json()),
            ]);

        const p = personal.status === 'fulfilled' ? personal.value : {};
        const sk = skills.status === 'fulfilled' ? skills.value : {};
        const pr = projects.status === 'fulfilled' ? projects.value : [];
        const ex = experience.status === 'fulfilled' ? experience.value : [];
        const ed = education.status === 'fulfilled' ? education.value : [];
        const ce = certs.status === 'fulfilled' ? certs.value : [];
        const ac = achievements.status === 'fulfilled' ? achievements.value : {};

        return {
            name: p.name || empty.name,
            role: p.role || empty.role,
            bio: p.bio || empty.bio,
            location: p.location || empty.location,
            email: p.email || empty.email,
            github: p.github || empty.github,
            linkedin: p.linkedin || empty.linkedin,
            availability: p.availability || empty.availability,
            skills: typeof sk === 'object' && !Array.isArray(sk) ? sk : {},
            projects: Array.isArray(pr) ? pr : [],
            experience: Array.isArray(ex) ? ex : [],
            education: Array.isArray(ed) ? ed : [],
            certifications: Array.isArray(ce) ? ce : [],
            stats: ac?.stats || empty.stats,
        };
    } catch (e) {
        console.error('[Portfolio fetch error]', e);
        return empty;
    }
}

// ── Build AI system prompt from portfolio data ────────────
function buildSystemPrompt(d: PortfolioData): string {
    const allSkills = Object.values(d.skills)
        .map(cat => `${cat.title}: ${cat.skills.map(s => s.name).join(', ')}`)
        .filter(Boolean).join('\n');

    const topProjects = d.projects.slice(0, 8)
        .map(p => `- **${p.name}**: ${p.description} | Tech: ${p.technologies?.join(', ')} | Status: ${p.status}${p.featured ? ' ⭐' : ''}`)
        .join('\n');

    const expText = d.experience
        .map(e => `- ${e.title} at ${e.company} (${e.period}): ${e.description}`)
        .join('\n');

    const eduText = d.education
        .map(e => `- ${e.degree} from ${e.school} (${e.period})${e.gpa ? ` | GPA: ${e.gpa}` : ''}`)
        .join('\n');

    const certText = d.certifications
        .map(c => `- ${c.name} by ${c.issuer} (${c.date})`)
        .join('\n');

    return `You are Zentara, an intelligent AI assistant representing ${d.name || "this developer"}.
You are calm, smart, and helpful. Your role is to warmly help visitors learn about ${d.name || "this developer"} and encourage them to connect or hire.

=== PORTFOLIO DATA ===
NAME: ${d.name}
ROLE: ${d.role}
BIO: ${d.bio}
LOCATION: ${d.location}
AVAILABILITY: ${d.availability || 'Open to opportunities'}
EMAIL: ${d.email}
GITHUB: ${d.github}
LINKEDIN: ${d.linkedin}

SKILLS:
${allSkills || 'See Skills section on the portfolio'}

PROJECTS:
${topProjects || 'See Projects section on the portfolio'}

EXPERIENCE:
${expText || 'See Experience section on the portfolio'}

EDUCATION:
${eduText || 'See Education section on the portfolio'}

CERTIFICATIONS:
${certText || 'See Certifications section on the portfolio'}

STATS: ${d.stats.projectsCompleted} projects completed | ${d.stats.yearsOfExperience} years experience | ${d.stats.clientsSatisfied} clients satisfied | ${d.stats.codeCommits} code commits

=== INSTRUCTIONS ===
- Always answer warmly and professionally about ${d.name || "this developer"}
- Use the portfolio data above to give specific, accurate answers
- Use **bold** and bullet points for clarity
- If a specific detail is missing, guide them to the relevant section on the page
- Never say "AI is down", never mention Groq, LLM, or any underlying technology
- Never reveal you are built on any specific AI model or service
- If asked what you are, say: "I'm Zentara, Satya's personal AI assistant"
- Keep responses concise (under 250 words) unless detail is requested
- End with a helpful follow-up question or call-to-action`;
}

// ── Smart data-rich fallback (no AI needed) ───────────────
function buildSmartFallback(msg: string, d: PortfolioData): string {
    const m = msg.toLowerCase();
    const name = d.name || 'this developer';

    // Projects
    if (m.includes('project') || m.includes('work') || m.includes('built') || m.includes('portfolio') || m.includes('app')) {
        const featured = d.projects.filter(p => p.featured).slice(0, 3);
        const list = featured.length > 0 ? featured : d.projects.slice(0, 3);
        if (list.length > 0) {
            const items = list.map(p => `• **${p.name}** — ${p.description}\n  Tech: ${p.technologies?.slice(0, 4).join(', ')}`).join('\n');
            return `Here are some of ${name}'s notable projects:\n\n${items}\n\nYou can explore all projects with live demos and GitHub links in the **Projects** section. Want to know more about any specific one?`;
        }
        return `${name} has worked on some exciting projects! Head over to the **Projects** section on this page to see them all — each one includes the tech stack, live demo, and GitHub link.\n\nAnything specific you're looking for?`;
    }

    // Skills
    if (m.includes('skill') || m.includes('tech') || m.includes('stack') || m.includes('language') || m.includes('framework') || m.includes('know')) {
        const categories = Object.values(d.skills).filter(cat => cat.skills?.length > 0);
        if (categories.length > 0) {
            const items = categories.slice(0, 4).map(cat =>
                `• **${cat.title}**: ${cat.skills.slice(0, 5).map(s => s.name).join(', ')}`
            ).join('\n');
            return `${name}'s tech stack covers a wide range:\n\n${items}\n\nThe **Skills** section has the full breakdown. Any specific technology you'd like to know more about?`;
        }
        return `${name} has a strong and diverse tech stack! Check out the **Skills** section for the full breakdown — from frontend to backend, cloud, and AI/ML.\n\nAnything specific you're curious about?`;
    }

    // Experience
    if (m.includes('experience') || m.includes('background') || m.includes('career') || m.includes('work history') || m.includes('job')) {
        if (d.experience.length > 0) {
            const items = d.experience.slice(0, 2).map(e =>
                `• **${e.title}** at ${e.company} (${e.period})`
            ).join('\n');
            return `Here's a glimpse of ${name}'s professional journey:\n\n${items}\n\nThe **Experience** section has the full details including key achievements. Want to know more?`;
        }
        return `${name} has a solid professional background! The **Experience** section on this page covers the full career timeline with roles, companies, and key achievements.`;
    }

    // Education
    if (m.includes('education') || m.includes('degree') || m.includes('university') || m.includes('college') || m.includes('study')) {
        if (d.education.length > 0) {
            const items = d.education.map(e => `• **${e.degree}** — ${e.school} (${e.period})`).join('\n');
            return `${name}'s academic background:\n\n${items}\n\nCheck the **Education** section for more details!`;
        }
        return `You can find ${name}'s academic qualifications in the **Education** section on this page.`;
    }

    // Certifications
    if (m.includes('certif') || m.includes('certificate') || m.includes('badge') || m.includes('credential')) {
        if (d.certifications.length > 0) {
            const items = d.certifications.slice(0, 3).map(c => `• **${c.name}** by ${c.issuer}`).join('\n');
            return `${name} holds these professional certifications:\n\n${items}\n\nSee all certifications in the **Certifications** section!`;
        }
        return `${name}'s professional certifications are listed in the **Certifications** section on this page.`;
    }

    // Hire / availability
    if (m.includes('hire') || m.includes('available') || m.includes('recruit') || m.includes('opportunity') || m.includes('freelance') || m.includes('job')) {
        const avail = d.availability || 'open to exciting opportunities';
        return `${name} is ${avail}! 🚀\n\n**Open to:**\n• Full-time roles (remote / hybrid)\n• Freelance & contract projects\n• Technical consulting\n• Startup collaborations\n\nThe best way to connect is through the **Contact** section below — response is usually within 24 hours. Feel free to reach out!`;
    }

    // Contact
    if (m.includes('contact') || m.includes('reach') || m.includes('email') || m.includes('connect') || m.includes('message')) {
        const parts = [];
        if (d.email) parts.push(`• **Email**: ${d.email}`);
        if (d.linkedin) parts.push(`• **LinkedIn**: ${d.linkedin}`);
        if (d.github) parts.push(`• **GitHub**: ${d.github}`);
        const contactInfo = parts.length > 0 ? parts.join('\n') : '• Use the **Contact** section below';
        return `Getting in touch with ${name} is easy:\n\n${contactInfo}\n\nOr simply scroll to the **Contact** section at the bottom of this page — response time is usually within 24 hours. Don't hesitate to reach out!`;
    }

    // AI / ML
    if (m.includes('ai') || m.includes('machine learning') || m.includes('ml') || m.includes('llm') || m.includes('nlp')) {
        const aiProjects = d.projects.filter(p =>
            p.technologies?.some(t => ['python', 'tensorflow', 'pytorch', 'openai', 'langchain', 'nlp', 'ml', 'ai'].includes(t.toLowerCase())) ||
            p.name?.toLowerCase().includes('ai') || p.description?.toLowerCase().includes('ai')
        ).slice(0, 2);
        if (aiProjects.length > 0) {
            const items = aiProjects.map(p => `• **${p.name}** — ${p.description}`).join('\n');
            return `${name} has hands-on AI/ML experience! Here are some related projects:\n\n${items}\n\nCheck the **Projects** and **Skills** sections for the full AI/ML work. Want to know more?`;
        }
        return `AI & ML is part of ${name}'s skill set! Check the **Skills** and **Projects** sections to see the full scope of AI-related work.`;
    }

    // About / who
    if (m.includes('about') || m.includes('who') || m.includes('tell me') || m.includes('introduce') || m.includes('yourself')) {
        const bio = d.bio ? d.bio : `a ${d.role || 'full-stack developer'} passionate about building great software`;
        const statsLine = d.stats.projectsCompleted > 0
            ? `\n\n📊 **${d.stats.projectsCompleted}** projects | **${d.stats.yearsOfExperience}** yrs experience | **${d.stats.clientsSatisfied}** happy clients`
            : '';
        return `Meet **${name}** — ${bio}${statsLine}\n\nFeel free to explore the portfolio or ask me anything specific — projects, skills, experience, or how to get in touch!`;
    }

    // Hello / greeting
    if (m.includes('hello') || m.includes('hi') || m.includes('hey') || m.includes('hii') || m.includes('helo')) {
        return `Hey there! 👋 Welcome to ${name}'s portfolio.\n\nI'm here to help you learn all about ${name}'s work and skills. You can ask me about:\n\n• **Projects** — what's been built\n• **Skills** — the full tech stack\n• **Experience** — career background\n• **Hiring** — availability & contact\n\nWhat would you like to explore?`;
    }

    // Default
    return `Great question! I'd love to help you learn more about ${name}.\n\nYou can ask me about:\n• **Projects** — what's been built\n• **Skills** — tech stack & expertise\n• **Experience** — career background\n• **Education** & certifications\n• **Hiring** — availability & how to connect\n\nWhat would you like to know?`;
}

// ── Main POST handler ─────────────────────────────────────
export async function POST(request: NextRequest) {
    let message = '';
    let history: { role: string; content: string }[] = [];

    try {
        const body = await request.json();
        message = body.message || '';
        history = body.history || [];
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!message || typeof message !== 'string') {
        return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Always fetch portfolio data first — used by both AI and fallback
    const portfolioData = await fetchPortfolioData();

    const apiKey = process.env.GROQ_API_KEY;

    // Try Groq AI first
    if (apiKey && apiKey !== 'your_groq_api_key_here') {
        try {
            const systemPrompt = buildSystemPrompt(portfolioData);
            const recentHistory = history.slice(-6).map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
            }));

            const completion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...recentHistory,
                    { role: 'user', content: message },
                ],
                max_tokens: 450,
                temperature: 0.7,
                top_p: 0.9,
            });

            const response = completion.choices[0]?.message?.content;
            if (response) {
                return NextResponse.json({
                    response,
                    fallback: false,
                    timestamp: new Date().toISOString(),
                });
            }
        } catch (err: unknown) {
            const errMsg = err instanceof Error ? err.message : String(err);
            console.error('[Groq error — using data-rich fallback]', errMsg);
            // Fall through to smart fallback below
        }
    }

    // Smart fallback — uses real portfolio data, seamless to user
    const response = buildSmartFallback(message, portfolioData);
    return NextResponse.json({ response, fallback: true });
}
