# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments (matching docker-compose.yml)
ARG NODE_ENV
ARG PORT
ARG DATABASE
ARG DATABASE_PASSWORD
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG EMAIL_HOST
ARG EMAIL_PORT
ARG EMAIL_ADDRESS
ARG EMAIL_FROM
ARG EMAIL_PASSWORD
ARG EMAIL_TO
ARG COMPANY_NAME

# Copy package files and install dependencies
COPY package*.json tsconfig*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY src ./src

RUN npm install -g typescript

# Build TypeScript
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built files and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Expose port (from ENV)
ENV NODE_ENV=production
ENV PORT=${PORT:-6010}
EXPOSE ${PORT:-6010}

# Create logs directory
RUN mkdir -p /app/logs

# Start the server
CMD ["node", "dist/server.js"]
