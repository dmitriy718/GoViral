import { useState } from 'react';
import { GlassCard } from '@/components/ui/design-system';
import { connectNotion, syncNotion } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { RefreshCw, CheckCircle } from 'lucide-react';

export function NotionSettings() {
    const mockMode = import.meta.env.VITE_MOCK_MODE === 'true';
    const [connected, setConnected] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const handleConnect = async () => {
        if (!mockMode) {
            toast.error('Notion integration is not available in production yet.');
            return;
        }
        try {
            await connectNotion('mock-db-id', 'mock-token');
            setConnected(true);
            toast.success('Notion Connected Successfully!');
        } catch {
            toast.error('Connection failed');
        }
    };

    const handleSync = async () => {
        if (!mockMode) {
            toast.error('Notion sync is not available in production yet.');
            return;
        }
        setSyncing(true);
        try {
            const res = await syncNotion();
            toast.success(`Synced ${res.synced} posts from Notion!`);
        } catch {
            toast.error('Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Notion Integration</h3>
                    <p className="text-sm text-muted-foreground">Sync content seamlessly from your Notion database.</p>
                </div>
            </div>

            {!connected ? (
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                    <p className="text-gray-400 mb-4">
                        {mockMode ? 'Connect your workspace to enable two-way sync.' : 'Notion integration is disabled in production.'}
                    </p>
                    <button 
                        onClick={handleConnect}
                        disabled={!mockMode}
                        className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        Connect Notion
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Connected to "Social Content" Database</span>
                    </div>
                    
                    <button 
                        onClick={handleSync}
                        disabled={syncing}
                        className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                    
                    <div className="text-xs text-gray-500 text-center">
                        Auto-sync enabled (every hour)
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
