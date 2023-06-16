# Install dependencies only when needed
FROM node:18-alpine AS deps

# Install the libc6-compat package
RUN apk add --no-cache libc6-compat

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json from the current directory into the container at /app
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM node:18-alpine AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the installed dependencies from the previous stage to the current stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the current directory contents into the container at /app
COPY . .

# Build the source code
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner

# Set the working directory to /app
WORKDIR /app

ENV NODE_ENV production

# Create a system group named nodejs with the GID 1001
RUN addgroup --system --gid 1001 nodejs

# Create a system user named nextjs with the UID 1001
RUN adduser --system --uid 1001 nextjs

# Copy the next.config.js file from the previous stage to the current stage
COPY --from=builder /app/next.config.js ./

# Copy the public directory from the previous stage to the current stage
COPY --from=builder /app/public ./public

# Copy the package.json file from the previous stage to the current stage
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size 
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set user to nextjs
USER nextjs

# Expose port 3000 to the outside world
EXPOSE 3000

ENV PORT 3000

# Run server.js when the container starts
CMD ["node", "server.js"]