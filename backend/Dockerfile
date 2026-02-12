# Use Node.js LTS on Debian (better Prisma compatibility)
FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
