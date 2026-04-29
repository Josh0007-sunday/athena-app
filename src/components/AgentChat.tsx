import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ProtocolIcon from './ProtocolIcon';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

const TypingMessage = ({ content }: { content: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < content.length) {
            const timer = setTimeout(() => {
                setDisplayedText((prev) => prev + content[index]);
                setIndex((prev) => prev + 1);
            }, 10); // Fast typing
            return () => clearTimeout(timer);
        }
    }, [index, content]);

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4 border border-stone-100 rounded-sm">
                        <table className="min-w-full divide-y divide-stone-100 font-mono text-[10px]" {...props} />
                    </div>
                ),
                th: ({ node, ...props }) => (
                    <th className="px-4 py-2 bg-stone-50 text-left font-bold uppercase tracking-widest text-stone-400" {...props} />
                ),
                td: ({ node, ...props }) => (
                    <td className="px-4 py-2 border-t border-stone-50 text-stone-600" {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <span className="font-bold text-stone-900" {...props} />
                ),
                p: ({ node, ...props }) => (
                    <p className="mb-2 last:mb-0" {...props} />
                ),
                img: ({ node, src, alt, ...props }) => {
                    if (src?.startsWith('https://logo.')) {
                        const protocolName = src.replace('https://logo.', '') as 'lulo' | 'kamino' | 'jupiter' | 'umbra';
                        return <span className="inline-flex items-center space-x-1 align-baseline mx-0.5"><span className="opacity-80 translate-y-[2px]"><ProtocolIcon protocol={protocolName} size={12} /></span><span className="font-semibold">{alt}</span></span>;
                    }
                    return <img src={src} alt={alt} {...props} />;
                }
            }}
        >
            {displayedText}
        </ReactMarkdown>
    );
};

