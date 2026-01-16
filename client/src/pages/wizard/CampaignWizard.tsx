import { useCampaignStore } from '@/store/campaignStore';
import { ArrowRight, Sparkles, FolderOpen, Plus } from 'lucide-react';
import { GlassCard, FadeIn } from '@/components/ui/design-system';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// Mock Data
const PRIOR_PROJECTS = [
    { id: '1', name: 'Q4 Marketing Push', description: 'End of year sales drive' },
    { id: '2', name: 'Alpha Product Launch', description: 'Initial go-to-market strategy' },
];

const PLATFORMS = [
    { id: 'twitter', name: 'X (Twitter)', color: 'bg-black' },
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-600' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' },
    { id: 'reddit', name: 'Reddit', color: 'bg-orange-500' },
    { id: 'discord', name: 'Discord', color: 'bg-indigo-500' },
    { id: 'slack', name: 'Slack', color: 'bg-purple-600' },
    { id: 'email', name: 'Email / Newsletter', color: 'bg-green-600' },
];

import { SEO } from '@/components/seo/SEO';

export function CampaignWizard() {
    const { currentStep, isNewProject, projectData, setStep, setProjectMode, updateProjectData } = useCampaignStore();

    // Step 0: Welcome / New or Existing
    if (currentStep === 0) {
        return (
            <>
                <SEO title="Campaign Wizard" description="Build your viral campaign." />
                <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4 text-glow">
                                Let's Create Magic.
                            </h1>
                            <p className="text-xl text-muted-foreground">Start your journey to viral status.</p>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                        <FadeIn delay={0.2}>
                            <button
                                onClick={() => { setProjectMode(true); setStep(1); }}
                                className="group w-full text-left"
                            >
                                <GlassCard className="h-64 flex flex-col justify-center items-center gap-6 group-hover:bg-primary/10 transition-all border-primary/20 hover:border-primary/50">
                                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                        <Plus className="w-10 h-10 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-white mb-2">Start New Project</h3>
                                        <p className="text-muted-foreground">Launch a fresh campaign from scratch.</p>
                                    </div>
                                </GlassCard>
                            </button>
                        </FadeIn>

                        <FadeIn delay={0.4}>
                            <button
                                onClick={() => { setProjectMode(false); setStep(1); }}
                                className="group w-full text-left"
                            >
                                <GlassCard className="h-64 flex flex-col justify-center items-center gap-6 group-hover:bg-secondary/10 transition-all border-secondary/20 hover:border-secondary/50">
                                    <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                                        <FolderOpen className="w-10 h-10 text-secondary" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-white mb-2">Continue Existing</h3>
                                        <p className="text-muted-foreground">Pick up where you left off.</p>
                                    </div>
                                </GlassCard>
                            </button>
                        </FadeIn>
                    </div>
                </div>
            </>
        );
    }

    // Step 1: Project Setup (Dynamic based on choice)
    if (currentStep === 1) {
        if (!isNewProject) {
            // SELECT EXISTING
            return (
                <div className="max-w-4xl mx-auto p-8">
                    <SEO title="Campaign Wizard" description="Select your project." />
                    <PageHeader title="Select a Project" subtitle="Choose from your active campaigns." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {PRIOR_PROJECTS.map(p => (
                            <GlassCard key={p.id} hoverEffect className="cursor-pointer" onClick={() => { updateProjectData(p); setStep(3); }}>
                                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                                <p className="text-muted-foreground">{p.description}</p>
                            </GlassCard>
                        ))}
                    </div>
                    <button onClick={() => setStep(0)} className="mt-8 text-muted-foreground hover:text-white">← Back</button>
                </div>
            )
        }

        // CREATE NEW
        return (
            <div className="max-w-3xl mx-auto p-8">
                <SEO title="Campaign Wizard" description="Create a new project." />
                <FadeIn>
                    <PageHeader title="Project Details" subtitle="Tell us about what we're building." />

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-lg font-medium text-white">Project Name</label>
                            <input
                                className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-xl text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                placeholder="e.g. Summer Collection Launch"
                                onChange={(e) => updateProjectData({ name: e.target.value })}
                                value={projectData.name || ''}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-lg font-medium text-white">Target Platforms</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {PLATFORMS.map(platform => {
                                    const isSelected = projectData.platforms?.includes(platform.id);
                                    return (
                                        <button
                                            key={platform.id}
                                            onClick={() => {
                                                const current = projectData.platforms || [];
                                                const next = isSelected
                                                    ? current.filter(p => p !== platform.id)
                                                    : [...current, platform.id];
                                                updateProjectData({ platforms: next });
                                            }}
                                            className={cn(
                                                "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
                                                isSelected
                                                    ? `bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]`
                                                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                            )}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                                            {platform.name}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!projectData.name || !projectData.platforms?.length}
                                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                Next Step <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        );
    }

    // Step 2: Data Gathering (Simplified for prototype)
    if (currentStep === 2) {
        return (
            <div className="max-w-3xl mx-auto p-8">
                <FadeIn>
                    <PageHeader title="Context Gathering" subtitle="Help the AI understand your product." />
                    <div className="space-y-6">
                        <GlassCard>
                            <label className="block text-sm font-medium mb-3 text-white">What is the core value proposition?</label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white h-32 resize-none focus:border-primary/50 focus:outline-none"
                                placeholder="e.g. Our energy drink helps gamers stay focused without the crash..."
                                onChange={(e) => updateProjectData({ description: e.target.value })}
                            />
                        </GlassCard>
                        <div className="flex justify-between pt-8">
                            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-white">← Back</button>
                            <button
                                onClick={() => setStep(3)}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
                            >
                                Next: Persona Setup
                            </button>
                        </div>
                    </div>
                </FadeIn>
            </div>
        )
    }

    // Step 3: Persona Selection
    return <PersonaWizard />;
}

