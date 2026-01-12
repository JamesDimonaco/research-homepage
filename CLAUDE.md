# Research Homepage - Turborepo Monorepo

A modern, reusable academic profile website builder for researchers and academics, built as a Turborepo monorepo with Next.js 15 and Sanity CMS v4.

## Architecture Overview

### Technology Stack
- **Build System**: Turborepo with pnpm workspaces
- **Framework**: Next.js 15.5.5 (App Router with React Server Components)
- **CMS**: Sanity v4.x with embedded Sanity Studio
- **Styling**: Tailwind CSS + shadcn/ui components
- **TypeScript**: Full type safety throughout
- **Fonts**: Libre Franklin (primary), Inter
- **Theme**: next-themes with dark/light mode support
- **Icons**: Lucide React + React Icons

### Key Features
- Server-side rendering for SEO optimization
- Responsive design with mobile-first approach
- Dark/light theme with system preference detection
- Rich content editing with Portable Text
- Image optimization via Sanity CDN
- DOI auto-fill functionality for publications
- Dynamic routing for individual content pages
- Shared packages for rapid deployment of new researcher sites

---

## Project Structure

```
research-homepage/
├── apps/
│   ├── nicholas-dimonaco/        # Researcher site (live at nicholas.dimonaco.co.uk)
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── components/       # App-specific components (HeaderWrapper)
│   │   │   ├── api/              # API routes (DOI lookup)
│   │   │   ├── studio/[[...tool]]/ # Sanity Studio
│   │   │   ├── blog/[slug]/
│   │   │   ├── conferences/[slug]/
│   │   │   ├── datasets/[slug]/
│   │   │   ├── news/[slug]/
│   │   │   ├── projects/[slug]/
│   │   │   ├── publications/
│   │   │   ├── tools/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── sanity/
│   │   │   ├── schema.ts         # Uses allSchemas from @research-homepage/cms
│   │   │   └── lib/
│   │   │       ├── client.ts     # Uses createSanityClient factory
│   │   │       └── image.ts      # Uses createImageBuilder factory
│   │   ├── sanity.config.ts
│   │   ├── tailwind.config.ts    # Extends @research-homepage/tailwind-config
│   │   └── tsconfig.json         # Extends @research-homepage/typescript-config
│   │
│   └── template/                 # Marketing/showcase site for the platform
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx          # Landing page with features
│       │   └── globals.css
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                       # @research-homepage/ui
│   │   ├── components/           # shadcn/ui components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── tabs.tsx
│   │   ├── lib/
│   │   │   └── utils.ts          # cn() utility
│   │   └── index.ts
│   │
│   ├── cms/                      # @research-homepage/cms
│   │   ├── schemas/              # All Sanity schemas
│   │   │   ├── blog.ts
│   │   │   ├── conference.ts
│   │   │   ├── contactInfo.ts
│   │   │   ├── cv.ts
│   │   │   ├── dataset.ts
│   │   │   ├── homePage.ts
│   │   │   ├── news.ts
│   │   │   ├── project.ts
│   │   │   ├── publication.ts
│   │   │   ├── researchInterest.ts
│   │   │   ├── section.ts
│   │   │   ├── tool.ts
│   │   │   └── index.ts
│   │   ├── lib/
│   │   │   ├── client.ts         # createSanityClient factory
│   │   │   └── image.ts          # createImageBuilder factory
│   │   ├── plugins/
│   │   │   └── doi-input/        # DOI auto-fill plugin
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   └── index.ts
│   │
│   ├── components/               # @research-homepage/components
│   │   ├── cards/
│   │   │   ├── BlogCard.tsx
│   │   │   ├── ConferenceCard.tsx
│   │   │   ├── DatasetCard.tsx
│   │   │   ├── NewsCard.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── sections/
│   │   │   ├── ContactSection.tsx
│   │   │   ├── CVSection.tsx
│   │   │   ├── ResearchInterestsCloud.tsx
│   │   │   └── Section.tsx
│   │   ├── navigation/
│   │   │   ├── Header.tsx        # CMS-driven with siteName prop
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── media/
│   │   │   ├── ClickableImage.tsx
│   │   │   ├── PublicationImage.tsx
│   │   │   └── ShareButton.tsx
│   │   ├── config.ts             # configureComponents setup
│   │   └── index.ts
│   │
│   ├── tailwind-config/          # @research-homepage/tailwind-config
│   │   ├── index.ts              # Shared Tailwind config
│   │   └── globals.css           # CSS variables for theming
│   │
│   └── typescript-config/        # @research-homepage/typescript-config
│       ├── base.json
│       ├── next.json
│       └── react-library.json
│
├── turbo.json                    # Turborepo configuration
├── pnpm-workspace.yaml           # pnpm workspace config
├── package.json                  # Root package.json with scripts
└── README.md                     # User-facing documentation
```

---

## Package Details

### @research-homepage/ui

Shared shadcn/ui primitives and utilities.

