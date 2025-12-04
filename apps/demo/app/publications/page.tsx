import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import Link from "next/link";
import { Publication, ContactInfo } from "../types/sanity";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Users, ExternalLink, Download } from "lucide-react";
import { PublicationImage } from "../components/PublicationImage";

const publicationsQuery = `*[_type == "publication"] | order(featured desc, year desc, publicationDate desc)`;
const contactQuery = `*[_type == "contactInfo"][0]`;

export default async function Publications() {
  const [publications, contactInfo] = await Promise.all([
    sanityFetch<Publication[]>({ query: publicationsQuery }),
    sanityFetch<ContactInfo>({ query: contactQuery })
  ]);

  const getStatusBadge = (publication: Publication) => {
    if (!publication.status) return null;
    
    const displayStatus = publication.status === "other" 
      ? publication.customStatus || "Other" 
      : publication.status;
    
    const statusColors = {
      published: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      in_press: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      accepted: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
      under_review: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      preprint: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      submitted: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
      other: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
    };

    return (
      <Badge 
        variant="outline" 
        className={statusColors[publication.status] || statusColors.other}
      >
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1).replace(/_/g, " ")}
      </Badge>
    );
  };

  const getPrimaryLink = (publication: Publication) => {
    if (publication.pdfLink) return { href: publication.pdfLink, text: "Download PDF", icon: Download };
    if (publication.preprintLink) return { href: publication.preprintLink, text: "View Preprint", icon: FileText };
    if (publication.googleScholarLink) return { href: publication.googleScholarLink, text: "Google Scholar", icon: ExternalLink };
    return null;
  };

  const getDefaultButtonText = (publication: Publication) => {
    if (publication.linkButtonText) return publication.linkButtonText;
    if (publication.status === "preprint") return "Read Preprint";
    if (publication.status === "published") return "Read Paper";
    return "View Details";
  };

  return (
    <main className="bg-background py-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Publications
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          This is a selection of publications. For a complete list, please see my {contactInfo?.googleScholar ? (
            <Link href={contactInfo.googleScholar} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
              Google Scholar
            </Link>
          ) : (
            "Google Scholar"
          )} profile.
        </p>
        <div className="grid grid-cols-1 gap-8">
          {publications.map((publication) => {
            const image = publication.image
              ? urlForImage(publication.image)
              : null;
            const primaryLink = getPrimaryLink(publication);
            
            return (
              <Card key={publication._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <CardTitle className="text-2xl">
                          {publication.title}
                        </CardTitle>
                        {publication.featured && (
                          <Badge variant="secondary">Featured</Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(publication)}
                          {publication.journal && (
                            <span className="text-sm text-muted-foreground">
                              {publication.journal}
                            </span>
                          )}
                          {publication.year && (
                            <Badge variant="outline" className="text-xs">
                              {publication.year}
                            </Badge>
                          )}
                        </div>
                        {publication.publicationDate && (
                          <CardDescription className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 h-3" />
                            Published {new Date(publication.publicationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </CardDescription>
                        )}
                        {publication.authors && (
                          <CardDescription className="flex items-start gap-2 text-sm">
                            <Users className="h-3 h-3 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{publication.authors}</span>
                          </CardDescription>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {publication.description && (
                        <p className="text-muted-foreground line-clamp-4 mb-4">
                          {publication.description}
                        </p>
                      )}
                      {publication.doi && (
                        <p className="text-sm text-muted-foreground">
                          DOI: <span className="font-mono">{publication.doi}</span>
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      {primaryLink && (
                        <Button asChild variant="default">
                          <Link
                            href={primaryLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <primaryLink.icon className="w-4 h-4 mr-2" />
                            {getDefaultButtonText(publication)}
                          </Link>
                        </Button>
                      )}
                      {publication.pdfLink && primaryLink?.href !== publication.pdfLink && (
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={publication.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            PDF
                          </Link>
                        </Button>
                      )}
                      {publication.preprintLink && primaryLink?.href !== publication.preprintLink && (
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={publication.preprintLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            Preprint
                          </Link>
                        </Button>
                      )}
                      {publication.googleScholarLink && primaryLink?.href !== publication.googleScholarLink && (
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={publication.googleScholarLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Scholar
                          </Link>
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                  {image && (
                    <div className="md:w-[300px] p-6">
                      <PublicationImage
                        src={image}
                        alt={publication.title}
                        title={publication.title}
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
