import { useState } from 'react';
import { PenTool, Image as ImageIcon, Video, BarChart2, Link as LinkIcon, Sparkles, Loader2, Save, Twitter, Linkedin, Facebook, Grid, Globe, Zap, ExternalLink, Eye, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateContent, savePost } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { GlassCard } from '@/components/ui/design-system';
import { TRENDS, MOCK_VIRAL_EXAMPLES } from '@/lib/data';

type PostType = 'text' | 'image' | 'video' | 'poll' | 'link';
type Platform = 'twitter' | 'linkedin' | 'facebook' | 'all';

export function CreatePost() {
  const [postType, setPostType] = useState<PostType>('text');
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Trending Data Logic
  const currentTrends = TRENDS[postType === 'link' || postType === 'poll' ? postType : 'general'];
  const typeTips = TRENDS[postType] || [];

  const handleGenerate = async () => {
    if (!keywords) return toast.error('Please enter some keywords first!');
    setIsGenerating(true);
    try {
      const suggestions = await generateContent(keywords.split(','), 'Professional', postType, platform === 'all' ? 'twitter' : platform);
      if (suggestions && suggestions.length > 0) {
        setContent(suggestions[0].content);
        toast.success('Content generated!');
      }
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCrawlLink = async () => {
      if(!linkUrl) return toast.error("Enter a URL");
      setIsCrawling(true);
      setTimeout(() => {
          setContent(`🚀 Just discovered this amazing resource: ${linkUrl}\n\nKey Takeaway: It completely changes how we think about [Subject].\n\nMust read for anyone in #Tech!`);
          setIsCrawling(false);
          toast.success("Link analyzed & summary generated!");
      }, 1500);
  }

  const handleSave = async () => {
    if (!content) return toast.error('Post content cannot be empty');
    setIsSaving(true);
    try {
      await savePost(content, postType);
      toast.success('Draft saved successfully!');
      setContent('');
      setKeywords('');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-white text-glow">Content Studio</h1>
        <div className="flex gap-2">
           <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 mr-4">
              {['twitter', 'linkedin', 'facebook'].map(p => (
                  <button key={p} onClick={() => setPlatform(p as Platform)} className={cn("p-2 rounded-md transition-all", platform === p ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white")}>
                    {p === 'twitter' && <Twitter className="w-4 h-4" />}
                    {p === 'linkedin' && <Linkedin className="w-4 h-4" />}
                    {p === 'facebook' && <Facebook className="w-4 h-4" />}
                  </button>
              ))}
              <div className="w-px bg-white/10 mx-1" />
              <button onClick={() => setPlatform('all')} className={cn("p-2 rounded-md transition-all", platform === 'all' ? "bg-secondary text-white shadow-lg shadow-secondary/20" : "text-muted-foreground hover:text-white")}>
                  <Grid className="w-4 h-4" />
              </button>
           </div>

          <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-white">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] flex items-center gap-2">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate with AI
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* LEFT: Editor & Tools */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
             {/* Editor Card */}
             <GlassCard className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                     {[
                        { id: 'text', icon: PenTool, label: 'Text' },
                        { id: 'image', icon: ImageIcon, label: 'Image' },
                        { id: 'video', icon: Video, label: 'Video' },
                        { id: 'poll', icon: BarChart2, label: 'Poll' },
                        { id: 'link', icon: LinkIcon, label: 'Link' },
                    ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setPostType(type.id as PostType)}
                        className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        postType === type.id
                            ? "bg-primary/20 text-primary border border-primary/20"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <type.icon className="w-4 h-4" />
                        {type.label}
                    </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                    {/* Link Crawler Input */}
                    {postType === 'link' && (
                        <div className="flex gap-2">
                            <input 
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="Paste URL to analyze..."
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none"
                            />
                            <button onClick={handleCrawlLink} disabled={isCrawling} className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-lg flex items-center gap-2">
                                {isCrawling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                                Crawl
                            </button>
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`Write your viral ${postType} post here...`}
                        className="w-full h-40 bg-transparent border-none resize-none focus:outline-none text-lg text-white placeholder:text-white/20"
                    />

                    {postType === 'image' && (
                        <div className="h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-sm">Drop your viral visual here</span>
                        </div>
                    )}

                    {/* Trending Data Assistant */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                         <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-green-400" /> Trending Now
                         </h3>
                         <div className="flex flex-wrap gap-2 mb-4">
                             {Array.isArray(currentTrends) && currentTrends.map((t: any, i) => (
                                 <span key={i} className="text-xs bg-black/40 text-gray-300 px-2 py-1 rounded border border-white/5 cursor-pointer hover:border-primary/50 hover:text-primary transition-colors" onClick={() => setKeywords(prev => prev ? `${prev}, ${t.keyword || t}` : (t.keyword || t))}>
                                     {t.keyword || t} {t.growth && <span className="text-green-400 ml-1">{t.growth}</span>}
                                 </span>
                             ))}
                         </div>
                         <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Pro Tips for {postType}</h4>
                         <ul className="space-y-1">
                             {Array.isArray(typeTips) && typeTips.map((tip: string, i) => (
                                 <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                     <span className="text-primary">•</span> {tip}
                                 </li>
                             ))}
                         </ul>
                    </div>
                </div>
             </GlassCard>
        </div>

        {/* RIGHT: Preview & Inspiration */}
        <div className="w-[450px] flex flex-col gap-6 overflow-hidden">
           {/* Preview Card */}
           <div className="flex-1 bg-background border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
               <div className="p-3 border-b border-white/10 bg-black/40 flex justify-between items-center">
                    <span className="text-xs font-medium text-white flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Live Preview
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-1 rounded border border-white/5 uppercase">
                        {platform === 'all' ? 'Grid View' : platform}
                    </span>
               </div>
               
               <div className={cn("flex-1 p-4 overflow-y-auto bg-black/20", platform === 'all' ? "grid grid-cols-2 gap-4" : "")}>
                    {(platform === 'all' ? ['twitter', 'linkedin', 'facebook', 'instagram'] : [platform]).map(p => (
                        <div key={p} className={cn("bg-white border rounded-xl p-4 shadow-sm relative", platform === 'all' ? "text-[10px]" : "text-sm")}>
                             {/* Mock Platform UI */}
                             <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                <div>
                                    <div className="font-bold text-gray-900">Your Brand</div>
                                    <div className="text-gray-500 text-xs">@{p} • Just now</div>
                                </div>
                                <div className="ml-auto text-gray-400"><ExternalLink className="w-3 h-3" /></div>
                             </div>
                             <div className="text-gray-800 whitespace-pre-wrap">{content || "Start typing to see your viral masterpiece..."}</div>
                             {postType === 'image' && <div className="mt-2 aspect-video bg-gray-100 rounded flex items-center justify-center text-gray-400">Image Preview</div>}
                             {/* Platform Footer */}
                             <div className="mt-3 flex justify-between text-gray-400 pt-2 border-t border-gray-100">
                                 <span>Like</span><span>Comment</span><span>Share</span>
                             </div>
                        </div>
                    ))}
               </div>
           </div>
           
           {/* Inspiration Card */}
           <div className="h-48 glass rounded-xl p-4 overflow-y-auto">
               <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-yellow-400" /> Viral Inspiration
               </h3>
               <div className="space-y-3">
                   {MOCK_VIRAL_EXAMPLES.map((ex, i) => (
                       <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer group transition-all" onClick={() => setContent(ex.content)}>
                           <div className="flex justify-between items-start mb-1">
                               <span className="text-[10px] uppercase text-primary font-bold">{ex.type}</span>
                               <span className="text-[10px] text-green-400 flex items-center gap-1">
                                   <Activity className="w-3 h-3" /> {ex.likes}
                               </span>
                           </div>
                           <p className="text-xs text-gray-300 line-clamp-2 group-hover:text-white">{ex.content}</p>
                       </div>
                   ))}
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TrendingUp(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> }