const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupGit() {
  console.log('🔧 Git Setup Wizard\n');

  try {
    // Check if git is installed
    execSync('git --version', { stdio: 'ignore' });
    console.log('✅ Git is installed\n');
  } catch (error) {
    console.error('❌ Git is not installed. Please install Git first:');
    console.log('   Download from: https://git-scm.com/downloads');
    process.exit(1);
  }

  // Get user info
  const name = await question('Enter your name (for git commits): ');
  const email = await question('Enter your email (for git commits): ');
  const githubUsername = await question('Enter your GitHub username (optional, press Enter to skip): ');

  // Configure git
  console.log('\n📝 Configuring git...');
  execSync(`git config --global user.name "${name}"`, { stdio: 'inherit' });
  execSync(`git config --global user.email "${email}"`, { stdio: 'inherit' });
  console.log('✅ Git configured\n');

  // Check if repository is initialized
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    console.log('✅ Git repository already initialized\n');
  } catch (error) {
    console.log('📦 Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
    console.log('✅ Repository initialized\n');
  }

  // Check if .gitignore exists
  const fs = require('fs');
  if (!fs.existsSync('.gitignore')) {
    console.log('⚠️  .gitignore not found. Creating one...');
    const gitignore = `# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/
*.log

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Database
*.sqlite
*.db

# Docker
docker-compose.override.yml

# Deployment
.railway/
.vercel/
.fly/
`;
    fs.writeFileSync('.gitignore', gitignore);
    console.log('✅ .gitignore created\n');
  }

  // Check if there are uncommitted changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
      console.log('📋 Staging files...');
      execSync('git add .', { stdio: 'inherit' });
      
      const commitMessage = await question('\nEnter commit message (or press Enter for default): ');
      const message = commitMessage.trim() || 'Initial commit: Essence Radio app';
      
      console.log('\n💾 Creating commit...');
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      console.log('✅ Changes committed\n');
    } else {
      console.log('✅ No uncommitted changes\n');
    }
  } catch (error) {
    console.log('⚠️  No commits yet. You can commit later with: git add . && git commit -m "message"\n');
  }

  // Check remote
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    console.log(`✅ Remote configured: ${remote}\n`);
  } catch (error) {
    console.log('📡 No remote repository configured\n');
    if (githubUsername) {
      const setupRemote = await question(`Set up remote for https://github.com/${githubUsername}/essence-radio.git? (y/n): `);
      if (setupRemote.toLowerCase() === 'y') {
        try {
          execSync(`git remote add origin https://github.com/${githubUsername}/essence-radio.git`, { stdio: 'inherit' });
          console.log('✅ Remote added\n');
          console.log('📝 Next steps:');
          console.log('   1. Create repository on GitHub: https://github.com/new');
          console.log('   2. Repository name: essence-radio');
          console.log('   3. DO NOT initialize with README');
          console.log('   4. Then run: git push -u origin main\n');
        } catch (error) {
          console.log('⚠️  Could not add remote. You can add it manually later.\n');
        }
      }
    } else {
      console.log('📝 To connect to GitHub:');
      console.log('   1. Create repository at: https://github.com/new');
      console.log('   2. Then run: git remote add origin https://github.com/YOUR_USERNAME/essence-radio.git');
      console.log('   3. Then run: git push -u origin main\n');
    }
  }

  console.log('✅ Git setup complete!\n');
  console.log('📚 Next steps:');
  console.log('   - Create repository on GitHub: https://github.com/new');
  console.log('   - See GIT_SETUP.md for detailed instructions');
  console.log('   - Use Personal Access Token for authentication\n');

  rl.close();
}

setupGit().catch(console.error);

