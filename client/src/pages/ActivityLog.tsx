import { GlassCard, FadeIn, PageHeader } from "@/components/ui/design-system";
import { CheckCircle, AlertCircle, Clock, Filter } from 'lucide-react';

const ACTIVITIES = [
    { id: 1, action: "Post Published", details: "Morning Motivation thread went live on Twitter", time: "2 mins ago", status: "success" },
    { id: 2, action: "Draf Saved", details: "Saved 'AI Trends 2025' to drafts", time: "15 mins ago", status: "success" },
    { id: 3, action: "Connection Error", details: "Failed to refresh Instagram tokens", time: "1 hour ago", status: "error" },
    { id: 4, action: "Billing Updated", details: "Monthly invoice paid successfully", time: "2 days ago", status: "success" },
    { id: 5, action: "New Member", details: "Sarah Smith joined the team", time: "3 days ago", status: "success" },
];

import { SEO } from '@/components/seo/SEO';

export function ActivityLog() {
    const mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
    const items = mockMode ? ACTIVITIES : [];
    return (
        <div className="space-y-8 p-8 min-h-screen bg-background text-foreground">
            <SEO title="Activity Log" description="Track workspace actions." />
            <PageHeader title="Activity Log" subtitle="Track every action within your workspace." />

            <FadeIn>
                <GlassCard className="p-0 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Recent Events
                        </h3>
                        <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {items.length === 0 ? (
                            <div className="p-6 text-sm text-muted-foreground">No activity to display.</div>
                        ) : items.map((activity) => (
                            <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {activity.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-white">{activity.action}</h4>
                                    <p className="text-xs text-muted-foreground">{activity.details}</p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </FadeIn>
        </div>
    );
}
