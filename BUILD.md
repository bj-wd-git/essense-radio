# Build Guide

## Building the Application

### Backend Build

```bash
cd backend
npm run build
```

The build output will be in `backend/dist/` directory.

To run the production build:
```bash
npm run start:prod
```

### Web Build

```bash
cd web
npm run build
```

The build output will be in `web/dist/` directory.

The built files can be served by any static file server or deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

### Production Docker Build

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Or build individual services
docker build -t essence-backend:prod ./backend
docker build -t essence-web:prod ./web
```

## Build Outputs

### Backend
- **Location:** `backend/dist/`
- **Main file:** `dist/main.js`
- **Dependencies:** Requires `node_modules/` to run

### Web
- **Location:** `web/dist/`
- **Files:**
  - `index.html` - Entry point
  - `assets/` - Compiled JavaScript and CSS
- **Size:** ~270 KB (gzipped: ~86 KB)

## Production Deployment

### Backend Production

1. Set environment variables:
   ```bash
   NODE_ENV=production
   DB_HOST=your-db-host
   DB_PASSWORD=secure-password
   JWT_SECRET=secure-random-secret
   ```

2. Build:
   ```bash
   cd backend
   npm run build
   ```

3. Run:
   ```bash
   npm run start:prod
   ```

### Web Production

1. Build:
   ```bash
   cd web
   npm run build
   ```

2. Serve the `dist/` folder with:
   - Nginx
   - Apache
   - Node.js static server
   - Any static hosting service

3. Configure API URL:
   - Set `VITE_API_URL` environment variable during build
   - Or update the API URL in the built files

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=essence_radio
JWT_SECRET=your-secret-key
PORT=3000
```

### Web
Set during build:
```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

## Build Scripts

From root directory:
```bash
# Build both
npm run build:backend
npm run build:web

# Or individually
cd backend && npm run build
cd web && npm run build
```

## Troubleshooting

### TypeScript Errors
- Ensure all types are properly defined
- Check `tsconfig.json` settings
- Run `npm run build` to see detailed errors

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Check for missing dependencies

### Production Issues
- Ensure environment variables are set
- Check database connection
- Verify CORS settings for production domains
- Test API endpoints

