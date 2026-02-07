# Estructura del Proyecto - Matteo Salvatore E-commerce

## 1. Estructura de Directorios Actual

```
matteo-salvatore-ecommerce/
│
├── frontend/                    # Next.js App
│   ├── app/
│   │   ├── admin/               # Admin Dashboard
│   │   │   ├── orders/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx         # Admin Overview
│   │   │
│   │   ├── (shop)/              # Public Shop Routes
│   │   │   ├── products/
│   │   │   │   ├── [slug]/      # Product Detail (PDP)
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx     # Product Listing (PLP)
│   │   │   └── cart/            # (Future: Cart Page)
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx           # Root Layout
│   │   ├── page.tsx             # Home
│   │   ├── globals.css
│   │   └── ...
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── DataTable.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── Navigation.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── api/                 # API Clients (Axios)
│   │   │   ├── api.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   └── products.ts
│   │   └── utils.ts
│   │
│   ├── store/
│   │   └── useCart.ts           # Zustand Store
│   │
│   ├── middleware.ts            # Admin Protection
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.local
│   └── .env.example
│
├── backend/                      # Express API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   └── productController.js
│   │   ├── routes/
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   └── products.js
│   │   ├── services/
│   │   │   └── supabase.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   ├── 003_add_triggers.sql
│   │   ├── 004_seed_data.sql
│   │   └── 005_seed_variants_and_images.sql
│   └── ...
│
├── nginx/
│   ├── nginx.conf
│   └── ...
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## 2. Docker Files

### 2.1 Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables
ENV NEXT_TELEMETRY_DISABLED 1

# Build
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2.2 Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

USER expressjs

EXPOSE 4000

ENV NODE_ENV=production
ENV PORT=4000

CMD ["node", "src/server.js"]
```

## 3. Scripts

### 3.1 Deploy Script (Reference)

```bash
#!/bin/bash
# scripts/deploy.sh
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Build and deploy with Docker
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services..."
sleep 10

# Check health
curl -f http://localhost:3000 || exit 1
curl -f http://localhost:4000/api/health || exit 1

echo "✅ Deployment successful!"
```
