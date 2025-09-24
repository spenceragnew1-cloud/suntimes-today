const { execSync } = require('child_process');
const fs = require('fs-extra');

console.log('🚀 Deploying SunTimes Today...');

async function deploy() {
  try {
    // Run build first
    console.log('🔨 Running build...');
    execSync('npm run build', { stdio: 'inherit' });

    // Check if we have deployment target configured
    if (!process.env.DEPLOY_TARGET) {
      console.log('ℹ️ No DEPLOY_TARGET set. Available options:');
      console.log('  - Set DEPLOY_TARGET=github-pages for GitHub Pages');
      console.log('  - Set DEPLOY_TARGET=netlify for Netlify');
      console.log('  - Set DEPLOY_TARGET=vercel for Vercel');
      return;
    }

    switch (process.env.DEPLOY_TARGET) {
      case 'github-pages':
        await deployToGitHubPages();
        break;
      case 'netlify':
        await deployToNetlify();
        break;
      case 'vercel':
        await deployToVercel();
        break;
      default:
        console.error('❌ Unknown deployment target:', process.env.DEPLOY_TARGET);
        process.exit(1);
    }

    console.log('🎉 Deployment complete!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

async function deployToGitHubPages() {
  console.log('📤 Deploying to GitHub Pages...');
  execSync('git add dist/', { stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  execSync('git subtree push --prefix dist origin gh-pages', { stdio: 'inherit' });
}

async function deployToNetlify() {
  console.log('📤 Deploying to Netlify...');
  if (!fs.existsSync('netlify.toml')) {
    await fs.writeFile('netlify.toml', `[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"`);
  }
  execSync('npx netlify deploy --prod --dir=dist', { stdio: 'inherit' });
}

async function deployToVercel() {
  console.log('📤 Deploying to Vercel...');
  if (!fs.existsSync('vercel.json')) {
    await fs.writeFile('vercel.json', JSON.stringify({
      "version": 2,
      "builds": [
        {
          "src": "dist/**",
          "use": "@vercel/static"
        }
      ],
      "routes": [
        {
          "src": "/(.*)",
          "dest": "/dist/$1"
        }
      ]
    }, null, 2));
  }
  execSync('npx vercel --prod', { stdio: 'inherit' });
}

deploy();