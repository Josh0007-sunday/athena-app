import { Bell, Shield, Mail, Cpu, Globe, Crown, Check, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsViewProps {
    user?: any;
    tier?: 'free' | 'pro';
}

export default function SettingsView({ user, tier = 'free' }: SettingsViewProps) {
    const navigate = useNavigate();
    const isPro = tier === 'pro';

    const proExpiresAt = user?.proExpiresAt
        ? new Date(user.proExpiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
            <div className="mb-12">
                <h1 className="text-3xl font-medium tracking-tight mb-3">Protocol Settings</h1>
                <p className="text-sm text-stone-500 font-light uppercase tracking-widest text-[10px] font-mono">Configure Agent Autonomy &amp; Security</p>
            </div>

            <div className="space-y-6">

                {/* ── Subscription Card ── */}
                {isPro ? (
                    <div className="border-2 border-amber-300 rounded-sm bg-gradient-to-br from-amber-50 via-white to-white overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-amber-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Crown size={18} className="text-amber-500" />
                                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700">Athena Pro — Active</h2>
                            </div>
                            <div className="flex items-center space-x-2 bg-amber-500 text-white px-3 py-1 rounded-sm">
                                <Check size={12} />
                                <span className="text-[9px] font-mono uppercase tracking-widest">Subscribed</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">Plan</div>
                                    <div className="text-sm font-mono font-bold">Pro — $10/month</div>
                                </div>
                                <div>
                                    <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400 mb-1">Renews</div>
                                    <div className="text-sm font-mono font-bold">{proExpiresAt || '—'}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] font-mono text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3 py-2 rounded-sm">
                                <Zap size={10} fill="currentColor" />
                                <span>Zero per-action fees — unlimited autonomous trading active</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border border-stone-200 rounded-sm bg-white overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-stone-50 bg-stone-50/10 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Crown size={18} className="text-stone-300" />
                                <h2 className="text-xs font-mono font-bold uppercase tracking-widest">Subscription</h2>
                            </div>
                            <span className="text-[9px] font-mono uppercase tracking-widest border border-stone-200 px-2 py-1 rounded-sm text-stone-400">Free Plan</span>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-stone-500 font-light mb-4">
                                You are on the Free plan. Each write action (deposit, withdraw, rebalance, DCA) costs <span className="font-mono font-medium text-stone-900">0.1 USDC</span> on-chain.
                            </p>
                            <button
                                onClick={() => navigate('/pricing')}
                                className="w-full flex items-center justify-center space-x-2 bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] py-4 rounded-sm hover:bg-stone-800 transition-all shadow-sm"
                            >
                                <Crown size={12} />
                                <span>Upgrade to Pro — $10/month</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Security Section ── */}
                <div className="border border-stone-100 rounded-sm bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-stone-50 bg-stone-50/10 flex items-center space-x-3">
                        <Shield size={18} className="text-stone-400" />
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest">Security &amp; Privacy</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Wallet Connection</div>
                                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mt-1">Status: Active // Verified</div>
                            </div>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between opacity-60">
                            <div>
                                <div className="text-sm font-medium text-stone-500">Umbra Privacy Obfuscation</div>
                                <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mt-1">Status: Enforced</div>
                            </div>
                            <div className="w-10 h-5 bg-stone-200 rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Notifications Section ── */}
                <div className="border border-stone-100 rounded-sm bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-stone-50 bg-stone-50/10 flex items-center space-x-3">
                        <Bell size={18} className="text-stone-400" />
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest">Notifications</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Weekly Treasury Briefs</div>
                                <div className="text-xs text-stone-500 font-light mt-1">Receive AI-generated yield summaries via email.</div>
                            </div>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Critical Action Alerts</div>
                                <div className="text-xs text-stone-500 font-light mt-1">Get notified when agents require manual approval signature.</div>
                            </div>
                            <div className="w-10 h-5 bg-stone-200 rounded-full relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── System Section ── */}
                <div className="border border-stone-100 rounded-sm bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-stone-50 bg-stone-50/10 flex items-center space-x-3">
                        <Cpu size={18} className="text-stone-400" />
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest">Protocol Stats</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center text-stone-400">
                                <Globe size={20} />
                            </div>
                            <div>
                                <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Current RPC</div>
                                <div className="text-xs font-mono font-bold">Mainnet Beta</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-stone-50 border border-stone-100 rounded-sm flex items-center justify-center text-stone-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Delivery Node</div>
                                <div className="text-xs font-mono font-bold">Resend / SMTP</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex justify-end">
                    <button className="bg-stone-900 text-white font-mono uppercase tracking-widest text-[10px] px-8 py-4 rounded-sm hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10">
                        Commit Protocol Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
