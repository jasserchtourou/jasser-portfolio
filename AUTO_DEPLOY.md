# 🚀 Automatic Deployment Guide

I've set up automatic deployment scripts. Choose the method that works best for you:

## Option 1: Deploy with Vercel CLI (Fastest - 2 minutes)

### First Time Setup:
```bash
npm run deploy
```

This will:
1. ✅ Install Vercel CLI if needed
2. ✅ Link your project to Vercel
3. ✅ Deploy to production
4. ✅ Give you a live URL instantly

**Note:** First time will ask you to login to Vercel in your browser.

### Subsequent Deployments:
```bash
npm run deploy
```
Just run this command whenever you want to deploy updates!

---

## Option 2: Deploy via GitHub + Vercel (Recommended - Auto-deploy on push)

### One-Time Setup:

1. **Create GitHub Repository:**
   - Go to: https://github.com/new
   - Name: `jasser-portfolio`
   - Set to **Public**
   - **DO NOT** check any boxes
   - Click "Create repository"

2. **Connect to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/jasser-portfolio.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username!

3. **Connect Vercel:**
   - Go to: https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Select your `jasser-portfolio` repository
   - Click "Deploy"
   - Wait 2-3 minutes
   - **Done!** Your site is live

### Auto-Deploy on Every Push:

After setup, every time you push to GitHub:
```bash
git add .
git commit -m "Update portfolio"
git push
```

Vercel will **automatically deploy** your changes in ~2 minutes!

---

## Option 3: Quick Deploy Script (GitHub + Push)

```bash
npm run deploy:git
```

This script will:
1. ✅ Check git status
2. ✅ Commit any changes
3. ✅ Push to GitHub
4. ✅ If Vercel is connected, it auto-deploys

---

## 🎯 Recommended Workflow

### For First Deployment:
1. Run: `npm run deploy` (uses Vercel CLI - fastest)
2. Get your live URL instantly

### For Ongoing Updates:
1. Set up GitHub + Vercel (Option 2) - one time
2. Then just: `git push` and Vercel auto-deploys!

---

## 📋 What Gets Deployed

- ✅ All pages (/, /projects, /skills, /universe)
- ✅ All assets (images, videos, icons)
- ✅ 3D Universe (WebGL)
- ✅ All project data
- ✅ Screenshots (in public/demo-screenshots/)

---

## 🔧 Troubleshooting

### "Vercel CLI not found"
- Run: `npm install -g vercel`
- Or use Option 2 (GitHub + Vercel web)

### "Not authenticated"
- Run: `vercel login`
- Or use Option 2 (GitHub + Vercel web)

### "Git remote not found"
- Follow Option 2 setup steps
- Or use Option 1 (Vercel CLI)

### "Build failed"
- Check: `npm run build` works locally
- Fix any errors
- Try deploying again

---

## 🌐 After Deployment

Your portfolio will be live at:
- `https://jasser-portfolio.vercel.app` (or your custom domain)

**Update your LinkedIn post** with the actual URL!

---

## 💡 Pro Tips

1. **Custom Domain:**
   - In Vercel dashboard → Settings → Domains
   - Add your domain (e.g., jasser-chtourou.com)
   - Follow DNS instructions

2. **Environment Variables:**
   - If you add API keys later
   - Vercel dashboard → Settings → Environment Variables

3. **Preview Deployments:**
   - Every push creates a preview URL
   - Test before merging to main

4. **Analytics:**
   - Vercel provides built-in analytics
   - Check dashboard for visitor stats

---

**Ready to deploy? Run:**
```bash
npm run deploy
```

And your portfolio will be live in 2 minutes! 🚀

