import Link from "next/link";
import { Badge, Button, Separator } from "@research-homepage/ui";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { InquiryForm } from "./components/InquiryForm";

const EXAMPLE_URL = "https://nicholas.dimonaco.co.uk";
const PORTFOLIO_URL = "https://james.dimonaco.co.uk";

const included: Array<{ term: string; detail: string }> = [
  {
    term: "Publications",
    detail:
      "Imported from your ORCID record, enriched via DOI — journal, year, links, preprint status. You never retype a citation.",
  },
  {
    term: "Projects & funding",
    detail:
      "Present research projects with funders, grant numbers, collaborators, and linked publications.",
  },
  {
    term: "Talks & conferences",
    detail: "Keynotes and talks with embedded slides and recorded video.",
  },
  {
    term: "Datasets & tools",
    detail:
      "Datasets with DOIs, licences and access terms; software with links to source.",
  },
  {
    term: "Blog & news",
    detail:
      "Long-form writing and announcements, with a proper editor — no fighting a wiki.",
  },
  {
    term: "Your own domain",
    detail:
      "yourname.org, yourlab.org — your address, your content. Exportable at any time. No lock-in.",
  },
  {
    term: "Findability",
    detail:
      "Structured data (schema.org Person & ScholarlyArticle) so search engines understand who you are and what you've published.",
  },
  {
    term: "Simple editing",
    detail:
      "A clean editing studio at /studio. If you can fill in a form, you can update your site.",
  },
  {
    term: "Dark mode & mobile",
    detail:
      "Looks right on a phone in a conference queue and a 4K monitor in the lab.",
  },
  {
    term: "A human",
    detail:
      "Set up by hand, by the person who built the platform. Questions get answered by someone who knows your site.",
  },
];

const steps = [
  {
    n: "01",
    title: "Send your ORCID iD",
    body: "That's the whole intake form. Your publication record is imported automatically and a complete draft site is assembled from it.",
  },
  {
    n: "02",
    title: "Review your draft",
    body: "Within 48 hours¹ you get a link to a finished site — bio, publications, projects. Change anything yourself in the editing studio, or tell us and we'll do it.",
  },
  {
    n: "03",
    title: "Publish on your domain",
    body: "Your site goes live on your own domain. From then on you edit content whenever you like — changes appear within minutes, no deploys, no tickets.",
  },
];

