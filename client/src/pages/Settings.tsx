import { PageHeader, GlassCard, FadeIn } from "@/components/ui/design-system";
import { User, CreditCard, Users, Key, Bell, Shield, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-6xl mx-auto p-8">
      <PageHeader title="Settings" subtitle="Manage your account preferences." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <FadeIn className="space-y-2">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id 
                            ? "bg-primary/20 text-white border border-primary/20" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
            ))}
            <div className="pt-8 mt-8 border-t border-white/10">
                 <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                 </button>
            </div>
        </FadeIn>

        {/* Content Area */}
        <div className="md:col-span-3">
            <FadeIn key={activeTab}>
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'billing' && <BillingSettings />}
                {activeTab === 'team' && <TeamSettings />}
                {activeTab === 'api' && <ApiSettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
            </FadeIn>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
    return (
        <GlassCard className="space-y-8">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                    VP
                </div>
                <div>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors">Change Avatar</button>
                    <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Full Name</label>
                    <input className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" defaultValue="Demo User" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <input className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" defaultValue="demo@goviral.ai" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Job Title</label>
                    <input className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none" defaultValue="Social Media Manager" />
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary/20">Save Changes</button>
            </div>
        </GlassCard>
    )
}

function BillingSettings() {
    return (
        <GlassCard className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Current Plan</h2>
                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">ACTIVE</span>
            </div>
            
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 p-6 rounded-xl flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white">Pro Plan</h3>
                    <p className="text-sm text-gray-300">$65/month • Billed Monthly</p>
                </div>
                <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Manage Subscription</button>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-white">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 border border-white/10 rounded-lg bg-black/20">
                    <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full opacity-70" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-70 -ml-1" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">Mastercard ending in 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/25</p>
                    </div>
                    <button className="text-sm text-primary hover:text-white transition-colors">Edit</button>
                </div>
            </div>
        </GlassCard>
    )
}

function TeamSettings() {
    return (
        <GlassCard className="space-y-6">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Team Members</h2>
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors">+ Invite Member</button>
            </div>

            <div className="space-y-4">
                {[
                    { name: "Demo User", email: "demo@goviral.ai", role: "Owner" },
                    { name: "Sarah Smith", email: "sarah@goviral.ai", role: "Editor" },
                    { name: "Mike Jones", email: "mike@goviral.ai", role: "Viewer" },
                ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-white/5 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                                {member.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">{member.role}</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}

function ApiSettings() {
    const copyKey = () => {
        navigator.clipboard.writeText("sk_live_51M...");
        toast.success("API Key copied to clipboard");
    }

    return (
        <GlassCard className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">API Configuration</h2>
            <p className="text-sm text-gray-400 mb-6">Manage your API keys to access the ViralPost Engine programmatically.</p>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Secret Key</label>
                <div className="flex gap-2">
                    <input className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-gray-400 font-mono text-sm outline-none" value="sk_live_51M...******************" readOnly />
                    <button onClick={copyKey} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors">Copy</button>
                </div>
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1"><Shield className="w-3 h-3" /> Never share your secret key with anyone.</p>
            </div>

             <div className="pt-8 border-t border-white/10">
                <button className="text-red-400 hover:text-red-300 text-sm font-medium">Roll Key</button>
             </div>
        </GlassCard>
    )
}

function NotificationSettings() {
    return (
        <GlassCard className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
            <div className="space-y-4">
                {['Email me when a post goes viral', 'Weekly digest of performance', 'New feature announcements', 'Security alerts'].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                        <span className="text-sm text-gray-300">{setting}</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id={`toggle-${i}`} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-green-400 right-5" defaultChecked={i < 2}/>
                            <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-600 cursor-pointer checked:bg-green-400"></label>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    )
}
