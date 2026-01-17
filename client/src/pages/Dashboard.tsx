import { useNavigate } from 'react-router-dom';
import { GlassCard, FadeIn, PageHeader, Button } from '@/components/ui/design-system';
import { TrendingUp, Users, Activity, Target, Zap, Eye, MoreHorizontal, Loader2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { addCompetitor, getCompetitors, getDashboardStats, getTrends, connectProvider, getSocialAccounts } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';

import { SEO } from '@/components/seo/SEO';

interface SocialAccount {
    provider: string;
    username?: string;
    connected: boolean;
}

interface Competitor {
    handle: string;
    lastPost?: string;
    analysis?: {
        bestTime: string;
        engagementRate: string;
        topHashtags: string[];
    };
}

const CHART_DATA = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 700 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 1000 },
];

export function Dashboard() {
    const mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
    const navigate = useNavigate();
    const { user } = useAuth();
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [loadingComps, setLoadingComps] = useState(false);


    const [stats, setStats] = useState({
        viralScore: 0,
        estRoi: 0,
        totalReach: 0,
        activePersonas: 0
    });
    const [trends, setTrends] = useState<{ topic: string, vol: string, sentiment: string, growth: string }[]>([]);
    const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

    useEffect(() => {
        if (!user) return;
        
        const initDashboard = async () => {
            await Promise.all([
                loadCompetitors(),
                loadStats(),
                loadTrends(),
                loadSocials()
            ]);
        };

        initDashboard();
    }, [user]);

    const loadSocials = async () => {
        try {
            const accounts = await getSocialAccounts();
            setConnectedPlatforms(accounts.map((a: SocialAccount) => a.provider));
        } catch {
            console.error("Failed to load social accounts");
        }
    };

    const handleConnect = async (provider: string) => {
        try {
            await connectProvider(provider);
            toast.success(`Connected to ${provider}`);
            loadSocials();
        } catch {
            toast.error(`Failed to connect to ${provider}`);
        }
    };

    const loadTrends = async () => {
        try {
            const data = await getTrends();
            setTrends(data);
        } catch {
            console.error("Failed to load trends");
        }
    };

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch {
            console.error("Failed to load dashboard stats");
        }
    };

    const loadCompetitors = async () => {
        try {
            const data = await getCompetitors();
            setCompetitors(data);
        } catch {
            console.error("Failed to load competitors");
        }
    };

    const handleAddCompetitor = async () => {
        const handle = prompt("Enter competitor Twitter handle (e.g. @competitor):");
        if (!handle) return;

        setLoadingComps(true);
        try {
            await addCompetitor(handle);
            toast.success(`Tracking started for ${handle}`);
            loadCompetitors();
        } catch {
            toast.error("Failed to add competitor");
        } finally {
            setLoadingComps(false);
        }
    };

    const PLATFORMS_STATUS = [
        { id: 'twitter', name: 'X (Twitter)', icon: '𝕏', color: 'bg-black' },
        { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'bg-[#0077b5]' },
        { id: 'instagram', name: 'Instagram', icon: '📸', color: 'bg-gradient-to-tr from-yellow-400 to-purple-600' },
        { id: 'facebook', name: 'Facebook', icon: 'f', color: 'bg-[#1877F2]' },
        { id: 'reddit', name: 'Reddit', icon: 'r/', color: 'bg-[#FF4500]' },
    ];
    const chartData = mockMode ? CHART_DATA : [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <SEO title="Dashboard" description="Monitor your viral performance and track key metrics." />
            <div className="flex justify-between items-center">
                <PageHeader title="Command Center" subtitle="Welcome back, Mastermind." />
                <Button
                    onClick={() => navigate('/wizard')}
                    className="gap-2"
                >
                    <Zap className="w-4 h-4" /> New Campaign
                </Button>
            </div>

            {/* Platform Matrix */}
            <FadeIn>
                <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Platform Matrix</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {PLATFORMS_STATUS.map((p) => {
                            const isConnected = connectedPlatforms.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => handleConnect(p.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[160px] transition-all duration-300",
                                        isConnected
                                            ? "bg-white/5 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                            : "bg-white/5 border-white/5 opacity-60 hover:opacity-100 hover:bg-white/10"
                                    )}>
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm", p.color)}>
                                        {p.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs font-semibold text-white">{p.name}</div>
                                        <div className={cn("text-[10px] flex items-center gap-1", isConnected ? "text-green-400" : "text-muted-foreground")}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-gray-600")} />
                                            {isConnected ? 'Active' : 'Connect'}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </GlassCard>
            </FadeIn>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Viral Score™', val: `${stats.viralScore}/100`, change: '+12%', icon: Activity, color: 'text-primary' },
                    { label: 'Est. ROI', val: `$${stats.estRoi}`, change: '+$420', icon: Target, color: 'text-green-400' },
                    { label: 'Total Reach', val: `${stats.totalReach}`, change: '+2.4k', icon: Eye, color: 'text-purple-400' },
                    { label: 'Personas', val: `${stats.activePersonas}`, change: 'Active', icon: Users, color: 'text-pink-400' },
                ].map((stat, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <GlassCard hoverEffect className="p-5 flex flex-col justify-between h-36 relative overflow-hidden group">
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">{stat.change}</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.val}</h3>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                            {/* Decorative gradient blob */}
                            <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-10 blur-2xl rounded-full ${stat.color.replace('text-', 'text-')}`} />
                        </GlassCard>
                    </FadeIn>
                ))}
            </div>

            {/* Analytics & Trends Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Analytics Chart */}
                <FadeIn delay={0.4} className="lg:col-span-2">
                    <GlassCard className="h-full min-h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" /> Growth Analytics
                            </h3>
                            <div className="flex gap-2">
                                <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">7D</button>
                                <button className="text-xs px-3 py-1.5 rounded-lg bg-transparent text-muted-foreground hover:bg-white/5 transition-colors">30D</button>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-[300px]">
                            {chartData.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                                    No analytics data yet.
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </GlassCard>
                </FadeIn>

                {/* Right Column: Trends & Competitors */}
                <div className="space-y-8">
                    {/* Feature 4: Trend Watch */}
                    <FadeIn delay={0.5}>
                        <GlassCard>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" /> Trending Now
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {trends.length === 0 ? (
                                    <p className="text-center text-sm text-muted-foreground py-4">Loading trends...</p>
                                ) : (
                                    trends.slice(0, 3).map((trend, i) => (
                                        <div key={i} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer">
                                            <div>
                                                <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{trend.topic}</h4>
                                                <p className="text-xs text-muted-foreground">{trend.vol} • {trend.sentiment}</p>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                                        </div>
                                    )))}
                            </div>
                        </GlassCard>
                    </FadeIn>

                    {/* Feature 2: Competitor Spy */}
                    <FadeIn delay={0.6}>
                        <GlassCard>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-red-400" /> Competitors
                                </h3>
                                <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                            </div>
                            <div className="space-y-4">
                                {competitors.length === 0 ? (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-muted-foreground mb-3">No competitors tracked.</p>
                                    </div>
                                ) : (
                                    competitors.slice(0, 3).map((comp, i) => (
                                        <div key={i} className="flex flex-col gap-2 p-3 bg-black/20 rounded-lg border border-white/5">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm text-white">{comp.handle}</span>
                                                <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">Active</span>
                                            </div>
                                            {comp.analysis && (
                                                <div className="flex gap-2 mt-1">
                                                    {comp.analysis.topHashtags.slice(0, 2).map((tag) => (
                                                        <span key={tag} className="text-[10px] text-muted-foreground bg-white/5 px-1.5 py-0.5 rounded">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                
                                <Button 
                                    variant="outline" 
                                    className="w-full text-xs h-9"
                                    onClick={handleAddCompetitor}
                                    disabled={loadingComps}
                                >
                                    {loadingComps ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : '+ Track Competitor'}
                                </Button>
                            </div>
                        </GlassCard>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
