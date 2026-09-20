import { z } from 'zod';

export const EvidenceUploadSchema = z.object({
  file_name: z.string(),
  file_type: z.enum(['cdr', 'bank', 'ipdr', 'device']),
  file_size: z.number().positive()
});

export const ColumnMappingSchema = z.object({
  source_col: z.string(),
  target_field: z.string()
});

export const SchemaMappingSchema = z.object({
  file_id: z.string(),
  mappings: z.array(ColumnMappingSchema)
});

export const AnalysisRequestSchema = z.object({
  file_ids: z.array(z.string()),
  anchor_timestamp: z.string().optional()
});
