# SANDHAN (संधान) — Cyber Fraud Investigation Engine

🕵️‍♂️🔍

## Overview
SANDHAN is a cyber fraud investigation engine designed to ingest diverse datasets (CDR, Bank transactions, IPDR, Device logs) and correlate them to uncover fraud paths and networks.

## Quick Start
```bash
git clone <repo>
cd sandhan
docker-compose -f docker/docker-compose.yml up --build
# Open http://localhost:3001
```

## Local Development
- Prerequisites: Node.js 20+, npm
- Backend setup: `cd backend && npm install && npm run dev`
- Frontend setup: `cd frontend && npm install && npm run dev`

## Demo Flow
1. Login as investigator (`investigator`/`inv123`).
2. Upload 4 synthetic files from `synthetic-data/`.
3. Map schemas (auto-mapping suggested).
4. Run analysis.
5. View graph: fraud path highlighted.
6. Click IMEI-490154203237518 edge → 'Why linked?' panel.
7. Top leads: IMEI, mule@upi, 192.168.10.42.
8. Generate brief → HTML report.

## Architecture
```
[Frontend (React/Vite)] <--> [Backend (Node.js/Express)] <--> [Database]
                                       |
                                [Analysis Engine]
```

## Fraud Scenario
The synthetic data represents a chained fraud event:
- Phone A contacts Phone B.
- Phone B contacts Phone C.
- Both Phone B and C share the same IMEI and overlapping IP addresses (192.168.10.42).
- Bank transactions rapidly move funds from the victim through mule and intermediary accounts.
- The engine correlates these signals to highlight the fraud path.

## Bhashini Integration
Set `BHASHINI_API_KEY` and `BHASHINI_USER_ID` in `.env` to enable multi-lingual capabilities.

## Security
- Password hashing: SHA-256
- Data encryption: AES-256
- Role-Based Access Control (RBAC)
- Audit logging included.

## Tech Stack
| Component | Technology |
|---|---|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| Database | SQLite/PostgreSQL |
| Deployment | Docker |

## Environment Variables
| Variable | Description |
|---|---|
| NODE_ENV | execution environment |
| PORT | server port |
| SANDHAN_JWT_SECRET | JWT signing key |
| SANDHAN_ENCRYPTION_KEY | 32-byte hex key for data encryption |
| BHASHINI_API_KEY | API key |
| BHASHINI_USER_ID | User ID |

## API Reference
- `POST /api/upload`: Upload data files
- `GET /api/analysis`: Retrieve investigation results
