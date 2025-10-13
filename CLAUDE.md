# Research Homepage - Project Overview

A modern, reusable academic profile website builder for researchers and academics, built with Next.js 15 and Sanity CMS v3.

## 🏗️ Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.4.5 (App Router with React Server Components)
- **CMS**: Sanity v3.99.0 with Sanity Studio
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

---

## 📁 Project Structure

```
research-homepage/
├── app/                          # Next.js App Router
│   ├── components/               # React components
│   ├── types/                    # TypeScript interfaces
│   ├── api/                      # API routes (DOI lookup)
│   ├── studio/[[...tool]]/       # Sanity Studio (at /studio)
│   ├── conferences/[slug]/       # Conference talk pages
│   ├── datasets/[slug]/          # Dataset pages
│   ├── news/[slug]/              # News post pages
│   ├── projects/[slug]/          # Project pages
│   ├── publications/             # Publications list
│   ├── tools/                    # Tools list
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles + CSS variables
│
├── sanity/                       # Sanity CMS configuration
│   ├── schema.ts                 # Schema registry
│   ├── types/                    # Content type definitions
│   │   ├── index.ts              # Type exports
│   │   ├── homePage.ts           # Homepage configuration
│   │   ├── publication.ts        # Publications with DOI support
│   │   ├── project.ts            # Research projects
│   │   ├── conference.ts         # Talks & presentations
│   │   ├── dataset.ts            # Research datasets
│   │   ├── tool.ts               # Software tools
│   │   ├── news.ts               # News & updates
│   │   ├── cv.ts                 # CV/Resume documents
│   │   ├── contactInfo.ts        # Contact information
│   │   ├── section.ts            # Homepage sections
│   │   └── researchInterest.ts   # Research interests (tag cloud)
│   │
│   ├── lib/
│   │   ├── client.ts             # Sanity client + sanityFetch utility
│   │   └── image.ts              # Image URL builder
│   │
│   ├── plugins/
│   │   └── doi-input/            # Custom DOI input plugin
│   │       └── index.tsx
│   │
│   └── env.ts                    # Environment configuration
│
├── components/ui/                # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dialog.tsx
│   ├── navigation-menu.tsx
│   ├── separator.tsx
│   ├── tabs.tsx
│   └── ...
│
├── lib/
│   └── utils.ts                  # Utility functions (cn)
│
├── public/                       # Static assets
│
├── sanity.config.ts              # Sanity Studio configuration
├── sanity.cli.ts                 # Sanity CLI configuration
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── .env                          # Environment variables (gitignored)
└── .env.example                  # Environment template
```

---

## 🎨 Sanity CMS Configuration

### Environment Setup

