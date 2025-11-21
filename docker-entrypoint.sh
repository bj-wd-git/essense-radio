#!/bin/bash
set -e

# Start MySQL
echo "Starting MySQL..."
service mysql start

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
for i in {1..30}; do
    if mysqladmin ping -h localhost --silent; then
        echo "MySQL is ready!"
        break
    fi
    echo "Waiting for MySQL... ($i/30)"
    sleep 1
done

# Start Nginx
echo "Starting Nginx..."
service nginx start

# Set environment variables for NestJS
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-3000}
export DB_HOST=${DB_HOST:-127.0.0.1}
export DB_PORT=${DB_PORT:-3306}
export DB_USERNAME=${DB_USERNAME:-essence_user}
export DB_PASSWORD=${DB_PASSWORD:-essence_pass}
export DB_DATABASE=${DB_DATABASE:-essence_radio}
export JWT_SECRET=${JWT_SECRET:-change_this_secret_in_production}
export ALLOWED_ORIGINS=${ALLOWED_ORIGINS:-http://localhost,http://localhost:80}

# Start NestJS application
echo "Starting NestJS backend..."
cd /opt/app/backend
exec node dist/main.js

