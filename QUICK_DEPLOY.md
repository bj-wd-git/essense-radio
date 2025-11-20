# Quick Deployment Guide

## 🚀 Fastest Way: Railway (5 minutes)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy Backend
```bash
cd backend
railway init
railway up
```

### Step 3: Add MySQL Database
1. Go to Railway dashboard
2. Click "New" → "Database" → "MySQL"
3. Copy connection details

### Step 4: Set Environment Variables
In Railway dashboard, add:
```
NODE_ENV=production
DB_HOST=(from database)
DB_USERNAME=(from database)
DB_PASSWORD=(from database)
DB_DATABASE=essence_radio
JWT_SECRET=(generate random string)
PORT=3000
```

### Step 5: Deploy Frontend
```bash
cd ../web
railway init
railway up
```

Set environment variable:
```
VITE_API_URL=https://your-backend.railway.app
```

### Step 6: Update CORS
In `backend/src/main.ts`, update:
```typescript
origin: ['https://your-web.railway.app']
```

Redeploy backend.

**Done!** Your app is live! 🎉

## Alternative: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel (Free)
1. Go to https://vercel.com
2. Import GitHub repo
3. Set:
   - Root Directory: `web`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable: `VITE_API_URL=https://your-backend.railway.app`

### Backend on Railway
Follow steps 1-4 above.

## Cost
- **Railway**: $5/month (includes database)
- **Vercel**: Free for personal projects
- **Total**: $5/month or free (Vercel + Railway free tier)

## Post-Deployment

1. **Update CORS** in backend for your frontend domain
2. **Test WebRTC** - HTTPS is required
3. **Set up domain** (optional) - Railway/Vercel provide free subdomains
4. **Monitor** - Check Railway/Vercel dashboards for logs

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify database connection
- Check logs: `railway logs`

### Frontend can't connect
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Ensure backend is running

### WebRTC not working
- HTTPS is required (Railway/Vercel provide this)
- Check browser console for errors
- Verify STUN servers are accessible

