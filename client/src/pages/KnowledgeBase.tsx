import { GlassCard, FadeIn } from "@/components/ui/design-system";
import { Search, BookOpen, FileText, Video, Tag } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const ARTICLES = [
    { title: "App Walkthrough: From Zero to Viral", category: "Getting Started", time: "10 min read", desc: "A complete tour of the entire ViralPost ecosystem." },
    { title: "Dashboard: Mastering Your Command Center", category: "Features", time: "3 min read", desc: "Understanding Viral Scores, ROI stats, and platform health." },
    { title: "Wizard: Setting Up Your First Campaign", category: "Setup", time: "5 min read", desc: "How to use the engine bay to configure projects and personas." },
    { title: "Content Studio: Creating Magic", category: "Creation", time: "7 min read", desc: "Using AI, trending data, and multi-platform previews." },
    { title: "Calendar: Scheduling for Success", category: "Planning", time: "4 min read", desc: "Drag-and-drop workflow and viral daily drops." },
    { title: "Support: Getting Help When You Need It", category: "Support", time: "2 min read", desc: "How to file tickets and use the self-service portal." },
    { title: "Settings: Managing Your Account", category: "Admin", time: "3 min read", desc: "Billing, team members, and API keys." },
];

export function KnowledgeBase() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const filtered = ARTICLES.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));

    const handleVideoClick = () => {
        toast("Video player feature coming in v1.1", { icon: "🎥" });
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <FadeIn>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white text-glow mb-4">Knowledge Base</h1>
                    <p className="text-muted-foreground text-lg mb-8">Master every tool in your arsenal.</p>

                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xl shadow-primary/10"
                            placeholder="Search for guides, tutorials, and tips..."
                        />
                    </div>
                </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-secondary" />
                        Core Guides
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {filtered.map((article, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <GlassCard hoverEffect className="flex items-center justify-between group cursor-pointer p-6" onClick={() => navigate(`/learn/${ARTICLES.indexOf(article) + 1}`)}>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-lg">{article.title}</h3>
                                            <p className="text-sm text-gray-400 mt-1">{article.desc}</p>
                                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded"><Tag className="w-3 h-3" /> {article.category}</span>
                                                <span>•</span>
                                                <span>{article.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </FadeIn>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                No articles found matching "{search}"
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-pink-500" />
                        Video Tutorials
                    </h2>
                    <GlassCard className="relative overflow-hidden aspect-video group cursor-pointer" onClick={handleVideoClick}>
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                            </div>
                        </div>
                        {/* Placeholder image removed to prevent 404 logs, using CSS placeholder instead */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-muted-foreground text-sm">
                            Walkthrough Thumbnail
                        </div>
                    </GlassCard>
                    <GlassCard className="relative overflow-hidden aspect-video group cursor-pointer" onClick={handleVideoClick}>
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                            </div>
                        </div>
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-muted-foreground text-sm">
                            Advanced AI Thumbnail
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}