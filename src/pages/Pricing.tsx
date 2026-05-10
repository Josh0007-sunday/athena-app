import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Bot, Crown } from 'lucide-react';

interface PricingProps {
    userId?: string;
}

const FREE_FEATURES = [
    'Conversational AI treasury agent',
    'Real-time APY & yield analytics',
    'Portfolio overview (Lulo + Kamino)',
    'Weekly report generation',
    '0.1 USDC per write action (deposit / withdraw / DCA)',
];

const PRO_FEATURES = [
    'Everything in Free',
    'Zero per-action fees — unlimited trading',
    'Priority AI context with Pro-aware Athena',
    'Golden PRO badge across the dashboard',
    'Faster autonomous rebalancing cycles',
    'Early access to new protocol integrations',
];

function KiraPayButton({ userId }: { userId?: string }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        if (!userId) return navigate('/connect');
        setIsLoading(true);
        try {
            const res = await fetch("https://api.kira-pay.com/api/link/generate", {
                method: "POST",
                headers: {
                    "x-api-key": import.meta.env.VITE_KIRAPAY_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    price: 10,
                    originalPrice: 10,
                    name: "Athena Pro Subscription",
                    customOrderId: userId,
                    receiver: "CyirpncQPVWHtnbmneHsTedUgmYABKTGsriYkSvKDZrD",
                    redirectUrl: window.location.origin + "/dashboard",
                    type: "single_use",
                    isViewAsCrypto: false,
                    tokenOut: { chainId: "sol", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" }
                })
            });
            const data = await res.json();
            if (data?.data?.url) {
                window.location.href = data.data.url;
            } else {
                alert("Failed to generate link: " + JSON.stringify(data));
            }
        } catch (err) {
            console.error('KiraPay Fetch Error:', err);
            alert("Payment service is temporarily unavailable.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!userId) {
        return (
            <p className="text-[10px] font-mono text-amber-600 uppercase tracking-widest text-center mt-6">
                Sign in to upgrade
            </p>
        );
    }

    return (
        <div className="mt-6">
            <button onClick={handleUpgrade} disabled={isLoading} className="w-full bg-stone-900 text-white rounded-sm py-4 text-xs font-mono uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                {isLoading ? 'Processing...' : 'Upgrade Now'}
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-4 leading-relaxed tracking-wider">SECURE USDC PAYMENT VIA KIRAPAY</p>
        </div>
    );
}

export default function Pricing({ userId }: PricingProps) {
    const navigate = useNavigate();
    const [storedUser, setStoredUser] = useState<string | undefined>(userId);

    useEffect(() => {
        if (!storedUser) {
            try {
                const u = JSON.parse(localStorage.getItem('athena_user') || '{}');
                if (u?.id) setStoredUser(u.id);
            } catch { /* ignore */ }
        }
    }, [storedUser]);

    return (
        <div className="min-h-screen bg-white font-sans text-stone-900">
            {/* Header */}
            <div className="border-b border-stone-100 px-8 py-5 flex items-center justify-between">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-3 group"
                >
                    <div className="w-7 h-7 bg-stone-900 text-white rounded-sm flex items-center justify-center p-1">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-stone-900">Athena</span>
                </button>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-[10px] font-mono uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Hero */}
            <div className="max-w-4xl mx-auto px-8 pt-20 pb-12 text-center">
                <div className="inline-flex items-center space-x-2 text-[9px] font-mono uppercase tracking-widest text-amber-600 mb-6 border border-amber-200 px-3 py-1 bg-amber-50 rounded-sm">
                    <Crown size={10} />
                    <span>Athena Subscription Plans</span>
                </div>
                <h1 className="text-5xl font-medium tracking-tight mb-4">Simple Pricing.</h1>
                <p className="text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed">
                    Start free. Upgrade to Pro to unlock zero-fee autonomous trading for a flat $10/month.
                </p>
            </div>

            {/* Tier Cards */}
            <div className="max-w-4xl mx-auto px-8 pb-24 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Free Tier */}
                <div className="border border-stone-100 rounded-sm bg-white p-8 flex flex-col shadow-sm">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-9 h-9 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center">
                            <Bot size={18} className="text-stone-400" />
                        </div>
                        <div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Current Plan</div>
                            <div className="text-sm font-mono font-bold uppercase tracking-wider">Free</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <span className="text-4xl font-medium">$0</span>
                        <span className="text-stone-400 text-sm font-light ml-2">/ month</span>
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                        {FREE_FEATURES.map((f) => (
                            <li key={f} className="flex items-start space-x-3">
                                <Check size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-stone-500 font-light leading-relaxed">{f}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="border border-stone-100 rounded-sm py-3 text-center text-[10px] font-mono uppercase tracking-widest text-stone-400 bg-stone-50">
                        Current Plan — No Action Needed
                    </div>
                </div>

                {/* Pro Tier */}
                <div className="border-2 border-amber-300 rounded-sm bg-gradient-to-br from-amber-50 via-white to-white p-8 flex flex-col shadow-md relative overflow-hidden">
                    {/* Glow accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-full" />

                    <div className="flex items-center space-x-3 mb-6 relative">
                        <div className="w-9 h-9 bg-amber-500 rounded-sm flex items-center justify-center">
                            <Crown size={18} className="text-white" />
                        </div>
                        <div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-amber-500">Recommended</div>
                            <div className="text-sm font-mono font-bold uppercase tracking-wider text-amber-700">Pro</div>
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <span className="text-4xl font-medium text-stone-900">$10</span>
                        <span className="text-stone-400 text-sm font-light ml-2">/ month</span>
                        <div className="text-[10px] font-mono text-amber-600 uppercase tracking-widest mt-1">Billed monthly · Cancel anytime</div>
                    </div>

                    <ul className="space-y-3 flex-1 mb-8 relative">
                        {PRO_FEATURES.map((f) => (
                            <li key={f} className="flex items-start space-x-3">
                                <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check size={10} className="text-amber-600" />
                                </div>
                                <span className="text-xs text-stone-700 font-light leading-relaxed">{f}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="relative">
                        <div className="flex items-center space-x-2 mb-3">
                            <Shield size={12} className="text-amber-500" />
                            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600">Powered by KiraPay · Crypto native checkout</span>
                        </div>
                        <KiraPayButton userId={storedUser} />
                    </div>
                </div>
            </div>

            {/* Footer note */}
            <div className="border-t border-stone-50 px-8 py-6 text-center">
                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-300">
                    <Zap size={10} className="inline mr-1" />
                    All payments processed on-chain via KiraPay · Upgrades activate instantly on payment confirmation
                </p>
            </div>
        </div>
    );
}
