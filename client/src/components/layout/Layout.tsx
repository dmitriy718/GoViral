import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Zap } from 'lucide-react';

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Beta Offer Banner */}
        <div 
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-b border-yellow-500/20 px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors"
        >
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-yellow-500">
                <Zap className="w-4 h-4 fill-current" />
                <span>Beta Access: Lock in 50% off for life. Offer ends Monday.</span>
                <span className="underline opacity-80 hover:opacity-100">Claim Offer &rarr;</span>
            </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
