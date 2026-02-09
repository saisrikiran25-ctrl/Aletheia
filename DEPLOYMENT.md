# GitHub Pages Deployment Guide

This guide will walk you through deploying your Aletheia webapp to GitHub Pages.

## Prerequisites
✅ GitHub repository (already set up)
✅ Build configuration (already configured)
✅ GitHub Actions workflow (already created)

## Setup Steps

### 1. Enable GitHub Pages for Your Repository

1. Go to your repository on GitHub: `https://github.com/saisrikiran25-ctrl/Aletheia`
2. Click on **Settings** (in the repository navigation bar)
3. In the left sidebar, click on **Pages** (under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
   - This enables GitHub Actions to deploy to GitHub Pages

### 2. Add Your API Key as a Secret (Important!)

Your app requires an OpenRouter API key to function. You need to add this as a repository secret:

1. In your repository, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secret:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Your actual OpenRouter API key
4. Click **Add secret**

### 3. Deploy Your App

Once you merge this PR to the `main` branch, the deployment will happen automatically!

**Option A: Merge this PR**
1. Merge this pull request to the `main` branch
2. The GitHub Actions workflow will automatically trigger
3. Your app will be built and deployed

**Option B: Manual Trigger**
1. After merging, go to **Actions** tab in your repository
2. Click on the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

### 4. Access Your Deployed App

After the workflow completes successfully (usually takes 1-2 minutes):

Your app will be available at: **`https://saisrikiran25-ctrl.github.io/Aletheia/`**

### 5. Monitor Deployment

To check the status of your deployment:
1. Go to the **Actions** tab in your repository
2. You'll see the workflow runs listed
3. Click on a run to see detailed logs
4. Green checkmark = successful deployment ✅
5. Red X = failed deployment (check logs for errors) ❌

## What Was Configured

### Files Modified/Created:

1. **`.github/workflows/deploy.yml`** - GitHub Actions workflow that:
   - Triggers on push to `main` branch
   - Builds your Vite app
   - Deploys to GitHub Pages

2. **`vite.config.ts`** - Updated with:
   - `base: '/Aletheia/'` - Ensures assets load correctly on GitHub Pages

## Updating Your App

After initial deployment, to update your app:

1. Make changes to your code
2. Commit and push to the `main` branch
3. GitHub Actions will automatically rebuild and redeploy
4. Changes will be live in 1-2 minutes

## Troubleshooting

### Build fails with "API key" error
- Make sure you've added the `OPENROUTER_API_KEY` secret in repository settings

### Page shows 404
- Verify GitHub Pages is enabled in repository settings
- Check that the workflow completed successfully in the Actions tab
- Wait a few minutes for GitHub's CDN to update

### Assets not loading
- The `base: '/Aletheia/'` configuration in `vite.config.ts` should handle this
- If issues persist, check browser console for errors

### Workflow doesn't trigger
- Ensure the changes are pushed to the `main` branch
- Check that GitHub Actions is enabled in your repository settings

## Local Testing

To test the production build locally before deploying:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

Then open `http://localhost:4173/Aletheia/` in your browser.

## Need Help?

- Check the **Actions** tab for detailed workflow logs
- GitHub Pages documentation: https://docs.github.com/en/pages
- Vite deployment guide: https://vitejs.dev/guide/static-deploy.html

---

**Your app is now ready to go live on GitHub Pages! 🚀**
