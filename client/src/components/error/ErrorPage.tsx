import { useState } from 'react';
import { AlertTriangle, Send, Loader2, RefreshCcw } from 'lucide-react';
import { reportClientError } from '@/lib/api';
import { FadeIn, GlassCard } from '@/components/ui/design-system';
import { toast } from 'react-hot-toast';

interface ErrorPageProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

export function ErrorPage({ error, resetErrorBoundary }: ErrorPageProps) {
    const [isReporting, setIsReporting] = useState(false);
    const [reported, setReported] = useState(false);

    const handleReport = async () => {
        setIsReporting(true);
        try {
            await reportClientError({
                message: error?.message || 'Unknown error',
                stack: error?.stack,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
            setReported(true);
            toast.success("Error report sent to development team.");
        } catch {
            toast.error("Failed to send report. Please try again.");
        } finally {
            setIsReporting(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] p-4">
            <FadeIn>
                <GlassCard className="max-w-md w-full p-8 text-center border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">System Critical</h1>
                    <p className="text-muted-foreground mb-6">
                        An unexpected error caused the application to crash. Our safeguards prevented total system failure.
                    </p>

                    {error && (
                        <div className="bg-black/40 rounded-lg p-4 mb-6 text-left border border-white/5 overflow-auto max-h-40">
                            <code className="text-xs text-red-300 font-mono">
                                {error.toString()}
                            </code>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        {!reported ? (
                            <button
                                onClick={handleReport}
                                disabled={isReporting}
                                className="w-full bg-white text-black hover:bg-gray-200 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Notify Development Team
                            </button>
                        ) : (
                            <div className="w-full bg-green-500/10 text-green-500 py-3 rounded-xl font-bold border border-green-500/20 flex items-center justify-center gap-2">
                                Report Sent Successfully
                            </div>
                        )}

                        <button
                            onClick={() => resetErrorBoundary ? resetErrorBoundary() : window.location.reload()}
                            className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Reload Application
                        </button>
                    </div>
                </GlassCard>
            </FadeIn>
        </div>
    );
}
