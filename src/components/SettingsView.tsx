import React from 'react';
import { Bell, Shield, Wallet, Mail, Cpu, Globe } from 'lucide-react';

export default function SettingsView() {
    return (
        <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
            <div className="mb-12">
                <h1 className="text-3xl font-medium tracking-tight mb-3">Protocol Settings</h1>
                <p className="text-sm text-stone-500 font-light uppercase tracking-widest text-[10px] font-mono">Configure Agent Autonomy & Security</p>
            </div>

            <div className="space-y-6">
                {/* Security Section */}
                <div className="border border-stone-100 rounded-sm bg-white overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-stone-50 bg-stone-50/10 flex items-center space-x-3">
                        <Shield size={18} className="text-stone-400" />
                        <h2 className="text-xs font-mono font-bold uppercase tracking-widest">Security & Privacy</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium">Decentralized Shard Derivation</div>
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

                {/* Notifications Section */}
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

                {/* System Section */}
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
