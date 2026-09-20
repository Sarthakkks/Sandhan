import { FastifyRequest, FastifyReply } from 'fastify';
import { getDb } from '../db/client';

export function auditLog(userId: string, action: string, resource: string, resourceId?: string, details?: string, ip?: string) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO audit_log (user_id, action, resource, resource_id, ip_address, timestamp, details)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(userId, action, resource, resourceId || null, ip || null, new Date().toISOString(), details || null);
}

export async function auditMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const user = (request.user as any)?.id || 'anonymous';
  const action = request.method;
  const resource = request.routeOptions.url || request.url;
  const ip = request.ip;
  auditLog(user, action, resource, undefined, undefined, ip);
}
