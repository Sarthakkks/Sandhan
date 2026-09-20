import { FastifyInstance } from 'fastify';
import { getDb } from '../db/client';
import { computeSHA256, verifyHash } from '../services/hasher';
import { authenticate, requireRole } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

export default async function (fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate);

  fastify.post('/upload', async (request, reply) => {
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const file_id = uuidv4();
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadsDir, `${file_id}_${data.filename}`);
    
    await pipeline(data.file, fs.createWriteStream(filePath));
    
    const hash = await computeSHA256(filePath);
    const stats = fs.statSync(filePath);
    
    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO evidence_ledger (file_id, file_name, file_type, file_size, sha256_hash, encrypted_path, ingestion_timestamp, parser_version, ingested_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // basic file type logic
    const ext = path.extname(data.filename).toLowerCase();
    let fileType = 'unknown';
    if (ext === '.csv') fileType = 'cdr';
    else if (ext === '.xlsx') fileType = 'bank';
    else if (ext === '.json') fileType = 'device';

    stmt.run(file_id, data.filename, fileType, stats.size, hash, filePath, new Date().toISOString(), '1.0.0', (request.user as any).id);
    
    return { file_id, file_name: data.filename, sha256_hash: hash };
  });

  fastify.get('/', async (request, reply) => {
    const db = getDb();
    let files = db.prepare('SELECT * FROM evidence_ledger').all();

    if (files.length === 0) {
      const stmt = db.prepare(`
        INSERT INTO evidence_ledger (file_id, file_name, file_type, file_size, sha256_hash, encrypted_path, ingestion_timestamp, parser_version, ingested_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = '2024-01-15T10:00:00.000Z';
      stmt.run('f-cdr', 'CDR.csv', 'cdr', 245760, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', path.join(__dirname, '..', '..', 'synthetic-data', 'CDR.csv'), now, '1.0.0', 'investigator');
      stmt.run('f-bank', 'Bank.csv', 'bank', 184320, 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3', path.join(__dirname, '..', '..', 'synthetic-data', 'Bank.csv'), now, '1.0.0', 'investigator');
      stmt.run('f-ipdr', 'IPDR.csv', 'ipdr', 512000, 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', path.join(__dirname, '..', '..', 'synthetic-data', 'IPDR.csv'), now, '1.0.0', 'investigator');
      stmt.run('f-device', 'device.json', 'device', 65536, 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5', path.join(__dirname, '..', '..', 'synthetic-data', 'device.json'), now, '1.0.0', 'investigator');

      files = db.prepare('SELECT * FROM evidence_ledger').all();
    }

    return files;
  });

  fastify.get('/:file_id', async (request, reply) => {
    const { file_id } = request.params as any;
    const db = getDb();
    const file = db.prepare('SELECT * FROM evidence_ledger WHERE file_id = ?').get(file_id);
    if (!file) return reply.status(404).send({ error: 'Not found' });
    return file;
  });

  fastify.delete('/:file_id', { preHandler: requireRole(['admin']) }, async (request, reply) => {
    const { file_id } = request.params as any;
    const db = getDb();
    const file = db.prepare('SELECT * FROM evidence_ledger WHERE file_id = ?').get(file_id) as any;
    if (!file) return reply.status(404).send({ error: 'Not found' });
    
    db.prepare('DELETE FROM evidence_ledger WHERE file_id = ?').run(file_id);
    if (fs.existsSync(file.encrypted_path)) {
      fs.unlinkSync(file.encrypted_path);
    }
    
    return { success: true };
  });

  fastify.get('/:file_id/verify', async (request, reply) => {
    const { file_id } = request.params as any;
    const db = getDb();
    const file = db.prepare('SELECT * FROM evidence_ledger WHERE file_id = ?').get(file_id) as any;
    if (!file) return reply.status(404).send({ error: 'Not found' });
    
    const isValid = await verifyHash(file.encrypted_path, file.sha256_hash);
    return { isValid };
  });
}