Required environment variables (`.env`):
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=e3p73cme
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_TOKEN=your_token_here  # Optional, for write operations
```

### Sanity Studio Configuration

**File**: `sanity.config.ts`

- **Base Path**: `/studio` (accessible at `yoursite.com/studio`)
- **Plugins**:
  - `structureTool()` - Content structure editor
  - `visionTool()` - GROQ query testing interface
- **Schema**: Imported from `./sanity/schema.ts`

### Sanity Client Configuration

**File**: `sanity/lib/client.ts`

- **Perspective**: `published` (only published content)
- **CDN**: Enabled (`useCdn: true`)
- **Revalidation**:
  - Development: 30 seconds
  - Production: 60 seconds
  - TODO: Change to 3600 for production (noted in code)

---

## 📝 Content Types (Sanity Schemas)

### 1. **homePage** (`sanity/types/homePage.ts`)
The main homepage configuration.

**Fields**:
- `name` (string) - Researcher's name
- `image` (image) - Profile photo with hotspot
- `bio` (text) - Biography
- `sections` (array of section) - Customizable homepage sections

**Singleton**: Only one instance allowed

---

### 2. **publication** (`sanity/types/publication.ts`)
Academic publications with rich metadata.

**Fields**:
- `title` (string, required)
- `status` (select) - published, in_press, accepted, under_review, preprint, submitted, other
- `customStatus` (string) - Custom status when "other" is selected
- `publicationDate` (date)
- `year` (number) - For sorting
- `journal` (string) - Journal/venue name
- `authors` (text)
- `description` (text) - Abstract
- `doi` (string) - **Uses custom DOI input plugin**
- `googleScholarLink` (url)
- `preprintLink` (url)
- `pdfLink` (url)
- `linkButtonText` (string) - Custom button text
- `image` (image) - Graphical abstract
- `featured` (boolean)

**Preview**: Title • Status • Venue • Year

**Special Feature**: DOI auto-fill via `/app/api/doi` endpoint

---

### 3. **project** (`sanity/types/project.ts`)
Research projects with funding and collaboration details.

**Fields**:
- `title` (string, required)
- `slug` (slug, required) - Auto-generated from title
- `status` (select) - active, completed, planning, on_hold
- `startDate` (date)
- `endDate` (date)
- `summary` (text, max 300 chars)
- `description` (portable text) - Rich text with formatting
- `image` (image)
- `funding` (object):
  - `source` (string)
  - `amount` (string)
  - `grantNumber` (string)
- `collaborators` (array of objects):
  - `name` (string, required)
  - `role` (string)
  - `institution` (string)
  - `url` (url)
- `publications` (array of references) - Links to publication documents
- `links` (array of objects) - External links
- `keywords` (array of strings)
- `featured` (boolean)
- `order` (number)

**Preview**: Title • Status • Year

**Individual Pages**: `/projects/[slug]`

---

### 4. **conference** (`sanity/types/conference.ts`)
Talks, presentations, and conference appearances.

**Fields**:
- `title` (string, required)
- `slug` (slug, required)
- `type` (select) - keynote, invited, conference, workshop, poster, panel, seminar
- `conference` (string, required)
- `location` (string)
- `date` (date, required)
- `abstract` (text)
- `description` (portable text)
- `image` (image)
- `slides` (object):
  - `embedUrl` (url) - Google Slides, SlideShare
  - `downloadUrl` (url) - Direct PDF/PPT link
- `video` (object):
  - `embedUrl` (url)
  - `platform` (select) - youtube, vimeo, other
- `links` (array of objects)
- `coAuthors` (array of strings)
- `relatedPublication` (reference to publication)
- `keywords` (array of strings)
- `featured` (boolean)
- `order` (number)

**Preview**: Title • Conference • Year • Type

**Individual Pages**: `/conferences/[slug]`

---

### 5. **dataset** (`sanity/types/dataset.ts`)
Research datasets with licensing and access information.

**Fields**:
- `title` (string, required)
- `slug` (slug, required)
- `doi` (string)
- `version` (string)
- `releaseDate` (date, required)
- `description` (text, required)
- `longDescription` (portable text)
- `dataType` (select) - tabular, images, text, audio, video, timeseries, geospatial, mixed, code, other
- `size` (object):
  - `fileSize` (string)
  - `samples` (string)
- `license` (select) - CC0, CC-BY-4.0, CC-BY-SA-4.0, CC-BY-NC-4.0, MIT, Apache-2.0, GPL-3.0, custom
- `accessType` (select) - open, registration, request, restricted
- `downloadUrl` (url)
- `repositoryUrl` (url) - Zenodo, Figshare, GitHub
- `paperUrl` (url)
- `citationText` (text)
- `relatedProject` (reference to project)
- `relatedPublication` (reference to publication)
- `tags` (array of strings)
- `image` (image)
- `featured` (boolean)
- `order` (number)

**Preview**: ⭐ Title (if featured) • Data Type • Year

**Individual Pages**: `/datasets/[slug]`

---

### 6. **tool** (`sanity/types/tool.ts`)
Software tools and packages developed.

**Fields**:
- `name` (string)
- `description` (text)
- `githubLink` (url)
- `linkButtonText` (string) - Default: "View on GitHub"
- `image` (image)

**Preview**: Name

**List Page**: `/tools`

---

### 7. **news** (`sanity/types/news.ts`)
News posts, updates, and announcements.

**Fields**:
- `title` (string, required)
- `slug` (slug, required)
- `category` (select) - research, software, publication, award, conference, general, lab
- `date` (datetime, required)
- `summary` (text, max 200 chars, required)
- `content` (portable text) - Rich content with images
  - Supports: H2, H3, blockquote, strong, em, code, links, images with captions
- `image` (image) - Featured image
- `relatedProject` (reference)
- `relatedPublication` (reference)
- `relatedTool` (reference)
- `tags` (array of strings)
- `featured` (boolean)
- `draft` (boolean) - Hidden when true

**Preview**: 🔸 Title (if draft) • Category • Date

**Individual Pages**: `/news/[slug]`

---

### 8. **cv** (`sanity/types/cv.ts`)
CV/Resume documents with version control.

**Fields**:
- `title` (string, required) - e.g., "Academic CV", "Industry Resume"
- `version` (string, required) - e.g., "v2.1", "December 2024"
- `lastUpdated` (date, required)
- `description` (text)
- `file` (file, required) - Accepts .pdf, .doc, .docx
- `fileSize` (string, read-only)
- `pages` (number)
- `isPublic` (boolean) - Default: true
- `isPrimary` (boolean) - Mark as main CV
- `order` (number)

**Preview**: Title ⭐ (if primary) • Version • Date

**Display**: Homepage CV section

---

### 9. **contactInfo** (`sanity/types/contactInfo.ts`)
Contact information and social media links.

**Fields**:
- `emails` (array of objects):
  - `label` (string, required) - e.g., "Work", "Personal"
  - `value` (string, email, required)
- `email` (string, hidden) - Legacy field for backward compatibility
- `phone` (string)
- `linkedin` (url)
- `X` (url) - Twitter/X profile
- `github` (url)
- `googleScholar` (url)

**Singleton**: Only one instance

**Display**: Homepage contact section

---

### 10. **section** (`sanity/types/section.ts`)
Reusable homepage sections (object type, not document).

**Fields**:
- `title` (string)
- `image` (image with hotspot)
- `text` (text)
- `orientation` (select) - imageLeft, imageRight
- `linkUrl` (string) - Internal or external URL
- `openInNewTab` (boolean) - Only shown when linkUrl is set

**Usage**: Array field in homePage

---

### 11. **researchInterest** (`sanity/types/researchInterest.ts`)
Research interests for tag cloud visualization.

**Fields**:
- `keyword` (string, required)
- `category` (select) - primary, methodology, application, technology, theory, interdisciplinary
- `description` (text)
- `weight` (number, 1-10) - Affects tag size (10 = largest)
- `color` (select) - blue, green, purple, amber, red, teal, pink, indigo
- `relatedProjects` (array of references)
- `relatedPublications` (array of references)
- `active` (boolean) - Default: true
- `order` (number)

**Preview**: Keyword (inactive) • Category • Weight

**Display**: Homepage research interests cloud

---

### 12. **blog** (`sanity/types/blog.ts`)
Blog posts with rich content and categorization.

**Fields**:
- `title` (string, required)
- `slug` (slug, required) - Auto-generated from title
- `publishedAt` (datetime, required) - Default: current date/time
- `excerpt` (text, max 300 chars, required) - Brief excerpt for list view
- `content` (portable text, required) - Rich content with:
  - Styles: H2, H3, H4, blockquote
  - Lists: bullet, numbered
  - Marks: strong, em, code, underline, strike-through
  - Links with "open in new tab" option
  - Images with caption and alt text
- `featuredImage` (image with alt text) - Main post image
- `categories` (array of strings, required, min 1) - Predefined list:
  - research, tutorial, opinion, technical, career, personal
- `tags` (array of strings) - Freeform keywords
- `author` (string) - Author name (defaults to site owner if empty)
- `readingTime` (number) - Minutes (auto-calculated if empty)
- `featured` (boolean) - Show prominently
- `draft` (boolean) - Hidden when true
- `relatedPosts` (array of references to blog) - Manually selected related posts

**Preview**: 🔸 (draft) or ⭐ (featured) Title • Category • Date

**Individual Pages**: `/blog/[slug]`

**Special Features**:
- Auto-calculates reading time based on word count (200 words/min)
- Rich portable text editor with extensive formatting options
- Related posts section
- Share functionality

---

## 🔌 Custom Sanity Plugins

### DOI Input Plugin (`sanity/plugins/doi-input/`)

**Purpose**: Auto-fill publication metadata from DOI

**Features**:
- Fetches publication data from Crossref API
- Auto-populates: title, authors, journal, year, publication date
- API endpoint: `/app/api/doi`
- Used in: publication schema

**Usage**:
```typescript
defineField({
  name: "doi",
  type: "string",
  components: {
    input: DoiInput,
  },
})
```

---

## 🎨 Theming & Styling

### CSS Variables (`app/globals.css`)

Dark/light mode is controlled via CSS custom properties:

**Light Mode**:
- `--background`: 0 0% 100%
- `--foreground`: 222.2 84% 4.9%
- `--primary`: 222.2 47.4% 11.2%
- `--secondary`: 210 40% 96.1%
- etc.

**Dark Mode** (`.dark` class):
- `--background`: 222.2 84% 4.9%
- `--foreground`: 210 40% 98%
- `--primary`: 210 40% 98%
- `--secondary`: 217.2 32.6% 17.5%
- etc.

### Tailwind Configuration

**Border Radius**: Uses CSS variable `--radius`

**Fonts**:
- Primary: Libre Franklin (`--font-libre_franklin`)
- Secondary: Inter

**Plugins**:
- `tailwindcss-animate` - Animation utilities

---

## 🌐 Routing & Pages

### Static Pages
- `/` - Homepage (server component)
- `/publications` - Publications list
- `/tools` - Tools list
- `/blog` - Blog posts list
- `/news` - News updates list
- `/studio` - Sanity Studio (protected)

### Dynamic Pages (with slug)
- `/projects/[slug]` - Individual project
- `/datasets/[slug]` - Individual dataset
- `/news/[slug]` - Individual news post
- `/conferences/[slug]` - Individual conference talk
- `/blog/[slug]` - Individual blog post

### API Routes
- `/api/doi` - DOI metadata lookup

---

## 🔄 Data Fetching

### sanityFetch Utility

**File**: `sanity/lib/client.ts`

**Features**:
- Automatic revalidation
- Tag-based cache invalidation support
- TypeScript generic for response typing

**Example**:
```typescript
const data = await sanityFetch<HomePage>({
  query: `*[_type == "homePage"][0]`,
  tags: ['homepage']
});
```

### Common GROQ Queries

**Homepage**:
```groq
*[_type == "homePage"][0]
```

**Contact Info**:
```groq
*[_type == "contactInfo"][0]
```

**Public CVs (ordered)**:
```groq
*[_type == "cv" && isPublic == true] | order(isPrimary desc, order asc, lastUpdated desc)
```

**Active Research Interests**:
```groq
*[_type == "researchInterest" && active == true] | order(weight desc, order asc)
```

**Projects with slug**:
```groq
*[_type == "project" && slug.current == $slug][0]{
  ...,
  publications[]->
}
```

---

## 🎯 Key Components

### App Components (`app/components/`)

1. **HeaderWrapper** - Server component wrapper for header
2. **Header** - Main navigation with theme toggle
3. **ThemeProvider** - next-themes provider
4. **ThemeToggle** - Dark/light mode switcher
5. **Section** - Reusable homepage section
6. **ContactSection** - Contact info display
7. **CVSection** - CV download section
8. **ResearchInterestsCloud** - Tag cloud visualization
9. **PublicationImage** - Publication image with DOI badge
10. **ProjectCard** - Project preview card
11. **ConferenceCard** - Conference talk card
12. **DatasetCard** - Dataset card
13. **NewsCard** - News post card
14. **BlogCard** - Blog post card with reading time

### UI Components (`components/ui/`)

shadcn/ui components (install via CLI):
- button, card, badge, dialog, tabs
- navigation-menu, separator, select
- sheet, input

---

## 🚀 Development Workflow

### Running Locally

```bash
# Install dependencies
npm install

