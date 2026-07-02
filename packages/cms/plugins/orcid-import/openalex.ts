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
  /** True once we detect this DOI already exists in the dataset. */
  alreadyExists?: boolean;
}

const OPENALEX = "https://api.openalex.org/works";
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

function mapWork(work: any): MappedWork | null {
  const title: string | undefined = work?.title ?? work?.display_name;
  if (!title) return null;

  const doi = normaliseDoi(work?.doi);
  const authors: string | undefined = Array.isArray(work?.authorships)
    ? work.authorships
        .map((a: any) => a?.author?.display_name)
        .filter(Boolean)
        .join(", ") || undefined
    : undefined;

  const oa = work?.best_oa_location ?? work?.open_access;
  const oaUrl: string | undefined =
    work?.best_oa_location?.pdf_url ??
    work?.open_access?.oa_url ??
    work?.primary_location?.pdf_url ??
    undefined;

  const status = deriveStatus(work);

  return {
    key: doi ?? String(work?.id ?? title),
    title,
    doi,
    year: typeof work?.publication_year === "number" ? work.publication_year : undefined,
    publicationDate: work?.publication_date || undefined,
    journal: work?.primary_location?.source?.display_name || undefined,
    authors,
    description: abstractFromInverted(work?.abstract_inverted_index),
    status,
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
  opts: { mailto?: string; maxPages?: number } = {},
): Promise<FetchResult> {
  const { mailto = "james@dimonaco.co.uk", maxPages = 6 } = opts;
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

    const res = await fetch(url);
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
