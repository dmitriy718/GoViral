import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/design-system';
import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(() => {
        return token ? 'verifying' : 'error';
    });

    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            try {
                await axios.post(`${apiBaseUrl}/users/verify-email`, { token });
                setStatus('success');
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                
                {status === 'verifying' && (
                    <>
                        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                        <h1 className="text-2xl font-bold">Verifying your email...</h1>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                        <h1 className="text-2xl font-bold">Email Verified!</h1>
                        <p className="text-muted-foreground">
                            Your email has been successfully verified. You can now access your dashboard.
                        </p>
                        <Button onClick={() => navigate('/')} className="w-full">
                            Go to Dashboard
                        </Button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                        <h1 className="text-2xl font-bold">Verification Failed</h1>
                        <p className="text-muted-foreground">
                            The verification link is invalid or has expired.
                        </p>
                        <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                            Back to Login
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
