import { cn } from "@research-homepage/ui";
import type { AuthorProfile } from "@research-homepage/cms";

export interface ScholarMetricOverrides {
  citations?: number;
  hIndex?: number;
  i10Index?: number;
  publications?: number;
}

interface ScholarStatsProps {
  author?: AuthorProfile | null;
  /**
   * Manual values from the CMS that take precedence over the live OpenAlex
   * figures — lets the researcher pin exact numbers (e.g. from Google Scholar).
   */
  overrides?: ScholarMetricOverrides;
  /**
   * Deduped publication count (typically from ORCID), used for the Publications
   * stat when there's no manual override. Falls back to OpenAlex's raw
   * works_count only if this is absent.
   */
  publicationsCount?: number | null;
  /** Label under the strip. Defaults to "OpenAlex" when null/blank. */
  sourceLabel?: string | null;
  className?: string;
  /**
   * Show the total-works count. Off on the publications page, where a curated
   * subset sits under an explicit "this is a selection" caption and a total
   * would contradict the visible cards.
   */
  showWorks?: boolean;
}

const fmt = (n?: number | null): string | null =>
  typeof n === "number" ? n.toLocaleString("en-US") : null;

/** First defined number in precedence order. */
const pick = (...vals: (number | null | undefined)[]): number | undefined =>
  vals.find((v): v is number => typeof v === "number");

/**
 * Compact scholarly-metrics strip (citations / h-index / i10 / publications).
 * Citations/h-index/i10 come from the OpenAlex author record unless overridden
 * in the CMS; the publications count prefers the deduped ORCID figure. Renders
 * nothing when there's no data, so it's safe to drop into any page.
 */
export default function ScholarStats({
  author,
  overrides,
  publicationsCount,
  sourceLabel,
  className,
  showWorks = true,
}: ScholarStatsProps) {
  const citations = pick(overrides?.citations, author?.citedByCount);
  const hIndex = pick(overrides?.hIndex, author?.hIndex);
  const i10Index = pick(overrides?.i10Index, author?.i10Index);
  const publications = pick(
    overrides?.publications,
    publicationsCount,
    author?.worksCount,
  );

  const stats = [
    { label: "Citations", value: fmt(citations) },
    { label: "h-index", value: fmt(hIndex) },
    { label: "i10-index", value: fmt(i10Index) },
    ...(showWorks ? [{ label: "Publications", value: fmt(publications) }] : []),
  ].filter((s): s is { label: string; value: string } => s.value !== null);

  if (!stats.length) return null;

  return (
    <div className={cn("space-y-1", className)}>
      <dl className="flex flex-wrap gap-x-8 gap-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </dt>
            <dd className="text-2xl font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">
        Source: {sourceLabel || "OpenAlex"}
      </p>
    </div>
  );
}
