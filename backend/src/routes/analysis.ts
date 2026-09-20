import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { getDb } from '../db/client';
import { parseFile } from '../services/parser';
import { suggestMappings, normalizeRows } from '../services/normalizer';
import { extractEntities } from '../services/extractor';
import { resolveEntities } from '../services/resolver';
import { correlateTemporally } from '../services/correlator';
import { buildGraph } from '../services/graphBuilder';
import { scoreEntities, rankLeads } from '../services/scorer';
import { currentAnalysis } from '../store';
import { SchemaMapping } from '../types';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.post('/suggest-mappings', async (request, reply) => {
    const { file_id, columns } = request.body as { file_id: string, columns: string[] };
    return suggestMappings(columns);
  });

  fastify.post('/normalize', async (request, reply) => {
    const mappingsList = request.body as SchemaMapping[];
    const db = getDb();
    
    let allNormalized: any[] = [];

    for (const sm of mappingsList) {
      const file = db.prepare('SELECT * FROM evidence_ledger WHERE file_id = ?').get(sm.file_id) as any;
      if (!file) continue;
      
      const parsed = await parseFile(file.encrypted_path, file.file_type);
      const normalized = normalizeRows(parsed, sm.mappings, file.file_name);
      allNormalized = allNormalized.concat(normalized);
    }
    
    currentAnalysis.normalizedRows = allNormalized;
    return { count: allNormalized.length };
  });

  fastify.post('/run', async (request, reply) => {
    const { file_ids, anchor_timestamp } = request.body as { file_ids: string[], anchor_timestamp?: string };
    
    if (currentAnalysis.normalizedRows.length === 0) {
      return reply.status(400).send({ error: 'Please normalize data first' });
    }
    
    let entities = extractEntities(currentAnalysis.normalizedRows);
    entities = resolveEntities(entities, currentAnalysis.normalizedRows);
    
    const { correlatedEntities, correlatedRows, anchorTime } = correlateTemporally(entities, currentAnalysis.normalizedRows, anchor_timestamp);
    
    const graph = buildGraph(correlatedEntities, correlatedRows);
    const scores = scoreEntities(correlatedEntities, graph, correlatedRows);
    const leads = rankLeads(scores, correlatedEntities);
    
    currentAnalysis.graph = graph;
    currentAnalysis.entities = correlatedEntities;
    currentAnalysis.scores = scores;
    currentAnalysis.leads = leads;
    currentAnalysis.anchorTime = anchorTime;
    
    return {
      entitiesCount: correlatedEntities.length,
      edgesCount: graph.edges.size,
      leadsCount: leads.length,
      entities: correlatedEntities,
      edges: Array.from(graph.edges.values()),
      scores,
      leads,
      anchor_time: anchorTime.toISOString()
    };
  });
}
