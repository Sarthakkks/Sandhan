import { create } from 'zustand';
import { User, EvidenceFile, AnalysisResult } from '../types';

interface AppState {
  user: User | null;
  token: string | null;
  evidenceFiles: EvidenceFile[];
  analysisResult: AnalysisResult | null;
  selectedEdgeId: string | null;
  selectedNodeId: string | null;
  language: 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr';
  isAnalyzing: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setEvidenceFiles: (files: EvidenceFile[]) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setSelectedEdge: (id: string | null) => void;
  setSelectedNode: (id: string | null) => void;
  setLanguage: (lang: 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr') => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  evidenceFiles: [],
  analysisResult: null,
  selectedEdgeId: null,
  selectedNodeId: null,
  language: 'en',
  isAnalyzing: false,
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },
  setEvidenceFiles: (files) => set({ evidenceFiles: files }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setSelectedEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
  setSelectedNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  setLanguage: (lang) => set({ language: lang }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, evidenceFiles: [], analysisResult: null, selectedEdgeId: null, selectedNodeId: null });
  }
}));
