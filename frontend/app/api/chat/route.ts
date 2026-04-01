import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();
        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }

        const response = generateResponse(message.toLowerCase().trim());
        return NextResponse.json({ response, timestamp: new Date().toISOString() });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

function generateResponse(m: string): string {
    // ── Projects ──────────────────────────────────────────────
    if (match(m, ['project', 'portfolio', 'built', 'made', 'created', 'work'])) {
        return `Here's a snapshot of Satya's key projects:\n\n**🤖 AI Chatbot Platform**\n• React + Flask + NLP pipeline\n• Context-aware streaming responses\n• Glassmorphism dark UI (you're using it!)\n\n**🌐 Portfolio Website**\n• Next.js 14 + TypeScript + Flask REST API\n• Admin dashboard with analytics\n• SEO optimized, fully responsive\n\n**⚙️ Full-Stack Web Apps**\n• Auth systems, REST APIs, DB design\n• Cloud deployment on AWS & Vercel\n• CI/CD pipelines with Docker\n\nWant a deep dive into any of these?`;
    }

    // ── Skills / Tech ─────────────────────────────────────────
    if (match(m, ['skill', 'tech', 'stack', 'language', 'framework', 'tool', 'know', 'use'])) {
        return `Satya's tech stack is broad and modern:\n\n**Frontend**\n• React, Next.js 14, TypeScript\n• Tailwind CSS, Framer Motion\n\n**Backend**\n• Python, Flask, FastAPI, Node.js\n• REST APIs, WebSockets\n\n**AI / ML**\n• NLP, LLM integrations, OpenAI API\n• scikit-learn, pandas, LangChain\n\n**DevOps & Cloud**\n• Docker, AWS, Vercel, Git CI/CD\n\n**Databases**\n• PostgreSQL, MongoDB, SQLite, Redis\n\nAlways learning — what area interests you most?`;
    }

    // ── AI / ML ───────────────────────────────────────────────
    if (match(m, ['ai', 'ml', 'machine learning', 'nlp', 'llm', 'gpt', 'openai', 'model', 'neural', 'deep learning', 'chatbot'])) {
        return `AI is one of Satya's strongest areas:\n\n**🧠 What he's built:**\n• Conversational AI assistants (like this one!)\n• NLP pipelines for text classification\n• LLM API integrations (OpenAI, Gemini)\n• Intelligent recommendation systems\n• Semantic search with vector embeddings\n\n**🔧 Tools & frameworks:**\n• Python, scikit-learn, pandas, NumPy\n• LangChain, OpenAI API, HuggingFace\n• FastAPI for AI microservices\n• Pinecone / ChromaDB for vector search\n\nHe believes AI should feel natural and useful — not gimmicky. Want to know about a specific project?`;
    }

    // ── Experience / About ────────────────────────────────────
    if (match(m, ['experience', 'background', 'about', 'who', 'bio', 'yourself', 'satya', 'tell me'])) {
        return `Satya is a full-stack developer with a strong focus on AI-integrated web experiences.\n\n**What sets him apart:**\n• Builds end-to-end — from UI to deployment\n• Obsessed with clean, performant code\n• Fast learner who ships quickly\n• Strong eye for modern UI/UX design\n• Communicates clearly with clients & teams\n\nHe's worked across personal projects, freelance clients, and open-source contributions — always pushing the quality bar higher.\n\nCurious about anything specific?`;
    }

    // ── Hire / Job ────────────────────────────────────────────
    if (match(m, ['hire', 'job', 'opportunity', 'recruit', 'position', 'role', 'work with', 'team', 'onboard', 'available'])) {
        return `Satya is open to exciting opportunities! 🚀\n\n**Available for:**\n• Full-time roles (remote / hybrid)\n• Freelance & contract projects\n• Technical consulting\n• Startup collaborations\n\n**He brings:**\n• Fast onboarding & clear communication\n• Full-stack + AI expertise\n• Ownership mindset — ships with quality\n• Clean, documented, maintainable code\n\nBest move? Hit the **Contact** section below — he typically responds within 24 hours.\n\nWant me to tell you more about his work first?`;
    }

    // ── Contact ───────────────────────────────────────────────
    if (match(m, ['contact', 'reach', 'email', 'message', 'connect', 'get in touch', 'dm', 'linkedin'])) {
        return `Getting in touch with Satya is easy:\n\n**📬 Contact Section** — scroll to the bottom of this page\n**⚡ Response time** — usually within 24 hours\n**💬 Open to** — any project size or collaboration type\n\nWhen you reach out, mention:\n• What you're building or need help with\n• Timeline & scope\n• Tech stack (if you have one in mind)\n\nHe loves ambitious ideas — don't hold back!`;
    }

    // ── React / Frontend ──────────────────────────────────────
    if (match(m, ['react', 'next', 'nextjs', 'frontend', 'ui', 'ux', 'css', 'tailwind', 'typescript'])) {
        return `Satya excels at modern frontend development:\n\n**⚛️ React Ecosystem**\n• Next.js 14 App Router, Server Components\n• TypeScript for full type safety\n• Zustand, React Query for state & data\n• Framer Motion for smooth animations\n\n**🎨 UI/UX Focus**\n• Glassmorphism, neumorphism, modern design\n• Responsive-first, mobile-optimized\n• Accessibility (ARIA, keyboard nav)\n• Performance — Core Web Vitals optimized\n\n**🚀 Deployment**\n• Vercel, Netlify, custom servers\n• SSR, SSG, ISR strategies\n• Image optimization, lazy loading\n\nThis portfolio is a live example — what do you think?`;
    }

    // ── Python / Backend ──────────────────────────────────────
    if (match(m, ['python', 'flask', 'fastapi', 'backend', 'api', 'server', 'database', 'sql'])) {
        return `Satya's backend skills are solid:\n\n**🐍 Python Ecosystem**\n• Flask, FastAPI for REST APIs\n• SQLAlchemy ORM, Alembic migrations\n• JWT auth, OAuth2, rate limiting\n• Async programming with asyncio\n\n**🗄️ Databases**\n• PostgreSQL, SQLite, MongoDB\n• Redis for caching & sessions\n• Query optimization & indexing\n\n**☁️ DevOps**\n• Docker containerization\n• AWS (EC2, S3, Lambda)\n• CI/CD with GitHub Actions\n• Environment & secrets management\n\nHis portfolio API is a clean example — well-structured and documented!`;
    }

    // ── Default ───────────────────────────────────────────────
    const defaults = [
        `Good question! I can tell you about:\n\n• **Projects** — what Satya has built\n• **Skills** — his full tech stack\n• **AI Work** — ML and LLM projects\n• **Experience** — his background\n• **Hiring** — how to bring him on board\n• **Contact** — how to reach him\n\nJust ask — or tap one of the chips below!`,
        `I'm here to give you the full picture on Satya's work.\n\nTry asking:\n• "What projects have you built?"\n• "Tell me about your AI experience"\n• "Are you available for hire?"\n• "What's your tech stack?"\n\nWhat would you like to know?`,
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
}

function match(msg: string, keywords: string[]): boolean {
    return keywords.some(k => msg.includes(k));
}