export default function AgentChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Welcome, Auditor. Athena Protocol is initialized. I am your autonomous treasury agent. I can help you analyze yield, execute swaps via Jupiter, or rebalance your Lulo/Kamino allocations. How can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const submitPrompt = async (textToSubmit: string) => {
        if (!textToSubmit.trim() || loading) return;

        const userMsg: Message = {
            role: 'user',
            content: textToSubmit,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('athena_token');
            const response = await axios.post('/api/agent/chat',
                { message: textToSubmit },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const assistantMsg: Message = {
                role: 'assistant',
                content: response.data.response || "I encountered a protocol error. Please retry.",
                timestamp: new Date(),
                isTyping: true
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (err: any) {
            console.error('Chat error:', err);
            let errorMessage = "System Alert: Backend communication failed. Ensure server is active.";

            if (err.response) {
                if (err.response.status === 401) {
                    errorMessage = "System Alert: Authentication expired or invalid. Please re-authenticate.";
                } else if (err.response.data?.error) {
                    errorMessage = `System Alert: ${err.response.data.error}`;
                }
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date(),
                isTyping: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitPrompt(input);
    };

    const handleQuickPrompt = (promptText: string) => {
        submitPrompt(promptText);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white animate-in slide-in-from-bottom duration-500">
            {/* Chat Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/30">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-stone-900 text-white rounded-sm flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Yield Agent // V1.0</div>
                            <div className="text-xs font-mono font-bold uppercase">Athena Intelligence</div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-stone-100"></div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <ProtocolIcon protocol="lulo" size={14} />
                            <span className="text-[9px] font-mono uppercase text-stone-400">Lulo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ProtocolIcon protocol="kamino" size={14} />
                            <span className="text-[9px] font-mono uppercase text-stone-400">Kamino</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <ProtocolIcon protocol="jupiter" size={14} />
                            <span className="text-[9px] font-mono uppercase text-stone-400">Jupiter</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-[9px] font-mono uppercase tracking-widest text-emerald-500">
                    <Zap size={12} fill="currentColor" />
                    <span>Live Context</span>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth"
            >
                <div className="max-w-6xl mx-auto space-y-12">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                            <div className={`flex w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                                <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-stone-50 text-stone-400 ml-6' : 'bg-stone-900 text-white mr-6'
                                    }`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`flex-1 p-6 rounded-sm text-sm font-light leading-relaxed border ${msg.role === 'user'
                                    ? 'bg-stone-50/50 border-stone-100 text-stone-600 max-w-xl ml-auto'
                                    : 'bg-white border-stone-100 text-stone-900 shadow-sm'
                                    }`}>
                                    {msg.role === 'assistant' && i === messages.length - 1 && msg.isTyping ? (
                                        <TypingMessage content={msg.content} />
                                    ) : (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-4 border border-stone-100 rounded-sm">
                                                        <table className="min-w-full divide-y divide-stone-100 font-mono text-[10px]" {...props} />
                                                    </div>
                                                ),
                                                th: ({ node, ...props }) => (
                                                    <th className="px-4 py-2 bg-stone-50 text-left font-bold uppercase tracking-widest text-stone-400" {...props} />
                                                ),
                                                td: ({ node, ...props }) => (
                                                    <td className="px-4 py-2 border-t border-stone-50 text-stone-600" {...props} />
                                                ),
                                                strong: ({ node, ...props }) => (
                                                    <span className="font-bold text-stone-900" {...props} />
                                                ),
                                                img: ({ node, src, alt, ...props }) => {
                                                    if (src?.startsWith('https://logo.')) {
                                                        const protocolName = src.replace('https://logo.', '') as 'lulo' | 'kamino' | 'jupiter' | 'umbra';
                                                        return <span className="inline-flex items-center space-x-1 align-baseline mx-0.5"><span className="opacity-80 translate-y-[2px]"><ProtocolIcon protocol={protocolName} size={12} /></span><span className="font-semibold">{alt}</span></span>;
                                                    }
                                                    return <img src={src} alt={alt} {...props} />;
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="flex w-full items-start">
                                <div className="w-8 h-8 rounded-sm bg-stone-900 text-white flex items-center justify-center mr-6">
                                    <Bot size={14} />
                                </div>
                                <div className="p-6 bg-stone-50 border border-stone-100 rounded-sm text-[10px] font-mono text-stone-400 uppercase tracking-widest flex items-center flex-1">
                                    <Loader2 size={14} className="animate-spin mr-3" />
                                    Synthesizing Analytics...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-stone-100 bg-white">
                <div className="max-w-6xl mx-auto">
                    <form
                        onSubmit={handleSend}
                        className="relative flex items-center bg-white border border-stone-200 rounded-sm shadow-sm focus-within:border-stone-400 transition-all overflow-hidden"
                    >
                        <div className="pl-5 text-stone-300">
                            <Sparkles size={16} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type command or query yield stats..."
                            className="flex-1 bg-transparent border-none px-5 py-5 text-xs font-mono focus:ring-0 placeholder:text-stone-300"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="mr-3 bg-stone-900 text-white w-10 h-10 rounded-sm flex items-center justify-center hover:bg-stone-800 transition-all disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <div className="mt-4 flex items-center justify-center space-x-3 text-[10px] font-mono tracking-wider">
                        <button
                            onClick={() => handleQuickPrompt("Analyze the active Kamino positions (TVL, Utilization) and suggest the most optimal safe deposit strategy.")}
                            className="px-4 py-2 border border-stone-100 rounded-full text-stone-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors bg-stone-50 hover:bg-emerald-50/50"
                        >
                            Analyze Yields
                        </button>
                        <button
                            onClick={() => handleQuickPrompt("I want to deposit 10 USDC into the highest performing strategy.")}
                            className="px-4 py-2 border border-stone-100 rounded-full text-stone-500 hover:border-blue-500 hover:text-blue-600 transition-colors bg-stone-50 hover:bg-blue-50/50"
                        >
                            Deposit 10 USDC
                        </button>
                        <button
                            onClick={() => handleQuickPrompt("If I have active positions, rebalance them to whatever has the highest APY.")}
                            className="px-4 py-2 border border-stone-100 rounded-full text-stone-500 hover:border-amber-500 hover:text-amber-600 transition-colors bg-stone-50 hover:bg-amber-50/50"
                        >
                            Rebalance Profile
                        </button>
                        <button
                            onClick={() => handleQuickPrompt("Set up a dynamic DCA strategy for Jupiter. Buy 10 USDC of JUP every 24 hours.")}
                            className="px-4 py-2 border border-stone-100 rounded-full text-stone-500 hover:border-purple-500 hover:text-purple-600 transition-colors bg-stone-50 hover:bg-purple-50/50"
                        >
                            Jupiter DCA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
