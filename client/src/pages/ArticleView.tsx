import { useNavigate } from 'react-router-dom';
import { GlassCard, FadeIn } from "@/components/ui/design-system";
import { ArrowLeft, Search, Zap } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { SEO } from '@/components/seo/SEO';
import { useEffect, useState, useMemo } from 'react';
import DOMPurify from 'dompurify';
import api from '@/lib/api';

interface Article {
    id: number;
    title: string;
    category: string;
    time: string;
    description: string;
    content: string;
    imageUrl?: string;
}

export function ArticleView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/articles/${id}`);
                if (response.data && typeof response.data === 'object' && 'id' in response.data) {
                    setArticle(response.data);
                } else {
                    console.error("Invalid article data received:", response.data);
                    setArticle(null);
                }
            } catch (error) {
                console.error("Failed to fetch article", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const sanitizedContent = useMemo(() => {
        if (!article?.content) return '';
        return DOMPurify.sanitize(article.content);
    }, [article?.content]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-muted-foreground animate-pulse">Loading article content...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <SEO title={article ? article.title : "Article Not Found"} />
            <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
            </button>
            <FadeIn>
                <GlassCard className="max-w-none relative overflow-visible">
                    {/* Decorative Background Glow */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-40 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

                    {article ? (
                        <>
                            {article.imageUrl && (
                                <div className="mb-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-64 md:h-80 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            <div className="mb-10 border-b border-white/10 pb-8 relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                                        {article.category || 'Guide'}
                                    </span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-500" />
                                        {article.time || '5 min read'}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white text-glow leading-tight mb-4">
                                    {article.title}
                                </h1>
                                <p className="text-xl text-gray-400 leading-relaxed font-light">
                                    {article.description || 'Master the art of social growth with this comprehensive guide.'}
                                </p>
                            </div>

                            <div className="prose prose-invert prose-lg max-w-none
                                prose-headings:text-white prose-headings:font-bold prose-headings:scroll-mt-20
                                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:flex prose-h2:items-center prose-h2:gap-3
                                prose-h3:text-xl prose-h3:text-secondary prose-h3:mt-8 prose-h3:mb-4
                                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                                prose-li:text-gray-300 prose-li:marker:text-primary/50
                                prose-strong:text-white prose-strong:font-semibold
                                prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                                ">
                                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-3">Article Unavailable</h1>
                            <p className="text-muted-foreground mb-8 text-lg">We couldn't locate that specific guide. It may have been moved or updated.</p>
                            <button onClick={() => navigate('/learn')} className="px-6 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all border border-white/5 hover:border-white/20 font-medium">
                                Browse Library
                            </button>
                        </div>
                    )}

                    {article && (
                        <div className="mt-16 pt-8 border-t border-white/10">
                            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
                                    <span className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500"><Zap className="w-5 h-5 fill-current" /></span>
                                    Key Takeaways
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-primary font-bold mb-2 text-2xl">01</div>
                                        <p className="text-sm text-gray-300 leading-relaxed">Follow the core loop: Plan, Generate, Schedule, Analyze for consistent growth.</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-primary font-bold mb-2 text-2xl">02</div>
                                        <p className="text-sm text-gray-300 leading-relaxed">Leverage the Viral Score to predict performance before you post.</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="text-primary font-bold mb-2 text-2xl">03</div>
                                        <p className="text-sm text-gray-300 leading-relaxed">Engage with your audience in the first 15 minutes to boost algorithmic velocity.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </FadeIn>
        </div>
    )
}