# Run Next.js dev server
npm run dev
# → http://localhost:3000

# Run Sanity Studio
npm run sanity:dev
# → http://localhost:3333

# Build for production
npm run build

# Start production server
npm start
```

### Adding New Content Types

1. Create schema file in `sanity/types/`
2. Export from `sanity/types/index.ts`
3. Add to schema array in `sanity/schema.ts`
4. Restart Sanity Studio
5. Create TypeScript interface in `app/types/sanity.ts`
6. Create page/component to display content

---

## 🔐 Environment & Deployment

### Required Environment Variables

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-06-10
SANITY_API_TOKEN=your_token  # Optional
```

### Deployment Platforms

**Recommended**: Vercel (automatic Next.js optimization)

**Also Supported**:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with Node.js

**Note**: Sanity Studio is embedded at `/studio` route

### Production Deployment

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step deployment guide**

Key steps:
1. Deploy Sanity schema: `npx sanity deploy`
2. Update revalidation time to 3600 seconds in `sanity/lib/client.ts`
3. Commit and push code to Git
4. Deploy to Vercel (or other platform)
5. Configure environment variables
6. Set up CORS origins in Sanity
7. Test production site

**Important Sanity Commands**:
```bash
# Deploy Studio schema changes (run when schemas are modified)
npx sanity deploy

# Export content backup
npx sanity dataset export production backup.tar.gz

# Manage your project
npx sanity manage
```

