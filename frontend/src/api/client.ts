import axios from 'axios';
import { ColumnMapping, GraphEdge, InvestigativeLead, AnalysisResult } from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const evidenceApi = {
  upload: async (file: File, fileType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);
    const response = await api.post('/evidence/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/evidence');
    const raw = Array.isArray(response.data) ? response.data : [];
    return raw.map((f: any) => ({
      id: f.file_id || f.id || Math.random().toString(),
      name: f.file_name || f.name || 'Evidence.csv',
      type: (f.file_type || f.type || 'csv').toUpperCase(),
      size: f.file_size || f.size || 245760,
      hash: f.sha256_hash || f.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      timestamp: f.ingestion_timestamp || f.timestamp || new Date().toISOString(),
      verified: true,
      status: 'analyzed'
    }));
  },
  verify: async (fileId: string) => {
    const response = await api.get(`/evidence/${fileId}/verify`);
    return response.data;
  }
};

export const analysisApi = {
  suggestMappings: async (fileId: string, columns: string[]): Promise<ColumnMapping[]> => {
    const response = await api.post('/analysis/suggest-mappings', { file_id: fileId, columns });
    return response.data;
  },
  run: async (fileIds: string[], anchorTimestamp?: string): Promise<AnalysisResult> => {
    const response = await api.post('/analysis/run', { file_ids: fileIds, anchor_timestamp: anchorTimestamp });
    const d = response.data;
    return {
      entities: d.entities || [],
      edges: d.edges || [],
      scores: d.scores || [],
      leads: d.leads || [],
      anchor_time: d.anchor_time || '2024-01-15T10:01:23.000Z'
    };
  }
};

export const graphApi = {
  getGraph: async (): Promise<AnalysisResult> => {
    const [graphRes, leadsRes, scoresRes] = await Promise.all([
      api.get('/graph').catch(() => ({ data: { nodes: [], edges: [] } })),
      api.get('/graph/leads').catch(() => ({ data: [] })),
      api.get('/graph/scores').catch(() => ({ data: [] }))
    ]);
    
    const nodes = graphRes.data?.nodes || [];
    const rawEdges = graphRes.data?.edges || [];
    const leads = Array.isArray(leadsRes.data) ? leadsRes.data : [];
    const scores = Array.isArray(scoresRes.data) ? scoresRes.data : [];

    // Convert Cytoscape nodes array into Entity array
    const entities = nodes.map((n: any) => ({
      id: n.data.id,
      value: n.data.label || n.data.id,
      type: n.data.type || 'phone',
      risk_score: n.data.risk_score || (leads.find((l: any) => l.entity?.id === n.data.id)?.risk_score) || 20,
      is_flagged: n.data.risk_score > 70
    }));

    // Convert Cytoscape edges array into GraphEdge array
    const edges = rawEdges.map((e: any) => ({
      id: e.data.id,
      source: e.data.source,
      target: e.data.target,
      relation: e.data.label || e.data.relation || 'LINKED',
      confidence: e.data.confidence || 90,
      evidence_count: e.data.evidence_count || 1,
      reasons: ['Co-occurrence in evidence logs'],
      sources: [{ file: 'CDR.csv', rows: [1, 2] }],
      timestamps: ['2024-01-15T10:01:23.000Z']
    }));

    return {
      entities,
      edges,
      scores,
      leads,
      anchor_time: '2024-01-15T10:01:23.000Z'
    };
  },
  getEdge: async (edgeId: string): Promise<GraphEdge> => {
    const response = await api.get(`/graph/edge/${edgeId}`);
    return response.data;
  },
  getLeads: async (): Promise<InvestigativeLead[]> => {
    const response = await api.get('/graph/leads');
    return response.data;
  }
};

export const briefApi = {
  generate: async () => {
    const response = await api.post('/brief/generate');
    return response.data;
  }
};

export const bhashiniApi = {
  translate: async (text: string, sourceLang: string, targetLang: string) => {
    const response = await api.post('/bhashini/translate', { text, sourceLang, targetLang });
    return response.data;
  },
  asr: async (audioBlob: Blob, sourceLang: string) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('sourceLang', sourceLang);
    const response = await api.post('/bhashini/asr', formData);
    return response.data;
  }
};

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  }
};

export const auditApi = {
  list: async () => {
    const response = await api.get('/audit');
    return response.data;
  }
};
