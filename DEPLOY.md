# Single Command Deployment

## 🚀 Quick Deploy from Git

### Option 1: Using Dockerfile.git (Recommended)

```bash
# Build and run in one command
docker build --build-arg GIT_REPO=https://github.com/bj-wd-git/essense-radio.git --build-arg GIT_BRANCH=main -f Dockerfile.git -t essence-radio . && \
docker run -d --name essence-radio -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=3306 \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=your-password \
  -e DB_DATABASE=essence_radio \
  -e JWT_SECRET=your-secret-key \
  --restart unless-stopped \
  essence-radio
```

### Option 2: Using Deployment Scripts

**Linux/Mac:**
```bash
./docker-deploy.sh https://github.com/bj-wd-git/essense-radio.git main
```

**Windows PowerShell:**
```powershell
.\docker-deploy.ps1 https://github.com/bj-wd-git/essense-radio.git main
```

### Option 3: Private Repository with Token

```bash
docker build \
  --build-arg GIT_REPO=https://github.com/username/repo.git \
  --build-arg GIT_BRANCH=main \
  --build-arg GIT_TOKEN=your-github-token \
  -f Dockerfile.git \
  -t essence-radio . && \
docker run -d --name essence-radio -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_PORT=3306 \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=your-password \
  -e DB_DATABASE=essence_radio \
  -e JWT_SECRET=your-secret-key \
  --restart unless-stopped \
  essence-radio
```

## 📋 Required Environment Variables

Set these when running the container:

- `DB_HOST` - Database host
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name (default: essence_radio)
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Application port (default: 3000)
- `NODE_ENV` - Environment (default: production)

## 🔍 Verify Deployment

```bash
# Check container status
docker ps

# View logs
docker logs -f essence-radio

# Test health endpoint
curl http://localhost:3000/health

# Test API
curl http://localhost:3000
```

## 🛑 Stop Container

```bash
docker stop essence-radio
docker rm essence-radio
```

## 📝 Notes

- The Dockerfile automatically clones from Git
- Builds the TypeScript application
- Runs in production mode
- Includes healthcheck endpoint
- Automatically retries database connections

