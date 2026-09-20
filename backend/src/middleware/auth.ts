import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { getDb } from '../db/client';
import bcrypt from 'bcryptjs';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}

export function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as any;
    if (!user || !roles.includes(user.role)) {
      reply.status(403).send({ error: 'Forbidden' });
    }
  };
}

export function generateToken(app: FastifyInstance, user: any): string {
  return app.jwt.sign({ id: user.id, username: user.username, role: user.role });
}

export async function loginHandler(request: FastifyRequest, reply: FastifyReply) {
  const { username, password } = request.body as any;
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
  
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }
  
  const token = generateToken(request.server, user);
  return { token, user: { id: user.id, username: user.username, role: user.role } };
}