**Exports**:
```typescript
// Components
export * from "./components/badge";
export * from "./components/button";
export * from "./components/card";
export * from "./components/dialog";
export * from "./components/input";
export * from "./components/navigation-menu";
export * from "./components/select";
export * from "./components/separator";
export * from "./components/sheet";
export * from "./components/tabs";

// Utilities
export { cn } from "./lib/utils";
```

**Usage in apps**:
```typescript
import { Button, Card, CardContent, Badge, cn } from "@research-homepage/ui";
```

---

### @research-homepage/cms

Sanity CMS schemas, client factory, and TypeScript types.

**Key Exports**:
```typescript
// Schema exports
export { allSchemas } from "./schemas";
export { blog, conference, contactInfo, cv, dataset, homePage, news, project, publication, researchInterest, section, tool } from "./schemas";

// Client factory
export { createSanityClient } from "./lib/client";
export { createImageBuilder } from "./lib/image";

// Types
export type { Blog, Conference, ContactInfo, CV, Dataset, HomePage, News, Project, Publication, ResearchInterest, Section, Tool } from "./types";

// DOI plugin
export { DoiInput } from "./plugins/doi-input";
```

**Client Factory Pattern**:
```typescript
// In apps/nicholas-dimonaco/sanity/lib/client.ts
import { createSanityClient } from "@research-homepage/cms";

const { client, sanityFetch } = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
});

export { client, sanityFetch };
```

**Image Builder Factory**:
```typescript
// In apps/nicholas-dimonaco/sanity/lib/image.ts
import { createImageBuilder } from "@research-homepage/cms";

const builder = createImageBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
});

export const urlForImage = (source: any) => {
  return builder.image(source).auto("format").fit("max").url();
};
```

**Schema Usage**:
```typescript
// In apps/nicholas-dimonaco/sanity/schema.ts
import { allSchemas } from "@research-homepage/cms";
export const schema = { types: allSchemas };
```

---

### @research-homepage/components

Domain-specific React components for research content.

**Configuration Pattern**:
Components need access to the app's `urlForImage` function. This is configured at app startup:

```typescript
// In apps/nicholas-dimonaco/app/layout.tsx
import { configureComponents } from "@research-homepage/components";
import { urlForImage } from "@/sanity/lib/image";

// Configure shared components with app-specific dependencies
configureComponents({ urlForImage });
```

**Header with CMS-driven branding**:
```typescript
// In apps/nicholas-dimonaco/app/components/HeaderWrapper.tsx
import { Header } from "@research-homepage/components";
import { sanityFetch } from "@/sanity/lib/client";

export default async function HeaderWrapper() {
  const homePage = await sanityFetch<HomePage>({
    query: `*[_type == "homePage"][0]{ name }`
  });

  return <Header siteName={homePage?.name || "Researcher"} contentCounts={...} />;
}
```

**Key Exports**:
```typescript
// Cards
export { default as BlogCard } from "./cards/BlogCard";
export { default as ConferenceCard } from "./cards/ConferenceCard";
export { default as DatasetCard } from "./cards/DatasetCard";
export { default as NewsCard } from "./cards/NewsCard";
export { default as ProjectCard } from "./cards/ProjectCard";

// Sections
export { default as Section } from "./sections/Section";
export { default as ContactSection } from "./sections/ContactSection";
export { default as CVSection } from "./sections/CVSection";
export { default as ResearchInterestsCloud } from "./sections/ResearchInterestsCloud";

// Navigation
export { default as Header } from "./navigation/Header";
export { ThemeProvider } from "./navigation/ThemeProvider";
export { ThemeToggle } from "./navigation/ThemeToggle";

// Media
export { default as ClickableImage } from "./media/ClickableImage";
export { default as PublicationImage } from "./media/PublicationImage";
export { default as ShareButton } from "./media/ShareButton";

// Config
export { configureComponents } from "./config";
```

---

### @research-homepage/tailwind-config

Shared Tailwind CSS configuration with CSS variables for theming.

**Usage in apps**:
```typescript
// apps/nicholas-dimonaco/tailwind.config.ts
import type { Config } from "tailwindcss";
import baseConfig from "@research-homepage/tailwind-config";

const config: Config = {
  ...baseConfig,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // Package paths
    "../../packages/ui/components/**/*.tsx",
    "../../packages/ui/lib/**/*.ts",
    "../../packages/components/cards/**/*.tsx",
    "../../packages/components/sections/**/*.tsx",
    "../../packages/components/navigation/**/*.tsx",
    "../../packages/components/media/**/*.tsx",
  ],
};

export default config;
```

---

### @research-homepage/typescript-config

Shared TypeScript configurations.

**Configs**:
- `base.json` - Base compiler options
- `next.json` - For Next.js apps (extends base)
- `react-library.json` - For packages (extends base)

