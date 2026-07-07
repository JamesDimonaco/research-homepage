/**
 * ORCID public-API helpers.
 *
 * OpenAlex is a citation *index*: it ingests every preprint as its own record,
 * plus datasets, and even works the researcher only peer-reviewed — so its
 * author `works_count` badly overstates the real publication list (49 vs ~18
 * for a typical early-career researcher).
 *
 * ORCID, by contrast, is an author-*curated registry*. Its `/works` endpoint
 * returns works already **grouped** — the preprint and published versions of
 * the same paper collapse into one group — and it only holds what the author
 * (or a trusted publisher integration) actually put on their record. That makes
 * it the honest source for a "Publications" count.
 *
 * ORCID has no citation data, so author-level metrics (h-index, i10, total
 * citations) still come from OpenAlex — see ./openalex.
 */

import {
  fetchWorksByDois,
  normaliseDoi,
  type MappedWork,
  type FetchResult,
} from "./openalex";

const ORCID_PUB_API = "https://pub.orcid.org/v3.0";

/**
 * ORCID work types that aren't scholarly publications. Everything not on this
 * list is counted, so new/rare publication types (book-chapter, conference-
 * paper, etc.) are included by default rather than silently dropped.
 */
const NON_PUBLICATION_TYPES = new Set([
  "data-set",
  "other",
  "funding",
  "patent",
  "invention",
  "license",
  "physical-object",
  "artistic-performance",
  "lecture-speech",
  "spin-off-company",
  "research-tool",
  "research-technique",
  "technical-standard",
  "standards-and-policy",
  "registered-copyright",
  "disclosure",
  "website",
  "online-resource",
  "trademark",
  "test",
]);

function clean(value?: string | null): string | undefined {
  if (typeof value !== "string") return undefined;
  const out = value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
  return out || undefined;
}

function num(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return typeof n === "number" && Number.isFinite(n) ? n : undefined;
}

/** Build an ISO date from ORCID's split publication-date, padding missing parts. */
function orcidDate(pd: any): string | undefined {
  const y = num(pd?.year?.value);
  if (!y) return undefined;
  const m = num(pd?.month?.value) ?? 1;
  const d = num(pd?.day?.value) ?? 1;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function orcidInit(revalidate?: number): RequestInit {
  const init: RequestInit & { next?: { revalidate: number } } = {
    headers: { Accept: "application/json" },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  };
  if (typeof revalidate === "number") init.next = { revalidate };
  return init;
}

/**
 * Count a researcher's distinct publications from their ORCID record.
 *
 * Returns the number of ORCID work *groups* (preprint + published versions of
 * one paper count once), excluding non-publication types like datasets. Returns
 * null on any failure so callers can fall back to OpenAlex or a manual value
 * without breaking the page.
 */
export async function fetchPublicationCountByOrcid(
  orcidId: string,
  opts: { revalidate?: number } = {},
): Promise<number | null> {
  try {
    const res = await fetch(
      `${ORCID_PUB_API}/${orcidId}/works`,
      orcidInit(opts.revalidate),
    );
    if (!res.ok) return null;

    const json: any = await res.json();
    const groups: any[] = Array.isArray(json?.group) ? json.group : [];
    if (!groups.length) return null;

    let count = 0;
    for (const g of groups) {
      const type: string | undefined = g?.["work-summary"]?.[0]?.type;
      if (type && NON_PUBLICATION_TYPES.has(type)) continue;
      count += 1;
    }
    return count;
  } catch {
    return null;
  }
}

/** One publication as ORCID sees it, before OpenAlex enrichment. */
interface OrcidBaseWork extends MappedWork {}

function mapOrcidGroup(group: any): OrcidBaseWork | null {
  const summary = group?.["work-summary"]?.[0];
  const type: string | undefined = summary?.type;
  if (!type || NON_PUBLICATION_TYPES.has(type)) return null;

  const title = clean(summary?.title?.title?.value);
  if (!title) return null;

  const ids: any[] = group?.["external-ids"]?.["external-id"] ?? [];
  const doi = normaliseDoi(
    ids.find((i) => i?.["external-id-type"] === "doi")?.["external-id-value"],
  );

  return {
    // Dedup key: DOI when present, else the ORCID put-code (unique per record).
    key: doi ?? `orcid:${summary?.["put-code"] ?? title}`,
    title,
    doi,
    year: num(summary?.["publication-date"]?.year?.value),
    publicationDate: orcidDate(summary?.["publication-date"]),
    journal: clean(summary?.["journal-title"]?.value),
    status: type === "preprint" ? "preprint" : "published",
  };
}

/**
 * The importer's source of truth: the researcher's ORCID works — already
 * deduped (preprint + published collapse to one) and free of datasets, peer
 * reviews and supplementary files — enriched with OpenAlex content (authors,
 * abstract, citation count, open-access links) joined by DOI.
 *
 * This replaces importing straight from OpenAlex, whose raw list conflates all
 * of the above (≈50 records) with the real publication list (≈18).
 */
export async function fetchWorksFromOrcid(
  orcidId: string,
  opts: { mailto?: string; revalidate?: number } = {},
): Promise<FetchResult> {
  const res = await fetch(
    `${ORCID_PUB_API}/${orcidId}/works`,
    orcidInit(opts.revalidate),
  );
  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? "No ORCID record found for that iD."
        : `ORCID request failed (${res.status}).`,
    );
  }

  const json: any = await res.json();
  const groups: any[] = Array.isArray(json?.group) ? json.group : [];

  const base: OrcidBaseWork[] = [];
  const seen = new Set<string>();
  for (const g of groups) {
    const mapped = mapOrcidGroup(g);
    if (!mapped || seen.has(mapped.key)) continue;
    seen.add(mapped.key);
    base.push(mapped);
  }

  // Enrich by DOI. Best-effort — if OpenAlex is unavailable we still return the
  // ORCID basics (title, venue, year, status, DOI).
  const enriched = await fetchWorksByDois(
    base.map((b) => b.doi),
    opts,
  ).catch(() => new Map<string, MappedWork>());

  const works: MappedWork[] = base.map((b) => {
    const e = b.doi ? enriched.get(b.doi) : undefined;
    if (!e) return b;
    return {
      ...b,
      // ORCID owns the curated fields (title, venue, status); OpenAlex fills the
      // content ORCID lacks.
      journal: b.journal ?? e.journal,
      authors: e.authors,
      description: e.description,
      // Carry whichever OA link OpenAlex resolved; ORCID's own status decides
      // how it's presented downstream.
      preprintLink: e.preprintLink ?? (b.status === "preprint" ? e.pdfLink : undefined),
      pdfLink: e.pdfLink ?? (b.status === "published" ? e.preprintLink : undefined),
      citedByCount: e.citedByCount,
    };
  });

  return { works, total: works.length };
}
