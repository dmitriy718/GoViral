import { useState, useEffect } from 'react';
import { PageHeader, FadeIn, GlassCard, Button } from '@/components/ui/design-system';
import { NotionSettings } from '@/components/integrations/NotionSettings';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { SEO } from '@/components/seo/SEO';
import { toast } from 'react-hot-toast';
import { User, Mail, Briefcase, Camera } from 'lucide-react';

export function Settings() {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        jobTitle: '',
        avatarUrl: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getUserProfile();
            setProfile({
                name: data.name || '',
                email: data.email || '',
                jobTitle: data.jobTitle || '',
                avatarUrl: data.avatarUrl || ''
            });
        } catch {
            console.error('Failed to load profile');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateUserProfile(profile);
            toast.success('Profile updated successfully');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <SEO title="Settings" description="Manage your PostDoctor profile and integrations." />
            <PageHeader title="Settings" subtitle="Manage your account and integrations." />
            
            <FadeIn>
                <div className="grid gap-8">
                    {/* Profile Settings */}
                    <GlassCard className="p-6 space-y-6">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Profile Information</h3>
                                <p className="text-sm text-muted-foreground">Update your personal details.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Display Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="email" 
                                        value={profile.email}
                                        disabled
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={profile.jobTitle}
                                        onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                                        placeholder="e.g. Marketing Manager"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Avatar URL</label>
                                <div className="relative">
                                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        type="text" 
                                        value={profile.avatarUrl}
                                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </GlassCard>

                    {/* Notion Integration */}
                    <NotionSettings />
                </div>
            </FadeIn>
        </div>
    );
}
