import { useNavigate } from 'react-router-dom';
import { GlassCard, FadeIn, PageHeader } from '@/components/ui/design-system';
import { TrendingUp, Users, Activity, Target, Zap, Eye, MoreHorizontal, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { addCompetitor, getCompetitors } from '@/lib/api';

export function Dashboard() {
    const navigate = useNavigate();
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [loadingComps, setLoadingComps] = useState(false);

    useEffect(() => {
        loadCompetitors();
    }, []);

    const loadCompetitors = async () => {
        try {
            const data = await getCompetitors();
            setCompetitors(data);
        } catch (e) {
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
        } catch (e) {
            toast.error("Failed to add competitor");
        } finally {
            setLoadingComps(false);
        }
    };

    const PLATFORMS_STATUS = [
        { id: 'twitter', name: 'X (Twitter)', connected: true, color: 'bg-black' },
        { id: 'linkedin', name: 'LinkedIn', connected: true, color: 'bg-blue-700' },
        { id: 'instagram', name: 'Instagram', connected: false, color: 'bg-pink-600' },
        { id: 'facebook', name: 'Facebook', connected: false, color: 'bg-blue-600' },
        { id: 'reddit', name: 'Reddit', connected: true, color: 'bg-orange-500' },
        { id: 'discord', name: 'Discord', connected: false, color: 'bg-indigo-500' },
        { id: 'slack', name: 'Slack', connected: false, color: 'bg-purple-600' },
        { id: 'email', name: 'Email', connected: true, color: 'bg-green-600' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <PageHeader title="Command Center" subtitle="Welcome back, Mastermind." />
                <button
                    onClick={() => navigate('/wizard')}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] flex items-center gap-2"
                >
                    <Zap className="w-4 h-4" /> New Campaign
                </button>
            </div>

            {/* Platform Health Check */}
            <FadeIn>
                <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Platform Matrix</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {PLATFORMS_STATUS.map((p) => (
                            <div key={p.id} className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300",
                                p.connected
                                    ? "bg-green-500/10 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                                    : "bg-red-500/5 border-red-500/20 opacity-70 hover:opacity-100 hover:bg-red-500/10"
                            )}>
                                <div className={cn("w-3 h-3 rounded-full absolute top-2 right-2", p.connected ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mb-2 text-white font-bold", p.color)}>
                                    {p.name[0]}
                                </div>
                                <span className="text-xs font-medium text-white">{p.name}</span>
                                <span className={cn("text-[10px] mt-1", p.connected ? "text-green-400" : "text-red-400")}>
                                    {p.connected ? 'Online' : 'Disconnected'}
                                </span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </FadeIn>

            {/* Feature 1 & 10: Viral Score & ROI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Viral Score™ Avg', val: '88/100', change: '+5%', icon: Activity, color: 'text-green-400' },
                    { label: 'Est. ROI Value', val: '$12,450', change: '+$2.1k', icon: Target, color: 'text-blue-400' },
                    { label: 'Total Reach', val: '1.2M', change: '+15%', icon: Eye, color: 'text-purple-400' },
                    { label: 'Active Personas', val: '4', change: 'All Health', icon: Users, color: 'text-pink-400' },
                ].map((stat, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <GlassCard hoverEffect className="p-5 flex flex-col justify-between h-32">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{stat.val}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        </GlassCard>
                    </FadeIn>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Feature 4: Trend Watch */}
                <FadeIn delay={0.4} className="lg:col-span-2">
                    <GlassCard className="h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-secondary" /> Trend Watch
                            </h3>
                            <button className="text-xs text-primary hover:text-white transition-colors">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { topic: "#GenerativeAI", vol: "2.4M posts", sentiment: "Positive", growth: "+120%" },
                                { topic: "Sustainable Tech", vol: "850k posts", sentiment: "Neutral", growth: "+45%" },
                                { topic: "Remote Work 2.0", vol: "500k posts", sentiment: "Mixed", growth: "+12%" },
                            ].map((trend, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-white/50 group-hover:text-primary transition-colors">0{i + 1}</span>
                                        <div>
                                            <h4 className="font-semibold text-white">{trend.topic}</h4>
                                            <p className="text-xs text-muted-foreground">{trend.vol} • {trend.sentiment}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-green-400 font-bold">{trend.growth}</span>
                                        <span className="text-xs text-muted-foreground">velocity</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </FadeIn>

                {/* Feature 2: Competitor Spy */}
                <FadeIn delay={0.5}>
                    <GlassCard className="h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Eye className="w-5 h-5 text-red-400" /> Competitor Spy
                            </h3>
                            <button className="p-1 hover:bg-white/10 rounded"><MoreHorizontal className="w-4 h-4 text-muted-foreground" /></button>
                        </div>
                        <div className="space-y-6">
                            {competitors.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-4">No competitors tracked yet.</p>
                            ) : (
                                competitors.map((comp, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                            {comp.handle[1]}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-white flex justify-between">
                                                {comp.handle}
                                                <span className="text-[10px] text-muted-foreground">{comp.lastPost}</span>
                                            </h4>
                                            <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                                                <div className="bg-red-500/50 h-full rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }} />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-1">Engagement Heatmap</p>
                                        </div>
                                    </div>
                                ))
                            )}

                            <button
                                onClick={handleAddCompetitor}
                                disabled={loadingComps}
                                className="w-full py-2 text-sm text-center border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white flex items-center justify-center gap-2"
                            >
                                {loadingComps ? <Loader2 className="w-3 h-3 animate-spin" /> : '+ Add Competitor'}
                            </button>
                        </div>
                    </GlassCard>
                </FadeIn>
            </div>
        </div>
    );
}