**Usage**:
```json
// apps/nicholas-dimonaco/tsconfig.json
{
  "extends": "@research-homepage/typescript-config/next.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

---

## Content Types (Sanity Schemas)

All schemas are defined in `packages/cms/schemas/` and exported via `allSchemas`.

### 1. homePage
Homepage configuration (singleton).
- `name` - Researcher's name (used in Header)
- `image` - Profile photo
- `bio` - Biography
- `sections` - Array of section objects

### 2. publication
Academic publications with DOI support.
- `title`, `status`, `year`, `journal`, `authors`
- `doi` - Uses custom DoiInput plugin for auto-fill
- `description` - Abstract
- `featured` - Boolean for highlighting

### 3. project
Research projects with funding info.
- `title`, `slug`, `status`
- `summary`, `description` (portable text)
- `funding` - Object with source, amount, grantNumber
- `collaborators` - Array of collaborator objects
- `publications` - References to publication documents

### 4. conference
Talks and presentations.
- `title`, `slug`, `type`, `conference`, `date`
- `slides` - Object with embedUrl, downloadUrl
- `video` - Object with embedUrl, platform

### 5. dataset
Research datasets.
- `title`, `slug`, `doi`, `version`
- `dataType`, `license`, `accessType`
- `size` - Object with fileSize, samples

### 6. tool
Software tools and packages.
- `name`, `description`, `githubLink`, `image`

### 7. news
News posts and announcements.
- `title`, `slug`, `category`, `date`
- `summary`, `content` (portable text)
- `draft` - Hidden when true

### 8. blog
Blog posts with rich content.
- `title`, `slug`, `publishedAt`, `excerpt`
- `content` (portable text)
- `categories`, `tags`, `readingTime`
- `featured`, `draft`

### 9. cv
CV/Resume documents.
- `title`, `version`, `lastUpdated`
- `file` - PDF/DOC upload
- `isPrimary`, `isPublic`

### 10. contactInfo
Contact information (singleton).
- `emails` - Array with label/value
- `phone`, `linkedin`, `X`, `github`, `googleScholar`

### 11. researchInterest
Research interests for tag cloud.
- `keyword`, `category`, `weight` (1-10)
- `color`, `active`

### 12. section
Homepage sections (object type).
- `title`, `image`, `text`
- `orientation` - imageLeft or imageRight
- `linkUrl`, `openInNewTab`

---

## Development Commands

```bash
# Install all dependencies
pnpm install

# Development
pnpm dev                      # Run all apps in dev mode
pnpm dev:nicholas-dimonaco    # Run researcher site only
pnpm dev:template             # Run marketing site only

# Build
pnpm build                    # Build all apps
pnpm build:nicholas-dimonaco  # Build researcher site
pnpm build:template           # Build marketing site

# Type checking
pnpm lint                     # Run linting across all packages

# Clean
pnpm clean                    # Clean all build artifacts
```

---

## Environment Setup

Each app needs its own `.env` file:

```env
# apps/nicholas-dimonaco/.env
NEXT_PUBLIC_SANITY_PROJECT_ID=e3p73cme
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_TOKEN=your_token_here  # Optional
```

---

## Adding a New Researcher Site

1. Copy `apps/template` to `apps/new-researcher-name`
2. Update `package.json` name to `@research-homepage/new-researcher-name`
3. Create `.env` with Sanity project credentials
4. Create `sanity/lib/client.ts` and `sanity/lib/image.ts` using factories
5. Create `sanity/schema.ts` importing `allSchemas`
6. Update `app/layout.tsx` to call `configureComponents({ urlForImage })`
7. Create `app/components/HeaderWrapper.tsx` to fetch siteName from CMS
8. Add dev/build scripts to root `package.json`

---

## Deployment

### Vercel (Recommended)

1. Import repository to Vercel
2. Set root directory to `apps/nicholas-dimonaco` (or specific app)
3. Configure environment variables
4. Deploy

### Sanity Studio

Studio is embedded at `/studio` route in each app. Deploy schema changes:

```bash
cd apps/nicholas-dimonaco
npx sanity deploy
```

---

## Key Architecture Decisions

1. **Factory Pattern for Sanity**: `createSanityClient` and `createImageBuilder` allow apps to inject their own project credentials while sharing schema logic.

2. **Component Configuration**: `configureComponents({ urlForImage })` injects app-specific image handling into shared components.

3. **CMS-Driven Header**: Header receives `siteName` prop from `homePage.name`, allowing per-site branding without code changes.

4. **Shared Schemas**: All Sanity schemas in `@research-homepage/cms` ensure consistency across sites.

5. **Content Paths in Tailwind**: Apps specify exact package paths in `content` to avoid scanning `node_modules`.

---

## TypeScript Types

All content types are exported from `@research-homepage/cms`:

```typescript
import type {
  Blog,
  Conference,
  ContactInfo,
  CV,
  Dataset,
  HomePage,
  News,
  Project,
  Publication,
  ResearchInterest,
  Section,
  Tool
} from "@research-homepage/cms";
```

---

## Resources

- **Next.js**: https://nextjs.org/docs
- **Sanity**: https://www.sanity.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Turborepo**: https://turbo.build/repo/docs

---

**Last Updated**: 2026-01-09
**Sanity Version**: 4.x
**Next.js Version**: 15.5.5
**Turborepo Version**: 2.6.3
