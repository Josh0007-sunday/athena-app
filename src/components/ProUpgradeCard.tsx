import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ExternalLink } from 'lucide-react';

interface ProUpgradeCardProps {
    userId: string;
    compact?: boolean;
}

/**
 * Renders the "Upgrade to Pro" CTA. On the Pricing page the full KiraPay
 * button is embedded. In Settings / sidebar a compact redirect card is shown.
 */
export default function ProUpgradeCard({ userId, compact = false }: ProUpgradeCardProps) {
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

    if (compact) {
        // Sidebar / Settings minimal CTA
        return (
            <button
                onClick={() => navigate('/pricing')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-sm border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all group"
            >
                <div className="flex items-center space-x-2">
                    <Zap size={12} className="text-amber-500" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700">Upgrade to Pro</span>
                </div>
                <ExternalLink size={10} className="text-amber-400 group-hover:text-amber-600 transition-colors" />
            </button>
        );
    }

    // Full button mode
    return (
        <div className="mt-6">
            <button onClick={handleUpgrade} disabled={isLoading} className="w-full bg-stone-900 text-white rounded-sm py-4 text-xs font-mono uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors">
                {isLoading ? 'Processing...' : 'Upgrade Now'}
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-4 leading-relaxed tracking-wider">SECURE USDC PAYMENT VIA KIRAPAY</p>
        </div>
    );
}
