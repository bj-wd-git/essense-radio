# Single Dockerfile that clones from Git and deploys
# Hardcoded repository: https://github.com/bj-wd-git/essense-radio.git

FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Clone repository (hardcoded)
RUN git clone https://github.com/bj-wd-git/essense-radio.git -b main . || exit 1

# Navigate to backend directory
WORKDIR /app/backend

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install runtime dependencies (curl for healthcheck)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files from cloned repo
COPY --from=builder /app/backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/backend/dist ./dist

# Expose port
EXPOSE 3000

# Environment variables (set these when running)
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_USERNAME=root
ENV DB_PASSWORD=password
ENV DB_DATABASE=essence_radio
ENV JWT_SECRET=your-secret-key-change-in-production

# Health check - use curl instead of wget, and check if process is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=10 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))" || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
