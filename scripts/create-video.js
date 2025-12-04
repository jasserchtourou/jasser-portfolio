const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const screenshotsDir = path.join(__dirname, '../public/demo-screenshots');
const outputVideo = path.join(__dirname, '../public/demo-portfolio.mp4');

async function createVideo() {
  console.log('🎬 Creating video from screenshots...');

  const screenshots = [
    '01-about-hero.png',
    '06-universe-initial.png',
    '07-universe-full-network.png',
    '08-universe-node-hover.png',
    '09-universe-project-panel.png',
    '03-projects-overview.png',
    '10-project-with-video.png',
    '05-skills-page.png'
  ].filter(file => {
    const filePath = path.join(screenshotsDir, file);
    return fs.existsSync(filePath);
  });

  if (screenshots.length === 0) {
    console.error('❌ No screenshots found! Run generate-demo.js first.');
    return;
  }

  console.log(`📸 Found ${screenshots.length} screenshots`);

  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ ffmpeg not found!');
    console.log('📥 Install ffmpeg:');
    console.log('   Windows: choco install ffmpeg');
    console.log('   Mac: brew install ffmpeg');
    console.log('   Linux: sudo apt-get install ffmpeg');
    console.log('\n💡 Alternative: Use online tools like:');
    console.log('   - https://www.freeconvert.com/video-compressor');
    console.log('   - https://www.clipchamp.com/');
    return;
  }

  // Create video using ffmpeg
  // Each screenshot shows for 3 seconds, smooth transitions
  const filterComplex = screenshots.map((_, i) => {
    const startTime = i * 3;
    return `[${i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setpts=PTS-STARTPTS,fps=30[v${i}]`;
  }).join(';') + ';' +
    screenshots.map((_, i) => `[v${i}]`).join('') +
    `concat=n=${screenshots.length}:v=1:a=0[outv]`;

  const inputFiles = screenshots.map(file => 
    `-loop 1 -t 3 -i "${path.join(screenshotsDir, file)}"`
  ).join(' ');

  const command = `ffmpeg ${inputFiles} -filter_complex "${filterComplex}" -map "[outv]" -c:v libx264 -pix_fmt yuv420p -r 30 -t ${screenshots.length * 3} -y "${outputVideo}"`;

  try {
    console.log('⏳ Creating video (this may take a minute)...');
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Video created successfully: ${outputVideo}`);
  } catch (error) {
    console.error('❌ Error creating video:', error.message);
    console.log('\n💡 Try creating video manually:');
    console.log('   1. Use online tool: https://www.freeconvert.com/video-compressor');
    console.log('   2. Upload screenshots from public/demo-screenshots/');
    console.log('   3. Set each image to display for 3 seconds');
    console.log('   4. Export as MP4');
  }
}

if (require.main === module) {
  createVideo().catch(console.error);
}

module.exports = { createVideo };

