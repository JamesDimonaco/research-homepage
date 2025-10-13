# Production Deployment Guide

Complete step-by-step guide for deploying your research homepage to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] All content added and reviewed in Sanity Studio
- [ ] Environment variables ready
- [ ] Git repository up to date
- [ ] Sanity project ID and dataset name
- [ ] Hosting platform account (Vercel recommended)

---

## 🚀 Step-by-Step Deployment

### Step 1: Deploy Sanity Studio Schema

Your Sanity Studio schema needs to be deployed to production so your live site can access the content.

```bash
# Deploy your Sanity schema to production
npx sanity deploy

# This will:
# - Bundle your Studio
# - Deploy it to Sanity's hosting
# - Make it accessible at: https://your-project.sanity.studio
```

**Note**: You only need to run this when:
- First time deploying
- You've added/modified Sanity schemas (like the new blog feature)
- You've changed Studio configuration

---

### Step 2: Prepare Environment Variables

You'll need these environment variables for production:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=e3p73cme
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_TOKEN=your_production_token_here
```

**To get/create a Sanity API token:**

1. Go to https://sanity.io/manage
2. Select your project
3. Go to "API" → "Tokens"
4. Create a new token with "Read" permissions (or "Editor" if you need write access)
5. Copy the token (you won't see it again!)

---

### Step 3: Update Revalidation Time (Recommended)

For production, increase the cache revalidation time to reduce API calls:

**File**: `sanity/lib/client.ts`

```typescript
return client.fetch<QueryResponse>(query, params, {
  next: {
    revalidate: process.env.NODE_ENV === "development" ? 30 : 3600, // Change 60 to 3600
    tags,
  },
});
```

This changes production revalidation from 60 seconds to 1 hour (3600 seconds).

---

### Step 4: Commit and Push to Git

```bash
# Check your changes
git status

# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Add blog feature and prepare for production deployment"

# Push to your main branch
git push origin main
```

---

### Step 5: Deploy to Vercel (Recommended)

#### Option A: Deploy via Vercel Dashboard

1. **Go to [Vercel](https://vercel.com) and sign in**

2. **Click "Add New..." → "Project"**

3. **Import your Git repository**
   - Select your GitHub/GitLab/Bitbucket repository
   - Click "Import"

4. **Configure your project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables**

   Click "Environment Variables" and add each one:

   ```
   Name: NEXT_PUBLIC_SANITY_PROJECT_ID
   Value: e3p73cme
   ```

   ```
   Name: NEXT_PUBLIC_SANITY_DATASET
   Value: production
   ```

   ```
   Name: NEXT_PUBLIC_SANITY_API_VERSION
   Value: 2024-06-10
   ```

   ```
   Name: SANITY_API_TOKEN
   Value: [your_token_from_step_2]
   ```

6. **Click "Deploy"**

   Vercel will:
   - Install dependencies
   - Build your Next.js app
   - Deploy to production
   - Give you a URL (e.g., `your-site.vercel.app`)

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Link to existing project or create new one
# - Confirm settings
# - Add environment variables when prompted
```

---

### Step 6: Configure Custom Domain (Optional)

If you have a custom domain:

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update DNS records** at your domain registrar:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS propagation** (can take up to 48 hours, usually minutes)

---

### Step 7: Configure Sanity CORS Origins

Allow your production domain to access Sanity:

