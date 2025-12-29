import { Dialog } from '@radix-ui/react-dialog';
import { X, Check, Instagram, Linkedin, Twitter } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const PLATFORMS = [
    { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: 'bg-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
];

export function ConnectPlatformModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [connecting, setConnecting] = useState<string | null>(null);

    const handleConnect = (platformId: string) => {
        setConnecting(platformId);
        // Simulate OAuth delay
        setTimeout(() => {
            setConnecting(null);
            toast.success(`Connected to ${platformId} successfully!`);
            onOpenChange(false);
        }, 1500);
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-gray-900/95 p-6 shadow-2xl duration-200 sm:rounded-lg animate-in zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]">
                    <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                        <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-white">
                            Connect Platform
                        </DialogPrimitive.Title>
                        <DialogPrimitive.Description className="text-sm text-muted-foreground">
                            Link your social media accounts to auto-publish content.
                        </DialogPrimitive.Description>
                    </div>

                    <div className="grid gap-3 py-4">
                        {PLATFORMS.map((platform) => (
                            <button
                                key={platform.id}
                                onClick={() => handleConnect(platform.id)}
                                disabled={!!connecting}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-white/5 transition-all group",
                                    connecting === platform.id && "opacity-50 cursor-wait"
                                )}
                            >
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", platform.color)}>
                                    <platform.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">{platform.name}</h4>
                                    <p className="text-xs text-muted-foreground">Authorize access</p>
                                </div>
                                {connecting === platform.id && (
                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                )}
                            </button>
                        ))}
                    </div>

                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4 text-white" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
