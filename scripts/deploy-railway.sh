#!/bin/bash

echo "🚀 Deploying Essence Radio to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "📝 Logging in to Railway..."
railway login

# Deploy Backend
echo "🔧 Deploying Backend..."
cd backend
railway init --name essence-backend || railway link
railway up

# Set environment variables
echo "⚙️  Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=3000
echo "⚠️  Please set these in Railway dashboard:"
echo "   - DB_HOST"
echo "   - DB_USERNAME"
echo "   - DB_PASSWORD"
echo "   - DB_DATABASE"
echo "   - JWT_SECRET"

# Deploy Web
echo "🌐 Deploying Web..."
cd ../web
railway init --name essence-web || railway link
railway up

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "   1. Add MySQL database in Railway dashboard"
echo "   2. Set environment variables"
echo "   3. Update VITE_API_URL in web service"
echo "   4. Update CORS in backend for your domain"

