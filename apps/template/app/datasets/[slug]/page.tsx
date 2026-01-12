import { sanityFetch } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { Badge, Button, Card, CardContent } from "@research-homepage/ui";
import type { Dataset } from "@research-homepage/cms";
import Link from "next/link";
import { Calendar, Download, ExternalLink, Database, FileText } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const datasets = await sanityFetch<{ slug: { current: string } }[]>({
    query: `*[_type == "dataset" && defined(slug.current)]{ slug }`,
  });

  return datasets?.map((dataset) => ({
    slug: dataset.slug.current,
  })) || [];
}

export default async function DatasetPage({ params }: Props) {
  const { slug } = await params;

  const dataset = await sanityFetch<Dataset>({
    query: `*[_type == "dataset" && slug.current == $slug][0]{
      ...,
      relatedProject->,
      relatedPublication->
    }`,
    params: { slug },
  });

  if (!dataset) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <article className="max-w-4xl mx-auto">
        {dataset.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlForImage(dataset.image) || ""}
              alt={dataset.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {dataset.dataType && <Badge>{dataset.dataType}</Badge>}
            {dataset.license && <Badge variant="secondary">{dataset.license}</Badge>}
            {dataset.accessType && <Badge variant="outline">{dataset.accessType}</Badge>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">{dataset.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {dataset.version && <span>Version: {dataset.version}</span>}
            {dataset.releaseDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Released: {new Date(dataset.releaseDate).toLocaleDateString()}</span>
              </div>
            )}
            {dataset.size?.fileSize && <span>Size: {dataset.size.fileSize}</span>}
            {dataset.size?.samples && <span>Samples: {dataset.size.samples}</span>}
          </div>

          {dataset.description && (
            <p className="text-lg text-muted-foreground">{dataset.description}</p>
          )}

          {dataset.longDescription && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={dataset.longDescription} />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {dataset.downloadUrl && (
              <Button asChild>
                <Link href={dataset.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Dataset
                </Link>
              </Button>
            )}
            {dataset.repositoryUrl && (
              <Button asChild variant="outline">
                <Link href={dataset.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Database className="w-4 h-4 mr-2" />
                  View Repository
                </Link>
              </Button>
            )}
            {dataset.doi && (
              <Button asChild variant="outline">
                <Link href={`https://doi.org/${dataset.doi}`} target="_blank" rel="noopener noreferrer">
                  DOI <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>

          {dataset.citationText && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Citation
                </h2>
                <p className="text-sm text-muted-foreground font-mono bg-muted p-4 rounded">
                  {dataset.citationText}
                </p>
              </CardContent>
            </Card>
          )}

          {dataset.tags && dataset.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dataset.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
