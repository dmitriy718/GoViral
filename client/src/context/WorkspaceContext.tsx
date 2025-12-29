import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface Workspace {
    id: string;
    name: string;
    slug: string;
    role: string;
}

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    createWorkspace: (name: string) => Promise<void>;
    switchWorkspace: (workspaceId: string) => void;
    refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            refreshWorkspaces();
        } else {
            setWorkspaces([]);
            setCurrentWorkspace(null);
            setIsLoading(false);
        }
    }, [user]);

    const refreshWorkspaces = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/workspaces');
            setWorkspaces(res.data);

            // Set default if none selected
            if (res.data.length > 0 && !currentWorkspace) {
                const stored = localStorage.getItem('goviral_workspace_id');
                const found = res.data.find((w: Workspace) => w.id === stored);
                setCurrentWorkspace(found || res.data[0]);
            }
        } catch (error) {
            console.error("Failed to load workspaces", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createWorkspace = async (name: string) => {
        try {
            const res = await api.post('/workspaces', { name });
            setWorkspaces(prev => [res.data, ...prev]);
            setCurrentWorkspace(res.data);
            localStorage.setItem('goviral_workspace_id', res.data.id);
            toast.success("Workspace created successfully");
        } catch (error: any) {
            const msg = error.response?.data?.error || "Failed to create workspace";
            toast.error(msg);
            throw error;
        }
    };

    const switchWorkspace = (workspaceId: string) => {
        const found = workspaces.find(w => w.id === workspaceId);
        if (found) {
            setCurrentWorkspace(found);
            localStorage.setItem('goviral_workspace_id', found.id);
            toast.success(`Switched to ${found.name}`);
            // In a real app we might reload or re-fetch data for the new workspace here
        }
    };

    return (
        <WorkspaceContext.Provider value={{ workspaces, currentWorkspace, isLoading, createWorkspace, switchWorkspace, refreshWorkspaces }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}
