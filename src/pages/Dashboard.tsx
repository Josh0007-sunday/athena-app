import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, Shield, Zap, Circle, LayoutDashboard,
    MessageSquare, Settings, Copy, Check,
    ChevronLeft, ChevronRight, PieChart, Activity
} from 'lucide-react';

// Sub-components
import AgentChat from '../components/AgentChat';
import SettingsView from '../components/SettingsView';

export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [currentView, setCurrentView] = useState<'overview' | 'chat' | 'portfolio' | 'settings'>('overview');
    const [copied, setCopied] = useState(false);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('athena_user');
        const token = localStorage.getItem('athena_token');

        if (!storedUser || !token) {
            navigate('/connect');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Auto-Sync: If user already has a derived Solana address locally, ensure backend is in sync
            const isSolanaAddress = (addr: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
            if (parsedUser.walletAddress && isSolanaAddress(parsedUser.walletAddress)) {
                const checkIdentity = async () => {
                    try {
                        const syncResponse = await axios.post('/api/auth/link-wallet',
                            { walletAddress: parsedUser.walletAddress },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (syncResponse.data.token) {
                            localStorage.setItem('athena_token', syncResponse.data.token);
                        }
                    } catch (err) {
                        console.log('Identity already synchronized or sync failed.');
                    }
                };
                checkIdentity();
            }
        }
    }, [navigate]);

    // Fetch dashboard data
    useEffect(() => {
        if (!user?.walletAddress) return;

        setIsLoadingData(true);
        axios.get(`/api/portfolio/dashboard/${user.walletAddress}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('athena_token')}` }
        })
            .then(res => {
                setDashboardData(res.data);
                setIsLoadingData(false);
            })
            .catch(err => {
                console.error('Failed to fetch dashboard data:', err);
                setIsLoadingData(false);
            });
    }, [user?.walletAddress]);

    // Fetch Jupiter Portfolio natively when accessing view
    useEffect(() => {
        if (currentView === 'portfolio' && user?.walletAddress) {
            setIsLoadingPortfolio(true);
            axios.get(`https://api.jup.ag/portfolio/v1/positions?wallet=${user.walletAddress}`)
                .then(res => {
                    const data = res.data;
                    const items = Array.isArray(data) ? data : (data?.items || data?.data || []);
                    setPortfolioData(items);
                    setIsLoadingPortfolio(false);
                })
                .catch(err => {
                    console.error('Failed to fetch Jupiter Portfolio:', err);
                    // Provide an empty array on fail so UI shows 'empty' safely
                    setPortfolioData([]);
                    setIsLoadingPortfolio(false);
                });
        }
    }, [currentView, user?.walletAddress]);

    const handleLogout = async () => {
        localStorage.removeItem('athena_token');
        localStorage.removeItem('athena_user');
        navigate('/');
    };

    const handleCopy = () => {
        const addr = user?.walletAddress;
        if (addr) {
            navigator.clipboard.writeText(addr);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const displayAddress = user?.walletAddress;
    const shortAddress = displayAddress ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-6)}` : 'DISCONNECTED';

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'chat', label: 'Agent Chat', icon: MessageSquare },
        { id: 'portfolio', label: 'Portfolio', icon: PieChart },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-white text-stone-900 font-sans overflow-hidden">
            {/* Side Navigation */}
            <aside
                className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} border-r border-stone-100 flex flex-col transition-all duration-300 ease-in-out bg-white z-20`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between border-b border-stone-50">
                    {!isSidebarCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-7 h-7 bg-stone-900 text-white rounded-sm flex items-center justify-center p-1">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Athena</span>
                        </div>
                    )}
                    {isSidebarCollapsed && (
                        <div className="w-7 h-7 bg-stone-900 text-white rounded-sm flex items-center justify-center p-1 mx-auto">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-2 pt-8">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id as any)}
                            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-4 px-4'} py-3.5 rounded-sm transition-all duration-200 group ${currentView === item.id
                                ? 'bg-stone-50 text-stone-900'
                                : 'text-stone-400 hover:bg-stone-50/50 hover:text-stone-600'
                                }`}
                        >
                            <item.icon size={18} className={`${currentView === item.id ? 'text-stone-900' : ''}`} />
                            {!isSidebarCollapsed && (
                                <span className="text-[11px] font-mono uppercase tracking-widest">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Footer / Toggle */}
                <div className="p-4 border-t border-stone-100">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="w-full flex items-center justify-center p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-sm transition-all"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden h-full">
                {/* HeaderBar */}
                <header className="px-8 py-5 border-b border-stone-100 flex justify-between items-center bg-white">
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                            <h2 className="text-[10px] font-mono uppercase tracking-widest text-stone-400">Current View //</h2>
                            <h1 className="text-xs font-mono uppercase font-bold text-stone-900">{currentView}</h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 bg-stone-50 px-4 py-2 border border-stone-100 rounded-sm">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Network Status</span>
                                <span className="text-[10px] font-mono font-medium flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
                                    Mainnet-Beta
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center bg-stone-900 text-white px-4 py-2 rounded-sm space-x-3 shadow-sm group">
                            <div className="flex flex-col cursor-help pt-0.5">
                                <span className="text-[8px] font-mono uppercase tracking-tight text-stone-500 group-hover:text-stone-400 transition-colors">Session Lock</span>
                                <span className="text-[10px] font-mono tracking-wider">{shortAddress}</span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-stone-50 rounded-full transition-colors text-stone-400 hover:text-stone-900"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>

                {/* View Container */}
                <div className="flex-1 overflow-y-auto bg-stone-50/20">
                    {currentView === 'overview' && (
                        <div className="p-8 lg:p-12 w-full animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                                <div className="col-span-1 lg:col-span-3 border border-stone-100 p-8 rounded-sm bg-stone-50/50 flex flex-col justify-between">
                                    <div>
                                        <div className="inline-flex items-center space-x-2 text-[9px] font-mono uppercase tracking-widest text-stone-500 mb-6 border border-stone-200 px-3 py-1 bg-white">
                                            <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse"></span>
                                            <span>Agent Core: Online</span>
                                        </div>
                                        <h1 className="text-4xl font-medium tracking-tight mb-4">Market Outlook</h1>
                                        <p className="text-sm text-stone-500 max-w-xl font-light leading-relaxed">
                                            Solana network throughput is stabilizing. Your agent is currently optimizing APY allocations across Kamino and Lulo nodes. No critical actions pending.
                                        </p>
                                    </div>

                                    <div className="mt-12 flex items-center space-x-8">
                                        <div className="flex items-center space-x-3">
                                            <Zap size={20} className="text-stone-300" />
                                            <div>
                                                <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Total Yield Generated</div>
                                                <div className="text-xs font-mono font-bold">
                                                    ${dashboardData?.positions ? (dashboardData.positions.lulo + dashboardData.positions.kamino).toFixed(2) : '0.00'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-px h-8 bg-stone-100"></div>
                                        <div className="flex items-center space-x-3">
                                            <Shield size={20} className="text-stone-300" />
                                            <div>
                                                <div className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Privacy Mode</div>
                                                <div className="text-xs font-mono font-bold">Umbra Active</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border border-stone-100 p-8 rounded-sm bg-stone-900 text-white flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <Activity size={24} className="text-stone-400" />
                                        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">Real-time</span>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-medium mb-2">Waitlisted</div>
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400 leading-normal">
                                            Priority queue enabled. Your decentralized derivation is healthy.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <div className="border border-stone-100 p-6 rounded-sm h-64 flex flex-col justify-start relative text-stone-900 overflow-hidden bg-white">
                                    <div className="flex items-center space-x-2 mb-6 text-stone-400">
                                        <Zap size={16} />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Yield Reports</span>
                                    </div>
                                    {isLoadingData ? (
                                        <div className="flex-1 flex flex-col justify-center items-center text-stone-300">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] animate-pulse">Syncing...</span>
                                        </div>
                                    ) : dashboardData?.apys ? (
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex justify-between items-center border-b border-stone-50 pb-2">
                                                <span className="text-xs text-stone-500">Lulo Finance APY</span>
                                                <span className="font-mono text-sm font-medium text-emerald-500">{dashboardData.apys.lulo}%</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-stone-50 pb-2">
                                                <span className="text-xs text-stone-500">Kamino Finance APY</span>
                                                <span className="font-mono text-sm font-medium text-emerald-500">{dashboardData.apys.kamino}%</span>
                                            </div>
                                            <div className="mt-4 bg-emerald-50 text-emerald-700 p-3 rounded-sm text-[10px] font-mono leading-relaxed">
                                                Both protocols are currently offering standard yields. Agent suggests maintaining current allocations.
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col justify-center items-center text-stone-300">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Unavailable</span>
                                        </div>
                                    )}
                                </div>
                                <div className="border border-stone-100 p-6 rounded-sm h-64 flex flex-col justify-start relative text-stone-900 overflow-hidden bg-white">
                                    <div className="flex items-center space-x-2 mb-6 text-stone-400">
                                        <PieChart size={16} />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Asset Ratios</span>
                                    </div>
                                    {isLoadingData ? (
                                        <div className="flex-1 flex flex-col justify-center items-center text-stone-300">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] animate-pulse">Syncing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-stone-500">Idle Wallet Balance</span>
                                                <span className="font-mono text-sm font-medium">${dashboardData?.usdcBalance?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-stone-500">Lulo Allocation</span>
                                                <span className="font-mono text-sm font-medium">${dashboardData?.positions?.lulo?.toFixed(2) || '0.00'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-stone-500">Kamino Allocation</span>
                                                <span className="font-mono text-sm font-medium">${dashboardData?.positions?.kamino?.toFixed(2) || '0.00'}</span>
                                            </div>

                                            {/* Visual Bar */}
                                            <div className="mt-4 w-full h-1.5 bg-stone-100 rounded-full overflow-hidden flex">
                                                {(dashboardData?.usdcBalance > 0 || dashboardData?.positions?.lulo > 0 || dashboardData?.positions?.kamino > 0) ? (
                                                    <>
                                                        <div className="bg-emerald-400 h-full" style={{ width: `${(dashboardData?.positions?.lulo / (dashboardData?.usdcBalance + dashboardData?.positions?.lulo + dashboardData?.positions?.kamino)) * 100}%` }}></div>
                                                        <div className="bg-stone-500 h-full" style={{ width: `${(dashboardData?.positions?.kamino / (dashboardData?.usdcBalance + dashboardData?.positions?.lulo + dashboardData?.positions?.kamino)) * 100}%` }}></div>
                                                        <div className="bg-stone-300 h-full flex-1"></div>
                                                    </>
                                                ) : (
                                                    <div className="bg-stone-300 h-full w-full"></div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="border border-stone-100 p-6 rounded-sm h-64 flex flex-col justify-start relative text-stone-900 overflow-hidden bg-white">
                                    <div className="flex items-center justify-between mb-4 text-stone-400">
                                        <div className="flex items-center space-x-2">
                                            <Circle size={16} />
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium">Action Logs</span>
                                        </div>
                                    </div>
                                    {isLoadingData ? (
                                        <div className="flex-1 flex flex-col justify-center items-center text-stone-300">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] animate-pulse">Syncing...</span>
                                        </div>
                                    ) : dashboardData?.recentActions && dashboardData.recentActions.length > 0 ? (
                                        <div className="flex flex-col space-y-3 overflow-y-auto pr-2 no-scrollbar">
                                            {dashboardData.recentActions.slice(0, 4).map((action: any) => (
                                                <div key={action._id} className="flex justify-between items-start text-xs border-b border-stone-50 pb-2">
                                                    <div className="flex flex-col">
                                                        <span className="capitalize font-medium">{action.type}</span>
                                                        <span className="text-[9px] text-stone-400 font-mono mt-0.5">{new Date(action.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="font-mono text-stone-600">${action.amount?.toFixed(2) || '0.00'}</span>
                                                        <span className="text-[9px] text-emerald-500 font-mono capitalize">{action.protocol}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col justify-center items-center text-stone-400">
                                            <span className="text-[10px] uppercase tracking-wider mb-2">No Active Logs</span>
                                            <span className="text-[10px] font-mono text-center leading-relaxed opacity-60">Deposit funds via chat to initialize yield strategies</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentView === 'chat' && <AgentChat />}
                    {currentView === 'settings' && <SettingsView />}
                    {currentView === 'portfolio' && (
                        <div className="p-8 lg:p-12 w-full animate-in fade-in duration-500">
                            <div className="mb-8">
                                <h1 className="text-3xl font-medium tracking-tight mb-2">Portfolio Overview</h1>
                                <p className="text-sm text-stone-500 font-light">Global positions provided natively via Jupiter Network.</p>
                            </div>

                            {isLoadingPortfolio ? (
                                <div className="flex flex-col items-center justify-center min-h-[40vh] text-stone-300 space-y-4">
                                    <PieChart size={48} className="animate-pulse text-stone-100" />
                                    <span className="text-[10px] font-mono uppercase tracking-widest">Scanning Blockchain //</span>
                                </div>
                            ) : portfolioData ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {portfolioData.length > 0 ? (
                                        portfolioData.map((pos: any, idx: number) => (
                                            <div key={idx} className="border border-stone-100 p-6 rounded-sm bg-white flex flex-col relative text-stone-900 group hover:border-stone-200 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        {pos.logoURI ? (
                                                            <img src={pos.logoURI} alt={pos.symbol} className="w-8 h-8 rounded-full shadow-sm" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
                                                                <span className="text-[10px] font-bold">{pos.symbol?.charAt(0) || '?'}</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-sm">{pos.name || pos.symbol || 'Unknown Token'}</div>
                                                            <div className="text-[10px] uppercase font-mono text-stone-400">{pos.symbol || 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-1">
                                                    <div className="text-[10px] uppercase font-mono tracking-widest text-stone-400">Balance</div>
                                                    <div className="text-xl font-mono">${(pos.valueUsd || 0).toFixed(2)}</div>
                                                    <div className="text-xs text-stone-500 font-mono mt-1">{parseFloat(pos.uiAmountString || pos.uiAmount || 0).toFixed(6)} {pos.symbol}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 border border-stone-100 p-12 text-center rounded-sm bg-white flex flex-col items-center justify-center space-y-4">
                                            <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center">
                                                <Zap size={20} className="text-stone-300" />
                                            </div>
                                            <span className="text-stone-400 font-mono text-xs uppercase tracking-widest">No active positions discovered via Jupiter</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="border border-stone-100 p-12 text-center rounded-sm bg-stone-50/50">
                                    <span className="text-stone-400 font-mono text-xs uppercase tracking-widest">Jupiter Portfolio System Offline</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
