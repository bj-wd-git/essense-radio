# Deployment Guide

This guide covers deploying Essence Radio to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

Railway offers free tier with easy deployment.

1. **Sign up**: https://railway.app
2. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```
3. **Deploy Backend**:
   ```bash
   cd backend
   railway init
   railway up
   ```
4. **Set Environment Variables** in Railway dashboard:
   ```
   NODE_ENV=production
   DB_HOST=your-db-host
   DB_USERNAME=root
   DB_PASSWORD=your-password
   DB_DATABASE=essence_radio
   JWT_SECRET=your-secret-key
   PORT=3000
   ```
5. **Add MySQL Service** in Railway dashboard
6. **Deploy Web**:
   ```bash
   cd web
   railway init
   railway up
   ```
   Set environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

### Option 2: Render

1. **Sign up**: https://render.com
2. **Create New Web Service**:
   - Connect your GitHub repo
   - Select `backend` directory
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
3. **Add Environment Variables** (same as Railway)
4. **Create PostgreSQL Database** (Render uses PostgreSQL, not MySQL)
5. **Deploy Web Service**:
   - Select `web` directory
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

**Note**: For Render, you'll need to update backend to use PostgreSQL instead of MySQL.

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Sign up: https://vercel.com
2. Import your repository
3. Set root directory to `web`
4. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

**Backend**: Deploy to Railway or Render as above.

### Option 4: Fly.io

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. **Login**: `fly auth login`
3. **Deploy Backend**:
   ```bash
   cd backend
   fly launch
   ```
4. **Set Secrets**:
   ```bash
   fly secrets set JWT_SECRET=your-secret
   fly secrets set DB_HOST=your-db-host
   # ... etc
   ```
5. **Deploy Web**: Same process in `web` directory

### Option 5: DigitalOcean App Platform

1. **Sign up**: https://www.digitalocean.com
2. **Create App** from GitHub
3. **Add Backend Component**:
   - Source: `backend/`
   - Build: `npm run build`
   - Run: `npm run start:prod`
4. **Add Web Component**:
   - Source: `web/`
   - Build: `npm run build`
   - Output: `dist`
5. **Add Managed Database** (MySQL)

## 📋 Pre-Deployment Checklist

### Backend
- [ ] Update CORS origins in `backend/src/main.ts`
- [ ] Set secure JWT_SECRET
- [ ] Configure database connection
- [ ] Set NODE_ENV=production
- [ ] Update Socket.IO CORS settings
- [ ] Test API endpoints

### Frontend
- [ ] Set VITE_API_URL to production backend URL
- [ ] Update Socket.IO URLs
- [ ] Test all features
- [ ] Build production bundle
- [ ] Test on mobile devices

### Database
- [ ] Create production database
- [ ] Run migrations (TypeORM will auto-create in dev)
- [ ] Backup strategy
- [ ] Connection pooling configured

## 🔧 Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-secure-password
DB_DATABASE=essence_radio
JWT_SECRET=generate-a-long-random-string-here
PORT=3000
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend
```bash
VITE_API_URL=https://your-backend-domain.com
```

## 🗄️ Database Setup

### For MySQL (Railway, DigitalOcean)
- Use managed MySQL service
- Connection string provided by platform
- TypeORM will create tables automatically

### For PostgreSQL (Render)
You'll need to update backend to use PostgreSQL:

1. Install: `npm install pg @types/pg`
2. Update `backend/src/app.module.ts`:
   ```typescript
   TypeOrmModule.forRoot({
     type: 'postgres',
     // ... rest of config
   })
   ```

## 🔒 Security Checklist

- [ ] Use HTTPS (required for WebRTC)
- [ ] Set secure JWT_SECRET (32+ characters)
- [ ] Configure CORS for production domains only
- [ ] Use environment variables (never commit secrets)
- [ ] Enable database SSL if available
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Regular security updates

## 📊 Monitoring

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (free tier)
- **Analytics**: Google Analytics or Plausible
- **Logs**: Platform's built-in logging

## 🚨 Troubleshooting

### Backend Won't Start
- Check environment variables
- Verify database connection
- Check logs: `railway logs` or platform logs
- Ensure port is correctly set

### Frontend Can't Connect
- Verify VITE_API_URL is set correctly
- Check CORS settings on backend
- Verify backend is accessible
- Check browser console for errors

### WebRTC Not Working
- HTTPS is required for WebRTC
- Check firewall allows WebRTC traffic
- Verify STUN/TURN servers are accessible
- Consider using TURN server for production

## 💰 Cost Estimates

### Free Tier Options
- **Railway**: $5/month free credit
- **Render**: Free tier (with limitations)
- **Vercel**: Free for personal projects
- **Fly.io**: Free tier available
- **DigitalOcean**: $5/month minimum

### Recommended Setup (Free/Cheap)
- Frontend: Vercel (Free)
- Backend: Railway ($5/month)
- Database: Railway MySQL (included)
- **Total**: ~$5/month

## 📚 Platform-Specific Guides

See individual platform documentation for detailed setup:
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Fly.io: https://fly.io/docs

