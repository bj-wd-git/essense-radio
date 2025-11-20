# Single Command Deployment

## 🚀 Deploy from Git with One Command

### Basic Usage (Public Repository)

```bash
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

### With Private Repository (GitHub Token)

```bash
docker build \
  --build-arg GIT_REPO=https://github.com/username/repo.git \
  --build-arg GIT_BRANCH=main \
  --build-arg GIT_TOKEN=ghp_your_token_here \
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

### Using Deployment Scripts

**Linux/Mac:**
```bash
chmod +x docker-deploy.sh
./docker-deploy.sh https://github.com/bj-wd-git/essense-radio.git main
```

**Windows PowerShell:**
```powershell
.\docker-deploy.ps1 https://github.com/bj-wd-git/essense-radio.git main
```

## ✅ What the Dockerfile Does

1. **Clones from Git** - Pulls the latest code from repository
2. **Installs Dependencies** - Runs `npm ci` for clean install
3. **Builds Application** - Compiles TypeScript to JavaScript
4. **Creates Production Image** - Multi-stage build for smaller image
5. **Starts Application** - Runs `npm run start:prod`

## 📋 Required Environment Variables

When running the container, set these:

- `DB_HOST` - Database hostname
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name (default: essence_radio)
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Application port (default: 3000)
- `NODE_ENV` - Set to `production`

## 🔍 Verify Deployment

```bash
# Check container is running
docker ps | grep essence-radio

# View logs
docker logs -f essence-radio

# Test health endpoint
curl http://localhost:3000/health

# Test API
curl http://localhost:3000
```

## 🛑 Stop and Remove

```bash
docker stop essence-radio
docker rm essence-radio
```

## 📝 Notes

- The Dockerfile automatically handles git clone
- Builds TypeScript application
- Includes healthcheck endpoint
- Production-ready configuration
- Supports both public and private repositories

