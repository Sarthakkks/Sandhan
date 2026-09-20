import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth';
import { BhashiniClient } from '../services/bhashini';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);
  const client = new BhashiniClient();

  fastify.post('/translate', async (request, reply) => {
    const { text, source_lang, target_lang } = request.body as any;
    const result = await client.translate(text, source_lang, target_lang);
    return { translated: result };
  });

  fastify.post('/translate-batch', async (request, reply) => {
    const { texts, target_lang } = request.body as any;
    const results = await client.translateBatch(texts, target_lang);
    return { translated: results };
  });

  fastify.post('/asr', async (request, reply) => {
    const { audio_base64, lang } = request.body as any;
    const result = await client.asr(audio_base64, lang);
    return { text: result };
  });

  fastify.get('/languages', async (request, reply) => {
    return { en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada', mr: 'Marathi' };
  });
}
