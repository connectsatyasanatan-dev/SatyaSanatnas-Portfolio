'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    Send, X, ChevronDown, User,
    Zap, Code2, Briefcase, Mail, Star, Brain,
    Mic, MicOff, RotateCcw, Copy, Check, Sparkles
} from 'lucide-react';

interface Message {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
    isStreaming?: boolean;
    suggestions?: string[];
    copied?: boolean;
}

interface HistoryItem {
    role: 'user' | 'assistant';
    content: string;
}

interface Chip {
    label: string;
    icon: React.ReactNode;
    query: string;
}

const CHIPS: Chip[] = [
    { label: 'Projects', icon: <Code2 size={12} />, query: 'Tell me about your projects' },
    { label: 'Skills', icon: <Zap size={12} />, query: 'What is your tech stack?' },
    { label: 'Experience', icon: <Briefcase size={12} />, query: 'Tell me about your experience' },
    { label: 'Hire Me', icon: <Star size={12} />, query: 'Are you available for hire?' },
    { label: 'Contact', icon: <Mail size={12} />, query: 'How can I contact you?' },
    { label: 'AI Work', icon: <Brain size={12} />, query: 'Tell me about your AI projects' },
];

// Smart follow-up suggestions based on response content
function extractSuggestions(text: string): string[] {
    const suggestions: string[] = [];
    if (text.toLowerCase().includes('project')) suggestions.push('Show me your best project');
    if (text.toLowerCase().includes('skill') || text.toLowerCase().includes('tech')) suggestions.push('What is your strongest skill?');
    if (text.toLowerCase().includes('experience') || text.toLowerCase().includes('company')) suggestions.push('Tell me more about your experience');
    if (text.toLowerCase().includes('ai') || text.toLowerCase().includes('ml')) suggestions.push('What AI tools do you use?');
    if (text.toLowerCase().includes('contact') || text.toLowerCase().includes('hire')) suggestions.push('What is your availability?');
    return suggestions.slice(0, 2);
}

