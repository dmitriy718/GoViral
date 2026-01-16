import { useState } from 'react';
import { GlassCard, FadeIn, PageHeader } from '@/components/ui/design-system';
import { SEO } from '@/components/seo/SEO';
import { generateContent, savePost } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Sparkles, Send, Copy, Repeat, Zap, Image as ImageIcon, AlignLeft, BarChart2, Video } from 'lucide-react';

interface GeneratedPost {
    content: string;
    platform?: string;
    mediaUrl?: string;
    hashtags?: string[];
}

export function CreatePost() {
    const [mode, setMode] = useState<'create' | 'repurpose'>('create');
    const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'poll'>('text');
    
    const [prompt, setPrompt] = useState('');
    const [sourceContent, setSourceContent] = useState(''); 
    const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
    const [loading, setLoading] = useState(false);

    // Automation States
    const [autoPlug, setAutoPlug] = useState(false);
    const [plugThreshold, setPlugThreshold] = useState(50);
    const [plugContent, setPlugContent] = useState('');

    const [autoDm, setAutoDm] = useState(false);
    const [dmKeyword, setDmKeyword] = useState('GUIDE');
    const [dmContent, setDmContent] = useState('');

    const handleGenerate = async () => {
        if (mode === 'create' && !prompt) return toast.error('Enter a topic');
        if (mode === 'repurpose' && !sourceContent) return toast.error('Enter content to repurpose');

        setLoading(true);
        try {
            const results = await generateContent(
                mode === 'create' ? [prompt] : [],
                'professional', 
                mode === 'create' ? postType : 'mix', // Use selected type in create mode
                'twitter',
                mode === 'create' && (postType === 'image' || postType === 'video'), // Include media if type matches
                mode === 'repurpose' ? 'repurpose' : 'mix',
                sourceContent
            );
            setGeneratedPosts(results);
        } catch (e) {
            console.error(e);
            toast.error('Failed to generate content');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (post: GeneratedPost) => {
        try {
            // Normalize data for backend
            const payload = {
                content: post.content,
                mediaUrl: post.mediaUrl || '', // Ensure it's not undefined if schema is strict
                platform: (post.platform || 'twitter').toLowerCase(),
                // Automations
                autoPlugEnabled: autoPlug,
                autoPlugThreshold: plugThreshold,
                autoPlugContent: plugContent,
                autoDmEnabled: autoDm,
                autoDmKeyword: dmKeyword,
                autoDmContent: dmContent
            };

            await savePost(payload);
            toast.success('Post scheduled!');
        } catch (e: unknown) {
            console.error('Save failed:', e);
            // Show specific error from backend if available
            const err = e as { response?: { data?: { error?: string; message?: string } } };
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save post';
            toast.error(msg);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <SEO title="Create Post" description="Generate and schedule viral content with AI." />
            <PageHeader title="Content Studio" subtitle="Create viral content or repurpose existing wins." />

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setMode('create')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'create' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                    ✨ New Creation
                </button>
                <button
                    onClick={() => setMode('repurpose')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'repurpose' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                    <Repeat className="inline w-4 h-4 mr-2" /> Repurpose (Omni-Post)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <FadeIn className="lg:col-span-1 space-y-6">
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">
                                {mode === 'create' ? 'Topic & Direction' : 'Source Material'}
                            </h3>
                        </div>
                        
                        {mode === 'create' && (
                            <div className="flex gap-2 mb-4 p-1 bg-black/20 rounded-lg">
                                {[
                                    { id: 'text', icon: AlignLeft, label: 'Text' },
                                    { id: 'image', icon: ImageIcon, label: 'Image' },
                                    { id: 'video', icon: Video, label: 'Video' },
                                    { id: 'poll', icon: BarChart2, label: 'Poll' },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setPostType(type.id as 'text' | 'image' | 'video' | 'poll')}
                                        className={`flex-1 flex items-center justify-center p-2 rounded-md transition-all ${
                                            postType === type.id 
                                            ? 'bg-primary text-white shadow-lg' 
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                        title={type.label}
                                    >
                                        <type.icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {mode === 'create' ? (
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={
                                    postType === 'text' ? "e.g. The future of AI in marketing..." :
                                    postType === 'image' ? "e.g. A futuristic workspace with neon lights..." :
                                    postType === 'poll' ? "e.g. Ask about remote work preferences..." :
                                    "Describe the video concept..."
                                }
                                className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        ) : (
                            <textarea
                                value={sourceContent}
                                onChange={(e) => setSourceContent(e.target.value)}
                                placeholder="Paste a blog post, a YouTube transcript, or a long rant here..."
                                className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-primary resize-none"
                            />
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? <Sparkles className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? 'Magic happening...' : 'Generate Magic'}
                        </button>
                    </GlassCard>

                    {/* Automation Panel */}
                    <GlassCard className="p-6 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <h3 className="font-bold text-white">Growth Automations</h3>
                        </div>

                        {/* Auto-Plug */}
                        <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Auto-Plug</label>
                                <input type="checkbox" checked={autoPlug} onChange={(e) => setAutoPlug(e.target.checked)} className="toggle" />
                            </div>
                            {autoPlug && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Trigger at</span>
                                        <input 
                                            type="number" 
                                            value={plugThreshold}
                                            onChange={(e) => setPlugThreshold(Number(e.target.value))}
                                            className="w-16 bg-black/20 border border-white/10 rounded p-1 text-xs text-white text-center"
                                        />
                                        <span className="text-xs text-muted-foreground">likes</span>
                                    </div>
                                    <textarea 
                                        value={plugContent}
                                        onChange={(e) => setPlugContent(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-white h-16 resize-none"
                                        placeholder="Reply with: Subscribe to my newsletter..."
                                    />
                                </div>
                            )}
                        </div>

                        {/* Auto-DM */}
                        <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-300">Auto-DM</label>
                                <input type="checkbox" checked={autoDm} onChange={(e) => setAutoDm(e.target.checked)} className="toggle" />
                            </div>
                            {autoDm && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 pt-2">
                                    <input 
                                        type="text" 
                                        value={dmKeyword}
                                        onChange={(e) => setDmKeyword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-white"
                                        placeholder="Trigger Keyword (e.g. GUIDE)"
                                    />
                                    <textarea 
                                        value={dmContent}
                                        onChange={(e) => setDmContent(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-white h-16 resize-none"
                                        placeholder="DM Content: Here is the link..."
                                    />
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </FadeIn>

                {/* Results Section */}
                <div className="lg:col-span-2 space-y-6">
                    {generatedPosts.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Ready to create.</p>
                            <p className="text-sm opacity-50">Select a mode and hit generate.</p>
                        </div>
                    ) : (
                        generatedPosts.map((post, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <GlassCard className="p-6 relative group border-l-4 border-l-primary">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => { navigator.clipboard.writeText(post.content); toast.success('Copied!'); }}
                                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded uppercase font-bold tracking-wider">
                                            {post.platform || 'Twitter'}
                                        </span>
                                        {post.mediaUrl && <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded font-bold">Media</span>}
                                    </div>

                                    <textarea
                                        defaultValue={post.content}
                                        className="w-full bg-transparent text-white border-none focus:ring-0 p-0 text-lg resize-none h-auto min-h-[100px] leading-relaxed"
                                    />
                                    
                                    {post.mediaUrl && (
                                        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                                            <img src={post.mediaUrl} alt="Generated Media" className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                                        <button 
                                            onClick={() => handleSave(post)}
                                            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            <Send className="w-4 h-4" /> Schedule Post
                                        </button>
                                    </div>
                                </GlassCard>
                            </FadeIn>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
