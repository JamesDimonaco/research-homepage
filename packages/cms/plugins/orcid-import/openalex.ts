/**
 * OpenAlex-backed publication fetch for the ORCID import tool.
 *
 * We query OpenAlex by ORCID iD rather than ORCID's own API because:
 *  - it's a public, CORS-enabled endpoint (no client secret — safe from the
 *    browser-side Studio tool),
 *  - it returns richer records (open-access status, abstract, venue) already
 *    deduped to a canonical work,
 *  - DOIs come normalised, which makes our own dedupe trivial.
 *
 * If we later want the *official* ORCID record (works with no DOI, ORCID-only
 * metadata), the myetal ORCID Public API client is the upgrade path — but that
 * needs a server route to hold ORCID_CLIENT_SECRET. See the growth-plan TODOs.
 */

import { safeUrl } from "../../lib/security";

export interface MappedWork {
  /** Stable key for dedupe/selection — normalised DOI, or an openalex id fallback. */
  key: string;
  title: string;
  doi?: string;
  year?: number;
  publicationDate?: string;
  journal?: string;
  authors?: string;
  description?: string;
  status: "published" | "preprint";
  preprintLink?: string;
  pdfLink?: string;
  /** Times this work has been cited, per OpenAlex. */
  citedByCount?: number;
  /** True once we detect this DOI already exists in the dataset. */
  alreadyExists?: boolean;
}

/** Author-level scholarly profile, from the OpenAlex author record. */
export interface AuthorProfile {
  displayName?: string;
  institution?: string;
  worksCount?: number;
  citedByCount?: number;
  hIndex?: number;
  i10Index?: number;
}

const OPENALEX = "https://api.openalex.org/works";
const OPENALEX_AUTHORS = "https://api.openalex.org/authors";

/**
 * Build a fetch init. When `revalidate` is supplied (server-side callers only)
 * we attach Next's data-cache hint so repeated renders don't re-hit OpenAlex;
 * in the browser-side Studio tool it's omitted and this is a plain fetch.
 */
function openalexInit(revalidate?: number): RequestInit {
  const init: RequestInit & { next?: { revalidate: number } } = {
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  };
  if (typeof revalidate === "number") init.next = { revalidate };
  return init;
}
const PREPRINT_RE =
  /arxiv|biorxiv|medrxiv|chemrxiv|ssrn|research\s?square|preprints?\.org|osf|preprint/i;

export function normaliseOrcid(input: string): string | null {
  const m = input.match(/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/i);
  return m?.[1] ? m[1].toUpperCase() : null;
}

export function normaliseDoi(doi?: string | null): string | undefined {
  if (!doi) return undefined;
  return (
    doi
      .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
      .replace(/^doi:/i, "")
      .replace(/\/+$/, "")
      .trim()
      .toLowerCase() || undefined
  );
}

function abstractFromInverted(
  inv?: Record<string, number[]> | null,
): string | undefined {
  if (!inv) return undefined;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(inv)) {
    for (const p of positions) words[p] = word;
  }
  const text = words.join(" ").replace(/\s+/g, " ").trim();
  // Guard against pathological length — abstracts occasionally balloon.
  return text ? text.slice(0, 4000) : undefined;
}

function deriveStatus(work: any): "published" | "preprint" {
  const venue: string = work?.primary_location?.source?.display_name ?? "";
  const version: string = work?.primary_location?.version ?? "";
  if (
    work?.type === "preprint" ||
    version === "submittedVersion" ||
    PREPRINT_RE.test(venue)
  ) {
    return "preprint";
  }
  return "published";
}

/** Strip HTML tags/angle-brackets from imported free-text (defence in depth —
 *  the render layer also escapes, but imported metadata is fully attacker-
 *  controlled so we neutralise it at the source too). */
function clean(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const out = value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
  return out || undefined;
}

function mapWork(work: any): MappedWork | null {
  const title = clean(work?.title ?? work?.display_name);
  if (!title) return null;

  const doi = normaliseDoi(work?.doi);
  const authors: string | undefined = Array.isArray(work?.authorships)
    ? clean(
        work.authorships
          .map((a: any) => a?.author?.display_name)
          .filter(Boolean)
          .join(", "),
      )
    : undefined;

  const oaUrl = safeUrl(
    work?.best_oa_location?.pdf_url ??
      work?.open_access?.oa_url ??
      work?.primary_location?.pdf_url ??
      undefined,
  );

  const status = deriveStatus(work);

  return {
    key: doi ?? String(work?.id ?? title),
    title,
    doi,
    year: typeof work?.publication_year === "number" ? work.publication_year : undefined,
    publicationDate: work?.publication_date || undefined,
    journal: clean(work?.primary_location?.source?.display_name),
    authors,
    description: clean(abstractFromInverted(work?.abstract_inverted_index)),
    status,
    citedByCount:
      typeof work?.cited_by_count === "number" ? work.cited_by_count : undefined,
    // Only surface a preprint link when it actually is one; otherwise treat as PDF.
    preprintLink: status === "preprint" ? oaUrl : undefined,
    pdfLink: status === "published" ? oaUrl : undefined,
  };
}

