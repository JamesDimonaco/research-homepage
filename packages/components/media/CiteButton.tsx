"use client";

import { useState } from "react";
import { Button } from "@research-homepage/ui";
import { Quote, Check } from "lucide-react";
import { toBibTeX, type CitablePublication } from "./bibtex";

interface CiteButtonProps {
  publication: CitablePublication;
}

/**
 * Copies a BibTeX entry for the publication to the clipboard. Mirrors
 * ShareButton — one click, brief "Copied" confirmation, graceful when the
 * Clipboard API is unavailable (older browsers / insecure origins).
 */
export default function CiteButton({ publication }: CiteButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCite = async () => {
    const bibtex = toBibTeX(publication);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(bibtex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard blocked (permissions / insecure origin) — no-op rather
      // than throw; the button simply doesn't confirm.
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCite}
      aria-label="Copy BibTeX citation"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3 mr-1" />
          Copied
        </>
      ) : (
        <>
          <Quote className="w-3 h-3 mr-1" />
          Cite
        </>
      )}
    </Button>
  );
}
