# Deployment Quick Reference

## 🎯 Recommended: Railway (Easiest & Free Tier)

### Prerequisites
- GitHub account
- Railway account (free): https://railway.app

### Deploy in 5 Steps

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   railway init
   railway up
   ```

3. **Add MySQL Database**:
   - In Railway dashboard: New → Database → MySQL
   - Copy connection details

4. **Set Environment Variables** (Railway dashboard):
   ```
   NODE_ENV=production
   DB_HOST=(from database)
   DB_USERNAME=(from database)  
   DB_PASSWORD=(from database)
   DB_DATABASE=essence_radio
   JWT_SECRET=(generate: openssl rand -hex 32)
   PORT=3000
   ```

5. **Deploy Frontend**:
   ```bash
   cd ../web
   railway init
   railway up
   ```
   Set: `VITE_API_URL=https://your-backend.railway.app`

6. **Update CORS** in `backend/src/main.ts`:
   ```typescript
   origin: ['https://your-web.railway.app']
   ```

**Done!** Your app is live at `https://your-web.railway.app`

## 📊 Platform Comparison

| Platform | Free Tier | Database | Ease | Best For |
|----------|-----------|----------|------|----------|
| **Railway** | ✅ $5 credit | ✅ MySQL | ⭐⭐⭐⭐⭐ | Best overall |
| **Render** | ✅ Limited | ✅ PostgreSQL | ⭐⭐⭐⭐ | Good alternative |
| **Vercel** | ✅ Unlimited | ❌ External | ⭐⭐⭐⭐⭐ | Frontend only |
| **Fly.io** | ✅ Limited | ❌ External | ⭐⭐⭐ | Docker-based |
| **DigitalOcean** | ❌ $5/mo | ✅ MySQL | ⭐⭐⭐⭐ | Production-ready |

## 🔗 Quick Links

- **Railway**: https://railway.app
- **Render**: https://render.com  
- **Vercel**: https://vercel.com
- **Fly.io**: https://fly.io

## 📝 Full Documentation

- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Step-by-step guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [BUILD.md](./BUILD.md) - Build instructions