1. **Go to [Sanity Manage](https://sanity.io/manage)**

2. **Select your project**

3. **Go to "API" → "CORS Origins"**

4. **Click "Add CORS origin"**

5. **Add your production URL(s)**:
   ```
   https://your-site.vercel.app
   https://www.yourdomain.com (if using custom domain)
   ```

   Settings:
   - ✅ Allow credentials: **Yes**
   - Origin: Your production URL

6. **Save**

---

### Step 8: Test Your Production Site

Visit your deployed site and verify:

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Publications display properly
- [ ] Projects page works
- [ ] Conference talks load
- [ ] Datasets page functions
- [ ] **Blog page loads** (new feature!)
- [ ] Individual blog posts open
- [ ] News section works
- [ ] Tools page displays
- [ ] Dark/light theme toggle works
- [ ] Images load from Sanity CDN
- [ ] Contact section displays
- [ ] CV downloads work

---

### Step 9: Enable Sanity Studio in Production

Your Sanity Studio is accessible at `/studio` on your live site:

```
https://your-site.vercel.app/studio
```

**Security Note**: The Studio route is protected by Sanity's authentication. Only authorized users can access it.

**To manage who can access the Studio**:

1. Go to https://sanity.io/manage
2. Select your project
3. Go to "Members"
4. Add/remove team members

---

## 🔄 Ongoing Deployments

### When You Update Content

Content updates in Sanity Studio are **automatically available** thanks to Next.js revalidation (every 60 seconds in production, or 3600 if you updated it).

**No redeployment needed** for content changes!

### When You Update Code

```bash
# Make your code changes
git add .
git commit -m "Description of changes"
git push origin main

# Vercel automatically deploys when you push to main
# Watch the deployment at: https://vercel.com/dashboard
```

### When You Update Sanity Schemas

If you add/modify content types in `sanity/types/`:

```bash
# Deploy the updated schema
npx sanity deploy

# Then deploy your Next.js code
git add .
git commit -m "Update Sanity schema"
git push origin main
```

---

## 🔍 Troubleshooting

### Issue: "CORS Error" in browser console

**Solution**: Add your production domain to Sanity CORS origins (Step 7)

### Issue: Images not loading

**Solution**:
1. Check `next.config.mjs` includes Sanity CDN hostname:
   ```js
   images: {
     remotePatterns: [{ hostname: "cdn.sanity.io" }],
   }
   ```
2. Redeploy

### Issue: Environment variables not working

**Solution**:
1. Check they're added in Vercel Dashboard
2. Rebuild the project: Click "Deployments" → "..." → "Redeploy"

### Issue: Blog posts not showing

**Solution**:
1. Check posts aren't marked as "draft" in Sanity Studio
2. Verify blog schema is deployed: `npx sanity deploy`
3. Clear Next.js cache by redeploying

### Issue: Old content still showing

**Solution**:
- Wait for revalidation period (60 seconds default)
- Or trigger a manual rebuild in Vercel

---

## 📊 Performance Optimization

### After Deployment

1. **Test Performance**:
   - Use [Lighthouse](https://developers.google.com/web/tools/lighthouse) in Chrome DevTools
   - Check [PageSpeed Insights](https://pagespeed.web.dev/)

2. **Enable Analytics** (Optional):
   - Vercel Analytics: Enable in project settings
   - Google Analytics: Add tracking code

3. **Set up Monitoring**:
   - Vercel automatically monitors uptime
   - Enable error tracking in Vercel settings

---

## 🔐 Security Checklist

- [ ] Environment variables stored securely (not in code)
- [ ] Sanity API token has minimal required permissions
- [ ] CORS origins configured correctly
- [ ] `.env` file in `.gitignore`
- [ ] Sanity Studio authentication enabled

---

## 📱 Alternative Hosting Platforms

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Follow prompts to configure
```

Add environment variables in Netlify Dashboard → Site Settings → Environment Variables

### Deploy to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Configure build settings (use Next.js defaults)
5. Add environment variables
6. Deploy

### Self-Host with Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t research-homepage .
docker run -p 3000:3000 --env-file .env research-homepage
```

---

## 🎯 Post-Deployment

### Update README.md

Add your live URL to the README:

```markdown
## 🌟 Live Demo

Visit the live site: [https://your-site.vercel.app](https://your-site.vercel.app)
```

### Share Your Site

- [ ] Update social media profiles with new URL
- [ ] Add to your email signature
- [ ] Submit to academic profile directories
- [ ] Share with colleagues and collaborators

### Set Up Backups (Important!)

**Sanity Content Backup**:

```bash
# Export all content
npx sanity dataset export production backup.tar.gz

# Schedule regular backups with cron or CI/CD
```

**Code Backup**:
- Your Git repository is your backup
- Consider enabling GitHub/GitLab protected branches

---

## 📞 Need Help?

- **Vercel Issues**: https://vercel.com/support
- **Sanity Issues**: https://slack.sanity.io or https://sanity.io/help
- **Next.js Issues**: https://github.com/vercel/next.js/discussions
- **Project Issues**: Create an issue at your repository

---

## ✅ Deployment Complete!

Your research homepage is now live! 🎉

**Quick Links**:
- Production Site: `https://your-site.vercel.app`
- Sanity Studio: `https://your-site.vercel.app/studio`
- Sanity Manage: `https://sanity.io/manage`
- Vercel Dashboard: `https://vercel.com/dashboard`

---

**Last Updated**: 2025-10-13
**Version**: 1.0.0 with Blog Feature
