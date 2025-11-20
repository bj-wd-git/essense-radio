# PowerShell setup script for Windows

Write-Host "🚀 Setting up Essence Radio..." -ForegroundColor Cyan

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Docker is not installed. Docker is recommended for easy setup." -ForegroundColor Yellow
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install web dependencies
Write-Host "Installing web dependencies..." -ForegroundColor Yellow
Set-Location web
npm install
Set-Location ..

# Install mobile dependencies
Write-Host "Installing mobile dependencies..." -ForegroundColor Yellow
Set-Location mobile
npm install --legacy-peer-deps
Set-Location ..

# Create .env file for backend if it doesn't exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "📝 Creating backend/.env from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "⚠️  Please update backend/.env with your database credentials and JWT secret!" -ForegroundColor Yellow
}

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Update backend/.env with your configuration"
Write-Host "2. Start the services:"
Write-Host "   - Docker: npm run docker:up"
Write-Host "   - Manual: npm run dev:backend (in one terminal) and npm run dev:web (in another)"
Write-Host ""

