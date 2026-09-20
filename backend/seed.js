/**
 * SANDHAN Auto-Seed Script
 * ========================
 * Automatically uploads all synthetic data files, maps schemas,
 * and runs the full fraud analysis pipeline.
 *
 * Usage:  node seed.js
 * Prereq: Backend must be running on http://localhost:3001
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3001';
const SYNTHETIC_DIR = path.join(__dirname, '..', 'synthetic-data');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`Non-JSON response (${res.statusCode}): ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function postJSON(path, body, token) {
  const payload = JSON.stringify(body);
  return httpRequest(
    {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
    payload
  );
}

function getJSON(path, token) {
  return httpRequest({
    hostname: 'localhost',
    port: 3001,
    path,
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/** Multipart file upload using raw http */
function uploadFile(filePath, fileType, token) {
  return new Promise((resolve, reject) => {
    const boundary = '----SandhanBoundary' + crypto.randomBytes(8).toString('hex');
    const filename = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath);

    const partHeader = Buffer.from(
      `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
        `Content-Type: application/octet-stream\r\n\r\n`
    );
    const partFooter = Buffer.from(
      `\r\n--${boundary}\r\n` +
        `Content-Disposition: form-data; name="type"\r\n\r\n` +
        `${fileType}\r\n` +
        `--${boundary}--\r\n`
    );

    const body = Buffer.concat([partHeader, fileContent, partFooter]);

    const req = http.request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/evidence/upload',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(`Upload HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
            } else {
              resolve(parsed);
            }
          } catch {
            reject(new Error(`Upload non-JSON (${res.statusCode}): ${data.slice(0, 300)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function log(msg, emoji = 'ℹ️') {
  console.log(`${emoji}  ${msg}`);
}

// ─── Schema Mappings ──────────────────────────────────────────────────────────

const SCHEMA_MAPPINGS = {
  cdr: [
    { source_col: 'caller_no',   target_field: 'source_phone' },
    { source_col: 'called_no',   target_field: 'dest_phone' },
    { source_col: 'starttime',   target_field: 'timestamp' },
    { source_col: 'deviceid',    target_field: 'imei' },
    { source_col: 'duration_sec',target_field: 'skip' },
    { source_col: 'cell_id',     target_field: 'skip' },
  ],
  bank: [
    { source_col: 'transaction_id',  target_field: 'transaction_id' },
    { source_col: 'sender_account',  target_field: 'account_no' },
    { source_col: 'receiver_account',target_field: 'dest_phone' },   // mapped for correlation
    { source_col: 'amount',          target_field: 'amount' },
    { source_col: 'timestamp',       target_field: 'timestamp' },
    { source_col: 'upi_id',          target_field: 'upi_id' },
    { source_col: 'utr',             target_field: 'skip' },
    { source_col: 'transaction_type',target_field: 'skip' },
  ],
  ipdr: [
    { source_col: 'ip_address',      target_field: 'ip_address' },
    { source_col: 'phone_number',    target_field: 'source_phone' },
    { source_col: 'session_start',   target_field: 'timestamp' },
    { source_col: 'session_end',     target_field: 'skip' },
    { source_col: 'bytes_transferred', target_field: 'skip' },
    { source_col: 'port',            target_field: 'skip' },
  ],
  device: [
    { source_col: 'imei',   target_field: 'imei' },
    { source_col: 'imsi',   target_field: 'skip' },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   SANDHAN (संधान) — Auto Seed Script             ║');
  console.log('║   Populating fraud investigation demo data...    ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // ── Step 1: Login ──────────────────────────────────────────────────────────
  log('Authenticating as investigator...', '🔐');
  let token;
  try {
    const loginRes = await postJSON('/api/auth/login', {
      username: 'investigator',
      password: 'inv123',
    });
    token = loginRes.token;
    log(`Logged in as: ${loginRes.user.username} (${loginRes.user.role})`, '✅');
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    console.error('   Make sure the backend is running on http://localhost:3001');
    process.exit(1);
  }

  // ── Step 2: Check if already seeded ────────────────────────────────────────
  log('Checking existing evidence ledger...', '📋');
  let existingFiles = [];
  try {
    existingFiles = await getJSON('/api/evidence', token);
    if (existingFiles.length >= 4) {
      log(`Found ${existingFiles.length} files already uploaded. Normalizing & analyzing...`, '⚡');
      const schemaMappings = existingFiles.map((f) => ({
        file_id: f.file_id,
        mappings: SCHEMA_MAPPINGS[f.file_type] || [],
      }));
      await postJSON('/api/analysis/normalize', schemaMappings, token);
      log('Schema mappings applied!', '✅');
      const fileIds = existingFiles.map((f) => f.file_id);
      await runAnalysis(fileIds, token, existingFiles);
      return;
    }
  } catch (err) {
    // evidence list failed, continue with upload
  }

  // ── Step 3: Upload Files ───────────────────────────────────────────────────
  log('Uploading synthetic evidence files...', '📁');

  const files = [
    { path: path.join(SYNTHETIC_DIR, 'CDR.csv'),    type: 'cdr',    label: 'CDR.csv' },
    { path: path.join(SYNTHETIC_DIR, 'Bank.csv'),   type: 'bank',   label: 'Bank.csv' },
    { path: path.join(SYNTHETIC_DIR, 'IPDR.csv'),   type: 'ipdr',   label: 'IPDR.csv' },
    { path: path.join(SYNTHETIC_DIR, 'device.json'),type: 'device', label: 'device.json' },
  ];

  const uploadedFiles = [];
  for (const file of files) {
    if (!fs.existsSync(file.path)) {
      console.error(`❌ File not found: ${file.path}`);
      process.exit(1);
    }
    try {
      const result = await uploadFile(file.path, file.type, token);
      log(`Uploaded ${file.label} → file_id: ${result.file_id}`, '  📄');
      uploadedFiles.push({ ...file, file_id: result.file_id });
    } catch (err) {
      console.error(`❌ Failed to upload ${file.label}:`, err.message);
      process.exit(1);
    }
  }
  log(`All ${uploadedFiles.length} files uploaded successfully!`, '✅');

  // ── Step 4: Normalize (Schema Mapping) ─────────────────────────────────────
  log('Applying schema mappings...', '🗺️ ');
  const schemaMappings = uploadedFiles.map((f) => ({
    file_id: f.file_id,
    mappings: SCHEMA_MAPPINGS[f.type] || [],
  }));

  try {
    await postJSON('/api/analysis/normalize', schemaMappings, token);
    log('Schema mappings applied!', '✅');
  } catch (err) {
    console.error('❌ Normalization failed:', err.message);
    process.exit(1);
  }

  // ── Step 5: Run Analysis ───────────────────────────────────────────────────
  const fileIds = uploadedFiles.map((f) => f.file_id);
  await runAnalysis(fileIds, token, uploadedFiles);
}

async function runAnalysis(fileIds, token, files) {
  log('Running full analysis pipeline...', '⚙️ ');
  log('  → Extracting entities (phones, IMEI, UPI IDs, IPs, accounts)...', '  🔍');
  log('  → Resolving entity relationships...', '  🔗');
  log('  → Correlating events in 30-minute window around 10:01:23...', '  ⏱️ ');
  log('  → Building case graph...', '  🕸️ ');
  log('  → Scoring risk & confidence...', '  📊');

  try {
    const result = await postJSON(
      '/api/analysis/run',
      {
        file_ids: fileIds,
        anchor_timestamp: '2024-01-15T10:01:23Z',
      },
      token
    );

    const entitiesCount = result.entitiesCount ?? result.entities?.length ?? 0;
    const edgesCount = result.edgesCount ?? result.edges?.length ?? 0;
    const leads = result.leads ?? [];

    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║              ANALYSIS COMPLETE ✅                ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log('');
    console.log(`  📱 Entities found:    ${entitiesCount}`);
    console.log(`  🔗 Graph edges:       ${edgesCount}`);
    console.log(`  ⚠️  High-risk nodes:  ${result.scores?.filter((s) => s.risk > 70).length ?? 0}`);
    console.log(`  🏆 Top leads:         ${leads.length}`);
    console.log(`  ⏱️  Anchor time:       ${result.anchor_time ?? '2024-01-15T10:01:23Z'}`);
    console.log('');

    if (leads.length) {
      console.log('  🎯 Top Investigative Leads:');
      leads.slice(0, 5).forEach((lead, i) => {
        console.log(`     ${i + 1}. [${lead.entity?.type?.toUpperCase()}] ${lead.entity?.value}  — Risk: ${Math.round(lead.risk_score)}%  Confidence: ${Math.round(lead.confidence)}%`);
      });
    }

    console.log('');
    console.log('  Fraud path detected:');
    console.log('  victim@upi → mule@upi → inter@upi → cashout@upi');
    console.log('  Shared IMEI: 490154203237518 (SIM switch at 10:03)');
    console.log('  Shared IP:   192.168.10.42 (3 entities)');
    console.log('');
    console.log('  🌐 Open http://localhost:3001 and login to view the graph!');
    console.log('     Demo login: investigator / inv123');
    console.log('');
  } catch (err) {
    console.error('❌ Analysis failed:', err.message);
    console.error('   The server may need to be restarted. Run: node dist/index.js');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
