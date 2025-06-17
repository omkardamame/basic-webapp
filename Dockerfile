# Stage 1: Install dependencies and build
FROM node:16-alpine AS builder

WORKDIR /app

# Only install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Stage 2: Create a minimal production image
FROM node:16-alpine

WORKDIR /app

# Copy app with production deps only
COPY --from=builder /app /app

# Expose app port
EXPOSE 3030

# Run the app
CMD ["npm", "start"]