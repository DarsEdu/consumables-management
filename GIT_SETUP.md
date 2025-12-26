# Git Setup and Push Guide

Step-by-step guide to push this project to Git (GitHub, GitLab, Bitbucket, etc.).

---

## Step 1: Initialize Git Repository

Open Terminal and navigate to the project:

```bash
cd /Users/kemalcanandac/Desktop/consumables
```

Initialize Git:

```bash
git init
```

---

## Step 2: Create .gitignore (Already Done)

The `.gitignore` file is already created and configured to exclude:
- `node_modules/` and `venv/` (dependencies)
- `inventory.json` (data file - may contain sensitive info)
- Build outputs, logs, and temporary files

---

## Step 3: Add Files to Git

Add all files (respecting .gitignore):

```bash
git add .
```

Check what will be committed:

```bash
git status
```

---

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: UNHCR Consumable Management System"
```

---

## Step 5: Create Remote Repository

### Option A: GitHub

1. **Go to GitHub:** https://github.com
2. **Click "New repository"** (or the + icon)
3. **Repository name:** `consumables-management` (or your preferred name)
4. **Description:** "UNHCR Türkiye Consumable Management System"
5. **Visibility:** Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have files)
7. **Click "Create repository"**

### Option B: GitLab

1. **Go to GitLab:** https://gitlab.com
2. **Click "New project"** → **"Create blank project"**
3. **Project name:** `consumables-management`
4. **Visibility:** Choose Public or Private
5. **Click "Create project"**

### Option C: Bitbucket

1. **Go to Bitbucket:** https://bitbucket.org
2. **Click "+"** → **"Repository"**
3. **Repository name:** `consumables-management`
4. **Access level:** Choose Public or Private
5. **Click "Create repository"**

---

## Step 6: Add Remote and Push

After creating the repository, you'll see instructions. Use these commands:

### For GitHub/GitLab/Bitbucket (HTTPS):

```bash
# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Or for GitLab:
# git remote add origin https://gitlab.com/YOUR_USERNAME/REPO_NAME.git

# Or for Bitbucket:
# git remote add origin https://bitbucket.org/YOUR_USERNAME/REPO_NAME.git

# Push to remote
git branch -M main
git push -u origin main
```

### For GitHub/GitLab/Bitbucket (SSH):

If you have SSH keys set up:

```bash
# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Or for GitLab:
# git remote add origin git@gitlab.com:YOUR_USERNAME/REPO_NAME.git

# Push to remote
git branch -M main
git push -u origin main
```

---

## Step 7: Verify Push

Check your repository on GitHub/GitLab/Bitbucket - you should see all your files!

---

## Future Updates

When you make changes:

```bash
# Check what changed
git status

# Add changed files
git add .

# Or add specific files
git add app.js index.html

# Commit changes
git commit -m "Description of changes"

# Push to remote
git push
```

---

## Quick Reference Commands

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Add remote repository
git remote add origin <repository-url>

# Push to remote
git push -u origin main

# Check status
git status

# View commit history
git log

# Pull latest changes (if working with others)
git pull
```

---

## Important Notes

### Files NOT Committed (by .gitignore):

- ✅ `inventory.json` - Data file (contains actual inventory data)
- ✅ `node_modules/` - Dependencies (can be reinstalled)
- ✅ `venv/` - Python virtual environment
- ✅ Build outputs and temporary files

### Files Committed:

- ✅ Source code (`app.js`, `server.js`, `server.py`)
- ✅ HTML/CSS (`index.html`, `styles.css`)
- ✅ Configuration files (`package.json`, `requirements.txt`, `Dockerfile`)
- ✅ Documentation (all `.md` files)
- ✅ Logo (`unhcr-logo.png`)

### Before Pushing:

1. **Review sensitive data:** Make sure no passwords, API keys, or sensitive data are in committed files
2. **Check .gitignore:** Verify important files are excluded
3. **Test locally:** Make sure everything works before pushing

---

## Troubleshooting

### Authentication Issues:

If you get authentication errors:

**For HTTPS:**
- Use a Personal Access Token instead of password
- GitHub: Settings → Developer settings → Personal access tokens
- GitLab: User Settings → Access Tokens

**For SSH:**
- Make sure SSH keys are set up
- Test: `ssh -T git@github.com`

### Push Rejected:

If push is rejected:

```bash
# Pull first (if repository has files)
git pull origin main --allow-unrelated-histories

# Then push again
git push -u origin main
```

### Wrong Remote URL:

```bash
# Check current remote
git remote -v

# Change remote URL
git remote set-url origin <new-url>

# Verify
git remote -v
```

---

## Example: Complete Workflow

```bash
# 1. Navigate to project
cd /Users/kemalcanandac/Desktop/consumables

# 2. Initialize Git
git init

# 3. Add files
git add .

# 4. First commit
git commit -m "Initial commit: UNHCR Consumable Management System"

# 5. Add remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/consumables-management.git

# 6. Push
git branch -M main
git push -u origin main
```

---

## Next Steps After Pushing

1. **Add README.md** (if you want) - describes the project
2. **Add LICENSE** (if needed) - specifies usage rights
3. **Set up CI/CD** (optional) - automate deployments
4. **Add collaborators** (if working with a team)

---

That's it! Your project is now on Git! 🎉

