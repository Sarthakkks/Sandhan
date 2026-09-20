import { Entity, NormalizedRow } from '../types';

export function resolveEntities(entities: Entity[], rows: NormalizedRow[]): Entity[] {
  for (const entity of entities) {
    let exact_match_score = entity.sources.length >= 2 ? 40 : 0;
    
    // temporal overlap score
    let temporal_overlap_score = 0;
    // mock temporal overlap logic for resolving
    if (entity.row_refs.length > 2) {
        temporal_overlap_score = 30;
    }
    
    let repeated_observation_score = 30 * Math.min(entity.row_refs.length / 10, 1);
    
    entity.confidence = Math.min(exact_match_score + temporal_overlap_score + repeated_observation_score, 100);
  }
  return entities;
}

export function computeCorrelationConfidence(entity: Entity, allRows: NormalizedRow[]): number {
  return entity.confidence;
}