export interface FetchResult {
  works: MappedWork[];
  total: number;
}

/**
 * Fetch a researcher's works from OpenAlex, newest first, paginated by cursor.
 * Capped defensively so a prolific author can't spin forever.
 */
export async function fetchWorksByOrcid(
  orcidId: string,
  opts: { mailto?: string; maxPages?: number; revalidate?: number } = {},
): Promise<FetchResult> {
  const { mailto = "james@dimonaco.co.uk", maxPages = 6, revalidate } = opts;
  const filter = `author.orcid:https://orcid.org/${orcidId}`;
  const seen = new Set<string>();
  const works: MappedWork[] = [];
  let cursor: string | null = "*";
  let pages = 0;
  let total = 0;

  while (cursor && pages < maxPages) {
    const url =
      `${OPENALEX}?filter=${encodeURIComponent(filter)}` +
      `&per-page=200&cursor=${encodeURIComponent(cursor)}` +
      `&sort=publication_date:desc&mailto=${encodeURIComponent(mailto)}`;

    const res = await fetch(url, openalexInit(revalidate));
    if (!res.ok) {
      throw new Error(
        res.status === 429
          ? "OpenAlex is rate-limiting — wait a moment and try again."
          : `OpenAlex request failed (${res.status}).`,
      );
    }
    const json: any = await res.json();
    total = json?.meta?.count ?? total;
    const batch: any[] = Array.isArray(json?.results) ? json.results : [];
    if (!batch.length) break;

    for (const raw of batch) {
      const mapped = mapWork(raw);
      if (!mapped) continue;
      if (seen.has(mapped.key)) continue;
      seen.add(mapped.key);
      works.push(mapped);
    }

    cursor = json?.meta?.next_cursor ?? null;
    pages += 1;
  }

  return { works, total };
}

/**
 * Fetch a researcher's author-level metrics from OpenAlex (h-index, citations,
 * last-known institution, display name). Used both to bootstrap a new site's
 * profile and to render the citation-metrics strip.
 *
 * Returns null when the ORCID iD has no OpenAlex author record (rather than
 * throwing) so callers can degrade gracefully. Genuine network/HTTP failures
 * still throw so the Studio tool can surface them.
 */
export async function fetchAuthorByOrcid(
  orcidId: string,
  opts: { mailto?: string; revalidate?: number } = {},
): Promise<AuthorProfile | null> {
  const { mailto = "james@dimonaco.co.uk", revalidate } = opts;
  const url =
    `${OPENALEX_AUTHORS}/https://orcid.org/${encodeURIComponent(orcidId)}` +
    `?mailto=${encodeURIComponent(mailto)}`;

  const res = await fetch(url, openalexInit(revalidate));
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      res.status === 429
        ? "OpenAlex is rate-limiting — wait a moment and try again."
        : `OpenAlex author request failed (${res.status}).`,
    );
  }

  const a: any = await res.json();
  // `last_known_institutions` (array) is current; `last_known_institution`
  // (singular object) is the deprecated shape — support both.
  const institution = clean(
    a?.last_known_institutions?.[0]?.display_name ??
      a?.last_known_institution?.display_name,
  );
  const num = (v: unknown): number | undefined =>
    typeof v === "number" && Number.isFinite(v) ? v : undefined;

  return {
    displayName: clean(a?.display_name),
    institution,
    worksCount: num(a?.works_count),
    citedByCount: num(a?.cited_by_count),
    hIndex: num(a?.summary_stats?.h_index),
    i10Index: num(a?.summary_stats?.i10_index),
  };
}

export interface ScholarMetrics {
  author: AuthorProfile | null;
  /** normalised DOI → cited-by count, for per-publication badges. */
  citationsByDoi: Record<string, number>;
}

/**
 * One call for the render layer: author-level stats plus a DOI→citations map
 * for the works we already show. Intended to be called from a server component
 * behind ISR (revalidate daily) — never per request.
 */
export async function fetchScholarMetrics(
  orcidId: string,
  opts: { mailto?: string; maxPages?: number; revalidate?: number } = {},
): Promise<ScholarMetrics> {
  const [author, works] = await Promise.all([
    fetchAuthorByOrcid(orcidId, opts),
    fetchWorksByOrcid(orcidId, opts),
  ]);

  const citationsByDoi: Record<string, number> = {};
  for (const w of works.works) {
    if (w.doi && typeof w.citedByCount === "number") {
      citationsByDoi[w.doi] = w.citedByCount;
    }
  }

  return { author, citationsByDoi };
}
