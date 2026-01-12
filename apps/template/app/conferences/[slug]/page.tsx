import { sanityFetch } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { Badge, Button } from "@research-homepage/ui";
import type { Conference } from "@research-homepage/cms";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Download, PlayCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const conferences = await sanityFetch<{ slug: { current: string } }[]>({
    query: `*[_type == "conference" && defined(slug.current)]{ slug }`,
  });

  return conferences?.map((conf) => ({
    slug: conf.slug.current,
  })) || [];
}

export default async function ConferencePage({ params }: Props) {
  const { slug } = await params;

  const conference = await sanityFetch<Conference>({
    query: `*[_type == "conference" && slug.current == $slug][0]{
      ...,
      relatedPublication->
    }`,
    params: { slug },
  });

  if (!conference) {
    notFound();
  }

  const typeLabels: Record<string, string> = {
    keynote: "Keynote",
    invited: "Invited Talk",
    conference: "Conference",
    workshop: "Workshop",
    poster: "Poster",
    panel: "Panel",
    seminar: "Seminar",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <article className="max-w-4xl mx-auto">
        {conference.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlForImage(conference.image) || ""}
              alt={conference.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {conference.type && (
              <Badge>{typeLabels[conference.type] || conference.type}</Badge>
            )}
            {conference.featured && <Badge variant="secondary">Featured</Badge>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">{conference.title}</h1>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium">{conference.conference}</span>
            </div>
            {conference.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(conference.date).toLocaleDateString()}</span>
              </div>
            )}
            {conference.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{conference.location}</span>
              </div>
            )}
          </div>

          {conference.abstract && (
            <p className="text-lg text-muted-foreground">{conference.abstract}</p>
          )}

          {conference.description && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={conference.description} />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {conference.slides?.downloadUrl && (
              <Button asChild variant="outline">
                <Link href={conference.slides.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Slides
                </Link>
              </Button>
            )}
            {conference.video?.embedUrl && (
              <Button asChild variant="outline">
                <Link href={conference.video.embedUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Watch Video
                </Link>
              </Button>
            )}
          </div>

          {conference.coAuthors && conference.coAuthors.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Co-Authors</h2>
              <p className="text-muted-foreground">{conference.coAuthors.join(", ")}</p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
