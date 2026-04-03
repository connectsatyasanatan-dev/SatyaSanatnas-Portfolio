import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Fetch portfolio data from Flask backend (server-side)
async function fetchPortfolioContext(): Promise<string> {
    const BASE = 'http://localhost:5000/api';
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

        const allSkills = Object.values(sk as Record<string, { title: string; skills: { name: string }[] }>)
            .map(cat => `${cat.title}: ${cat.skills?.map((s: { name: string }) => s.name).join(', ')}`)
            .filter(Boolean)
            .join('\n');

        const topProjects = (Array.isArray(pr) ? pr : []).slice(0, 6)
            .map((proj: { name: string; description: string; technologies: string[]; status: string }) =>
                `- ${proj.name}: ${proj.description} [Tech: ${proj.technologies?.join(', ')}] [Status: ${proj.status}]`)
            .join('\n');

        const expText = (Array.isArray(ex) ? ex : [])
            .map((e: { title: string; company: string; period: string; description: string }) =>
                `- ${e.title} at ${e.company} (${e.period}): ${e.description}`)
            .join('\n');

        const eduText = (Array.isArray(ed) ? ed : [])
            .map((e: { degree: string; school: string; period: string }) =>
                `- ${e.degree} from ${e.school} (${e.period})`)
            .join('\n');

        const certText = (Array.isArray(ce) ? ce : [])
            .map((c: { name: string; issuer: string; date: string }) =>
                `- ${c.name} by ${c.issuer} (${c.date})`)
            .join('\n');

        const stats = ac?.stats || {};

        return `
PERSON: ${p.name || 'Developer'} | ${p.role || 'Full Stack Developer'} | ${p.location || ''}
BIO: ${p.bio || ''}
AVAILABILITY: ${p.availability || 'Open to opportunities'}
EMAIL: ${p.email || ''} | GITHUB: ${p.github || ''} | LINKEDIN: ${p.linkedin || ''}

SKILLS:
${allSkills || 'Not specified'}

PROJECTS:
${topProjects || 'No projects listed'}

EXPERIENCE:
${expText || 'Not specified'}

EDUCATION:
${eduText || 'Not specified'}

CERTIFICATIONS:
${certText || 'None listed'}

STATS: ${stats.projectsCompleted || 0} projects | ${stats.yearsOfExperience || 0} yrs exp | ${stats.clientsSatisfied || 0} clients | ${stats.codeCommits || 0} commits
        `.trim();
    } catch (e) {
        console.error('[Portfolio fetch error]', e);
        return 'Portfolio data temporarily unavailable.';
    }
}

export async function POST(request: NextRequest) {
    // Parse body ONCE — store it
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

    const apiKey = process.env.GROQ_API_KEY;

    // No API key — return fallback
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
        console.warn('[Chat] No GROQ_API_KEY set — using fallback');
        return NextResponse.json({ response: getFallback(message) });
    }

    try {
        const portfolioContext = await fetchPortfolioContext();

        const systemPrompt = `You are an intelligent, friendly AI assistant embedded in a developer portfolio website.
Your job is to help visitors learn about this developer and encourage them to connect or hire them.

PORTFOLIO DATA:
${portfolioContext}

RULES:
- Answer questions about this developer's skills, projects, experience, education, certifications, and hiring
- Be concise, warm, and professional
- Use bullet points and **bold** for clarity
- If portfolio data is empty/missing for a field, say "I don't have that detail right now — feel free to reach out directly!"
- Never fabricate information not in the portfolio data
- Keep responses under 250 words unless a detailed breakdown is requested
- End with a natural follow-up question or call-to-action`;

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
        if (!response) throw new Error('Empty response from Groq');

        return NextResponse.json({
            response,
            timestamp: new Date().toISOString(),
            model: 'llama-3.3-70b-versatile',
        });

    } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error('[Groq API error]', errMsg);

        // Return the actual error in dev so you can debug
        return NextResponse.json({
            response: getFallback(message),
            _debug: process.env.NODE_ENV === 'development' ? errMsg : undefined,
        });
    }
}

function getFallback(msg: string): string {
    const m = msg.toLowerCase();
    if (m.includes('project') || m.includes('work') || m.includes('built'))
        return `Check out the **Projects** section on this page for a full breakdown — each one includes tech stack, live demo, and GitHub links.\n\nAnything specific you're curious about?`;
    if (m.includes('skill') || m.includes('tech') || m.includes('stack'))
        return `The **Skills** section has the full tech stack breakdown. From frontend to backend, cloud to AI — it's all there.\n\nWant to know about a specific technology?`;
    if (m.includes('hire') || m.includes('job') || m.includes('available'))
        return `Open to exciting opportunities! 🚀 Full-time, freelance, or consulting — hit the **Contact** section to start a conversation.`;
    if (m.includes('contact') || m.includes('reach') || m.includes('email'))
        return `Scroll to the **Contact** section at the bottom — response time is usually within 24 hours!`;
    return `I can help you explore this portfolio! Ask me about:\n\n• **Projects** built\n• **Skills** & tech stack\n• **Experience** & background\n• **Hiring** availability\n\nWhat would you like to know?`;
}
