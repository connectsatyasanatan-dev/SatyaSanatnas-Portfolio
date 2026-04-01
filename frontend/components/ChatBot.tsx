'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Send, X, User, ChevronDown,
    Zap, Code2, Briefcase, Mail, Star, Brain
} from 'lucide-react';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
    isStreaming?: boolean;
}

interface Chip {
    label: string;
    icon: React.ReactNode;
    query: string;
}

const CHIPS: Chip[] = [
    { label: 'Projects', icon: <Code2 size={12} />, query: 'Tell me about your projects' },
    { label: 'Skills', icon: <Zap size={12} />, query: 'What are your skills?' },
    { label: 'Experience', icon: <Briefcase size={12} />, query: 'Tell me about your experience' },
    { label: 'Hire Me', icon: <Star size={12} />, query: 'I want to hire you' },
    { label: 'Contact', icon: <Mail size={12} />, query: 'How can I contact you?' },
    { label: 'AI Work', icon: <Brain size={12} />, query: 'Tell me about your AI projects' },
];

// Renders markdown-like text with bold, bullets, line breaks
function RenderMessage({ text }: { text: string }) {
    const lines = text.split('\n');
    return (
        <div className="cb-msg-body">
            {lines.map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                // Bold: **text**
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                const rendered = parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{part}</span>;
                });
                // Bullet lines
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                    return <div key={i} className="cb-bullet">{rendered}</div>;
                }
                return <div key={i}>{rendered}</div>;
            })}
        </div>
    );
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [pulseBtn, setPulseBtn] = useState(true);

    const messagesRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Stop pulse after 6s
    useEffect(() => {
        const t = setTimeout(() => setPulseBtn(false), 6000);
        return () => clearTimeout(t);
    }, []);

    const scrollToBottom = (smooth = true) => {
        messagesRef.current?.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto',
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
        if (isOpen && !hasOpened) {
            setHasOpened(true);
            setTimeout(() => {
                streamBotMessage(
                    "Hey! 👋 I'm **Satya's AI assistant** — here to give you the full picture on his work, skills, and how to collaborate.\n\nWhat would you like to explore?"
                );
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleScroll = () => {
        if (!messagesRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 80);
    };

    // Stream text character by character for AI feel
    const streamBotMessage = (fullText: string) => {
        const id = Date.now().toString();
        setMessages(prev => [...prev, { id, text: '', isBot: true, timestamp: new Date(), isStreaming: true }]);
        setIsTyping(false);

        let i = 0;
        const speed = 12; // ms per char

        const tick = () => {
            i++;
            setMessages(prev =>
                prev.map(m =>
                    m.id === id
                        ? { ...m, text: fullText.slice(0, i), isStreaming: i < fullText.length }
                        : m
                )
            );
            if (i < fullText.length) {
                streamRef.current = setTimeout(tick, speed);
            }
        };
        streamRef.current = setTimeout(tick, speed);
    };

    const getBotResponse = async (userMsg: string): Promise<string> => {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.response;
            }
        } catch (_) { }
        return getFallbackResponse(userMsg);
    };

    const getFallbackResponse = (msg: string): string => {
        const m = msg.toLowerCase();
        if (m.includes('project') || m.includes('portfolio') || m.includes('work'))
            return `Here's a snapshot of Satya's key projects:\n\n**🤖 AI Chatbot Platform**\n• React + Flask + NLP\n• Context-aware conversations\n• Real-time streaming responses\n\n**🌐 Portfolio Website** *(you're on it!)*\n• Next.js 14 + TypeScript\n• Flask REST API backend\n• Admin dashboard + analytics\n\n**⚙️ Full-Stack Web Apps**\n• Auth systems, REST APIs\n• Database design & optimization\n• Cloud deployment pipelines\n\nWant a deep dive into any of these?`;
        if (m.includes('skill') || m.includes('tech') || m.includes('stack'))
            return `Satya's tech stack is broad and modern:\n\n**Frontend**\n• React, Next.js, TypeScript\n• Tailwind CSS, Framer Motion\n\n**Backend**\n• Python, Flask, FastAPI\n• Node.js, REST APIs\n\n**AI / ML**\n• NLP, LLM integrations\n• scikit-learn, pandas\n\n**DevOps**\n• Docker, AWS, Vercel, Git CI/CD\n\n**Databases**\n• PostgreSQL, MongoDB, SQLite\n\nAlways learning — what area interests you most?`;
        if (m.includes('experience') || m.includes('background') || m.includes('about'))
            return `Satya is a full-stack developer with a strong focus on AI-integrated web experiences.\n\n**What sets him apart:**\n• Builds end-to-end — from UI to deployment\n• Obsessed with clean, performant code\n• Fast learner who ships quickly\n• Strong eye for modern UI/UX\n\nHe's worked across personal projects, freelance clients, and open-source contributions — always pushing the quality bar higher.\n\nCurious about anything specific?`;
        if (m.includes('hire') || m.includes('job') || m.includes('opportunity') || m.includes('recruit'))
            return `Satya is open to exciting opportunities! 🚀\n\n**Available for:**\n• Full-time roles (remote/hybrid)\n• Freelance & contract projects\n• Technical consulting\n• Startup collaborations\n\n**He brings:**\n• Fast onboarding & communication\n• Full-stack + AI expertise\n• Ownership mindset\n• Clean, documented code\n\nBest move? Hit the **Contact** section below — he typically responds within 24 hours. Want me to tell you more about his work first?`;
        if (m.includes('contact') || m.includes('reach') || m.includes('email'))
            return `Getting in touch with Satya is easy:\n\n**📬 Contact Section** — scroll to the bottom of this page\n**⚡ Response time** — usually within 24 hours\n**💬 Open to** — any project size or collaboration type\n\nWhen you reach out, mention:\n• What you're building\n• Timeline & scope\n• Tech stack (if you have one in mind)\n\nHe loves ambitious ideas — don't hold back!`;
        if (m.includes('ai') || m.includes('machine learning') || m.includes('nlp') || m.includes('llm'))
            return `AI is one of Satya's strongest areas:\n\n**🧠 What he's built:**\n• Conversational AI assistants (like this one!)\n• NLP pipelines for text classification\n• LLM API integrations (OpenAI, etc.)\n• Intelligent recommendation systems\n\n**🔧 Tools & frameworks:**\n• Python, scikit-learn, pandas\n• LangChain, OpenAI API\n• Vector databases & embeddings\n• FastAPI for AI microservices\n\nHe believes AI should feel natural and useful — not gimmicky. Want to know about a specific AI project?`;
        return `Good question! I can tell you about:\n\n• **Projects** — what Satya has built\n• **Skills** — his full tech stack\n• **Experience** — his background\n• **AI Work** — ML and LLM projects\n• **Hiring** — how to bring him on board\n\nJust ask — or tap one of the chips below!`;
    };

    const sendMessage = async (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || isTyping) return;

        if (streamRef.current) clearTimeout(streamRef.current);

        const userMsg: Message = {
            id: Date.now().toString(),
            text: msg,
            isBot: false,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const response = await getBotResponse(msg);
        streamBotMessage(response);
    };

    const handleChip = (query: string) => sendMessage(query);

    return (
        <>
            {/* Floating Button */}
            <button
                className={`cb-fab ${isOpen ? 'cb-fab--open' : ''} ${pulseBtn ? 'cb-fab--pulse' : ''}`}
                onClick={() => setIsOpen(v => !v)}
                aria-label="Toggle AI assistant"
            >
                {isOpen
                    ? <X size={22} />
                    : <img src="/lottie/AI Robot.gif" alt="AI Assistant" className="cb-fab-gif" />
                }
                {!isOpen && <span className="cb-fab-ring" />}
            </button>

            {/* Chat Window */}
            <div className={`cb-window ${isOpen ? 'cb-window--open' : ''}`} role="dialog" aria-label="AI Chat Assistant">

                {/* Header */}
                <div className="cb-header">
                    <div className="cb-header-glow" />
                    <div className="cb-header-left">
                        <div className="cb-avatar">
                            <Brain size={18} />
                            <span className="cb-avatar-dot" />
                        </div>
                        <div>
                            <div className="cb-header-name">Satya's AI</div>
                            <div className="cb-header-status">
                                <span className="cb-status-dot" />
                                Online · Powered by AI
                            </div>
                        </div>
                    </div>
                    <button className="cb-close" onClick={() => setIsOpen(false)} aria-label="Close">
                        <X size={16} />
                    </button>
                </div>

                {/* Messages */}
                <div className="cb-messages" ref={messagesRef} onScroll={handleScroll}>
                    {messages.length === 0 && (
                        <div className="cb-empty">
                            <div className="cb-empty-icon"><Brain size={28} /></div>
                            <p>Ask me anything about Satya</p>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div key={msg.id} className={`cb-msg ${msg.isBot ? 'cb-msg--bot' : 'cb-msg--user'}`}>
                            {msg.isBot && (
                                <div className="cb-msg-avatar"><Brain size={14} /></div>
                            )}
                            <div className="cb-msg-bubble">
                                {msg.isBot ? <RenderMessage text={msg.text} /> : <span>{msg.text}</span>}
                                {msg.isStreaming && <span className="cb-cursor" />}
                                <div className="cb-msg-time">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            {!msg.isBot && (
                                <div className="cb-msg-avatar cb-msg-avatar--user"><User size={14} /></div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="cb-msg cb-msg--bot">
                            <div className="cb-msg-avatar"><Brain size={14} /></div>
                            <div className="cb-msg-bubble cb-typing-bubble">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}
                </div>

                {/* Scroll to bottom */}
                {showScrollBtn && (
                    <button className="cb-scroll-btn" onClick={() => scrollToBottom()} aria-label="Scroll to bottom">
                        <ChevronDown size={16} />
                    </button>
                )}

                {/* Chips */}
                <div className="cb-chips">
                    {CHIPS.map(chip => (
                        <button key={chip.label} className="cb-chip" onClick={() => handleChip(chip.query)}>
                            {chip.icon}
                            {chip.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="cb-input-row">
                    <input
                        ref={inputRef}
                        className="cb-input"
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Ask me anything..."
                        aria-label="Chat input"
                    />
                    <button
                        className="cb-send"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isTyping}
                        aria-label="Send"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
