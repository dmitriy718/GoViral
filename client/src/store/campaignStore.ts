import { create } from 'zustand';

export interface Persona {
  id: string;
  name: string;
  avatar: string; // Emoji or URL
  traits: string[]; // e.g., "Sassy", "Professional"
  voiceVariables: Record<string, string>; // { "intro": "Hey guys!", "signature": "- The Team" }
}

export interface Project {
  id: string;
  name: string;
  description: string;
  platforms: string[]; // 'twitter', 'facebook', 'linkedin', 'instagram', 'slack', 'discord', 'reddit', 'email'
  personas: Persona[];
}

interface CampaignState {
  currentStep: number;
  isNewProject: boolean | null;
  projectData: Partial<Project>;
  selectedPersona: Persona | null;
  
  // Actions
  setStep: (step: number) => void;
  setProjectMode: (isNew: boolean) => void;
  updateProjectData: (data: Partial<Project>) => void;
  selectPersona: (persona: Persona) => void;
  resetWizard: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  currentStep: 0,
  isNewProject: null,
  projectData: {
    platforms: [],
    personas: []
  },
  selectedPersona: null,

  setStep: (step) => set({ currentStep: step }),
  setProjectMode: (isNew) => set({ isNewProject: isNew }),
  updateProjectData: (data) => set((state) => ({ projectData: { ...state.projectData, ...data } })),
  selectPersona: (persona) => set({ selectedPersona: persona }),
  resetWizard: () => set({ currentStep: 0, isNewProject: null, projectData: {}, selectedPersona: null }),
}));
