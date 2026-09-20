import { z } from 'zod';

export const EntitySchema = z.object({
  id: z.string(),
  type: z.enum(['phone', 'imei', 'upi', 'ip', 'account', 'transaction']),
  value: z.string(),
  sources: z.array(z.string()),
  row_refs: z.array(z.number()),
  risk_score: z.number(),
  confidence: z.number(),
  properties: z.record(z.any())
});

export const GraphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  relation: z.enum(['OWNS', 'USES', 'CALLED', 'TRANSFERRED_TO', 'CONNECTED_FROM', 'CO_OCCURRENCE']),
  confidence: z.number(),
  evidence_count: z.number(),
  timestamps: z.array(z.string()),
  source_files: z.array(z.string()),
  row_refs: z.array(z.number()),
  reasons: z.array(z.string())
});

export const GraphNodeSchema = z.object({
  entity: EntitySchema,
  edges: z.array(z.string())
});
