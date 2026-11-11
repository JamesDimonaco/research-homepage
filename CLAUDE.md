# research-homepage

Academic profile site builder. Turborepo + pnpm 9, Next.js 15 (App Router), Sanity v4 with an embedded Studio at `/studio`, Tailwind, shadcn/ui.
This is a consulting lead-gen play, not a SaaS. Onboarding is manual on purpose. Do not propose signup, auto-provisioning or multi-tenancy.

## Layout
- `apps/nicholas-dimonaco`: the live site (the only client so far).
- `apps/template`: copy this for a new researcher. Wire the factories, add root scripts.
- `apps/demo`: the marketing site. Own scripts, so it is easy to miss.
- `packages/`: `ui`, `cms` (schemas, Sanity factories, importers), `components`, `tailwind-config`, `typescript-config`.

## Commands
- `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`. No test suite.
- Per app: `pnpm dev:nicholas-dimonaco`, `pnpm dev:demo`, `pnpm dev:template` (same for `build:`). `pnpm sanity:dev` runs Studio for Nicholas.

## Where things live
- Identity lane: personal.
- Hosting: Vercel, team james-dimonacos-projects. Project `nicholas-dimonaco` (root `apps/nicholas-dimonaco`, nicholas.dimonaco.co.uk) and project `research-homepage-demo` (root `apps/demo`). Both deploy on push to `main`.
- CMS: Sanity project `e3p73cme`, dataset `production`. Studio deploys with `npx sanity deploy` from the app folder.
- Env, per app `.env`: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SITE_URL`, optional `SANITY_API_TOKEN`, optional `NEXT_PUBLIC_POSTHOG_KEY`.
- Sanity wiring: each app calls `createSanityClient` and `createImageBuilder` from `@research-homepage/cms`, and `configureComponents({ urlForImage })` in `layout.tsx`. Header reads `siteName` from the `homePage` doc.
- Security helpers in `packages/cms/lib/security.ts`: JSON-LD goes through `serializeJsonLd`, external links through `safeUrl`.
- Plans, roadmap and tickets live in the vault: `Nextcloud/Notes/James/projects/research-homepage/`.

## Scholar metrics
- Publication count comes from the ORCID public API (`fetchPublicationCountByOrcid`). It groups preprint and published versions.
- Citations, h-index, i10 and abstracts come from OpenAlex. Do not use OpenAlex `works_count`. It counts every preprint and dataset (49 against about 17).
- The importer is `packages/cms/plugins/orcid-import/`. It uses OpenAlex because Studio tools run in the browser, where ORCID OAuth would need a secret.
- The metrics strip shows only when the `homePage` doc has an `orcid` value.
- `homePage` has manual overrides (`citationsOverride`, `hIndexOverride`, `i10IndexOverride`, `publicationsOverride`, `metricsSourceLabel`) to pin Google Scholar numbers. Override wins over the live source.
- Unset Sanity fields come back as `null`, not `undefined`. Use `x || default`, not default parameters.
- DOI auto-fill (`packages/cms/plugins/doi-input/`) calls the same-origin `/api/doi` route. Keep that fetch relative.

## Gotchas
- James's brother pushes feature work straight to `origin/main`. Fetch and fast-forward before you start, then run `pnpm install`. Stale `node_modules` makes the dev server 500 on `PostHogProvider`.
- Work from a fresh worktree off `origin/main`. `feature/growth-sprint` and `feature/sales-ready` diverged long ago.
- Studio custom tools mount in a fixed-height `overflow: hidden` pane. Use `<Flex direction="column" height="fill">`, then a scrollable `<Box flex={1} overflow="auto">`, then a sticky footer `<Card>`. A plain `<Container>` clips.
- TODO: register a dedicated ORCID app instead of reusing myetal's credentials.
