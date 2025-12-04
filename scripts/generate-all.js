const { generateScreenshots } = require('./generate-demo');
const { createVideo } = require('./create-video');
const { spawn } = require('child_process');
const http = require('http');

// Check if server is running
function checkServer(url, timeout = 5000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Start dev server
function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting Next.js dev server...');
    const server = spawn('npm', ['run', 'dev'], {
      shell: true,
      stdio: 'pipe'
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      if (output.includes('Ready') || output.includes('Local:')) {
        if (!serverReady) {
          serverReady = true;
          console.log('✅ Server is ready!');
          setTimeout(() => resolve(server), 3000); // Wait 3 more seconds for full startup
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    server.on('error', reject);

    // Timeout after 60 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Server startup timeout'));
      }
    }, 60000);
  });
}

async function generateAll() {
  const baseUrl = process.env.PORTFOLIO_URL || 'http://localhost:3000';
  let server = null;

  try {
    // Check if server is already running
    const isRunning = await checkServer(baseUrl);
    
    if (!isRunning) {
      console.log('📡 Server not running, starting it...');
      server = await startDevServer();
    } else {
      console.log('✅ Server is already running!');
    }

    // Wait a bit more to ensure everything is loaded
    console.log('⏳ Waiting for server to be fully ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Double-check server is responding
    const isReady = await checkServer(baseUrl);
    if (!isReady) {
      throw new Error('Server is not responding. Please start it manually with: npm run dev');
    }

    // Generate screenshots
    console.log('\n📸 Step 1: Generating screenshots...');
    await generateScreenshots();

    console.log('\n✅ Screenshots generated successfully!');
    console.log('📁 Screenshots: public/demo-screenshots/');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (server) {
      console.log('\n🛑 Stopping dev server...');
      server.kill();
    }
  }
}

if (require.main === module) {
  generateAll().catch(console.error);
}

module.exports = { generateAll };

