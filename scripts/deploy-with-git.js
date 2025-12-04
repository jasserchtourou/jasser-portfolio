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

async function setupGitAndDeploy() {
  console.log('🚀 Setting up automatic deployment via GitHub + Vercel...\n');

  // Check if git is initialized
  const hasGit = await checkGitRepo();
  if (!hasGit) {
    console.log('📦 Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
  }

  // Check if files are committed
  try {
    execSync('git diff --quiet HEAD', { stdio: 'ignore' });
  } catch (error) {
    console.log('📝 Committing changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Deploy: Jasser Portfolio"', { stdio: 'inherit' });
  }

  // Check if remote exists
  const hasRemote = await checkGitRemote();
  if (!hasRemote) {
    console.log('\n⚠️  No GitHub remote found!');
    console.log('\n📋 To deploy automatically, you need to:');
    console.log('   1. Create a GitHub repository at: https://github.com/new');
    console.log('   2. Name it: jasser-portfolio');
    console.log('   3. DO NOT initialize with README');
    console.log('   4. Copy the repository URL');
    console.log('   5. Run these commands:');
    console.log('      git remote add origin YOUR_REPO_URL');
    console.log('      git branch -M main');
    console.log('      git push -u origin main');
    console.log('\n   6. Then go to: https://vercel.com');
    console.log('   7. Sign in with GitHub');
    console.log('   8. Click "Add New Project"');
    console.log('   9. Select your repository');
    console.log('   10. Click "Deploy"');
    console.log('\n   Vercel will auto-deploy on every git push!');
    return;
  }

  // Push to GitHub
  console.log('\n📤 Pushing to GitHub...');
  try {
    execSync('git push', { stdio: 'inherit' });
    console.log('\n✅ Pushed to GitHub!');
    console.log('🌐 If Vercel is connected, it will auto-deploy in ~2 minutes.');
    console.log('   Check: https://vercel.com/dashboard');
  } catch (error) {
    console.error('❌ Failed to push to GitHub:', error.message);
    console.log('\n💡 Make sure your GitHub remote is set correctly.');
  }
}

if (require.main === module) {
  setupGitAndDeploy().catch(console.error);
}

module.exports = { setupGitAndDeploy };