// Markdown renderer — bold, bullets, line breaks
function RenderMessage({ text }: { text: string }) {
    const lines = text.split('\n');
    return (
        <div className="cb-msg-body">
            {lines.map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                const rendered = parts.map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j}>{part.slice(2, -2)}</strong>
                        : <span key={j}>{part}</span>
                );
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
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [pulseBtn, setPulseBtn] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const messagesRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const MAX_CHARS = 300;

    useEffect(() => {
        const t = setTimeout(() => setPulseBtn(false), 6000);
        return () => clearTimeout(t);
    }, []);

    const scrollToBottom = useCallback((smooth = true) => {
        messagesRef.current?.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto',
        });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
        if (isOpen && !hasOpened) {
            setHasOpened(true);
            setTimeout(() => {
                streamBotMessage(
                    "Hey! 👋 I'm an **AI assistant** powered by Groq — here to give you the full picture on this developer's work, skills, and how to collaborate.\n\nWhat would you like to explore?",
                    []
                );
            }, 350);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleScroll = () => {
        if (!messagesRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 80);
    };

    const streamBotMessage = (fullText: string, suggestions: string[] = []) => {
        const id = Date.now().toString();
        setMessages(prev => [...prev, {
            id, text: '', isBot: true, timestamp: new Date(), isStreaming: true, suggestions: []
        }]);
        setIsTyping(false);

        let i = 0;
        const speed = 10;

        const tick = () => {
            i++;
            const done = i >= fullText.length;
            setMessages(prev =>
                prev.map(m =>
                    m.id === id
                        ? { ...m, text: fullText.slice(0, i), isStreaming: !done, suggestions: done ? suggestions : [] }
                        : m
                )
            );
            if (!done) streamRef.current = setTimeout(tick, speed);
        };
        streamRef.current = setTimeout(tick, speed);
    };

    const getBotResponse = async (userMsg: string): Promise<{ response: string; suggestions: string[] }> => {
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history }),
            });
            if (res.ok) {
                const data = await res.json();
                return {
                    response: data.response,
                    suggestions: extractSuggestions(data.response),
                };
            }
        } catch (_) { }
        return { response: "I'm having trouble connecting right now. Please try again!", suggestions: [] };
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
        setHistory(prev => [...prev, { role: 'user', content: msg }]);
        setInput('');
        setCharCount(0);
        setIsTyping(true);

        const { response, suggestions } = await getBotResponse(msg);
        setHistory(prev => [...prev, { role: 'assistant', content: response }]);
        streamBotMessage(response, suggestions);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val.length <= MAX_CHARS) {
            setInput(val);
            setCharCount(val.length);
        }
    };

    const clearChat = () => {
        if (streamRef.current) clearTimeout(streamRef.current);
        setMessages([]);
        setHistory([]);
        setIsTyping(false);
        setTimeout(() => {
            streamBotMessage(
                "Chat cleared! 🔄 I'm ready for a fresh conversation.\n\nWhat would you like to know?",
                []
            );
        }, 200);
    };

    const copyMessage = (id: string, text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
            setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m));
            }, 2000);
        });
    };

    // Voice input
    const toggleVoice = () => {
        if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return;

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SR = (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition);
        const recognition = new SR();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onresult = (e: SpeechRecognitionEvent) => {
            const transcript = e.results[0][0].transcript;
            setInput(transcript);
            setCharCount(transcript.length);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    const hasSpeech = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    return (
        <>
            {/* FAB Button */}
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
                            <div className="cb-header-name">
                                <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                                AI Assistant
                            </div>
                            <div className="cb-header-status">
                                <span className="cb-status-dot" />
                                Groq · llama3.3-70b · Ultra-fast
                            </div>
                        </div>
                    </div>
                    <div className="cb-header-actions">
                        <button className="cb-icon-btn" onClick={clearChat} aria-label="Clear chat" title="Clear chat">
                            <RotateCcw size={14} />
                        </button>
                        <button className="cb-close" onClick={() => setIsOpen(false)} aria-label="Close">
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="cb-messages" ref={messagesRef} onScroll={handleScroll}>
                    {messages.length === 0 && (
                        <div className="cb-empty">
                            <div className="cb-empty-icon"><Brain size={28} /></div>
                            <p>Powered by Groq AI</p>
                            <span>Ask me anything about this developer</span>
                        </div>
                    )}

                    {messages.map(msg => (
                        <div key={msg.id} className={`cb-msg ${msg.isBot ? 'cb-msg--bot' : 'cb-msg--user'}`}>
                            {msg.isBot && (
                                <div className="cb-msg-avatar"><Brain size={14} /></div>
                            )}
                            <div className="cb-msg-wrap">
                                <div className="cb-msg-bubble">
                                    {msg.isBot ? <RenderMessage text={msg.text} /> : <span>{msg.text}</span>}
                                    {msg.isStreaming && <span className="cb-cursor" />}
                                    <div className="cb-msg-footer">
                                        <span className="cb-msg-time">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {msg.isBot && !msg.isStreaming && msg.text && (
                                            <button
                                                className="cb-copy-btn"
                                                onClick={() => copyMessage(msg.id, msg.text)}
                                                aria-label="Copy message"
                                            >
                                                {msg.copied ? <Check size={11} /> : <Copy size={11} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {/* Smart suggestions */}
                                {msg.isBot && !msg.isStreaming && msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="cb-suggestions">
                                        {msg.suggestions.map((s, i) => (
                                            <button key={i} className="cb-suggestion" onClick={() => sendMessage(s)}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
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

                {showScrollBtn && (
                    <button className="cb-scroll-btn" onClick={() => scrollToBottom()} aria-label="Scroll to bottom">
                        <ChevronDown size={16} />
                    </button>
                )}

                {/* Chips */}
                <div className="cb-chips">
                    {CHIPS.map(chip => (
                        <button key={chip.label} className="cb-chip" onClick={() => sendMessage(chip.query)}>
                            {chip.icon}{chip.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="cb-input-row">
                    {hasSpeech && (
                        <button
                            className={`cb-voice-btn ${isListening ? 'cb-voice-btn--active' : ''}`}
                            onClick={toggleVoice}
                            aria-label={isListening ? 'Stop listening' : 'Voice input'}
                            title="Voice input"
                        >
                            {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                        </button>
                    )}
                    <div className="cb-input-wrap">
                        <input
                            ref={inputRef}
                            className="cb-input"
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder={isListening ? 'Listening...' : 'Ask me anything...'}
                            aria-label="Chat input"
                            disabled={isListening}
                        />
                        {charCount > 200 && (
                            <span className={`cb-char-count ${charCount > 270 ? 'cb-char-count--warn' : ''}`}>
                                {MAX_CHARS - charCount}
                            </span>
                        )}
                    </div>
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
