# Frontend Deployment Guide - Vercel

## Quick Setup (5 minutes)

### Step 1: Sign up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project
1. Click "Add New..." → "Project"
2. Find and select your `Airbnb-Clone-` repository
3. Click "Import"

### Step 3: Configure Build Settings

**Framework Preset:** Vite

**Root Directory:** `frontend` (click "Edit" and type `frontend`)

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:**
Click "Add" and enter:
- Name: `VITE_API_URL`
- Value: `https://airbnb-clone-production-b895.up.railway.app/api/v1`

### Step 4: Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for deployment to complete
3. Your app will be live at `https://your-project.vercel.app`

## Automatic Deployments

✅ Every push to `backend-setup` branch automatically triggers a new deployment  
✅ Pull requests get preview deployments  
✅ Zero configuration needed after initial setup

## Your Deployment URLs

After deployment, you'll get:
- **Production:** `https://airbnb-clone-xxxx.vercel.app`
- **Dashboard:** `https://vercel.com/your-username/airbnb-clone`

## Update Backend CORS

After deployment, update your backend to allow your Vercel URL:

```typescript
// backend/src/index.ts
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-project.vercel.app', // Add your Vercel URL here
];
```

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Domain automatically gets SSL certificate

## Troubleshooting

**Build fails?**
- Check that `VITE_API_URL` environment variable is set
- Verify root directory is set to `frontend`
- Check build logs for TypeScript errors

**404 on page refresh?**
- Vercel automatically handles SPA routing (already configured)

**API calls failing?**
- Verify `VITE_API_URL` points to your Railway backend
- Check backend CORS settings include your Vercel domain

## CLI Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts and link to your project
```

---

**That's it!** Every time you push to GitHub, Vercel automatically deploys your latest frontend. 🚀
