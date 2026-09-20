export interface User {
  id: string;
  username: string;
  role: 'admin' | 'investigator' | 'analyst';
}

export interface EvidenceFile {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  timestamp: string;
  status: 'pending' | 'mapped' | 'analyzed';
  verified: boolean | null;
}

export interface Entity {
  id: string;
  type: 'phone' | 'imei' | 'upi' | 'ip' | 'account' | 'email';
  value: string;
  risk_score: number;
  is_flagged: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  confidence: number;
  evidence_count: number;
  reasons: string[];
  sources: { file: string; rows: number[] }[];
  timestamps: string[];
}

export interface RiskScore {
  entityId: string;
  score: number;
  factors: string[];
}

export interface InvestigativeLead {
  id: string;
  entityId: string;
  entityValue: string;
  entityType: string;
  rank: number;
  score: number;
  confidence: number;
  signal: string;
}

export interface ColumnMapping {
  original: string;
  mappedTo: string;
}

export interface SchemaMapping {
  fileId: string;
  mappings: ColumnMapping[];
}

export interface AnalysisResult {
  entities: Entity[];
  edges: GraphEdge[];
  scores: RiskScore[];
  leads: InvestigativeLead[];
  anchor_time: string;
}

export interface CytoscapeNode {
  data: {
    id: string;
    label: string;
    type: string;
    risk_score: number;
    confidence: number;
  };
}

export interface CytoscapeEdge {
  data: {
    id: string;
    source: string;
    target: string;
    relation: string;
    confidence: number;
    evidence_count: number;
  };
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  details: string;
}
