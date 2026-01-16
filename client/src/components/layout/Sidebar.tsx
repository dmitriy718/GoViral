import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PenTool, Calendar, Settings, LogOut, BookOpen, LifeBuoy, ChevronDown, Layers, Sparkles } from 'lucide-react';
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
      } catch {
        // Toast already handled in context
      }
    }
  };

  return (
    <div className="flex flex-col w-72 bg-[#09090b]/80 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">PostDoctor</span>
        </div>

        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group relative"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/20">
              {currentWorkspace?.name?.[0] || 'V'}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white truncate w-32">{currentWorkspace?.name || 'PostDoctor'}</h3>
              <p className="text-[10px] text-muted-foreground font-medium">Pro Workspace</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${workspaceOpen ? 'rotate-180' : ''}`} />

          {workspaceOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#18181b] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground px-3 py-2">Switch Workspace</div>
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  onClick={() => {
                    setWorkspaceOpen(false);
                    switchWorkspace(ws.id);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors",
                    currentWorkspace?.id === ws.id ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Layers className="w-3 h-3" /> {ws.name}
                </div>
              ))}
              <div
                onClick={handleCreateWorkspace}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 cursor-pointer text-sm text-primary hover:text-primary/80 border-t border-white/5 mt-1 pt-2"
              >
                <span className="text-lg leading-none">+</span> Create New
              </div>
            </div>
          )}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "text-white bg-primary/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
                <>
                    <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                    {item.name}
                    {isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(129,140,248,0.8)]" />}
                </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <p className="text-xs font-semibold text-white">Credits Used</p>
            <p className="text-xs text-muted-foreground">750/1000</p>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-purple-500 w-[75%] h-full rounded-full shadow-[0_0_10px_rgba(129,140,248,0.3)]" />
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}