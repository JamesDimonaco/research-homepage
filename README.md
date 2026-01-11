# Research Homepage Monorepo

A modern, fully-featured academic profile website builder designed for researchers, professors, and academics. Built with Next.js 15, Sanity CMS, and Turborepo, it provides a beautiful, responsive platform to showcase your academic work, research projects, publications, and more.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Sanity](https://img.shields.io/badge/Sanity-4.0-red?style=flat-square&logo=sanity)
![Turborepo](https://img.shields.io/badge/Turborepo-2.0-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Overview

This monorepo contains shared packages and example applications for creating professional academic homepages.

### Apps

| App | Description | Port |
|-----|-------------|------|
| `@research-homepage/nicholas-dimonaco` | Example researcher site | 3000 |
| `@research-homepage/template` | Marketing/showcase site | 3001 |

### Packages

| Package | Description |
|---------|-------------|
| `@research-homepage/ui` | Shared shadcn/ui components |
| `@research-homepage/components` | Domain-specific React components |
| `@research-homepage/cms` | Sanity CMS schemas, types, and utilities |
| `@research-homepage/tailwind-config` | Shared Tailwind CSS configuration |
| `@research-homepage/typescript-config` | Shared TypeScript configuration |

## Features

### Comprehensive Academic Sections

- **Research Projects** - Showcase active and completed projects with funding details, collaborators, and related publications
- **Conference Talks** - Display keynotes, invited talks, and presentations with embedded videos and slides
- **Publications** - List your papers with DOI auto-fill and links to Google Scholar
- **Datasets** - Share research data with DOI, licenses, and download links
- **Blog & News** - Blog about research updates, software releases, and announcements
- **Tools** - Highlight software and tools you've developed
- **CV/Resume** - Multiple CV versions with automatic download tracking

### Beautiful Design

- **Dark/Light Mode** - Automatic theme switching with system preference detection
- **Responsive Layout** - Looks perfect on all devices
- **Modern UI** - Built with shadcn/ui components for a clean, professional look
- **CMS-Driven** - Update your site header name and branding from the CMS

### Advanced Features

- **Research Interests Tag Cloud** - Visual representation of your research areas
- **Smart Navigation** - Header automatically shows/hides sections based on content
- **SEO Optimized** - Server-side rendering for better search engine visibility
- **Fast Performance** - Static generation for lightning-fast page loads
- **Type Safety** - Full TypeScript support throughout

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm 9.0.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/jamesdimonaco/research-homepage.git
cd research-homepage

# Install dependencies
pnpm install
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run a specific app
pnpm dev:nicholas-dimonaco
pnpm dev:template

# Run Sanity Studio
pnpm sanity:dev
```

### Build

```bash
# Build all apps
pnpm build

# Build a specific app
pnpm build:nicholas-dimonaco
pnpm build:template
```

## Setting Up a New Researcher Site

### 1. Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and create a new project
2. Note your **Project ID** and **Dataset** name (usually "production")

### 2. Configure Environment Variables

Create a `.env` file in your app directory:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_TOKEN=your_token  # Optional, for write operations
```

### 3. Deploy Sanity Schema

```bash
# From your app directory
npx sanity deploy
```

### 4. Configure Components

In your app's `layout.tsx`, configure the components package:

```typescript
import { configureComponents, ThemeProvider } from "@research-homepage/components";
import { urlForImage } from "@/sanity/lib/image";

// Configure components with your app's urlForImage function
configureComponents({
  urlForImage,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 5. Set Up Sanity Client

Create `sanity/lib/client.ts`:

```typescript
import { createSanityClient } from "@research-homepage/cms";

const { client, sanityFetch } = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
});

export { client, sanityFetch };
```

### 6. Use Shared Schemas

In your `sanity/schema.ts`:

```typescript
import { allSchemas } from "@research-homepage/cms";

export const schema = {
  types: allSchemas,
};
```

## Content Structure

### Content Types

| Type | Description |
|------|-------------|
| `homePage` | Main homepage configuration (singleton) |
| `publication` | Academic publications with DOI support |
| `project` | Research projects with funding details |
| `conference` | Talks and presentations |
| `dataset` | Research datasets |
| `tool` | Software tools and packages |
| `news` | News posts and updates |
| `blog` | Blog posts with rich content |
| `cv` | CV/Resume documents |
| `contactInfo` | Contact information (singleton) |
| `researchInterest` | Research interests for tag cloud |

### Available Components

**Cards:**
- `BlogCard` - Blog post preview card
- `ProjectCard` - Research project card
- `NewsCard` - News item card
- `ConferenceCard` - Conference/talk card
- `DatasetCard` - Dataset card

**Sections:**
- `Section` - Generic homepage section
- `ContactSection` - Contact information display
- `CVSection` - CV download section
- `ResearchInterestsCloud` - Interactive tag cloud

**Navigation:**
- `Header` - Site header with navigation
- `ThemeProvider` - Dark/light mode provider
- `ThemeToggle` - Theme toggle button

**Media:**
- `ClickableImage` - Zoomable image
- `PublicationImage` - Publication figure with zoom
- `ShareButton` - Social sharing button

## Customization

### Tailwind CSS

Extend the base config in your app's `tailwind.config.ts`:

```typescript
import baseConfig from "@research-homepage/tailwind-config";

export default {
  ...baseConfig,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../packages/components/**/*.{js,ts,jsx,tsx}",
  ],
};
```

### Theming

Override CSS variables in your app's `globals.css`:

```css
:root {
  --primary: 220 90% 50%;  /* Custom primary color */
}
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set the root directory to `apps/your-app-name`
4. Deploy

### Other Platforms

The apps are standard Next.js applications and can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Node.js

## Project Structure

```
research-homepage/
├── apps/
│   ├── nicholas-dimonaco/     # Example researcher site
│   │   ├── app/               # Next.js App Router
│   │   ├── sanity/            # Sanity config
│   │   └── public/            # Static assets
│   └── template/              # Marketing site
├── packages/
│   ├── ui/                    # shadcn/ui components
│   ├── components/            # Domain components
│   │   ├── cards/
│   │   ├── sections/
│   │   ├── navigation/
│   │   └── media/
│   ├── cms/                   # Sanity schemas and utilities
│   │   ├── schemas/
│   │   ├── lib/
│   │   └── types/
│   ├── tailwind-config/
│   └── typescript-config/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint on all packages |
| `pnpm clean` | Remove all build artifacts |
| `pnpm dev:nicholas-dimonaco` | Start the researcher site |
| `pnpm dev:template` | Start the marketing site |

## Examples

- [Dr. Nicholas Dimonaco](https://nicholas.dimonaco.co.uk/) - Computational Biology
- [Your site here!] - Submit a PR to add your site

## Getting Help

### Free & Open Source

This project is completely free and open source under the MIT license.

### Professional Support

Need help setting up, customizing, or adding new features? Contact: [james@dimonaco.co.uk](mailto:james@dimonaco.co.uk)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [Sanity](https://www.sanity.io/), and [Turborepo](https://turbo.build/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ for the academic community**
