# 🚀 Quick Deploy Guide

## Deploy to Vercel (Recommended - 2 minutes)

### Step 1: Prepare for Deployment

```bash
# Make sure you're in the project directory
cd C:\Users\Gigab\Desktop\NeuroJasser

# Check if git is initialized
git status
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"** (green button)
3. Name it: `jasser-portfolio` or `jasser-ai-portfolio`
4. Set to **Public** (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit - Jasser Portfolio"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/jasser-portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**
4. Click **"Add New Project"**
5. Import your `jasser-portfolio` repository
6. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
7. Click **"Deploy"**
8. Wait 2-3 minutes
9. Your site will be live at: `https://jasser-portfolio.vercel.app`

### Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `jasser-chtourou.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

---

## Alternative: Deploy to Netlify

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Log in
3. Drag and drop the `.next` folder, OR
4. Connect GitHub repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Click **"Deploy site"**

---

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All pages work (/, /projects, /skills, /universe)
- [ ] 3D universe renders properly
- [ ] Videos embed correctly
- [ ] Images load
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] Favicon displays
- [ ] No console errors

---

## Environment Variables (if needed later)

Currently, no environment variables are required. If you add features that need API keys:

1. In Vercel: **Settings** → **Environment Variables**
2. Add variables
3. Redeploy

---

## Troubleshooting

**Build fails?**
- Check Node.js version (should be 18+)
- Run `npm install` locally first
- Check for TypeScript errors: `npm run build` locally

**3D universe not showing?**
- Check browser console for errors
- Ensure WebGL is enabled
- Try different browser

**Videos not loading?**
- Check if YouTube/LinkedIn URLs are correct
- Verify embed URLs are properly formatted

---

## Update Your Portfolio

After making changes:

```bash
git add .
git commit -m "Update: [describe changes]"
git push
```

Vercel will automatically redeploy!

---

**Your portfolio will be live in ~5 minutes!** 🎉