---

## 📊 Content Relationships

### Reference Structure

```
homePage
├── sections[] (embedded objects)

publication
├── (standalone)

project
├── publications[] → publication
├── collaborators[] (embedded objects)

conference
├── relatedPublication → publication

dataset
├── relatedProject → project
├── relatedPublication → publication

news
├── relatedProject → project
├── relatedPublication → publication
├── relatedTool → tool

blog
├── relatedPosts[] → blog (self-referencing)

researchInterest
├── relatedProjects[] → project
├── relatedPublications[] → publication

cv
├── (standalone)

contactInfo
├── (singleton)

tool
├── (standalone)
```

---

## 🎨 Design Patterns

### Responsive Design
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Container with responsive padding: `px-4 md:px-6 lg:px-8`

### Typography
- Headings: `text-4xl md:text-5xl lg:text-6xl`
- Body: `text-lg md:text-xl`
- Color: `text-muted-foreground` for secondary text

### Layout
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Spacing: `gap-4`, `gap-6`, `gap-8`, `gap-12`
- Sections: `py-16 md:py-24 lg:py-32`

### Cards
- Base: `<Card>` with `<CardContent>`
- Hover effects: `hover:shadow-lg transition-shadow`
- Images: Next.js `<Image>` with `fill` or fixed dimensions

