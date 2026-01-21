import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Zap, Mail, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/design-system';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export function Layout() {
  const navigate = useNavigate();
  const { user, dbUser, logout, refreshProfile } = useAuth();
  const [sending, setSending] = useState(false);
  const isUnverified = dbUser && !dbUser.emailVerified;

  // Polling for verification status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isUnverified) {
      interval = setInterval(async () => {
        await refreshProfile();
      }, 5000); // Check every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUnverified, refreshProfile]);

  const handleResend = async () => {
    setSending(true);
    try {
      const token = await user?.getIdToken();
      await axios.post(`${apiBaseUrl}/users/resend-verification`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Verification email sent!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to resend verification email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-background relative overflow-hidden" data-testid="layout-root">
      <div data-testid="sidebar-container"><Sidebar /></div>
      <main 
        data-testid="main-content"
        className={`flex-1 overflow-y-auto flex flex-col transition-all duration-500 ${isUnverified ? 'blur-md pointer-events-none' : ''}`}
      >
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

      {/* Verification Modal */}
      {isUnverified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-card border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-10 w-10 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Verify your email</h2>
              <p className="text-muted-foreground">
                We've sent a verification link to <strong>{user?.email}</strong>. 
                Please verify your account to unlock full access.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={handleResend} 
                disabled={sending}
                variant="primary"
                className="w-full"
              >
                {sending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Resend Verification Email
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => logout()}
                className="w-full text-muted-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            <p className="text-[10px] text-muted-foreground/60">
              Verified in another tab? We'll detect it automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
