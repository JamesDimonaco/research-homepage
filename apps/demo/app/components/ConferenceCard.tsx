import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/sanity/lib/image";
import { Conference } from "../types/sanity";
import { 
  Calendar, 
  MapPin, 
  Video, 
  FileText, 
  ExternalLink, 
  Download,
  Presentation,
  Users
} from "lucide-react";

interface ConferenceCardProps {
  conference: Conference;
}

export default function ConferenceCard({ conference }: ConferenceCardProps) {
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

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="space-y-4">
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={conference.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
              {conference.title}
            </h3>
            {conference.featured && (
              <Badge variant="secondary" className="shrink-0">Featured</Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant="outline" 
                className={typeColors[conference.type]}
              >
                <span className="mr-1">{typeIcons[conference.type]}</span>
                {conference.type.charAt(0).toUpperCase() + conference.type.slice(1)}
              </Badge>
              
              <Badge variant="outline" className="text-xs">
                <Presentation className="w-3 h-3 mr-1" />
                {conference.conference}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(conference.date)}</span>
              </div>
              {conference.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{conference.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {conference.abstract && (
          <p className="text-muted-foreground text-sm line-clamp-3">{conference.abstract}</p>
        )}
        
        {conference.coAuthors && conference.coAuthors.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              With: {conference.coAuthors.join(", ")}
            </span>
          </div>
        )}
        
        {conference.keywords && conference.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {conference.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {conference.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{conference.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 pt-2">
          {conference.slug && (
            <Link href={`/conferences/${conference.slug.current}`}>
              <Button size="sm" variant="default">
                View Details
              </Button>
            </Link>
          )}
          
          {conference.video?.embedUrl && (
            <Link href={conference.video.embedUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <Video className="w-3 h-3 mr-1" />
                Watch
              </Button>
            </Link>
          )}
          
          {conference.slides?.embedUrl && (
            <Link href={conference.slides.embedUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <FileText className="w-3 h-3 mr-1" />
                Slides
              </Button>
            </Link>
          )}
          
          {conference.slides?.downloadUrl && (
            <Link href={conference.slides.downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                PDF
              </Button>
            </Link>
          )}
          
          {conference.links && conference.links.map((link, index) => (
            <Link key={link._key || index} href={link.url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-3 h-3 mr-1" />
                {link.title}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}