#!/bin/bash

# Configuration
VPS_USER="root"
VPS_IP="72.62.162.228"
PROJECT_DIR="matteosalvatore"

echo "🚀 Deploying to $VPS_IP..."

ssh $VPS_USER@$VPS_IP <<EOF
    cd $PROJECT_DIR
    echo "⬇️ forcing sync with latest changes..."
    git fetch origin
    git reset --hard origin/main

    echo "🐳 Rebuilding and restarting containers..."
    echo "🐳 Pruning and rebuilding..."
    docker system prune -f
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d

    echo "✅ Deployment complete!"
EOF
