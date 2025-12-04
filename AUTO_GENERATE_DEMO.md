# 🤖 Automated Demo Generation

I've created automated scripts that will generate screenshots and videos for you automatically!

## 🚀 Quick Start

### Option 1: Generate Everything (Recommended)

```bash
npm run generate:demo
```

This will:
1. ✅ Start the dev server automatically
2. ✅ Take 10 high-quality screenshots
3. ✅ Create a video from the screenshots
4. ✅ Stop the server when done

### Option 2: Generate Screenshots Only

```bash
npm run generate:screenshots
```

**Note:** Make sure your dev server is running first:
```bash
npm run dev
```

### Option 3: Create Video from Existing Screenshots

```bash
npm run generate:video
```

---

## 📸 What Gets Generated

### Screenshots (10 total):
1. **01-about-hero.png** - About page hero section
2. **02-about-full.png** - Full about page
3. **03-projects-overview.png** - Projects page overview
4. **04-projects-full.png** - Full projects page
5. **05-skills-page.png** - Skills page
6. **06-universe-initial.png** - 3D Universe initial view ⭐
7. **07-universe-full-network.png** - Full network view ⭐
8. **08-universe-node-hover.png** - Node hover effect ⭐
9. **09-universe-project-panel.png** - Project panel open ⭐
10. **10-project-with-video.png** - Project with video demo

### Video:
- **demo-portfolio.mp4** - 24-second video showcasing the portfolio

---

## 📁 Output Location

All files are saved to:
- Screenshots: `public/demo-screenshots/`
- Video: `public/demo-portfolio.mp4`

---

## 🔧 Requirements

### Automatic Installation:
The script will install `puppeteer` automatically when you run `npm install`.

### For Video Creation (Optional):
If you want to generate the video automatically, install `ffmpeg`:

**Windows:**
```bash
choco install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

**If ffmpeg is not installed:**
- The script will still generate all screenshots
- You can create the video manually using online tools:
  - https://www.freeconvert.com/video-compressor
  - https://www.clipchamp.com/
  - Upload screenshots from `public/demo-screenshots/`
  - Set each image to display for 3 seconds
  - Export as MP4

---

## ⚙️ Configuration

### Custom URL:
If your portfolio is already deployed, you can use a custom URL:

```bash
PORTFOLIO_URL=https://your-portfolio.vercel.app npm run generate:demo
```

### Default:
Uses `http://localhost:3000` (starts dev server automatically)

---

## 🎬 Video Details

- **Duration:** ~24 seconds (3 seconds per screenshot)
- **Resolution:** 1920x1080 (Full HD)
- **Format:** MP4 (H.264)
- **FPS:** 30

---

## 📋 Process Flow

1. **Check Server** - Checks if dev server is running
2. **Start Server** - If not running, starts it automatically
3. **Wait for Load** - Waits 5 seconds for everything to load
4. **Navigate Pages** - Automatically visits each page
5. **Take Screenshots** - Captures high-quality screenshots (2x retina)
6. **Wait for Animations** - Waits for 3D animations to render
7. **Create Video** - Combines screenshots into video (if ffmpeg available)
8. **Cleanup** - Stops dev server if it was started

---

## 🐛 Troubleshooting

### "Server not starting"
- Make sure port 3000 is available
- Check if another Next.js app is running
- Try: `npm run dev` manually first

### "Screenshots are blank"
- Wait longer for 3D to load (increase timeout in script)
- Check browser console for errors
- Ensure WebGL is supported

### "Video not created"
- Install ffmpeg (see Requirements above)
- Or create video manually using online tools
- Screenshots are still generated successfully

### "Puppeteer installation failed"
- Run: `npm install puppeteer --save-dev`
- On some systems, you may need: `npm install puppeteer --unsafe-perm=true`

---

## 🎯 Next Steps

After generation:

1. **Review Screenshots:**
   - Check `public/demo-screenshots/` folder
   - Use the best ones for LinkedIn

2. **Use the Video:**
   - Upload `public/demo-portfolio.mp4` to LinkedIn
   - Or use individual screenshots

3. **Post on LinkedIn:**
   - Use the post from `LINKEDIN_POST.md`
   - Include the video or screenshots
   - Add your deployed URL

---

## 💡 Pro Tips

1. **Best Screenshots for LinkedIn:**
   - `06-universe-initial.png` - Shows the 3D network
   - `07-universe-full-network.png` - Full view
   - `09-universe-project-panel.png` - Shows interactivity

2. **For Video:**
   - The auto-generated video is great for quick preview
   - For a more polished video, record manually with OBS (see `DEMO_VIDEO_GUIDE.md`)

3. **Multiple Runs:**
   - You can run the script multiple times
   - It will overwrite previous screenshots
   - Useful if you make changes to the portfolio

---

**Ready? Just run:**
```bash
npm run generate:demo
```

And everything will be generated automatically! 🚀

