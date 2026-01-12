# Research Homepage Template

This is a starter template for creating a new researcher homepage. Follow the steps below to set up your own academic website.

## Quick Start

### 1. Copy This Template

```bash
# From the monorepo root
cp -r apps/template apps/your-name
cd apps/your-name
```

### 2. Update Package Name

Edit `package.json` and change the name:

```json
{
  "name": "@research-homepage/your-name",
  ...
}
```

### 3. Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io) and create an account (or log in)
2. Create a new project at [sanity.io/manage](https://www.sanity.io/manage)
3. Choose a project name (e.g., "Your Name Homepage")
4. Select the "Production" dataset
5. Note your **Project ID** from the project settings

### 4. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
```

### 5. Configure CORS in Sanity

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **CORS origins**
4. Add these origins:
   - `http://localhost:3000` (for development)
   - `https://your-domain.com` (for production)

### 6. Install Dependencies & Start Development

From the monorepo root:

```bash
pnpm install
pnpm dev --filter=@research-homepage/your-name
```

Or from this app directory:

```bash
pnpm dev
```

### 7. Access Sanity Studio

Open `http://localhost:3000/studio` in your browser to access the content management system.

---

## Adding Your Content

### First Steps in Sanity Studio

1. **Create a Home Page**
   - Go to "Home Page" in the sidebar
   - Click "Create new"
   - Add your name, photo, and bio
   - Add sections to customize your homepage

2. **Add Contact Information**
   - Go to "Contact Info" in the sidebar
   - Add your emails, social media links, etc.

3. **Add Your Content**
   - **Publications**: Add your research papers with DOI auto-fill
   - **Projects**: Showcase your research projects
   - **Blog**: Write blog posts and articles
   - **Conferences**: List your talks and presentations
   - **Datasets**: Share your research data
   - **Tools**: Highlight software you've developed
   - **News**: Post updates and announcements
   - **CV**: Upload your curriculum vitae

---

## Customization

### Update Metadata

Edit `app/layout.tsx` and update the metadata:

```typescript
export const metadata: Metadata = {
  title: "Your Name - Academic Homepage",
  description: "Your custom description here.",
};
```

### Update Fallback Name

Edit `app/components/HeaderWrapper.tsx` and update the fallback:

```typescript
const siteName = homePage?.name || "Your Name";
```

### Customize Styling

The template uses Tailwind CSS with CSS variables for theming. You can customize colors by editing the CSS variables in the shared `tailwind-config` package, or override them in `app/globals.css`.

---

## Deployment

### Vercel (Recommended)

1. Push your changes to GitHub
2. Import your repository at [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `apps/your-name`
4. Add your environment variables
5. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Node.js

---

## File Structure

```
template/
├── app/
│   ├── api/doi/              # DOI lookup API
│   ├── blog/                 # Blog pages
│   ├── components/           # App-specific components
│   ├── conferences/          # Conference pages
│   ├── datasets/             # Dataset pages
│   ├── news/                 # News pages
│   ├── projects/             # Project pages
│   ├── publications/         # Publications page
│   ├── studio/               # Sanity Studio
│   ├── tools/                # Tools page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── sanity/
│   ├── lib/
│   │   ├── client.ts         # Sanity client
│   │   └── image.ts          # Image URL builder
│   └── schema.ts             # Schema configuration
├── public/                   # Static assets
├── .env.example              # Environment template
├── next.config.mjs           # Next.js config
├── sanity.config.ts          # Sanity Studio config
├── tailwind.config.ts        # Tailwind config
└── tsconfig.json             # TypeScript config
```

---

## Content Types

| Type | Description |
|------|-------------|
| **Home Page** | Main homepage configuration (name, bio, photo, sections) |
| **Publication** | Academic papers with DOI support |
| **Project** | Research projects with funding and collaborators |
| **Blog** | Blog posts with rich content |
| **Conference** | Talks, presentations, and conferences |
| **Dataset** | Research datasets with licensing info |
| **Tool** | Software tools and packages |
| **News** | News posts and announcements |
| **CV** | CV/Resume documents |
| **Contact Info** | Contact details and social links |
| **Research Interest** | Keywords for the research cloud |

---

## Adding to Root Scripts

After creating your app, add these scripts to the root `package.json`:

```json
{
  "scripts": {
    "dev:your-name": "turbo run dev --filter=@research-homepage/your-name",
    "build:your-name": "turbo run build --filter=@research-homepage/your-name"
  }
}
```

---

## Troubleshooting

### "Module not found" errors
Run `pnpm install` from the monorepo root to ensure all dependencies are installed.

### Sanity Studio not loading
Check that your environment variables are set correctly and CORS is configured in Sanity.

### Images not displaying
Verify that `cdn.sanity.io` is in the `remotePatterns` in `next.config.mjs`.

### Build errors with packages
Ensure packages are listed in `transpilePackages` in `next.config.mjs`.

---

## Need Help?

- Check the main [README.md](../../README.md) for monorepo documentation
- Review [CLAUDE.md](../../CLAUDE.md) for architecture details
- Open an issue on GitHub for bugs or questions
