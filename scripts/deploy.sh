#!/bin/bash

# Configuration
VPS_USER="root"
VPS_IP="72.62.162.228"
PROJECT_DIR="matteosalvatore"

echo "🚀 Deploying to $VPS_IP..."

ssh $VPS_USER@$VPS_IP <<EOF
    cd /root
    if [ -d "matteosalvatore" ]; then
        cd matteosalvatore
        if [ -d ".git" ]; then
            echo "⬇️ forcing sync with latest changes..."
            git fetch origin
            git reset --hard origin/main
        else
            echo "⚠️ Git repository corrupt. Re-cloning..."
            cd ..
            rm -rf matteosalvatore
            git clone git@github.com:josephdelgadoa/matteosalvatore.git matteosalvatore
            cd matteosalvatore
        fi
    else
        echo "⚠️ Repository not found. Cloning..."
        git clone git@github.com:josephdelgadoa/matteosalvatore.git matteosalvatore
        cd matteosalvatore
    fi

    echo "🐳 Rebuilding and restarting containers..."
    echo "🐳 Pruning and rebuilding..."
    docker system prune -f
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d

    echo "✅ Deployment complete!"
EOF
