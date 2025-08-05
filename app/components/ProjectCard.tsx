import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/sanity/lib/image";
import { Project } from "../types/sanity";
import { Calendar, Users, DollarSign, ExternalLink, FileText } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl = project.image ? urlForImage(project.image) : null;
  
  const statusColors = {
    active: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    planning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    on_hold: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="space-y-4">
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            {project.featured && (
              <Badge variant="secondary" className="shrink-0">Featured</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant="outline" 
              className={statusColors[project.status]}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
            </Badge>
            
            {project.startDate && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(project.startDate)}
                {project.endDate && ` - ${formatDate(project.endDate)}`}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">{project.summary}</p>
        
        {project.funding && project.funding.source && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {project.funding.source}
              {project.funding.amount && ` • ${project.funding.amount}`}
            </span>
          </div>
        )}
        
        {project.collaborators && project.collaborators.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {project.collaborators.length} collaborator{project.collaborators.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        
        {project.keywords && project.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {project.keywords.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 pt-2">
          {project.slug && (
            <Link href={`/projects/${project.slug.current}`}>
              <Button size="sm" variant="default">
                View Details
              </Button>
            </Link>
          )}
          
          {project.links && project.links.map((link, index) => (
            <Link key={link._key || index} href={link.url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <ExternalLink className="w-3 h-3 mr-1" />
                {link.title}
              </Button>
            </Link>
          ))}
          
          {project.publications && project.publications.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              {project.publications.length} publication{project.publications.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}