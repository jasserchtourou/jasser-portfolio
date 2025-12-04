# 📸 Guide: Adding LinkedIn Project Videos & Images

## How to Add LinkedIn Media to Projects

### Step 1: Get LinkedIn Project URLs

1. Go to your LinkedIn profile: `https://www.linkedin.com/in/jasser-chtourou/details/projects/`
2. Click on each project to view it
3. For each project, copy:
   - **Video URLs**: Right-click on videos → "Copy video address" or get the embed URL
   - **Image URLs**: Right-click on images → "Copy image address" or "Open image in new tab" → copy URL

### Step 2: Update `src/data/projects.json`

For each project, add or update the following fields:

```json
{
  "id": "project-id",
  "title": "Project Title",
  "hasVideo": true,  // Set to true if project has video
  "demoVideo": "https://www.linkedin.com/embed/feed/update/urn:li:activity:XXXXX",  // LinkedIn embed URL
  "demo": "https://www.linkedin.com/posts/...",  // Original LinkedIn post URL
  "linkedinProject": "https://www.linkedin.com/in/jasser-chtourou/details/projects/...",  // Direct project page
  "images": [
    {
      "type": "image",
      "url": "https://media.licdn.com/dms/image/...",  // Direct image URL from LinkedIn
      "description": "Screenshot description"
    },
    {
      "type": "image",
      "url": "https://media.licdn.com/dms/image/...",
      "description": "Another screenshot"
    }
  ]
}
```

### Step 3: Getting LinkedIn Video Embed URLs

1. Find the LinkedIn post with the video
2. Click "..." → "Embed this post"
3. Copy the embed URL, or manually convert:
   - From: `https://www.linkedin.com/posts/username_activity-7356634435653353474-wuqF`
   - To: `https://www.linkedin.com/embed/feed/update/urn:li:activity:7356634435653353474`

### Step 4: Getting LinkedIn Image URLs

1. Open the project on LinkedIn
2. Right-click on any image
3. Select "Copy image address" or "Open image in new tab"
4. Copy the full URL (usually starts with `https://media.licdn.com/`)

### Example: Knowledge Base Management System

```json
{
  "id": "knowledge-base-management",
  "hasVideo": true,
  "demoVideo": "https://www.linkedin.com/embed/feed/update/urn:li:activity:7356634435653353474",
  "demo": "https://www.linkedin.com/posts/jasser-chtourou_engineering-automation-ai-activity-7356634435653353474-wuqF",
  "linkedinProject": "https://www.linkedin.com/in/jasser-chtourou/details/projects/",
  "images": [
    {
      "type": "image",
      "url": "https://media.licdn.com/dms/image/D4E22AQFz8qJqJqJqJq/feedshare-document-images/0/1234567890/abc123",
      "description": "Knowledge Base System Interface"
    },
    {
      "type": "image",
      "url": "https://media.licdn.com/dms/image/...",
      "description": "Release Notes Generation Feature"
    }
  ]
}
```

### Tips

- **Images**: Use direct image URLs from LinkedIn media CDN
- **Videos**: Use LinkedIn embed URLs for proper iframe embedding
- **Multiple Images**: Add multiple image objects to the `images` array
- **Image Descriptions**: Add helpful descriptions for accessibility

### Testing

After adding URLs:
1. Run `npm run dev`
2. Visit `/projects` page
3. Check that videos embed correctly
4. Verify images display in the gallery
5. Test image modal (click to enlarge)

---

**Note**: If LinkedIn URLs don't work directly, you may need to:
- Download images and host them in `/public/images/projects/`
- Upload videos to YouTube/Vimeo and use those URLs instead

