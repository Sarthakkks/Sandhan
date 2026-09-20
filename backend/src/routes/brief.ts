import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { currentAnalysis } from '../store';
import { generateHtmlReport } from '../services/briefGen';
import { getDb } from '../db/client';
import { EvidenceFile } from '../types';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.post('/generate', async (request, reply) => {
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
