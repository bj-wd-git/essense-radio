# PowerShell deployment script
# Usage: .\docker-deploy.ps1 [GIT_REPO] [GIT_BRANCH] [GIT_TOKEN]

param(
    [string]$GIT_REPO = "https://github.com/bj-wd-git/essense-radio.git",
    [string]$GIT_BRANCH = "main",
    [string]$GIT_TOKEN = ""
)

Write-Host "🚀 Deploying Essence Radio from Git..." -ForegroundColor Cyan
Write-Host "Repository: $GIT_REPO"
Write-Host "Branch: $GIT_BRANCH"

# Build arguments
$buildArgs = @(
    "build",
    "--build-arg", "GIT_REPO=$GIT_REPO",
    "--build-arg", "GIT_BRANCH=$GIT_BRANCH",
    "-f", "Dockerfile.git",
    "-t", "essence-radio:latest",
    "."
)

if ($GIT_TOKEN) {
    $buildArgs += "--build-arg", "GIT_TOKEN=$GIT_TOKEN"
}

# Build the image
Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker $buildArgs

# Stop and remove existing container if it exists
if (docker ps -a --format '{{.Names}}' | Select-String -Pattern '^essence-radio$') {
    Write-Host "🛑 Stopping existing container..." -ForegroundColor Yellow
    docker stop essence-radio
    docker rm essence-radio
}

# Run the container
Write-Host "🚀 Starting container..." -ForegroundColor Yellow
docker run -d `
    --name essence-radio `
    -p 3000:3000 `
    -e NODE_ENV=production `
    -e PORT=3000 `
    -e DB_HOST=$env:DB_HOST `
    -e DB_PORT=$env:DB_PORT `
    -e DB_USERNAME=$env:DB_USERNAME `
    -e DB_PASSWORD=$env:DB_PASSWORD `
    -e DB_DATABASE=$env:DB_DATABASE `
    -e JWT_SECRET=$env:JWT_SECRET `
    --restart unless-stopped `
    essence-radio:latest

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "📊 Container running on http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔍 Check logs: docker logs -f essence-radio" -ForegroundColor Cyan
Write-Host "🛑 Stop: docker stop essence-radio" -ForegroundColor Yellow