function SectionHeading({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-serif text-sm italic text-accent">{index}</span>
        <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
      </div>
      {children ? (
        <p className="text-muted-foreground md:text-lg">{children}</p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Masthead */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-serif text-xl tracking-tight">
            Research<span className="italic text-accent"> Homepage</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <Link href="#method" className="nav-link text-sm font-medium">
              Method
            </Link>
            <Link
              href={EXAMPLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-sm font-medium"
            >
              Example
            </Link>
            <Link href="#pricing" className="nav-link text-sm font-medium">
              Pricing
            </Link>
            <Button asChild size="sm">
              <Link href="#contact">Request your site</Link>
            </Button>
          </nav>
          <Button asChild size="sm" className="md:hidden">
            <Link href="#contact">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Title block, set like a paper ─────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="paper-rules pointer-events-none absolute inset-0" />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl">
              <p className="reveal reveal-1 mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                A concierge website service for researchers &amp; labs
              </p>

              <h1 className="reveal reveal-2 font-serif text-4xl leading-[1.1] tracking-tight md:text-6xl">
                A <span className="highlight">proper home</span> for your
                research on the web.
              </h1>

              {/* Author line */}
              <p className="reveal reveal-3 mt-6 text-sm text-muted-foreground">
                James Dimonaco<sup className="text-accent">1</sup>, Nicholas
                Dimonaco<sup className="text-accent">2</sup>
                <span className="mx-3 opacity-40">·</span>
                <span className="italic">
                  <sup className="text-accent">1</sup>Developer&nbsp;&nbsp;
                  <sup className="text-accent">2</sup>Scientific advisor, PhD
                </span>
              </p>

              {/* Abstract */}
              <div className="reveal reveal-4 mt-10 border-l-2 border-accent/60 pl-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Abstract
                </p>
                <p className="font-serif text-lg italic leading-relaxed text-foreground/90 md:text-xl">
                  Most researchers are represented online by a faculty
                  directory entry and a stale publications list. We build
                  personal and lab websites, by hand: send your ORCID iD and
                  within 48 hours¹ you review a complete site — publications,
                  projects, talks, datasets — live on your own domain. You edit
                  everything afterwards, without code. We remain a human on the
                  other end.
                </p>
              </div>

              <div className="reveal reveal-5 mt-10 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild className="group">
                  <Link href="#contact">
                    Request your site
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="group">
                  <Link
                    href={EXAMPLE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read the live example
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── 1. Method ─────────────────────────────────────────────── */}
        <section id="method" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading index="§1" title="Method">
              Three steps. One of them is yours.
            </SectionHeading>

            <div className="grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="group bg-background p-8 transition-colors hover:bg-muted/40"
                >
                  <span className="font-serif text-4xl italic text-accent/70 transition-colors group-hover:text-accent">
                    {step.n}
                  </span>
                  <h3 className="mb-3 mt-4 font-serif text-xl">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* ── 2. What's included ────────────────────────────────────── */}
        <section className="bg-muted/30 py-20 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading index="§2" title="What your site includes">
              Everything below ships with every site. No tiers of features, no
              &ldquo;available on the Pro plan&rdquo;.
            </SectionHeading>

            <dl className="grid gap-x-16 md:grid-cols-2">
              {included.map((item) => (
                <div
                  key={item.term}
                  className="border-b border-border/70 py-5 first:border-t md:[&:nth-child(2)]:border-t"
                >
                  <dt className="mb-1 font-medium">{item.term}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <Separator />

        {/* ── 3. Results ────────────────────────────────────────────── */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading index="§3" title="Results">
              One site live; founding places open for the next.
            </SectionHeading>

            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Typographic browser mock */}
              <Link
                href={EXAMPLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="overflow-hidden rounded-lg border shadow-sm transition-shadow group-hover:shadow-md">
                  <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="ml-3 rounded bg-background px-3 py-0.5 text-xs text-muted-foreground">
                      nicholas.dimonaco.co.uk
                    </span>
                  </div>
                  <div className="space-y-4 p-8">
                    <p className="font-serif text-2xl">Dr. Nicholas Dimonaco</p>
                    <p className="text-sm text-muted-foreground">
                      Computational biologist — microbial genomics,
                      metagenomics, and the software between them.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="secondary">Publications</Badge>
                      <Badge variant="secondary">Projects</Badge>
                      <Badge variant="secondary">Talks</Badge>
                      <Badge variant="secondary">Datasets</Badge>
                      <Badge variant="secondary">Tools</Badge>
                    </div>
                    <p className="pt-2 text-xs text-accent">
                      Visit the live site{" "}
                      <ArrowUpRight className="inline h-3 w-3" />
                    </p>
                  </div>
                </div>
              </Link>

              {/* Citation-style testimonial — PLACEHOLDER: get a real quote from Nick */}
              <figure className="space-y-4">
                <blockquote className="font-serif text-xl italic leading-relaxed md:text-2xl">
                  &ldquo;It does what my university profile never did — it
                  actually looks like my research, and I can update it myself
                  in two minutes.&rdquo;
                </blockquote>
                <figcaption className="text-sm text-muted-foreground">
                  — Dimonaco, N. (2026).{" "}
                  <span className="italic">Personal communication.</span>{" "}
                  Computational biologist.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── 4. Availability & pricing ─────────────────────────────── */}
        <section id="pricing" className="bg-muted/30 py-20 md:py-24">
          <div className="container mx-auto px-4">
            <SectionHeading index="§4" title="Availability & pricing" />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border-2 border-accent/50 bg-background p-8">
                <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
                  Founding researchers
                </Badge>
                <p className="font-serif text-4xl">
                  Free
                  <span className="ml-2 text-base italic text-muted-foreground">
                    for the first five
                  </span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Full setup, all features, your own domain — in exchange for
                  honest feedback and permission to cite your site as an
                  example. Thereafter a flat yearly fee that costs less than
                  one conference dinner.
                </p>
                <Button className="mt-6 w-full" size="lg" asChild>
                  <Link href="#contact">Claim a founding place</Link>
                </Button>
              </div>

              <div className="rounded-lg border bg-background p-8">
                <Badge variant="secondary" className="mb-4">
                  Labs &amp; groups
                </Badge>
                <p className="font-serif text-4xl">
                  Let&rsquo;s talk
                  <span className="ml-2 text-base italic text-muted-foreground">
                    one site, whole group
                  </span>
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  A lab site with members, joint publications, project pages
                  and news — one place to point the grant reviewers at. Tell us
                  the shape of your group and we&rsquo;ll propose something
                  sensible.
                </p>
                <Button
                  className="mt-6 w-full"
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <Link href="#contact">Start the conversation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ── 5. Correspondence ─────────────────────────────────────── */}
        <section id="contact" className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <SectionHeading index="§5" title="Correspondence">
                Send your details and we&rsquo;ll reply within a day — usually
                with a draft site not long after.
              </SectionHeading>
              <InquiryForm />
            </div>
          </div>
        </section>

        {/* Footnotes */}
        <div className="container mx-auto px-4 pb-12">
          <div className="mx-auto max-w-2xl border-t pt-4">
            <p className="text-xs italic text-muted-foreground">
              ¹ Typically. A six-person lab site with fifteen years of
              publications may take a few days. We&rsquo;ll tell you which
              before we start.
            </p>
          </div>
        </div>
      </main>

      {/* Footer — the consulting loop */}
      <footer className="border-t py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} Research Homepage — built by{" "}
            <Link
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-accent/60 underline-offset-4 transition-colors hover:text-foreground"
            >
              James Dimonaco
            </Link>
          </p>
          <Link
            href="https://github.com/jamesdimonaco/research-homepage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            Open source
          </Link>
        </div>
      </footer>
    </div>
  );
}
