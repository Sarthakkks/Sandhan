import { Entity, CaseGraph, NormalizedRow, RiskScore, InvestigativeLead } from '../types';

export function scoreEntities(entities: Entity[], graph: CaseGraph, correlatedRows: NormalizedRow[]): RiskScore[] {
  const scores: RiskScore[] = [];

  for (const entity of entities) {
    let risk = 20; // base risk for correlated entities
    const signals: RiskScore['signals'] = [];
    const node = graph.nodes.get(entity.id);
    
    if (node) {
      const edges = node.edges.map(eid => graph.edges.get(eid)!).filter(Boolean);
      
      const transfers = edges.filter(e => e.relation === 'TRANSFERRED_TO');
      if (transfers.length >= 1) {
        risk += 25;
        signals.push({ name: 'Rapid fund movement', weight: 25, triggered: true });
      }

      if (edges.length >= 2) {
        risk += 25;
        signals.push({ name: 'Multi-hop routing', weight: 25, triggered: true });
      }

      if (entity.type === 'imei' && edges.length >= 2) {
        risk += 30;
        signals.push({ name: 'Device reuse / SIM switching', weight: 30, triggered: true });
      }

      if (entity.type === 'phone' && edges.some(e => e.target.startsWith('imei_') || e.source.startsWith('imei_'))) {
        risk += 20;
        signals.push({ name: 'IMEI linkage', weight: 20, triggered: true });
      }

      if (entity.type === 'ip' && edges.length >= 2) {
        risk += 25;
        signals.push({ name: 'IP reuse across sessions', weight: 25, triggered: true });
      }

      if (entity.type === 'upi' || entity.type === 'account') {
        risk += 15;
        signals.push({ name: 'Transaction endpoint', weight: 15, triggered: true });
      }
    }
    
    risk = Math.min(risk, 100);
    
    scores.push({
      entity_id: entity.id,
      risk,
      confidence: entity.confidence || 80,
      signals
    });
    
    // Apply score back to entity
    entity.risk_score = risk;
  }
  
  return scores;
}

export function rankLeads(scores: RiskScore[], entities: Entity[]): InvestigativeLead[] {
  const ranked = scores.sort((a, b) => (b.risk * b.confidence) - (a.risk * a.confidence));
  const top5 = ranked.slice(0, 5);
  
  return top5.map(s => {
    const entity = entities.find(e => e.id === s.entity_id)!;
    const topSignal = s.signals.length > 0 ? s.signals.sort((a,b) => b.weight - a.weight)[0].name : 'Unknown';
    return {
      entity,
      risk_score: s.risk,
      confidence: s.confidence,
      top_signal: topSignal
    };
  });
}
