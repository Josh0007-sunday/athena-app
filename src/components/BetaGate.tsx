import React, { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

interface BetaGateProps {
    onSuccess: () => void;
}

export default function BetaGate({ onSuccess }: BetaGateProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) return;

        setLoading(true);
        setError('');

        try {
            await axios.post('/api/beta/verify', { password });
            // Store clearance in session storage so it persists across navigations
            sessionStorage.setItem('beta_access', 'granted');
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid access code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="w-full max-w-sm px-8">
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 bg-stone-900 text-white rounded-sm flex items-center justify-center p-3 mb-6 shadow-sm">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-4 border border-stone-200 px-3 py-1 rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Beta Access Required</span>
                    </div>

                    <h1 className="text-2xl font-medium tracking-tight text-stone-900 mb-2">Restricted Access</h1>
                    <p className="text-[11px] font-mono text-stone-400 uppercase tracking-widest text-center">
                        Enter your beta access code to continue
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Beta Access Code"
                            autoFocus
                            className="w-full pl-4 pr-10 py-3.5 bg-white border border-stone-200 rounded-sm text-xs font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-[10px] font-mono uppercase tracking-widest px-1 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="w-full flex items-center justify-center bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all active:translate-y-px shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Request Access'}
                    </button>
                </form>

                <p className="text-center text-[9px] font-mono uppercase tracking-widest text-stone-300 mt-8">
                    Athena Protocol — Beta v0.1
                </p>
            </div>
        </div>
    );
}
