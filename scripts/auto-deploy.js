const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

async function installVercelCLI() {
  console.log('📦 Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed!');
    return true;
  } catch (error) {
    console.error('❌ Failed to install Vercel CLI:', error.message);
    return false;
  }
}

async function deployToVercel() {
  console.log('🚀 Starting automatic deployment to Vercel...\n');

  // Check if Vercel CLI is installed
  const hasVercel = await checkVercelCLI();
  if (!hasVercel) {
    console.log('Vercel CLI not found. Installing...');
    const installed = await installVercelCLI();
    if (!installed) {
      console.error('❌ Could not install Vercel CLI. Please install manually:');
      console.log('   npm install -g vercel');
      process.exit(1);
    }
  }

  // Check if .vercel folder exists (already linked)
  const vercelConfig = path.join(process.cwd(), '.vercel', 'project.json');
  const isLinked = fs.existsSync(vercelConfig);

  if (!isLinked) {
    console.log('🔗 Linking project to Vercel...');
    console.log('⚠️  This will require Vercel authentication.');
    console.log('   If you see a browser prompt, please login to Vercel.\n');
    
    try {
      // Run vercel link (non-interactive mode)
      execSync('vercel link --yes', { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to link project. Please run manually:');
      console.log('   vercel link');
      console.log('   Then run: npm run deploy');
      process.exit(1);
    }
  }

  // Deploy
  console.log('\n🚀 Deploying to Vercel...');
  try {
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('\n✅ Deployment successful!');
    console.log('🌐 Your portfolio is now live!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n💡 Try deploying manually:');
    console.log('   vercel --prod');
    process.exit(1);
  }
}

if (require.main === module) {
  deployToVercel().catch(console.error);
}

module.exports = { deployToVercel };

