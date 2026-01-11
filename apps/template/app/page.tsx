import Link from "next/link";
import { Button, Card, CardContent, CardHeader, Badge, Separator } from "@research-homepage/ui";
import {
  BookOpen,
  Briefcase,
  FileText,
  Mic,
  Database,
  Newspaper,
  Palette,
  Search,
  BarChart3,
  Globe,
  CheckCircle2,
  ArrowRight,
  Github,
  Mail
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Blog & Publications",
    description: "Showcase your research publications, preprints, and blog posts with DOI auto-fill and rich content editing."
  },
  {
    icon: Briefcase,
    title: "Research Projects",
    description: "Present your research projects with funding details, collaborators, and links to related publications."
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
    title: "News & Updates",
    description: "Keep visitors informed with news posts about your latest research achievements."
  },
  {
    icon: Palette,
    title: "Customizable Themes",
    description: "Dark and light mode with customizable colors to match your personal brand."
  },
  {
    icon: Search,
    title: "SEO Optimized",
    description: "Built with Next.js for excellent search engine visibility and fast page loads."
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description: "Integrated with Vercel Analytics to track your website's performance."
  },
];

const benefits = [
  "Professional academic presence online",
  "Easy content management with Sanity CMS",
  "Mobile-responsive design",
  "Fast, modern tech stack",
  "Automatic sitemap generation",
  "Social media sharing optimized",
];

export default function HomePage() {
  return (
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
            <Link href="#demo" className="text-sm font-medium hover:text-primary transition-colors">
              Demo
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
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
                Built for Researchers
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Professional Academic Website,{" "}
                <span className="text-primary">Made Simple</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Showcase your research, publications, and academic achievements with a beautiful,
                CMS-driven website. No coding required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="#contact">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="https://nicholas.dimonaco.co.uk" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    View Live Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Everything You Need to Showcase Your Research
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for academics and researchers, with all the features you need to present your work professionally.
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

        {/* Benefits Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Focus on Your Research, Not Your Website
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform handles all the technical details so you can spend your time on what matters most - your research.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="p-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Tech Stack</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Next.js 15</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Sanity CMS</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Tailwind CSS</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">TypeScript</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Vercel</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">shadcn/ui</Badge>
                    </div>
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
              <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get your professional academic website up and running without breaking the bank.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="border-primary">
                <CardHeader className="text-center">
                  <Badge className="w-fit mx-auto mb-2">Most Popular</Badge>
                  <h3 className="text-2xl font-bold">Researcher Pro</h3>
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

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground">
                Contact us to set up your professional academic website. We&apos;ll handle the technical setup
                so you can focus on adding your content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="mailto:contact@example.com">
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
          <p>© {new Date().getFullYear()} Research Homepage. Built with Next.js and Sanity.</p>
        </div>
      </footer>
    </div>
  );
}
