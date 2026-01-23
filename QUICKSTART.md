# Quick Start: Deploying to GitHub Pages

## ⚡ TL;DR - 3 Steps to Go Live

### Step 1: Enable GitHub Pages (1 minute)
1. Go to: `https://github.com/saisrikiran25-ctrl/Aletheia/settings/pages`
2. Under "Build and deployment" → **Source**: Select **GitHub Actions**
3. That's it for this step!

### Step 2: Add Your API Key (1 minute)
1. Go to: `https://github.com/saisrikiran25-ctrl/Aletheia/settings/secrets/actions`
2. Click **New repository secret**
3. Name: `GEMINI_API_KEY`
4. Value: Your Gemini API key
5. Click **Add secret**

### Step 3: Deploy (Automatic!)
1. Merge this PR to the `main` branch
2. Watch the magic happen in the **Actions** tab
3. In ~2 minutes, your app will be live at:
   
   **🌐 https://saisrikiran25-ctrl.github.io/Aletheia/**

## That's It! 🎉

Your webapp will automatically redeploy whenever you push to `main`.

---

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
