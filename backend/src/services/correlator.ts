import { Entity, NormalizedRow } from '../types';

export function correlateTemporally(entities: Entity[], rows: NormalizedRow[], anchorTimestamp?: string): { correlatedEntities: Entity[], correlatedRows: NormalizedRow[], anchorTime: Date } {
  let anchorTime: Date = new Date();
  
  if (anchorTimestamp) {
    anchorTime = new Date(anchorTimestamp);
  } else {
    // Find anchor: first UPI transaction timestamp
    const firstTx = rows.find(r => r.upi_id && r.amount && r.timestamp);
    if (firstTx && firstTx.timestamp) {
      anchorTime = new Date(firstTx.timestamp);
    }
  }

  const thirtyMinsMs = 30 * 60 * 1000;
  
  const correlatedRows = rows.filter(r => {
    if (!r.timestamp) return false;
    const t = new Date(r.timestamp).getTime();
    return Math.abs(t - anchorTime.getTime()) <= thirtyMinsMs;
  });

  const correlatedRowIndices = new Set(correlatedRows.map(r => r.row_index));

  const correlatedEntities = entities.filter(e => {
    return e.row_refs.some(ref => correlatedRowIndices.has(ref));
  });

  return { correlatedEntities, correlatedRows, anchorTime };
}

export function buildCorrelationMatrix(entities: Entity[]): Map<string, Map<string, number>> {
  const matrix = new Map<string, Map<string, number>>();
  
  for (let i = 0; i < entities.length; i++) {
    const map = new Map<string, number>();
    for (let j = 0; j < entities.length; j++) {
      if (i === j) continue;
      
      const e1 = entities[i];
      const e2 = entities[j];
      
      const sharedSources = e1.sources.filter(s => e2.sources.includes(s));
      const sharedRows = e1.row_refs.filter(r => e2.row_refs.includes(r));
      
      let score = 0;
      if (sharedSources.length > 0) score += 30;
      if (sharedRows.length > 0) score += 70;
      
      map.set(e2.id, score);
    }
    matrix.set(entities[i].id, map);
  }
  
  return matrix;
}
