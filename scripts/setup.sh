#!/bin/bash

echo "🚀 Setting up Essence Radio..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker is recommended for easy setup."
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install web dependencies
echo "Installing web dependencies..."
cd web
npm install
cd ..

# Install mobile dependencies
echo "Installing mobile dependencies..."
cd mobile
npm install --legacy-peer-deps
cd ..

# Create .env file for backend if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from .env.example..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please update backend/.env with your database credentials and JWT secret!"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Start the services:"
echo "   - Docker: npm run docker:up"
echo "   - Manual: npm run dev:backend (in one terminal) and npm run dev:web (in another)"
echo ""

