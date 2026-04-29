import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { ArrowRight, ShieldCheck, Zap, BarChart3, Loader2 } from 'lucide-react';
import athenaImg from '../assets/athena.png';
import jupiterImg from '../assets/jupiter.jpg';
import heliusImg from '../assets/helius.jpg';
import umbraImg from '../assets/umbra.jpg';
import colosseumImg from '../assets/colosseum.jpg';
import superteamImg from '../assets/superteam.jpg';
import zeroMobileImg from '../assets/logo.png';

export default function Landing() {
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistLoading, setWaitlistLoading] = useState(false);
    const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [waitlistMsg, setWaitlistMsg] = useState('');

    const handleWaitlist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!waitlistEmail) return;
        setWaitlistLoading(true);
        setWaitlistStatus('idle');
        try {
            const res = await axios.post('/api/beta/waitlist', { email: waitlistEmail });
            setWaitlistMsg(res.data.message);
            setWaitlistStatus('success');
            setWaitlistEmail('');
        } catch (err: any) {
            setWaitlistMsg(err.response?.data?.error || 'Something went wrong');
            setWaitlistStatus('error');
        } finally {
            setWaitlistLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
                <div className="flex items-center justify-between px-6 md:px-12 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-stone-900 text-white rounded flex items-center justify-center p-1">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold tracking-wide uppercase">athena_ai</span>
                    </div>
                    <nav className="hidden md:flex space-x-8 text-xs font-medium text-stone-500 uppercase tracking-widest">
                        <a href="#how-it-works" className="hover:text-stone-900 transition-colors">Architecture</a>
                        <a href="#fees" className="hover:text-stone-900 transition-colors">Economics</a>
                    </nav>
                    <div>
                        <Link to="/connect" className="text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white px-5 py-2.5 rounded hover:bg-stone-800 transition-colors inline-block text-center">
                            Initialize
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Split Layout */}
            <div className="flex flex-col lg:flex-row relative">

                {/* Left Side: Image & Ecosystem */}
                <div className="hidden lg:flex flex-col w-1/2 p-6 items-center py-8">
                    <div className="w-full relative mb-16">
                        <img
                            src={athenaImg}
                            alt="Athena Protocol"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Infrastructure Stack */}
                    <div className="w-full max-w-sm flex flex-col space-y-10 border-t border-stone-100 pt-10">
                        <h2 className="text-[10px] font-mono text-stone-400 uppercase tracking-widest text-center mb-2">Core Infrastructure //</h2>

                        <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-8 w-full xl:w-[120%] -ml-[10%]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden shadow-sm border border-stone-200">
                                    <img src={jupiterImg} alt="Jupiter" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[9px] xl:text-[10px] font-mono uppercase tracking-widest text-stone-500">Jupiter</span>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden shadow-sm border border-stone-200 bg-white p-1">
                                    <img src={heliusImg} alt="Helius" className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <span className="text-[9px] xl:text-[10px] font-mono uppercase tracking-widest text-stone-500">Helius</span>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden shadow-sm border border-stone-200 p-2 bg-stone-50">
                                    <img src={umbraImg} alt="Umbra Protocol" className="w-full h-full object-contain mix-blend-multiply rounded-full" />
                                </div>
                                <span className="text-[9px] xl:text-[10px] font-mono uppercase tracking-widest text-stone-500">Umbra</span>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden shadow-sm border border-stone-200">
                                    <img src={colosseumImg} alt="Colosseum" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[9px] xl:text-[10px] font-mono uppercase tracking-widest text-stone-500">Colosseum</span>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden shadow-sm border border-stone-200 p-1">
                                    <img src={superteamImg} alt="Superteam" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <span className="text-[9px] xl:text-[10px] font-mono uppercase tracking-widest text-stone-500">Superteam</span>
                            </div>
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full overflow-hidden shadow-sm border border-stone-200 p-1 bg-white">
                                    <img src={zeroMobileImg} alt="Zero Mobile" className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <span className="text-[9px] xl:text-[10px] font-mono uppercase tracking-widest text-stone-500">Zero Mobile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Scrollable Content */}
                <div className="w-full lg:w-[50%] p-8 md:p-16 lg:p-20 xl:p-24 bg-white flex flex-col space-y-32">

                    {/* Hero Segment */}
                    <section className="pt-8">
                        <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-8 border border-stone-200 px-3 py-1 rounded-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse"></span>
                            <span>Colosseum Frontier 2026 // Target Locked</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-8 text-stone-900 group">
                            Autonomous treasury <br />
                            <span className="text-stone-400 group-hover:text-stone-900 transition-colors duration-700">for Solana routing.</span>
                        </h1>

                        <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed max-w-lg mb-10">
                            Deploy your idle USDC via natural language. Athena automatically maps capital across Kamino and Lulo protocols for optimal yield, wrapping all transactions within the Umbra privacy layer.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link to="/connect" className="w-full sm:w-auto flex items-center justify-between sm:justify-center space-x-3 bg-stone-900 text-white px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-all">
                                <span>Engage Agent</span>
                                <ArrowRight size={14} />
                            </Link>
                            <a href="#how-it-works" className="w-full sm:w-auto px-8 py-3.5 rounded border border-stone-200 text-stone-600 text-xs font-medium uppercase tracking-wider hover:bg-stone-50 transition-colors text-center">
                                Review Docs
                            </a>
                        </div>
                    </section>

                    {/* Architecture (How it works) */}
                    <section id="how-it-works" className="border-t border-stone-100 pt-16">
                        <h2 className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-10">System Architecture //</h2>

                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-12">
                            <div className="space-y-4">
                                <div className="w-10 h-10 border border-stone-200 rounded flex items-center justify-center text-stone-900">
                                    <Zap size={18} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-sm font-semibold tracking-wide uppercase">NLP Orchestration</h3>
                                <p className="text-xs text-stone-500 font-light leading-relaxed">
                                    Interact via semantic commands. "Deposit 500 USDC." The agent parses intent, provisions capital, and executes multi-step on-chain protocols autonomously.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-10 h-10 border border-stone-200 rounded flex items-center justify-center text-stone-900">
                                    <ShieldCheck size={18} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-sm font-semibold tracking-wide uppercase">Zero-Knowledge Ops</h3>
                                <p className="text-xs text-stone-500 font-light leading-relaxed">
                                    All capital routing passes through Umbra's privacy primitives. Position sizes, yields, and wallet telemetry remain cloaked from public block explorers.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-10 h-10 border border-stone-200 rounded flex items-center justify-center text-stone-900">
                                    <BarChart3 size={18} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-sm font-semibold tracking-wide uppercase">Automated Telemetry</h3>
                                <p className="text-xs text-stone-500 font-light leading-relaxed">
                                    Bypass complex dashboard interfaces. The AI synthesizes weekly yield reports, formatting complex decentralized metrics into readable strategic briefs.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Economics (Fees) */}
                    <section id="fees" className="border-t border-stone-100 pt-16">
                        <h2 className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-10">Protocol Economics //</h2>

                        <div className="bg-stone-50 border border-stone-100 p-8 rounded">
                            <h3 className="text-lg font-medium mb-4 text-stone-900">Deterministic Pricing</h3>
                            <p className="text-xs text-stone-500 font-light leading-relaxed mb-8 max-w-sm">
                                A rigid flat-fee structure. No variable spreads, no performance dilution. Yield analytics and read-state queries remain permanently unmetered.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="text-2xl font-medium tracking-tight text-stone-900">0.1 USDC</div>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 border-l border-stone-200 pl-4 py-1">
                                    Per write <br /> transaction
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Waitlist Section */}
                    <section id="waitlist" className="border-t border-stone-100 pt-16">
                        <h2 className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-4">Early Access //</h2>
                        <h3 className="text-2xl font-medium tracking-tight text-stone-900 mb-3">Join the waitlist</h3>
                        <p className="text-xs text-stone-500 font-light leading-relaxed mb-8 max-w-sm">
                            Athena is currently in private beta. Drop your email to secure a spot when we open the next access window.
                        </p>

                        {waitlistStatus === 'success' ? (
                            <div className="flex items-center space-x-3 border border-stone-200 bg-stone-50 px-5 py-4 rounded-sm max-w-md">
                                <span className="w-2 h-2 rounded-full bg-stone-900 shrink-0"></span>
                                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-700">{waitlistMsg}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md">
                                <input
                                    type="email"
                                    value={waitlistEmail}
                                    onChange={(e) => setWaitlistEmail(e.target.value)}
                                    placeholder="Your email address"
                                    required
                                    className="flex-1 px-4 py-3.5 border border-stone-200 rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300 placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
                                />
                                <button
                                    type="submit"
                                    disabled={waitlistLoading}
                                    className="flex items-center justify-center gap-2 bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] px-6 py-3.5 rounded-sm hover:bg-stone-800 transition-all active:translate-y-px disabled:opacity-70 whitespace-nowrap"
                                >
                                    {waitlistLoading ? <Loader2 size={14} className="animate-spin" /> : 'Request Access'}
                                </button>
                            </form>
                        )}

                        {waitlistStatus === 'error' && (
                            <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-red-500">{waitlistMsg}</p>
                        )}
                    </section>

                </div>
            </div>

            {/* Global Footer */}
            <footer className="border-t border-stone-100 px-6 lg:px-12 pt-8 pb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] uppercase tracking-widest text-stone-400 font-mono bg-white">
                <div className="mb-4 sm:mb-0">
                    © 2026 Athena Protocol. Built for Solana.
                </div>
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-stone-900 transition-colors">GitHub</a>
                    <a href="#" className="hover:text-stone-900 transition-colors">Docs</a>
                </div>
            </footer>
        </div>
    );
}
