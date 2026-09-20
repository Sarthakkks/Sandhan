export interface EvidenceFile {
  file_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  sha256_hash: string;
  encrypted_path: string;
  ingestion_timestamp: string;
  parser_version: string;
  ingested_by: string;
}

export interface AuditLog {
  id: number;
  user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address?: string;
  timestamp: string;
  details?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'investigator' | 'supervisor' | 'admin';
  password_hash: string;
}

export interface NormalizedRow {
  source_phone?: string;
  dest_phone?: string;
  timestamp?: string;
  imei?: string;
  upi_id?: string;
  ip_address?: string;
  amount?: string;
  account_no?: string;
  transaction_id?: string;
  raw: Record<string, any>;
  source_file: string;
  row_index: number;
}

export interface Entity {
  id: string;
  type: 'phone' | 'imei' | 'upi' | 'ip' | 'account' | 'transaction';
  value: string;
  sources: string[];
  row_refs: number[];
  risk_score: number;
  confidence: number;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: 'OWNS' | 'USES' | 'CALLED' | 'TRANSFERRED_TO' | 'CONNECTED_FROM' | 'CO_OCCURRENCE';
  confidence: number;
  evidence_count: number;
  timestamps: string[];
  source_files: string[];
  row_refs: number[];
  reasons: string[];
}

export interface GraphNode {
  entity: Entity;
  edges: string[];
}

export interface CaseGraph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
}

export interface RiskScore {
  entity_id: string;
  risk: number;
  confidence: number;
  signals: { name: string; weight: number; triggered: boolean }[];
}

export interface InvestigativeLead {
  entity: Entity;
  risk_score: number;
  confidence: number;
  top_signal: string;
}

export interface ColumnMapping {
  source_col: string;
  target_field: string;
}

export interface SchemaMapping {
  file_id: string;
  mappings: ColumnMapping[];
}
