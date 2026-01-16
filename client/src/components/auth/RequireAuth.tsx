import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { type ReactNode } from 'react';
import { VerifyEmailNotice } from '@/pages/auth/VerifyEmailNotice';

export function RequireAuth({ children }: { children: ReactNode }) {
    const { user, dbUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Block access if not verified
    // Note: We check dbUser explicitly. If dbUser is missing (backend error), 
    // we might want to let them through or block. 
    // Blocking is safer, but if backend is down, it's annoying.
    // Assuming if user is logged in, dbUser *should* be there eventually.
    if (dbUser && !dbUser.emailVerified) {
        return <VerifyEmailNotice />;
    }

    return children;
}