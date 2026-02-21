FROM node:22-alpine

WORKDIR /app

# Install dependencies based on package-lock.json
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start command
CMD ["npm", "start"]
