# Render.com Deployment Guide for Backend

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

## Step 2: Create Render.com Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

## Step 3: Create Web Service

1. Dashboard → "New +" → "Web Service"
2. Connect Repository: `social_chat_app`
3. Click "Connect"

## Step 4: Configure Service

**Basic Settings:**
- Name: `fwp-backend-api`
- Region: `Singapore` (closest to Bangladesh)
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `node server.js`

**Instance Type:**
- Free (for testing)
- Or Starter ($7/month for production)

## Step 5: Environment Variables

Click "Advanced" → Add Environment Variables:

```
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://onetimemalaysiatoor_db_user:Jakir@4219@fwp-cluster.zmsoq60.mongodb.net/?appName=FWP-Cluster
JWT_SECRET=fwp_audiochat_jwt_secret_key_2025_super_secure_production
JWT_EXPIRE=7d
FRONTEND_URL=https://utility-logic-454816-h3.web.app
CORS_ORIGIN=https://utility-logic-454816-h3.web.app
SESSION_SECRET=fwp_session_secret_production_2025
```

## Step 6: Create Web Service

Click "Create Web Service"

## Step 7: Wait for Deployment

- Initial deployment takes 5-10 minutes
- Watch logs for any errors
- Service will auto-deploy on every git push

## Step 8: Get Your Backend URL

After deployment completes, you'll get:
```
https://fwp-backend-api.onrender.com
```

## Step 9: Test Your API

```bash
# Health check
curl https://fwp-backend-api.onrender.com/health

# Or visit in browser
https://fwp-backend-api.onrender.com
```

## Troubleshooting

**Build Failed:**
- Check Node.js version in `package.json`
- Ensure all dependencies are in `package.json`

**Application Error:**
- Check Render logs
- Verify MongoDB connection string
- Check environment variables

**CORS Issues:**
- Verify FRONTEND_URL matches your Firebase hosting URL
- Check CORS_ORIGIN in environment variables

## Important Notes

- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to Starter plan ($7/month) for always-on service
- Render provides automatic SSL certificates
- Auto-deploys from GitHub on every push
