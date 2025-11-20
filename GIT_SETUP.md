# Git Setup Guide

## 🔧 Initial Git Configuration

### 1. Set Your Git Identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Initialize Repository (if not already done)

```bash
git init
```

### 3. Add All Files

```bash
git add .
```

### 4. Create Initial Commit

```bash
git commit -m "Initial commit: Essence Radio app"
```

## 🌐 Connect to GitHub via Browser

### Option 1: Create New Repository on GitHub

1. **Go to GitHub**: https://github.com
2. **Sign in** or create account
3. **Click "+"** → **"New repository"**
4. **Repository name**: `essence-radio` (or your preferred name)
5. **Visibility**: Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. **Click "Create repository"**

### Option 2: Use GitHub CLI (if installed)

```bash
gh auth login
gh repo create essence-radio --public --source=. --remote=origin --push
```

## 🔗 Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/essence-radio.git

# Or use SSH (if you have SSH keys set up)
git remote add origin git@github.com:YOUR_USERNAME/essence-radio.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🔐 Authentication Methods

### Method 1: Personal Access Token (Recommended)

1. **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. **Select scopes**: `repo` (full control of private repositories)
4. **Generate token** and **copy it**
5. When pushing, use token as password:
   ```bash
   git push
   # Username: your-github-username
   # Password: paste-your-token-here
   ```

### Method 2: GitHub CLI

```bash
# Install GitHub CLI
# Windows: winget install GitHub.cli
# Or download from: https://cli.github.com

# Login
gh auth login
# Follow browser prompts
```

### Method 3: SSH Keys

1. **Generate SSH key**:
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. **Copy public key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

3. **Add to GitHub**:
   - GitHub → **Settings** → **SSH and GPG keys** → **New SSH key**
   - Paste your public key
   - Save

4. **Test connection**:
   ```bash
   ssh -T git@github.com
   ```

## 📋 Quick Setup Script

Run this after configuring your identity:

```bash
# Set your GitHub username and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Essence Radio - Live audio streaming app"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/essence-radio.git

# Push
git branch -M main
git push -u origin main
```

## 🚀 After Setup

### Daily Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push
```

### Create .gitignore (Already exists)

The project already has a `.gitignore` file that excludes:
- `node_modules/`
- `dist/`
- `.env` files
- Build artifacts
- IDE files

## 🔍 Verify Setup

```bash
# Check git config
git config --list

# Check remote
git remote -v

# Check status
git status

# View commits
git log --oneline
```

## 📚 Useful Commands

```bash
# View changes
git diff

# View commit history
git log

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# Pull latest changes
git pull

# Clone repository (for others)
git clone https://github.com/YOUR_USERNAME/essence-radio.git
```

## 🆘 Troubleshooting

### Authentication Failed
- Use Personal Access Token instead of password
- Or set up SSH keys

### Remote Already Exists
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/essence-radio.git
```

### Push Rejected
```bash
git pull --rebase origin main
git push
```

