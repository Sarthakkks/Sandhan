# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder  
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy backend build
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/package.json ./

# Copy frontend build to be served as static files
COPY --from=frontend-builder /app/frontend/dist ./public

# Create data directories
RUN mkdir -p data uploads

# Copy synthetic data
COPY synthetic-data/ ./synthetic-data/

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001
ENV SANDHAN_JWT_SECRET=sandhan-secret-key-change-in-production

CMD ["node", "dist/index.js"]
