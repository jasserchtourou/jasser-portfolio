# 🚀 Deployment Guide for Jasser Portfolio

This guide will help you deploy your portfolio to various platforms.

## 📋 Pre-Deployment Checklist

- ✅ Project name updated to "Jasser Portfolio"
- ✅ Favicon/icon added (red neural network design)
- ✅ Profile photo added at `/public/images/jasser-photo.png`
- ✅ Summary updated with graduation honors
- ✅ All metadata updated

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Jasser Portfolio"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Custom Domain (Optional):**
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder, OR
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

### Option 3: Self-Hosted (VPS/Server)

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

3. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "jasser-portfolio" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up Nginx reverse proxy:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔧 Environment Variables

Currently, no environment variables are required. If you add features that need API keys, create a `.env.local` file:

```env
NEXT_PUBLIC_API_KEY=your_key_here
```

## 📝 Post-Deployment

1. **Verify:**
   - ✅ Favicon displays correctly
   - ✅ Profile photo loads
   - ✅ All pages work (About, Universe)
   - ✅ 3D graph renders properly
   - ✅ Video embeds work
   - ✅ Links to GitHub/LinkedIn work

2. **SEO:**
   - Update `app/layout.jsx` metadata if needed
   - Add Google Analytics (optional)
   - Submit sitemap to Google Search Console

3. **Performance:**
   - Run Lighthouse audit
   - Optimize images if needed
   - Enable compression on hosting platform

## 🎨 Customization

- **Change colors:** Edit `tailwind.config.js` and `src/lib/colorMap.js`
- **Update content:** Edit JSON files in `src/data/`
- **Modify layout:** Edit components in `src/components/`

## 🐛 Troubleshooting

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear `.next` folder and rebuild

**3D graph not showing:**
- Ensure browser supports WebGL
- Check browser console for errors
- Verify all dependencies are installed

**Images not loading:**
- Check file paths in `public/` directory
- Verify Next.js image configuration
- Check browser console for 404 errors

## 📞 Support

If you encounter issues during deployment, check:
- Next.js documentation: https://nextjs.org/docs
- Vercel documentation: https://vercel.com/docs
- Project README.md for setup instructions

---

**Ready to deploy?** Choose your platform and follow the steps above! 🚀

