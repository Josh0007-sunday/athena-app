import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Keypair } from '@solana/web3.js';
import sss from 'shamirs-secret-sharing';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally for web3 dependencies
if (typeof window !== 'undefined') {
    (window as any).Buffer = (window as any).Buffer || Buffer;
}

export default function AuthForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const urlEmail = searchParams.get('e');

    useEffect(() => {
        if (urlEmail) setEmail(urlEmail);
    }, [urlEmail]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/email', { email });
            setStep('otp');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to send verification code.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/verify', {
                email,
                otp
            });

            const { token, user, isNewUser, shardOne, shardTwo } = response.data;
            let currentToken = token;

            // Critical: Always save the initial session token momentarily
            localStorage.setItem('athena_token', currentToken);

            let derivedAddress = user.walletAddress;

            if (isNewUser) {
                try {
                    // Generate new valid Solana keypair in browser
                    const keypair = Keypair.generate();
                    derivedAddress = keypair.publicKey.toBase58();

                    // Split into 3 shards with 2-of-3 threshold
                    const secretBuf = Buffer.from(keypair.secretKey);
                    const shares = sss.split(secretBuf, { shares: 3, threshold: 2 });
                    const shard1 = shares[0].toString('hex');
                    const shard2 = shares[1].toString('hex');
                    const shard3 = shares[2].toString('hex');

                    console.log('✅ Local Wallet Generated:', derivedAddress);

                    // Sync all 3 shards with backend — shard1 is encrypted and stored server-side
                    const setupResponse = await axios.post('/api/auth/setup-wallet',
                        { shard1, shard2, shard3, walletAddress: derivedAddress },
                        { headers: { Authorization: `Bearer ${currentToken}` } }
                    );

                    if (setupResponse.data.token) {
                        currentToken = setupResponse.data.token;
                        localStorage.setItem('athena_token', currentToken);
                    }
                } catch (derivationError) {
                    console.error('Wallet generation failed:', derivationError);
                    throw new Error('Wallet generation failed');
                }
            } else if (shardOne && shardTwo) {
                // Returning user. Reconstruct keypair in-memory from server-provided shards.
                try {
                    const recoveredBuf = sss.combine([
                        Buffer.from(shardOne, 'hex'),
                        Buffer.from(shardTwo, 'hex')
                    ]);
                    const secretKey = new Uint8Array(recoveredBuf);
                    const keypair = Keypair.fromSecretKey(secretKey);

                    derivedAddress = keypair.publicKey.toBase58();

                    if (derivedAddress !== user.walletAddress) {
                        throw new Error('Wallet integrity check failed. Please contact support.');
                    }

                    console.log('✅ Local Wallet Resumed:', derivedAddress);
                } catch (reconstructError: any) {
                    console.error('Wallet reconstruction failed:', reconstructError);
                    throw new Error(reconstructError.message || 'Failed to reconstruct wallet');
                }
            } else if (!isNewUser) {
                throw new Error('Wallet shards unavailable. Please contact support.');
            }

            localStorage.setItem('athena_user', JSON.stringify({
                ...user,
                walletAddress: derivedAddress
            }));

            navigate('/dashboard');

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Authentication failed. Invalid code.');
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
                    {step === 'email' ? 'Select Authorization Method' : 'Verify transmission code'}
                </p>
            </div>

            {/* Step Selection: Email or Wallet */}
            {step === 'email' && (
                <div className="space-y-4">
                    <form className="space-y-4 pt-4" onSubmit={handleEmailSubmit}>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Payload Email"
                                className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-sm text-xs font-mono focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300 placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all active:translate-y-px shadow-sm disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin text-white" size={16} /> : 'Request Access Code'}
                        </button>
                    </form>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-stone-100"></div>
                        <span className="flex-shrink mx-4 text-[9px] font-mono text-stone-300 uppercase tracking-widest">End of Methods</span>
                        <div className="flex-grow border-t border-stone-100"></div>
                    </div>
                </div>
            )}

            {/* OTP Step */}
            {step === 'otp' && (
                <form className="space-y-4 pt-4" onSubmit={handleOtpSubmit}>
                    <div className="relative">
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            placeholder="6-Digit OTP"
                            className="w-full px-4 py-3.5 bg-white border border-stone-200 rounded-sm text-center text-xl font-mono tracking-[0.5em] focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all placeholder:text-stone-300 placeholder:text-[10px] placeholder:tracking-widest placeholder:uppercase"
                        />
                    </div>


                    {error && (
                        <div className="text-red-500 text-[10px] font-mono uppercase tracking-widest px-2 py-1 text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 pb-4">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <div className="w-3 h-3 border border-stone-300 rounded-sm flex items-center justify-center group-hover:border-stone-500 transition-colors"></div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 group-hover:text-stone-600 transition-colors">Preserve State</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setStep('email');
                                navigate('/connect'); // clear url params
                            }}
                            className="text-[10px] font-mono uppercase tracking-widest text-stone-900 hover:underline"
                        >
                            Reset
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full flex items-center justify-center bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all active:translate-y-px shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin text-white" size={16} /> : 'Initialize Agent'}
                    </button>
                </form>
            )}
        </div>
    );
}
