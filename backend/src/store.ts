import { CaseGraph, Entity, RiskScore, InvestigativeLead, NormalizedRow } from './types';

interface AnalysisState {
  graph: CaseGraph | null;
  entities: Entity[];
  scores: RiskScore[];
  leads: InvestigativeLead[];
  normalizedRows: NormalizedRow[];
  anchorTime: Date | null;
}

export const currentAnalysis: AnalysisState = {
  graph: null,
  entities: [],
  scores: [],
  leads: [],
  normalizedRows: [],
  anchorTime: null
};
