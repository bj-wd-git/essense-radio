#!/bin/bash

echo "🔧 Setting up production environment..."

# Generate JWT secret
JWT_SECRET=$(openssl rand -hex 32)
echo "Generated JWT_SECRET: $JWT_SECRET"
echo ""

# Create production .env files
echo "Creating production environment files..."

# Backend .env.production
cat > backend/.env.production << EOF
NODE_ENV=production
DB_HOST=\${DB_HOST}
DB_PORT=3306
DB_USERNAME=\${DB_USERNAME}
DB_PASSWORD=\${DB_PASSWORD}
DB_DATABASE=essence_radio
JWT_SECRET=$JWT_SECRET
PORT=3000
ALLOWED_ORIGINS=https://your-frontend-domain.com
EOF

# Web .env.production
cat > web/.env.production << EOF
VITE_API_URL=https://your-backend-domain.com
EOF

echo "✅ Production environment files created!"
echo ""
echo "📝 Next steps:"
echo "   1. Update ALLOWED_ORIGINS in backend/.env.production"
echo "   2. Update VITE_API_URL in web/.env.production"
echo "   3. Set database credentials"
echo "   4. Build and deploy"

