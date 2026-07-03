/**
 * Security helpers for rendering CMS/imported data.
 */

// Characters that must be escaped when embedding JSON inside a <script> element:
// `<` `>` `&` and the U+2028 / U+2029 line separators. Written as \u escapes
// (never literal) because U+2028/U+2029 are JS line terminators and would break
// the source if pasted raw.
const JSONLD_UNSAFE = /[<>&\u2028\u2029]/g;

/**
 * Serialise an object for embedding inside an inline `<script>` tag
 * (e.g. JSON-LD via dangerouslySetInnerHTML).
 *
 * `JSON.stringify` does NOT escape `<`, `>`, `&`, or the U+2028/U+2029 line
 * separators, so a CMS/imported value containing `</script>` would break out
 * of the script element and execute as HTML (stored XSS). Escaping these to
 * their `\uXXXX` forms keeps the JSON valid while making script break-out
 * impossible.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    JSONLD_UNSAFE,
    (ch) => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}

/**
 * Return a URL only if it uses a safe scheme, otherwise `undefined`.
 * Blocks `javascript:`, `data:`, `vbscript:` etc. from reaching an href.
 * Allows http(s), mailto, tel, and protocol-relative/relative URLs.
 */
export function safeUrl(url: unknown): string | undefined {
  if (typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Relative / anchor / query URLs have no scheme to abuse.
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("?")
  ) {
    return trimmed;
  }

  // No scheme prefix at all → treat as relative → safe.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const allowed = ["http:", "https:", "mailto:", "tel:"];
    return allowed.includes(parsed.protocol) ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

/** Strip HTML tags and angle brackets from a plain-text field (defence in depth). */
export function stripUnsafeChars(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();
  return cleaned || undefined;
}
