import crypto from 'crypto';
import fs from 'fs';

export async function computeSHA256(filePath: string): Promise<string> {
  const hash = crypto.createHash('sha256');
  const stream = fs.createReadStream(filePath);
  
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

export async function verifyHash(filePath: string, expectedHash: string): Promise<boolean> {
  const actualHash = await computeSHA256(filePath);
  return actualHash === expectedHash;
}

export function getEncryptionKey(): Buffer {
  if (process.env.SANDHAN_ENCRYPTION_KEY) {
    return Buffer.from(process.env.SANDHAN_ENCRYPTION_KEY, 'hex');
  }
  // Generate and cache for demo purposes
  const key = crypto.randomBytes(32);
  process.env.SANDHAN_ENCRYPTION_KEY = key.toString('hex');
  return key;
}

export async function encryptFile(sourcePath: string, destPath: string, key: Buffer): Promise<void> {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = fs.readFileSync(sourcePath);
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  fs.writeFileSync(destPath, Buffer.concat([iv, tag, encrypted]));
}

export async function decryptFile(sourcePath: string, destPath: string, key: Buffer): Promise<void> {
  const data = fs.readFileSync(sourcePath);
  const iv = data.subarray(0, 16);
  const tag = data.subarray(16, 32);
  const encrypted = data.subarray(32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  fs.writeFileSync(destPath, decrypted);
}
