#!/bin/bash

# Single command deployment script
# Usage: ./docker-deploy.sh [GIT_REPO] [GIT_BRANCH] [GIT_TOKEN]

set -e

GIT_REPO=${1:-"https://github.com/bj-wd-git/essense-radio.git"}
GIT_BRANCH=${2:-"main"}
GIT_TOKEN=${3:-""}

echo "🚀 Deploying Essence Radio from Git..."
echo "Repository: $GIT_REPO"
echo "Branch: $GIT_BRANCH"

# Build arguments
BUILD_ARGS="--build-arg GIT_REPO=$GIT_REPO --build-arg GIT_BRANCH=$GIT_BRANCH"

if [ -n "$GIT_TOKEN" ]; then
  BUILD_ARGS="$BUILD_ARGS --build-arg GIT_TOKEN=$GIT_TOKEN"
fi

# Build the image
echo "📦 Building Docker image..."
docker build $BUILD_ARGS -f Dockerfile.git -t essence-radio:latest .

# Run the container
echo "🚀 Starting container..."
docker run -d \
  --name essence-radio \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=${DB_HOST:-localhost} \
  -e DB_PORT=${DB_PORT:-3306} \
  -e DB_USERNAME=${DB_USERNAME:-root} \
  -e DB_PASSWORD=${DB_PASSWORD:-password} \
  -e DB_DATABASE=${DB_DATABASE:-essence_radio} \
  -e JWT_SECRET=${JWT_SECRET:-your-secret-key-change-in-production} \
  --restart unless-stopped \
  essence-radio:latest

echo "✅ Deployment complete!"
echo "📊 Container running on http://localhost:3000"
echo "🔍 Check logs: docker logs -f essence-radio"
echo "🛑 Stop: docker stop essence-radio"