import { createProject } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Sub-component for Persona Logic
function PersonaWizard() {
    const { projectData } = useCampaignStore();
    const navigate = useNavigate();
    const [personaMode, setPersonaMode] = useState<'list' | 'create'>('list');
    const [newPersona, setNewPersona] = useState({ name: '', tone: 'Professional', traits: [] as string[] });
    const [isSaving, setIsSaving] = useState(false);

    const finish = async () => {
        setIsSaving(true);
        const loadingToast = toast.loading("Launching campaign...");
        try {
            await createProject(projectData);
            toast.success("Campaign launched successfully!", { id: loadingToast });
            navigate('/create');
        } catch {
            toast.error("Failed to launch campaign.", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    if (personaMode === 'create') {
        return (
            <div className="max-w-3xl mx-auto p-8">
                <FadeIn>
                    <PageHeader title="Craft Your Persona" subtitle="Gamify your brand voice." />
                    <GlassCard className="space-y-6 p-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-xl">
                                🤖
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Character Name</label>
                                <input
                                    className="w-full bg-transparent border-b border-white/20 p-2 text-2xl font-bold text-white focus:border-primary outline-none placeholder:text-white/20"
                                    placeholder="e.g. Techy Tom"
                                    value={newPersona.name}
                                    onChange={e => setNewPersona({ ...newPersona, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Gamified Traits */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">Character Stats</label>
                            <div className="space-y-4">
                                {['Humor', 'Professionalism', 'Emoji Usage'].map(trait => (
                                    <div key={trait} className="flex items-center gap-4">
                                        <span className="w-32 text-sm text-muted-foreground">{trait}</span>
                                        <input type="range" className="flex-1 accent-primary h-1 bg-white/10 rounded-full appearance-none" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Variable Injection */}
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <h4 className="text-primary font-bold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" /> Variable Power-Up</h4>
                            <p className="text-sm text-muted-foreground mb-3">Use <code>#PROJECTNAME#</code> in your bio to auto-inject "{projectData.name}".</p>
                            <textarea
                                className="w-full bg-black/20 rounded p-3 text-sm text-white border border-white/5"
                                placeholder="I'm the lead evangelist for #PROJECTNAME#..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setPersonaMode('list')} className="px-4 py-2 text-muted-foreground">Cancel</button>
                            <button onClick={finish} disabled={isSaving} className="bg-secondary text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-secondary/20 hover:scale-105 transition-transform disabled:opacity-50">
                                {isSaving ? "Launching..." : "Create & Launch 🚀"}
                            </button>
                        </div>
                    </GlassCard>
                </FadeIn>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto p-8">
            <SEO title="Campaign Wizard" description="Select a persona." />
            <FadeIn>
                <PageHeader title="Select a Persona" subtitle={`Who will be speaking for "${projectData.name}"?`} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Create New Card */}
                    <button onClick={() => setPersonaMode('create')} className="group text-left h-full">
                        <div className="h-full border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <span className="font-medium text-muted-foreground group-hover:text-white">Create New Persona</span>
                        </div>
                    </button>

                    {/* Mock Existing Personas */}
                    {[
                        { name: "Sassy Social Manager", desc: "High emoji usage, witty replies.", color: "from-pink-500 to-rose-500" },
                        { name: "Corporate Exec", desc: "Professional, data-driven, clean.", color: "from-blue-500 to-cyan-500" }
                    ].map((p, i) => (
                        <GlassCard key={i} hoverEffect className="relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-r ${p.color} opacity-20`} />
                            <div className="relative pt-8">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${p.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-4`}>
                                    {p.name[0]}
                                </div>
                                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                                <p className="text-sm text-muted-foreground mt-2">{p.desc}</p>

                                <div className="mt-6 flex gap-2">
                                    <button onClick={finish} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded text-sm text-white transition-colors">Use</button>
                                    <button className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded text-muted-foreground hover:text-white">Edit</button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </FadeIn>
        </div>
    );
}

function PageHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-white text-glow mb-2">{title}</h2>
            <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>
    )
}
