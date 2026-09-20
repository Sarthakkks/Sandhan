import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import jwt from '@fastify/jwt';
import path from 'path';
import fs from 'fs';

import { runMigrations } from './db/schema';
import { loginHandler } from './middleware/auth';
import { auditMiddleware } from './middleware/audit';

import evidenceRoutes from './routes/evidence';
import analysisRoutes from './routes/analysis';
import graphRoutes from './routes/graph';
import briefRoutes from './routes/brief';
import bhashiniRoutes from './routes/bhashini';

const fastify = Fastify({
  logger: true
});

async function start() {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Run migrations
    runMigrations();

    // Register plugins
    await fastify.register(cors, {
      origin: '*' // allow all for dev
    });
    
    await fastify.register(multipart, {
      limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
      }
    });

    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'supersecret_sandhan_key_2024'
    });

    // Frontend static serving
    const frontendDist = path.join(process.cwd(), '..', 'frontend', 'dist');
    if (fs.existsSync(frontendDist)) {
      await fastify.register(staticPlugin, {
        root: frontendDist,
        prefix: '/'
      });
    }

    // Auth middleware & Audit
    fastify.addHook('onRequest', async (request, reply) => {
      if (request.url.startsWith('/api') && !request.url.startsWith('/api/auth')) {
        await auditMiddleware(request, reply);
      }
    });

    // Health check
    fastify.get('/api/health', async () => ({ status: 'ok', service: 'SANDHAN', timestamp: new Date().toISOString() }));

    // Routes
    fastify.post('/api/auth/login', loginHandler);
    
    await fastify.register(evidenceRoutes, { prefix: '/api/evidence' });
    await fastify.register(analysisRoutes, { prefix: '/api/analysis' });
    await fastify.register(graphRoutes, { prefix: '/api/graph' });
    await fastify.register(briefRoutes, { prefix: '/api/brief' });
    await fastify.register(bhashiniRoutes, { prefix: '/api/bhashini' });

    // Catch-all to serve frontend if running
    fastify.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api')) {
        reply.status(404).send({ error: 'Not found' });
      } else {
        if (fs.existsSync(frontendDist)) {
          reply.sendFile('index.html');
        } else {
          reply.status(404).send({ error: 'Frontend not built' });
        }
      }
    });

    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
const listeners = ['SIGINT', 'SIGTERM'];
listeners.forEach((signal) => {
  process.on(signal, async () => {
    await fastify.close();
    process.exit(0);
  });
});

start();
