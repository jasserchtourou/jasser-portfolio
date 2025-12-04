const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '../public/demo-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function generateScreenshots() {
  console.log('🚀 Starting automated screenshot generation...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  
  // Set viewport for high-quality screenshots
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2 // Retina quality
  });

  const baseUrl = process.env.PORTFOLIO_URL || 'http://localhost:3000';
  console.log(`📸 Using URL: ${baseUrl}`);

  try {
    // Helper function to wait (replaces deprecated waitForTimeout)
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 1. About Page - Hero Section
    console.log('📸 Taking screenshot: About Page...');
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await wait(2000); // Wait for animations
    await page.screenshot({
      path: path.join(screenshotsDir, '01-about-hero.png'),
      fullPage: false
    });

    // 2. About Page - Full Scroll
    console.log('📸 Taking screenshot: About Page Full...');
    await page.screenshot({
      path: path.join(screenshotsDir, '02-about-full.png'),
      fullPage: true
    });

    // 3. Projects Page - Overview
    console.log('📸 Taking screenshot: Projects Page...');
    await page.goto(`${baseUrl}/projects`, { waitUntil: 'networkidle2', timeout: 30000 });
    await wait(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '03-projects-overview.png'),
      fullPage: false
    });

    // 4. Projects Page - Full Scroll
    console.log('📸 Taking screenshot: Projects Page Full...');
    await page.screenshot({
      path: path.join(screenshotsDir, '04-projects-full.png'),
      fullPage: true
    });

    // 5. Skills Page
    console.log('📸 Taking screenshot: Skills Page...');
    await page.goto(`${baseUrl}/skills`, { waitUntil: 'networkidle2', timeout: 30000 });
    await wait(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '05-skills-page.png'),
      fullPage: true
    });

    // 6. 3D Universe - Initial View (MOST IMPORTANT)
    console.log('📸 Taking screenshot: 3D Universe Initial...');
    await page.goto(`${baseUrl}/universe`, { waitUntil: 'networkidle2', timeout: 30000 });
    await wait(5000); // Wait for 3D to load and nodes to appear
    await page.screenshot({
      path: path.join(screenshotsDir, '06-universe-initial.png'),
      fullPage: false
    });

    // 7. 3D Universe - Zoomed Out (Full Network)
    console.log('📸 Taking screenshot: 3D Universe Full Network...');
    // Simulate zoom out by scrolling
    await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // Trigger zoom out via wheel event
        const event = new WheelEvent('wheel', {
          deltaY: 100,
          bubbles: true
        });
        canvas.dispatchEvent(event);
      }
    });
    await wait(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '07-universe-full-network.png'),
      fullPage: false
    });

    // 8. 3D Universe - Node Hover
    console.log('📸 Taking screenshot: 3D Universe Node Hover...');
    await page.goto(`${baseUrl}/universe`, { waitUntil: 'networkidle2', timeout: 30000 });
    await wait(5000);
    
    // Try to hover over a node by clicking in the center area
    const canvas = await page.$('canvas');
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        // Click in center area where nodes might be
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await wait(1000);
        await page.screenshot({
          path: path.join(screenshotsDir, '08-universe-node-hover.png'),
          fullPage: false
        });
      }
    }

    // 9. 3D Universe - Project Panel Open
    console.log('📸 Taking screenshot: 3D Universe Project Panel...');
    // Click to open a project panel
    if (canvas) {
      const box = await canvas.boundingBox();
      if (box) {
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await wait(2000); // Wait for panel animation
        await page.screenshot({
          path: path.join(screenshotsDir, '09-universe-project-panel.png'),
          fullPage: false
        });
      }
    }

    // 10. Project with Video
    console.log('📸 Taking screenshot: Project with Video...');
    await page.goto(`${baseUrl}/projects`, { waitUntil: 'networkidle2', timeout: 30000 });
    await wait(2000);
    // Scroll to find a project with video
    await page.evaluate(() => window.scrollTo(0, 500));
    await wait(1000);
    await page.screenshot({
      path: path.join(screenshotsDir, '10-project-with-video.png'),
      fullPage: false
    });

    console.log('✅ All screenshots generated successfully!');
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  generateScreenshots().catch(console.error);
}

module.exports = { generateScreenshots };

