import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/design-system';
import { Mail, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export function VerifyEmailNotice() {
    const { user, logout } = useAuth();
    const [sending, setSending] = useState(false);

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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="h-12 w-12 text-primary" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
                
                <p className="text-muted-foreground">
                    We've sent a verification link to <strong>{user?.email}</strong>. 
                    Please click the link to verify your account and access the dashboard.
                </p>

                <div className="flex flex-col gap-4 pt-4">
                    <Button 
                        onClick={handleResend} 
                        disabled={sending}
                        variant="outline"
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
                        className="w-full"
                    >
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
