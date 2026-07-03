import Link from "next/link";
import { Button, Card, CardContent, CardHeader, Badge, Separator, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@research-homepage/ui";
import { CopyButton } from "./components/CopyButton";
import {
  BookOpen,
  Briefcase,
  Mic,
  Database,
  Newspaper,
  Palette,
  Search,
  Globe,
  CheckCircle2,
  ArrowRight,
  Github,
  Mail,
  Users,
  Beaker,
  User,
  FileText,
  Code,
  BarChart3,
  Layout,
  Sparkles,
  Layers,
  Monitor,
  Smartphone
} from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://researchhomepage.com";

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Research Homepage",
      description: "Professional websites for research labs, individual researchers, and academic groups",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Research Homepage",
      url: siteUrl,
      contactPoint: {
        "@type": "ContactPoint",
        email: "james@dimonaco.co.uk",
        contactType: "customer service",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "Research Homepage",
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      description: "A platform for creating professional websites for research labs and researchers.",
      featureList: [
        "Research lab websites",
        "Individual researcher profiles",
        "Publication management with DOI auto-fill",
        "Team member pages",
        "Research project portfolios",
        "Dataset sharing",
        "Blog and news posts",
        "Dark and light themes",
        "SEO optimization",
      ],
    },
  ],
};

const features = [
  {
    icon: Users,
    title: "Lab & Team Pages",
    description: "Showcase your research lab, team members, and group structure with dedicated profile pages."
  },
  {
    icon: BookOpen,
    title: "Publications",
    description: "Display your lab or personal publications with DOI auto-fill, citations, and PDF downloads."
  },
  {
    icon: Briefcase,
    title: "Research Projects",
    description: "Present active and completed projects with funding details, collaborators, and outcomes."
  },
  {
    icon: Mic,
    title: "Talks & Conferences",
    description: "Display conference talks, keynotes, and presentations with embedded slides and videos."
  },
  {
    icon: Database,
    title: "Datasets",
    description: "Share your research datasets with licensing info, download links, and citation text."
  },
  {
    icon: Newspaper,
    title: "News & Blog",
    description: "Keep visitors informed with news posts about lab achievements and research breakthroughs."
  },
  {
    icon: Code,
    title: "Software & Tools",
    description: "Showcase software tools and packages developed by your lab with GitHub links."
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built with Next.js for excellent search engine visibility and fast page loads."
  },
];

const useCases = [
  {
    icon: Beaker,
    title: "Research Labs",
    description: "Perfect for research groups and laboratories",
    examples: [
      "Lab homepage with research themes",
      "Team member directory with profiles",
      "Group publications and citations",
      "Ongoing and completed projects",
      "Lab news and announcements",
      "Software tools developed by the group"
    ]
  },
  {
    icon: User,
    title: "Individual Researchers",
    description: "Ideal for professors, postdocs, and PhD students",
    examples: [
      "Personal academic profile",
      "CV and career timeline",
      "Publication list with metrics",
      "Conference talks and presentations",
      "Research interests and bio",
      "Contact and collaboration info"
    ]
  }
];

const examplePages = [
  {
    title: "Homepage",
    description: "Hero section, research overview, latest news, and featured publications",
    icon: Layout
  },
  {
    title: "Team / About",
    description: "Lab members with photos, roles, research interests, and contact links",
    icon: Users
  },
  {
    title: "Publications",
    description: "Filterable list with DOI links, abstracts, authors, and PDF downloads",
    icon: BookOpen
  },
  {
    title: "Projects",
    description: "Active research with funding info, collaborators, and related papers",
    icon: Briefcase
  },
  {
    title: "Datasets",
    description: "Shared data with licenses, citations, and download links",
    icon: Database
  },
  {
    title: "Blog / News",
    description: "Lab updates, research highlights, and announcements",
    icon: Newspaper
  }
];

