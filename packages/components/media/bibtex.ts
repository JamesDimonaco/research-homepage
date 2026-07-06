/**
 * BibTeX generation for a publication. Pure + dependency-free so it can run in
 * a client component. Values are escaped for LaTeX/BibTeX so a title with an
 * ampersand, underscore, or braces can't produce a broken entry.
 */

export interface CitablePublication {
  title: string;
  authors?: string;
  year?: number;
  journal?: string;
  doi?: string;
  status?: string;
}

/**
 * Escape the characters that are special in LaTeX/BibTeX field values. Single
 * pass with a replacer function so no substitution reprocesses another's output
 * (a multi-pass version double-escapes the braces it introduces for `\`).
 */
function esc(value: string): string {
  return value.replace(/[\\{}$&%#_~^]/g, (ch) => {
    switch (ch) {
      case "\\":
        return "\\textbackslash{}";
      case "~":
        return "\\textasciitilde{}";
      case "^":
        return "\\textasciicircum{}";
      default:
        return `\\${ch}`; // { } $ & % # _
    }
  });
}

/** "John Smith, Jane Doe" → "John Smith and Jane Doe" (BibTeX author form). */
function bibAuthors(authors: string): string {
  return authors
    .split(/\s*,\s*/)
    .map((a) => a.trim())
    .filter(Boolean)
    .map(esc)
    .join(" and ");
}

/** Deterministic cite key: firstauthorlastname + year, ascii-only. */
function citeKey(pub: CitablePublication): string {
  const firstAuthor = pub.authors?.split(/\s*,\s*/)[0]?.trim() ?? "";
  const surname =
    firstAuthor.split(/\s+/).pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ??
    "";
  const stem =
    surname ||
    pub.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 12) ||
    "ref";
  return `${stem}${pub.year ?? ""}` || "ref";
}

export function toBibTeX(pub: CitablePublication): string {
  const entryType = pub.status === "preprint" ? "misc" : "article";
  const fields: Array<[string, string]> = [];

  // Double braces protect title-case from BibTeX's lowercasing.
  fields.push(["title", `{${esc(pub.title)}}`]);
  if (pub.authors) fields.push(["author", bibAuthors(pub.authors)]);
  if (pub.year) fields.push(["year", String(pub.year)]);
  if (pub.journal) {
    fields.push([
      entryType === "misc" ? "howpublished" : "journal",
      esc(pub.journal),
    ]);
  }
  if (pub.doi) {
    const doi = pub.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
    fields.push(["doi", esc(doi)]);
    fields.push(["url", `https://doi.org/${esc(doi)}`]);
  }

  const body = fields.map(([k, v]) => `  ${k} = {${v}},`).join("\n");
  return `@${entryType}{${citeKey(pub)},\n${body}\n}`;
}
