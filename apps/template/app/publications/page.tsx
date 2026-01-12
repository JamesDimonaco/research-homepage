import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { Card, CardContent, CardHeader, Badge } from "@research-homepage/ui";
import { PublicationImage } from "@research-homepage/components";
import type { Publication } from "@research-homepage/cms";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default async function PublicationsPage() {
  const publications = await sanityFetch<Publication[]>({
    query: `*[_type == "publication"] | order(year desc, publicationDate desc)`,
  });

  const statusLabels: Record<string, string> = {
    published: "Published",
    in_press: "In Press",
    accepted: "Accepted",
    under_review: "Under Review",
    preprint: "Preprint",
    submitted: "Submitted",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Publications</h1>

      <div className="space-y-6">
        {publications?.map((pub) => (
          <Card key={pub._id} className="hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {pub.image && (
                <div className="shrink-0">
                  <PublicationImage
                    src={urlForImage(pub.image) || ""}
                    alt={pub.title}
                    title={pub.title}
                  />
                </div>
              )}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-semibold">{pub.title}</h2>
                  <Badge variant={pub.status === "published" ? "default" : "secondary"}>
                    {pub.customStatus || (pub.status && statusLabels[pub.status]) || pub.status || "Unknown"}
                  </Badge>
                </div>
                {pub.authors && (
                  <p className="text-sm text-muted-foreground">{pub.authors}</p>
                )}
                {pub.journal && (
                  <p className="text-sm font-medium">
                    {pub.journal} {pub.year && `(${pub.year})`}
                  </p>
                )}
                {pub.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {pub.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {pub.doi && (
                    <Link
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      DOI <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                  {pub.pdfLink && (
                    <Link
                      href={pub.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      PDF <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {(!publications || publications.length === 0) && (
          <p className="text-muted-foreground text-center py-12">
            No publications yet. Add some in Sanity Studio.
          </p>
        )}
      </div>
    </div>
  );
}
