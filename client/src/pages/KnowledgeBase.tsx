import { GlassCard, FadeIn } from "@/components/ui/design-system";
import { Search, BookOpen, Video } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { SEO } from '@/components/seo/SEO';
import api from '@/lib/api';

interface Article {
    id: number;
    title: string;
    category: string;
    time: string;
    description: string;
}

export function KnowledgeBase() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/articles');
                setArticles(response.data);
            } catch (error) {
                console.error("Failed to fetch articles", error);
                toast.error("Failed to load knowledge base");
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const filtered = Array.isArray(articles) ? articles.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.category.toLowerCase().includes(search.toLowerCase())
    ) : [];

    const handleVideoClick = () => {
        toast("Video player feature coming in v1.1", { icon: "🎥" });
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <SEO title="Knowledge Base" description="Master the viral tools." />
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
                    <div className="space-y-4">
                        {loading ? (
                            <GlassCard className="p-8 text-center text-muted-foreground">
                                Loading library...
                            </GlassCard>
                        ) : filtered.length > 0 ? (
                            <GlassCard className="space-y-1">
                                {filtered.map((article) => (
                                    <div
                                        key={article.id}
                                        onClick={() => navigate(`/learn/${article.id}`)}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-between group py-3 border-b border-white/5 last:border-0 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{article.title}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary/80 transition-colors">
                                                {article.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs">{article.time}</span>
                                            <BookOpen className="w-3 h-3" />
                                        </div>
                                    </div>
                                ))}
                            </GlassCard>
                        ) : (
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