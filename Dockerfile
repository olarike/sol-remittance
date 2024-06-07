# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .
RUN npm install next@latest react@latest react-dom@latest
# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 3000

# Start the application
# CMD ["node", "dist/app.js"]
CMD ["npm start"]
