import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <Link
        href="https://researchhomepage.com"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        Site by James Dimonaco
      </Link>
    </footer>
  );
}
