import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { currentAnalysis } from '../store';
import { exportGraphJSON, getEdgeExplanation } from '../services/graphBuilder';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.get('/', async (request, reply) => {
    if (!currentAnalysis.graph) return { nodes: [], edges: [] };
    return exportGraphJSON(currentAnalysis.graph);
  });

  fastify.get('/node/:entity_id', async (request, reply) => {
    const { entity_id } = request.params as any;
    if (!currentAnalysis.graph) return reply.status(404).send({ error: 'Graph not built' });
    
    const node = currentAnalysis.graph.nodes.get(entity_id);
    if (!node) return reply.status(404).send({ error: 'Node not found' });
    
    return node;
  });

  fastify.get('/edge/:edge_id', async (request, reply) => {
    const { edge_id } = request.params as any;
    if (!currentAnalysis.graph) return reply.status(404).send({ error: 'Graph not built' });
    
    const edge = currentAnalysis.graph.edges.get(edge_id);
    if (!edge) return reply.status(404).send({ error: 'Edge not found' });
    
    return {
      edge,
      explanation: getEdgeExplanation(edge)
    };
  });

  fastify.get('/leads', async (request, reply) => {
    return currentAnalysis.leads;
  });

  fastify.get('/scores', async (request, reply) => {
    return currentAnalysis.scores;
  });
}
