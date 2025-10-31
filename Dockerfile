# Dockerfile for Backend API (Railway/Render/DigitalOcean)
FROM node:22-alpine3.21

# Install security updates and curl for health checks
RUN apk update && apk upgrade && apk add --no-cache curl dumb-init && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies as root first
RUN npm ci --omit=dev --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY . .

# Create non-root user and change ownership
RUN addgroup -g 1001 -S nodejs && \
    adduser -S careerpath -u 1001 -G nodejs && \
    chown -R careerpath:nodejs /app

# Switch to non-root user
USER careerpath

# Expose port
EXPOSE 3001

# Health check with proper error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly and start the server
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]