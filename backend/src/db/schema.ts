import { getDb } from './client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export function runMigrations() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS evidence_ledger (
      file_id TEXT PRIMARY KEY,
      file_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      sha256_hash TEXT NOT NULL,
      encrypted_path TEXT NOT NULL,
      ingestion_timestamp TEXT NOT NULL,
      parser_version TEXT NOT NULL,
      ingested_by TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT,
      ip_address TEXT,
      timestamp TEXT NOT NULL,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('investigator','supervisor','admin')),
      password_hash TEXT NOT NULL
    );
  `);

  // Insert demo users if they don't exist
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, username, role, password_hash) VALUES (?, ?, ?, ?)');
  
  const users = [
    { username: 'admin', role: 'admin', pass: 'admin123' },
    { username: 'supervisor', role: 'supervisor', pass: 'super123' },
    { username: 'investigator', role: 'investigator', pass: 'inv123' }
  ];

  for (const u of users) {
    const hash = bcrypt.hashSync(u.pass, 10);
    insertUser.run(uuidv4(), u.username, u.role, hash);
  }
}

if (require.main === module) {
  runMigrations();
  console.log('Migrations completed successfully.');
}
