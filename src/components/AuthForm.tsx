import React, { useState, useEffect } from 'react';
import { Loader2, Wallet } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * AuthForm — simplified: Email OTP for identity, then link an existing wallet.
 * Shard-based key management has been removed entirely.
 */
export default function AuthForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [step, setStep] = useState<'email' | 'otp' | 'wallet'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const urlEmail = searchParams.get('e');
    useEffect(() => { if (urlEmail) setEmail(urlEmail); }, [urlEmail]);

    // ── Step 1: Request OTP ────────────────────────────────────────────────────
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) { setError('Email is required'); return; }
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/auth/email', { email });
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) { setError('Please enter a valid 6-digit code'); return; }
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/auth/verify', { email, otp });
            const { token: jwt, user } = response.data;

            localStorage.setItem('athena_token', jwt);
            setToken(jwt);
            setUserId(user.id);

            if (user.walletAddress) {
                // Returning user already has a linked wallet — go straight to dashboard
                localStorage.setItem('athena_user', JSON.stringify(user));
                navigate('/dashboard');
            } else {
                // New user needs to link a wallet
                setStep('wallet');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    // ── Step 3: Link wallet address ────────────────────────────────────────────
    const handleWalletLink = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = walletAddress.trim();
        const isSolana = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);
        if (!isSolana) { setError('Enter a valid Solana wallet address.'); return; }
        setLoading(true);
        setError('');
        try {
            const syncRes = await axios.post(
                '/api/auth/link-wallet',
                { walletAddress: trimmed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedToken = syncRes.data.token || token;
            localStorage.setItem('athena_token', updatedToken);
            localStorage.setItem('athena_user', JSON.stringify({
                id: userId,
                email,
                walletAddress: trimmed,
            }));
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to link wallet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm">
            {/* Logo Area */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-stone-900 text-white rounded-sm flex items-center justify-center p-3 mb-8 shadow-sm relative overflow-hidden">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-4 border border-stone-200 px-3 py-1 rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse"></span>
                    <span>System Access //</span>
                </div>
                <h1 className="text-3xl font-medium tracking-tight mb-3 text-stone-900">Initialize Agent</h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                    {step === 'email' && 'Enter your email to get started'}
                    {step === 'otp' && 'Verify transmission code'}
                    {step === 'wallet' && 'Connect your Solana wallet'}
                </p>
            </div>

            {/* ── Step 1: Email ── */}
            {step === 'email' && (
                <form className="space-y-4 pt-4" onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Payload Email"
                        className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                    />
                    {error && <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Request Access Code'}
                    </button>
                </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 'otp' && (
                <form className="space-y-4 pt-4" onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="6-Digit OTP"
                        className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-sm text-center text-xl font-mono tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300 placeholder:text-[10px] placeholder:tracking-widest placeholder:uppercase"
                    />
                    {error && <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest text-center">{error}</p>}
                    <div className="flex items-center justify-end pt-2 pb-4">
                        <button
                            type="button"
                            onClick={() => { setStep('email'); navigate('/connect'); }}
                            className="text-[10px] font-mono uppercase tracking-widest text-stone-900 hover:underline"
                        >
                            Reset
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full flex items-center justify-center bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify Code'}
                    </button>
                </form>
            )}

            {/* ── Step 3: Connect Wallet ── */}
            {step === 'wallet' && (
                <form className="space-y-4 pt-4" onSubmit={handleWalletLink}>
                    <div className="p-4 border border-stone-100 rounded-sm bg-stone-50 text-center mb-2">
                        <Wallet size={24} className="text-stone-400 mx-auto mb-2" />
                        <p className="text-xs text-stone-500 font-light">
                            Paste your Solana wallet address below to link it to your Athena account.
                        </p>
                    </div>
                    <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value.trim())}
                        placeholder="Solana wallet address (Base58)"
                        className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300"
                    />
                    {error && <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading || !walletAddress.trim()}
                        className="w-full flex items-center justify-center bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Link Wallet & Enter'}
                    </button>
                </form>
            )}
        </div>
    );
}