---

## 🔧 Customization Guide

### Changing Colors

Edit CSS variables in `app/globals.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;  /* Change hue, saturation, lightness */
}
```

### Adding a New Content Type

1. **Create schema** (`sanity/types/newType.ts`):
```typescript
export default defineType({
  name: "newType",
  title: "New Type",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
  ],
});
```

2. **Register** (`sanity/schema.ts`):
```typescript
import { newType } from "./types";
export const schema = { types: [..., newType] };
```

3. **Create page** (`app/newtype/page.tsx`):
```typescript
import { sanityFetch } from "@/sanity/lib/client";

export default async function NewTypePage() {
  const data = await sanityFetch({
    query: `*[_type == "newType"]`
  });
  // Render data
}
```

### Modifying Homepage

Edit `app/page.tsx` to:
- Reorder sections
- Add new sections
- Change layout
- Modify hero section

---

## 📚 TypeScript Types

Located in `app/types/sanity.ts` (not shown but referenced):

```typescript
interface HomePage {
  _id: string;
  name: string;
  image?: SanityImageSource;
  bio: string;
  sections: Section[];
}

interface Publication {
  _id: string;
  title: string;
  status: string;
  year?: number;
  authors?: string;
  journal?: string;
  // ... etc
}

// ... and more for each content type
```

---

## 🐛 Known Issues / TODOs

From code comments:

1. **Revalidation** (`sanity/lib/client.ts:25`):
   - Current: 60 seconds in production
   - TODO: Change to 3600 (1 hour) for production

---

## 📖 Additional Resources

### Official Documentation
- **Next.js**: https://nextjs.org/docs
- **Sanity**: https://www.sanity.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com/docs

### Repository
- **GitHub**: https://github.com/jamesdimonaco/research-homepage
- **Example Site**: https://nicholas.dimonaco.co.uk

---

## 🤝 Contributing

To extend or customize:

1. Fork the repository
2. Create feature branch
3. Test thoroughly (especially Sanity schema changes)
4. Submit pull request

---

## 📄 License

MIT License - Free and open source

---

**Last Updated**: 2025-10-13
**Sanity Version**: 3.99.0
**Next.js Version**: 15.4.5
