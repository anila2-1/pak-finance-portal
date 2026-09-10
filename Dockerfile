# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml first (for caching installs)
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the project
COPY . .

# Expose Payload's default port
EXPOSE 3000

# Start the Payload CMS server
CMD ["pnpm", "start"]
