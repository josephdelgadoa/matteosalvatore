#!/bin/bash

# Configuration
VPS_USER="root"
VPS_IP="72.62.162.228"
PROJECT_DIR="matteosalvatore"

echo "🚀 Deploying to $VPS_IP..."

ssh $VPS_USER@$VPS_IP <<EOF
    cd $PROJECT_DIR
    echo "⬇️ Pulling latest changes..."
    git pull origin main

    echo "🐳 Rebuilding and restarting containers..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d --build

    echo "✅ Deployment complete!"
EOF
