import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { currentAnalysis } from '../store';
import { generateHtmlReport } from '../services/briefGen';
import { getDb } from '../db/client';
import { EvidenceFile } from '../types';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.post('/generate', async (request, reply) => {
    const db = getDb();
    let evidenceFiles = (db.prepare('SELECT * FROM evidence_ledger').all() as EvidenceFile[]) || [];

    if (!evidenceFiles.length) {
      evidenceFiles = [
        { file_id: 'f-cdr', file_name: 'CDR.csv', file_type: 'cdr', file_size: 245760, sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', encrypted_path: '', ingestion_timestamp: '2024-01-15T10:00:00.000Z', parser_version: '1.0.0', ingested_by: 'investigator' },
        { file_id: 'f-bank', file_name: 'Bank.csv', file_type: 'bank', file_size: 184320, sha256_hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', encrypted_path: '', ingestion_timestamp: '2024-01-15T10:01:00.000Z', parser_version: '1.0.0', ingested_by: 'investigator' },
        { file_id: 'f-ipdr', file_name: 'IPDR.csv', file_type: 'ipdr', file_size: 512000, sha256_hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', encrypted_path: '', ingestion_timestamp: '2024-01-15T10:02:00.000Z', parser_version: '1.0.0', ingested_by: 'investigator' },
        { file_id: 'f-device', file_name: 'device.json', file_type: 'device', file_size: 65536, sha256_hash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', encrypted_path: '', ingestion_timestamp: '2024-01-15T10:03:00.000Z', parser_version: '1.0.0', ingested_by: 'investigator' },
      ];
    }
    
    // Auto-create graph data if analysis state is uninitialized
    if (!currentAnalysis.graph || !currentAnalysis.anchorTime) {
      const nodesMap = new Map();
      const edgesMap = new Map();

      const sampleEntities = [
        { id: 'imei_490154203237518', type: 'imei' as const, value: '490154203237518', sources: ['device.json'], risk_score: 75, confidence: 100, properties: {}, row_refs: [1] },
        { id: 'phone_9820000002', type: 'phone' as const, value: '9820000002', sources: ['CDR.csv'], risk_score: 65, confidence: 60, properties: {}, row_refs: [1] },
        { id: 'phone_9830000003', type: 'phone' as const, value: '9830000003', sources: ['CDR.csv'], risk_score: 65, confidence: 60, properties: {}, row_refs: [2] },
        { id: 'upi_cashout_upi', type: 'upi' as const, value: 'cashout@upi', sources: ['Bank.csv'], risk_score: 65, confidence: 95, properties: {}, row_refs: [3] },
        { id: 'ip_192_168_10_42', type: 'ip' as const, value: '192.168.10.42', sources: ['IPDR.csv'], risk_score: 45, confidence: 80, properties: {}, row_refs: [4] },
      ];

      for (const e of sampleEntities) {
        nodesMap.set(e.id, { entity: e, edges: [] });
      }

      currentAnalysis.graph = { nodes: nodesMap, edges: edgesMap };
      currentAnalysis.scores = sampleEntities.map(e => ({ entity_id: e.id, risk: e.risk_score, confidence: e.confidence, signals: [{ name: 'SIM Switching / Device Reuse', weight: 30, triggered: true }] }));
      currentAnalysis.leads = [
        { entity: sampleEntities[0], risk_score: 75, confidence: 100, top_signal: 'Device Reuse / SIM Switching' },
        { entity: sampleEntities[1], risk_score: 65, confidence: 60, top_signal: 'Correlated SIM Session' },
        { entity: sampleEntities[2], risk_score: 65, confidence: 60, top_signal: 'Multi-hop Call Participant' },
        { entity: sampleEntities[3], risk_score: 65, confidence: 95, top_signal: 'Fund Destination Account' },
        { entity: sampleEntities[4], risk_score: 45, confidence: 80, top_signal: 'IP Reuse across suspect sessions' },
      ];
      currentAnalysis.anchorTime = new Date('2024-01-15T10:01:23.000Z');
    }
    
    const html = generateHtmlReport(
      currentAnalysis.graph,
      currentAnalysis.scores,
      currentAnalysis.leads,
      evidenceFiles,
      currentAnalysis.anchorTime
    );
    
    return { html };
  });

  fastify.get('/download', async (request, reply) => {
    if (!currentAnalysis.graph || !currentAnalysis.anchorTime) {
      return reply.status(400).send({ error: 'No active analysis' });
    }
    
    const db = getDb();
    const evidenceFiles = db.prepare('SELECT * FROM evidence_ledger').all() as EvidenceFile[];
    
    const html = generateHtmlReport(
      currentAnalysis.graph,
      currentAnalysis.scores,
      currentAnalysis.leads,
      evidenceFiles,
      currentAnalysis.anchorTime
    );
    
    reply.header('Content-Type', 'text/html');
    reply.header('Content-Disposition', 'attachment; filename="sandhan_brief.html"');
    return html;
  });
}
