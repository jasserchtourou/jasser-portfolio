const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function checkGitRepo() {
  try {
    execSync('git status', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

async function checkGitRemote() {
  try {
    const output = execSync('git remote -v', { encoding: 'utf-8' });
    return output.trim().length > 0;
  } catch (error) {
    return false;
  }
}

async function fullAutoDeploy() {
  console.log('🚀 Full Automatic Deployment Setup\n');

  // Step 1: Ensure git is initialized
  if (!await checkGitRepo()) {
    console.log('📦 Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
  }

  // Step 2: Commit all changes
  try {
    execSync('git diff --quiet HEAD', { stdio: 'ignore' });
    console.log('✅ All changes already committed');
  } catch (error) {
    console.log('📝 Committing all changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Deploy: Jasser Portfolio - Interactive 3D AI Portfolio"', { stdio: 'inherit' });
  }

  // Step 3: Check for remote
  const hasRemote = await checkGitRemote();
  
  if (!hasRemote) {
    console.log('\n📋 AUTOMATIC DEPLOYMENT SETUP\n');
    console.log('To deploy automatically, follow these steps:\n');
    console.log('1️⃣  Create GitHub Repository:');
    console.log('   → Go to: https://github.com/new');
    console.log('   → Name: jasser-portfolio');
    console.log('   → Set to Public');
    console.log('   → DO NOT check any boxes');
    console.log('   → Click "Create repository"\n');
    console.log('2️⃣  Connect to GitHub (run these commands):');
    console.log('   git remote add origin https://github.com/YOUR_USERNAME/jasser-portfolio.git');
    console.log('   git branch -M main');
    console.log('   git push -u origin main\n');
    console.log('3️⃣  Deploy on Vercel:');
    console.log('   → Go to: https://vercel.com');
    console.log('   → Sign in with GitHub');
    console.log('   → Click "Add New Project"');
    console.log('   → Select jasser-portfolio');
    console.log('   → Click "Deploy"');
    console.log('   → Wait 2-3 minutes\n');
    console.log('4️⃣  After first deployment:');
    console.log('   → Every git push will auto-deploy!');
    console.log('   → Just run: git push\n');
    
    // Create a helper script
    const helperScript = `@echo off
echo.
echo 🚀 Quick Deploy Helper
echo.
echo Step 1: Create GitHub repo at https://github.com/new
echo Step 2: Replace YOUR_USERNAME below with your GitHub username
echo Step 3: Run these commands:
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/jasser-portfolio.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo Step 4: Go to https://vercel.com and connect your repo
echo.
pause
`;
    
    fs.writeFileSync(path.join(process.cwd(), 'QUICK_DEPLOY.bat'), helperScript);
    console.log('✅ Created QUICK_DEPLOY.bat helper file!\n');
    
    return;
  }

  // Step 4: Push to GitHub (if remote exists)
  console.log('📤 Pushing to GitHub...');
  try {
    execSync('git push', { stdio: 'inherit' });
    console.log('\n✅ Pushed to GitHub!');
    console.log('🌐 If Vercel is connected, deployment will start automatically.');
    console.log('   Check: https://vercel.com/dashboard');
    console.log('   Your site will be live in ~2 minutes!');
  } catch (error) {
    console.error('\n❌ Failed to push:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. GitHub remote is set correctly');
    console.log('   2. You have push access');
    console.log('   3. Run: git remote -v to check');
  }
}

if (require.main === module) {
  fullAutoDeploy().catch(console.error);
}

module.exports = { fullAutoDeploy };

