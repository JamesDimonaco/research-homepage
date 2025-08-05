import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { urlForImage } from "@/sanity/lib/image";
import { Dataset } from "../types/sanity";
import { 
  Calendar, 
  Download, 
  Lock, 
  Unlock, 
  Database,
  FileText,
  ExternalLink,
  Package,
  Scale,
  UserCheck
} from "lucide-react";

interface DatasetCardProps {
  dataset: Dataset;
  featured?: boolean;
}

export default function DatasetCard({ dataset, featured = false }: DatasetCardProps) {
  const imageUrl = dataset.image ? urlForImage(dataset.image) : null;
  
  const dataTypeIcons = {
    tabular: "📊",
    images: "🖼️",
    text: "📝",
    audio: "🎵",
    video: "🎬",
    timeseries: "📈",
    geospatial: "🗺️",
    mixed: "🔀",
    code: "💻",
    other: "📦",
  };

  const accessIcons = {
    open: <Unlock className="w-4 h-4" />,
    registration: <UserCheck className="w-4 h-4" />,
    request: <FileText className="w-4 h-4" />,
    restricted: <Lock className="w-4 h-4" />,
  };

  const accessColors = {
    open: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    registration: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    request: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    restricted: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short",
      year: "numeric" 
    });
  };

  const CardComponent = featured ? "div" : Card;
  const cardClasses = featured 
    ? "h-full hover:shadow-lg transition-all duration-300 group border rounded-lg overflow-hidden bg-card p-6"
    : "h-full hover:shadow-lg transition-all duration-300 group";

  return (
    <CardComponent className={cardClasses}>
      {!featured ? (
        <>
          <CardHeader className="space-y-3">
            {imageUrl && (
              <div className="relative h-48 w-full overflow-hidden rounded-lg -mx-6 -mt-6 mb-4">
                <Image
                  src={imageUrl}
                  alt={dataset.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                {dataset.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <span className="mr-1">{dataTypeIcons[dataset.dataType]}</span>
                  {dataset.dataType.charAt(0).toUpperCase() + dataset.dataType.slice(1)}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={`text-xs ${accessColors[dataset.accessType]}`}
                >
                  {accessIcons[dataset.accessType]}
                  <span className="ml-1">
                    {dataset.accessType.charAt(0).toUpperCase() + dataset.accessType.slice(1)}
                  </span>
                </Badge>
                
                {dataset.version && (
                  <Badge variant="outline" className="text-xs">
                    {dataset.version}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {dataset.description}
            </p>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              {dataset.size && (dataset.size.fileSize || dataset.size.samples) && (
                <div className="flex items-center gap-4">
                  {dataset.size.fileSize && (
                    <div className="flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      <span>{dataset.size.fileSize}</span>
                    </div>
                  )}
                  {dataset.size.samples && (
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      <span>{dataset.size.samples}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(dataset.releaseDate)}</span>
                </div>
                
                {dataset.license && (
                  <div className="flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    <span className="text-xs">{dataset.license}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {dataset.slug && (
                <Link href={`/datasets/${dataset.slug.current}`}>
                  <Button size="sm" variant="default">
                    View Details
                  </Button>
                </Link>
              )}
              
              {dataset.downloadUrl && dataset.accessType === "open" && (
                <Link href={dataset.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </Link>
              )}
              
              {dataset.repositoryUrl && (
                <Link href={dataset.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Repository
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </>
      ) : (
        /* Featured layout */
        <div className="flex flex-col md:flex-row gap-6">
          {imageUrl && (
            <div className="relative h-48 md:h-auto md:w-1/3 overflow-hidden rounded-lg shrink-0">
              <Image
                src={imageUrl}
                alt={dataset.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                  {dataset.title}
                </h3>
                {dataset.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  <span className="mr-1">{dataTypeIcons[dataset.dataType]}</span>
                  {dataset.dataType.charAt(0).toUpperCase() + dataset.dataType.slice(1)}
                </Badge>
                
                <Badge 
                  variant="outline" 
                  className={accessColors[dataset.accessType]}
                >
                  {accessIcons[dataset.accessType]}
                  <span className="ml-1">
                    {dataset.accessType.charAt(0).toUpperCase() + dataset.accessType.slice(1)}
                  </span>
                </Badge>
                
                {dataset.doi && (
                  <Badge variant="outline">
                    DOI: {dataset.doi}
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                {dataset.description}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {dataset.size && (dataset.size.fileSize || dataset.size.samples) && (
                  <>
                    {dataset.size.fileSize && (
                      <div className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        <span>{dataset.size.fileSize}</span>
                      </div>
                    )}
                    {dataset.size.samples && (
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{dataset.size.samples}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Released {formatDate(dataset.releaseDate)}</span>
                </div>
                
                {dataset.license && (
                  <div className="flex items-center gap-1">
                    <Scale className="w-4 h-4" />
                    <span>{dataset.license}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {dataset.slug && (
                <Link href={`/datasets/${dataset.slug.current}`}>
                  <Button size="sm" variant="default">
                    View Details
                  </Button>
                </Link>
              )}
              
              {dataset.downloadUrl && dataset.accessType === "open" && (
                <Link href={dataset.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Dataset
                  </Button>
                </Link>
              )}
              
              {dataset.repositoryUrl && (
                <Link href={dataset.repositoryUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Repository
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </CardComponent>
  );
}