import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlForImage } from "@/sanity/lib/image";
import { News } from "../types/sanity";
import { Calendar, Tag, ArrowRight, Sparkles } from "lucide-react";

interface NewsCardProps {
  news: News;
  featured?: boolean;
}

export default function NewsCard({ news, featured = false }: NewsCardProps) {
  const imageUrl = news.image ? urlForImage(news.image) : null;
  
  const categoryIcons = {
    research: "🔬",
    software: "💻",
    publication: "📚",
    award: "🏆",
    conference: "🎤",
    general: "📢",
    lab: "🧪",
  };

  const categoryColors = {
    research: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    software: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    publication: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    award: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    conference: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
    general: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    lab: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric",
      year: "numeric" 
    });
  };

  const CardComponent = featured ? "div" : Card;
  const cardClasses = featured 
    ? "h-full hover:shadow-lg transition-all duration-300 group border rounded-lg overflow-hidden bg-card"
    : "h-full hover:shadow-lg transition-all duration-300 group";

  return (
    <CardComponent className={cardClasses}>
      <Link href={`/news/${news.slug.current}`} className="block h-full">
        {featured && imageUrl && (
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {news.featured && (
              <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        )}
        
        <CardHeader className="space-y-3">
          {!featured && imageUrl && (
            <div className="relative h-48 w-full overflow-hidden rounded-lg -mx-6 -mt-6 mb-4">
              <Image
                src={imageUrl}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between gap-2">
            <Badge 
              variant="outline" 
              className={categoryColors[news.category]}
            >
              <span className="mr-1">{categoryIcons[news.category]}</span>
              {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <time dateTime={news.date}>{formatDate(news.date)}</time>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {news.tags && news.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
              {news.tags && news.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{news.tags.length - 2}
                </Badge>
              )}
            </div>
            
            <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          
          {(news.relatedProject || news.relatedPublication || news.relatedTool) && (
            <div className="pt-2 border-t text-xs text-muted-foreground">
              Related to: 
              {news.relatedProject && <span className="ml-1">Project: {news.relatedProject.title}</span>}
              {news.relatedPublication && <span className="ml-1">Publication: {news.relatedPublication.title}</span>}
              {news.relatedTool && <span className="ml-1">Tool: {news.relatedTool.name}</span>}
            </div>
          )}
        </CardContent>
      </Link>
    </CardComponent>
  );
}