const faqs = [
  {
    question: "What is Research Homepage?",
    answer: "Research Homepage is a platform that helps research labs, individual researchers, and academic groups create professional websites to showcase publications, projects, team members, datasets, and achievements. No coding required."
  },
  {
    question: "Can I create a website for my research lab?",
    answer: "Yes! Research Homepage is perfect for research labs and groups. You can showcase your team members, lab publications, ongoing projects, and research focus areas all in one professional website."
  },
  {
    question: "Do I need technical skills?",
    answer: "No, Research Homepage is designed for academics without technical backgrounds. Our CMS-driven platform lets you manage all your content through an easy-to-use interface."
  },
  {
    question: "What features are included?",
    answer: "Research Homepage includes team/lab member profiles, publication management with DOI auto-fill, research project portfolios, conference talk pages, dataset sharing, blog posts, customizable themes, and SEO optimization."
  },
  {
    question: "Can I use my own domain name?",
    answer: "Yes, we help you set up your own custom domain name like creeveylab.com or drsmith.ac.uk for a professional, branded URL."
  },
  {
    question: "How long does it take to set up?",
    answer: "We can have your lab or personal site ready within 24-48 hours. You just provide your content and we handle all the technical setup."
  },
];

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Research Homepage
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#examples" className="text-sm font-medium hover:text-primary transition-colors">
              Examples
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
            <Button asChild size="sm">
              <Link href="#contact">
                Get Started
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mb-4">
                For Research Labs & Academics
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Professional Websites for{" "}
                <span className="text-primary">Research Labs & Academics</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Create stunning websites for your research lab, academic group, or personal profile.
                Showcase publications, projects, team members, and more. No coding required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="#contact">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#examples">
                    <Layout className="mr-2 h-4 w-4" />
                    See Examples
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Use Cases Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">Who It&apos;s For</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for Labs and Researchers
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you&apos;re running a research lab or building your personal academic presence, we&apos;ve got you covered.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {useCases.map((useCase, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <useCase.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{useCase.title}</h3>
                      <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {useCase.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Example Pages Section */}
        <section id="examples" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">What You Get</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Every Page Your Lab Needs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A complete website with all the pages to showcase your research, team, and achievements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {examplePages.map((page, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <page.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{page.title}</h3>
                      <p className="text-sm text-muted-foreground">{page.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Visual Mockup Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">Preview</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                What Your Site Could Look Like
              </h2>
            </div>
            <div className="max-w-5xl mx-auto">
              {/* Mockup Browser Window */}
              <div className="rounded-xl border bg-background shadow-2xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background rounded px-3 py-1 text-sm text-muted-foreground border">
                      https://yourlab.edu
                    </div>
                  </div>
                </div>
                {/* Mockup Content */}
                <div className="p-8 space-y-8">
                  {/* Mock Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/20" />
                      <div className="font-bold text-lg">The Smith Lab</div>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <span>Home</span>
                      <span>Team</span>
                      <span>Publications</span>
                      <span>Projects</span>
                      <span>Contact</span>
                    </div>
                  </div>
                  {/* Mock Hero */}
                  <div className="grid md:grid-cols-2 gap-8 items-center py-8">
                    <div className="space-y-4">
                      <Badge>Computational Biology</Badge>
                      <h3 className="text-2xl font-bold">Understanding Complex Biological Systems</h3>
                      <p className="text-muted-foreground">Our lab develops computational methods to analyze large-scale biological data and uncover patterns in complex systems.</p>
                      <div className="flex gap-3">
                        <div className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">View Research</div>
                        <div className="px-4 py-2 border rounded text-sm">Meet the Team</div>
                      </div>
                    </div>
                    <div className="h-48 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Beaker className="h-16 w-16 text-primary/40" />
                    </div>
                  </div>
                  {/* Mock Stats */}
                  <div className="grid grid-cols-4 gap-4 py-4 border-y">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">Publications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">12</div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">8</div>
                      <div className="text-sm text-muted-foreground">Active Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">5</div>
                      <div className="text-sm text-muted-foreground">Open Datasets</div>
                    </div>
                  </div>
                  {/* Mock Team Preview */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Our Team</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="text-center">
                          <div className="w-16 h-16 mx-auto rounded-full bg-muted mb-2" />
                          <div className="text-sm font-medium">Dr. Team Member</div>
                          <div className="text-xs text-muted-foreground">Postdoc</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Device indicators */}
              <div className="flex justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Monitor className="h-4 w-4" />
                  <span>Desktop</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile Responsive</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything Your Lab or Profile Needs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for research labs and individual academics, with all the features you need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary mb-2" />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Tech Stack & Benefits */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="space-y-6">
                <Badge variant="outline">Why Choose Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Focus on Research, Not Web Development
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform handles all the technical details so your lab or team can focus on what matters most.
                </p>
                <ul className="space-y-3">
                  {[
                    "Professional lab or personal website",
                    "Easy content management with Sanity CMS",
                    "Team member profiles and pages",
                    "Mobile-responsive design",
                    "Fast, modern tech stack",
                    "SEO optimized for discoverability"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="p-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Modern Tech Stack</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Next.js 15",
                      "Sanity CMS",
                      "Tailwind CSS",
                      "TypeScript",
                      "Vercel Hosting",
                      "shadcn/ui"
                    ].map((tech, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">{tech}</Badge>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">Included with every site:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Dark & light mode themes
                      </li>
                      <li className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Built-in analytics
                      </li>
                      <li className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        Custom domain setup
                      </li>
                      <li className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        SSL certificate included
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">Pricing</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get your professional lab or personal website up and running without breaking the bank.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="border-primary">
                <CardHeader className="text-center">
                  <Badge className="w-fit mx-auto mb-2">Most Popular</Badge>
                  <h3 className="text-2xl font-bold">Research Pro</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Contact Us</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {[
                      "Custom domain setup",
                      "Sanity CMS access",
                      "All features included",
                      "Lab or individual site",
                      "SEO optimization",
                      "Analytics dashboard",
                      "Priority support",
                      "Regular updates",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="#contact">
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <Badge variant="outline">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Research Homepage
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <Separator />

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <Badge variant="outline">Get Started</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Lab Website?</h2>
              <p className="text-lg text-muted-foreground">
                Contact us to set up your professional lab or academic website. We&apos;ll handle the technical setup
                so you can focus on adding your content.
              </p>
              {/* Desktop: Show email directly */}
              <div className="hidden md:flex flex-col items-center gap-4 pt-4">
                <p className="text-muted-foreground">Get in touch:</p>
                <Card className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="text-lg font-medium select-all">james@dimonaco.co.uk</span>
                    <CopyButton text="james@dimonaco.co.uk" />
                  </div>
                </Card>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://github.com/jamesdimonaco/research-homepage" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Link>
                </Button>
              </div>
              {/* Mobile: Keep mailto button */}
              <div className="flex md:hidden flex-col gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="mailto:james@dimonaco.co.uk">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://github.com/jamesdimonaco/research-homepage" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Research Homepage. Built with Next.js and Sanity.</p>
        </div>
      </footer>
    </div>
    </>
  );
}
