import { cn } from "@research-homepage/ui";
import type { AuthorProfile } from "@research-homepage/cms";

interface ScholarStatsProps {
  author?: AuthorProfile | null;
  className?: string;
  /**
   * Show the total-works count. Off on the publications page, where a curated
   * subset sits under an explicit "this is a selection" caption and an OpenAlex
   * total would contradict the visible cards.
   */
  showWorks?: boolean;
}

const fmt = (n?: number): string | null =>
  typeof n === "number" ? n.toLocaleString("en-US") : null;

/**
 * Compact scholarly-metrics strip (citations / h-index / i10 / publications),
 * fed from the OpenAlex author record. Renders nothing when there's no data,
 * so it's safe to drop into any page unconditionally.
 */
export default function ScholarStats({
  author,
  className,
  showWorks = true,
}: ScholarStatsProps) {
  if (!author) return null;

  const stats = [
    { label: "Citations", value: fmt(author.citedByCount) },
    { label: "h-index", value: fmt(author.hIndex) },
    { label: "i10-index", value: fmt(author.i10Index) },
    ...(showWorks
      ? [{ label: "Publications", value: fmt(author.worksCount) }]
      : []),
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
      <p className="text-xs text-muted-foreground">Source: OpenAlex</p>
    </div>
  );
}
