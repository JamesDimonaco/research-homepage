import { sanityFetch } from "@/sanity/lib/client";
import { Conference } from "../../types/sanity";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Calendar, 
  MapPin, 
  Video, 
  FileText, 
  ExternalLink, 
  Download,
  Presentation,
  Users,
  ArrowLeft
} from "lucide-react";
import { PortableText } from "@portabletext/react";

const conferenceQuery = `*[_type == "conference" && slug.current == $slug][0] {
  ...,
  "relatedPublication": relatedPublication->{
    _id,
    title,
    publicationDate,
    googleScholarLink
  }
}`;

export async function generateStaticParams() {
  const conferences = await sanityFetch<Conference[]>({
    query: `*[_type == "conference"] { slug }`,
  });
  
  return conferences.map((conference) => ({
    slug: conference.slug.current,
  }));
}

export default async function ConferencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conference = await sanityFetch<Conference>({
    query: conferenceQuery,
    params: { slug },
  });

  if (!conference) {
    notFound();
  }

  const imageUrl = conference.image ? urlForImage(conference.image) : null;
  
  const typeColors = {
    keynote: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    invited: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    conference: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    workshop: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    poster: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
    panel: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    seminar: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  };

  const typeIcons = {
    keynote: "🎯",
    invited: "💌",
    conference: "🎤",
    workshop: "🛠️",
    poster: "📊",
    panel: "👥",
    seminar: "📚",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric",
      year: "numeric" 
    });
  };

  const getVideoEmbedUrl = (url: string, platform?: string) => {
    if (!url) return null;
    
    // YouTube URL conversion
    if (platform === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") 
        ? url.split("/").pop() 
        : url.split("v=")[1]?.split("&")[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    
    // Vimeo URL conversion
    if (platform === "vimeo" || url.includes("vimeo.com")) {
      const videoId = url.split("/").pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    
    return url;
  };

  const videoEmbedUrl = conference.video?.embedUrl 
    ? getVideoEmbedUrl(conference.video.embedUrl, conference.video.platform) 
    : null;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <Link href="/conferences">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Talks
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-8">
            <Image
              src={imageUrl}
              alt={conference.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold">{conference.title}</h1>
              {conference.featured && (
                <Badge variant="secondary" className="text-sm">Featured Talk</Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Badge 
                variant="outline" 
                className={typeColors[conference.type]}
              >
                <span className="mr-1">{typeIcons[conference.type]}</span>
                {conference.type.charAt(0).toUpperCase() + conference.type.slice(1)}
              </Badge>
              
              <Badge variant="outline" className="text-sm">
                <Presentation className="w-3 h-3 mr-1" />
                {conference.conference}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(conference.date)}</span>
              </div>
              {conference.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{conference.location}</span>
                </div>
              )}
            </div>
          </div>

          {conference.abstract && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Abstract</h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{conference.abstract}</p>
              </CardContent>
            </Card>
          )}

          {conference.description && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <PortableText value={conference.description} />
            </div>
          )}

          {videoEmbedUrl && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Video Recording
                </h2>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={videoEmbedUrl}
                    title={conference.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {conference.slides?.embedUrl && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Presentation Slides
                </h2>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={conference.slides.embedUrl}
                    title={`${conference.title} Slides`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {conference.coAuthors && conference.coAuthors.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Co-presenters
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{conference.coAuthors.join(", ")}</p>
              </CardContent>
            </Card>
          )}

          {conference.relatedPublication && (
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Related Publication
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{conference.relatedPublication.title}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{new Date(conference.relatedPublication.publicationDate).getFullYear()}</span>
                    {conference.relatedPublication.googleScholarLink && (
                      <Link 
                        href={conference.relatedPublication.googleScholarLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        View on Google Scholar
                        <ExternalLink className="w-3 h-3 ml-1 inline" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3">
            {conference.video?.embedUrl && (
              <Link href={conference.video.embedUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Watch on {conference.video.platform || "Platform"}
                </Button>
              </Link>
            )}
            
            {conference.slides?.downloadUrl && (
              <Link href={conference.slides.downloadUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Slides
                </Button>
              </Link>
            )}
            
            {conference.links && conference.links.map((link, index) => (
              <Link 
                key={link._key || index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {link.title}
                </Button>
              </Link>
            ))}
          </div>

          {conference.keywords && conference.keywords.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {conference.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}