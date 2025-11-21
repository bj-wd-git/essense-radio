# Docker Deployment Guide

This guide explains how to build and run the Essence Radio application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)
- Git repository URL (if using git clone method)

## Quick Start

### Using Docker Compose (Recommended)

1. **Set environment variables** (create a `.env` file or export them):

```bash
export GIT_REPO=https://github.com/your-username/essense.git
export GIT_BRANCH=main
```

2. **Build and run**:

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api
- MySQL: localhost:3306

### Using Docker directly

1. **Build the image**:

```bash
docker build \
  --build-arg GIT_REPO=https://github.com/your-username/essense.git \
  --build-arg GIT_BRANCH=main \
  -t essence-radio .
```

2. **Run the container**:

```bash
docker run -d \
  -p 80:80 \
  -p 3000:3000 \
  -p 3306:3306 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=127.0.0.1 \
  -e DB_PORT=3306 \
  -e DB_USERNAME=essence_user \
  -e DB_PASSWORD=essence_pass \
  -e DB_DATABASE=essence_radio \
  -e JWT_SECRET=your_jwt_secret_key \
  -e ALLOWED_ORIGINS=http://localhost,http://localhost:80 \
  --name essence-radio \
  essence-radio
```

## Configuration

### Build Arguments

- `GIT_REPO`: Git repository URL (default: `https://github.com/your/repo.git`)
- `GIT_BRANCH`: Git branch or tag to clone (default: `main`)

### Environment Variables

- `NODE_ENV`: Node environment (default: `production`)
- `PORT`: Backend server port (default: `3000`)
- `DB_HOST`: MySQL host (default: `127.0.0.1`)
- `DB_PORT`: MySQL port (default: `3306`)
- `DB_USERNAME`: MySQL username (default: `essence_user`)
- `DB_PASSWORD`: MySQL password (default: `essence_pass`)
- `DB_DATABASE`: MySQL database name (default: `essence_radio`)
- `JWT_SECRET`: JWT secret key for authentication (⚠️ **CHANGE IN PRODUCTION**)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Private Git Repositories

If your repository is private, you have a few options:

### Option 1: SSH Keys (Recommended for CI/CD)

1. Add your SSH key as a build secret:

```bash
docker build \
  --ssh default=$SSH_AUTH_SOCK \
  --build-arg GIT_REPO=git@github.com:your-username/essense.git \
  -t essence-radio .
```

### Option 2: Personal Access Token

Use a token in the URL:

```bash
docker build \
  --build-arg GIT_REPO=https://TOKEN@github.com/your-username/essense.git \
  -t essence-radio .
```

### Option 3: Build Context (Local Development)

For local development, you can modify the Dockerfile to use COPY instead of git clone, or use a local git repository.

## Services

The Docker container runs three services:

1. **MySQL**: Database server on port 3306
2. **Nginx**: Web server on port 80 (serves frontend and proxies API)
3. **NestJS**: Backend API on port 3000

All services are managed by Supervisor for automatic restart on failure.

## Logs

View logs for all services:

```bash
docker-compose logs -f
```

Or for individual services:

```bash
docker-compose logs -f app
```

## Stopping the Application

```bash
docker-compose down
```

To also remove volumes (⚠️ **This will delete database data**):

```bash
docker-compose down -v
```

## Troubleshooting

### MySQL won't start

Check MySQL logs:

```bash
docker exec -it <container-name> tail -f /var/log/supervisor/mysql.err.log
```

### Backend won't start

Check NestJS logs:

```bash
docker exec -it <container-name> tail -f /var/log/supervisor/nestjs.err.log
```

### Database connection issues

Ensure the database credentials match in:
- Docker environment variables
- Backend configuration

### Frontend not loading

Check Nginx logs:

```bash
docker exec -it <container-name> tail -f /var/log/supervisor/nginx.err.log
```

## Production Considerations

1. **Change default passwords**: Update `DB_PASSWORD` and `JWT_SECRET`
2. **Use environment-specific configurations**: Don't hardcode secrets
3. **Set up proper backups**: MySQL data is stored in a Docker volume
4. **Configure SSL/TLS**: Use a reverse proxy (e.g., Traefik, Caddy) for HTTPS
5. **Monitor resources**: Set appropriate memory and CPU limits
6. **Use separate containers**: Consider splitting MySQL into its own container for better scalability

## Volume Persistence

MySQL data is persisted in a Docker volume named `mysql_data`. To backup:

```bash
docker run --rm -v mysql_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mysql-backup.tar.gz /data
```

To restore:

```bash
docker run --rm -v mysql_data:/data -v $(pwd):/backup ubuntu tar xzf /backup/mysql-backup.tar.gz -C /
```

