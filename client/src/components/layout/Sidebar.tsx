import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PenTool, Calendar, Settings, LogOut, BookOpen, LifeBuoy, ChevronDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Content Studio', href: '/create', icon: PenTool },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Help Desk', href: '/support', icon: LifeBuoy },
  { name: 'Knowledge Base', href: '/learn', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';

export function Sidebar() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { workspaces, currentWorkspace, switchWorkspace, createWorkspace } = useWorkspace();

  const handleCreateWorkspace = async () => {
    const name = prompt("Enter new workspace name:");
    if (name) {
      try {
        await createWorkspace(name);
        setWorkspaceOpen(false);
      } catch (e) {
        // Toast already handled in context
      }
    }
  };

  return (
    <div className="flex flex-col w-64 bg-background/50 backdrop-blur-md border-r border-white/10 h-screen sticky top-0">
      <div className="p-4 border-b border-white/10">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group relative"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
              {currentWorkspace?.name?.[0] || 'VP'}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-white truncate w-32">{currentWorkspace?.name || 'Select Workspace'}</h3>
              <p className="text-[10px] text-muted-foreground">Pro Workspace</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${workspaceOpen ? 'rotate-180' : ''}`} />

          {workspaceOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">Switch Workspace</div>
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => {
                    setWorkspaceOpen(false);
                    switchWorkspace(ws.id);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/10 cursor-pointer text-sm",
                    currentWorkspace?.id === ws.id ? "text-white bg-white/10" : "text-gray-300 hover:text-white"
                  )}
                >
                  <Layers className="w-3 h-3" /> {ws.name}
                </div>
              ))}
              <div
                onClick={handleCreateWorkspace}
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-white/10 cursor-pointer text-sm text-primary hover:text-primary/80 border-t border-white/5 mt-1"
              >
                <span className="text-lg leading-none">+</span> Add New
              </div>
            </div>
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "text-white bg-primary/20 border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )
            }
          >
            <div className="relative z-10 flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.name}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-4 px-4 py-3 bg-gradient-to-br from-secondary/10 to-purple-500/10 rounded-xl border border-secondary/20">
          <p className="text-xs text-secondary font-semibold mb-1">Pro Plan</p>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary w-[75%] h-full rounded-full" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">750/1000 credits used</p>
        </div>
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-md w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}