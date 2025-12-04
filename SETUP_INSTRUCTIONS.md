# Setup Instructions

## 📸 Adding Your Photo

1. Place your profile photo in: `/public/images/jasser-photo.jpg`
   - Recommended size: 400x400px or larger (square format)
   - Formats: JPG, PNG, or WebP
   - If the image is not found, a gradient placeholder with "JC" initials will be displayed

2. The photo will automatically appear on the About page (landing page) with a red neon glow effect.

## 🎥 LinkedIn Video Embed

The LinkedIn video is embedded using LinkedIn's official embed API. If it doesn't load automatically:

1. **Option 1: Use LinkedIn Embed (Current)**
   - The iframe should work if LinkedIn allows embedding
   - If not, users can click "Watch on LinkedIn" to open in a new tab

2. **Option 2: Download and Host Locally (Recommended)**
   - Download the video from LinkedIn
   - Save it as: `/public/videos/plug-plai-demo.mp4`
   - The code will automatically use the local video if available

3. **Option 3: Use YouTube/Vimeo**
   - Upload the video to YouTube or Vimeo
   - Update the video URL in the code

## 🚀 Quick Start

1. Add your photo: `/public/images/jasser-photo.jpg`
2. (Optional) Add video: `/public/videos/plug-plai-demo.mp4`
3. Run `npm run dev`
4. Visit `http://localhost:3000`

## 📁 File Structure

```
/public
  /images
    - jasser-photo.jpg (ADD YOUR PHOTO HERE)
  /videos
    - plug-plai-demo.mp4 (OPTIONAL - if you want local video)
```

